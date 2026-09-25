/* Hero atmosphere: one raw WebGL2 triangle, no library.
   A gold keyhole breathes in a dark forest field. The left side stays
   dark so the title stays readable. Reduced motion draws a single frame. */

const canvas = document.getElementById("hero-field");
if (canvas) boot(canvas);

function boot(canvas) {
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "high-performance",
  });
  if (!gl) {
    canvas.remove();
    return;
  }

  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(
    vs,
    `#version 300 es
    layout(location=0) in vec2 a;
    void main() { gl_Position = vec4(a, 0.0, 1.0); }`
  );
  gl.compileShader(vs);

  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(
    fs,
    `#version 300 es
    precision highp float;
    uniform vec2 uRes;
    uniform float uTime;
    uniform vec2 uPointer;
    uniform vec2 uCenter;
    uniform float uScale;
    out vec4 frag;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p = mat2(0.8, 0.6, -0.6, 0.8) * p * 2.02;
        a *= 0.5;
      }
      return v;
    }
    float keyhole(vec2 p) {
      float head = length(p - vec2(0.0, 0.20)) - 0.155;
      float w = mix(0.05, 0.105, smoothstep(-0.32, 0.05, p.y));
      float shaft = max(abs(p.x) - w, abs(p.y + 0.08) - 0.30);
      return min(head, shaft);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uRes;
      vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
      vec2 p = (uv - 0.5) * aspect;
      p += (uPointer - 0.5) * vec2(0.06, 0.04);

      vec3 ink = vec3(0.027, 0.043, 0.031);
      vec3 forest = vec3(0.09, 0.18, 0.12);
      vec3 gold = vec3(0.90, 0.76, 0.45);
      vec3 hot = vec3(1.0, 0.94, 0.78);

      float drift = uTime * 0.045;
      float n = fbm(p * 1.7 + vec2(drift, drift * 0.4));
      float vein = fbm(p * 4.6 + n * 1.4 + vec2(-drift, drift));
      vec3 col = mix(ink, forest, smoothstep(0.28, 0.82, n));
      col += gold * 0.07 * smoothstep(0.58, 0.86, vein);

      vec2 q = (uv - uCenter) * aspect;
      q -= (uPointer - 0.5) * 0.03;
      float d = keyhole(q / uScale);
      float glow = exp(-max(d, 0.0) * 5.0);
      float hole = smoothstep(0.02, -0.06, d);
      col += gold * glow * (1.05 + 0.12 * sin(uTime * 0.7));
      col = mix(col, hot, hole * 0.95);
      col += gold * hole * 0.55;

      float arch = abs(length(q / uScale - vec2(0.0, 0.06)) - 0.46);
      col += gold * exp(-arch * 26.0) * 1.05;

      vec2 cell = floor(gl_FragCoord.xy / 36.0);
      vec2 gv = fract(gl_FragCoord.xy / 36.0) - 0.5;
      float spark = hash(cell + floor(uTime * 0.15));
      float mote = smoothstep(0.07, 0.0, length(gv)) * step(0.994, spark);
      mote *= 0.55 + 0.45 * sin(uTime * 1.8 + spark * 40.0);
      col += gold * mote;

      float vig = smoothstep(1.25, 0.25, length((uv - 0.5) * vec2(1.15, 0.9)));
      col *= mix(0.62, 1.0, vig);

      float grain = hash(gl_FragCoord.xy + fract(uTime) * 80.0) - 0.5;
      col += grain * 0.03;

      frag = vec4(col, 1.0);
    }`
  );
  gl.compileShader(fs);
  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
    canvas.remove();
    return;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    canvas.remove();
    return;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, "uRes");
  const uTime = gl.getUniformLocation(prog, "uTime");
  const uPointer = gl.getUniformLocation(prog, "uPointer");
  const uCenter = gl.getUniformLocation(prog, "uCenter");
  const uScale = gl.getUniformLocation(prog, "uScale");

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = { x: 0.5, y: 0.5 };
  const hero = canvas.parentElement;
  const place = { x: 0.28, y: 0.55, scale: 0.28 };
  let raf = 0;
  let running = true;

  function layout() {
    const canvasRect = canvas.getBoundingClientRect();
    const art = hero.querySelector(".hero-art");
    const wide = window.innerWidth > 860;
    if (!art || canvasRect.width < 2 || canvasRect.height < 2) return;

    const artRect = art.getBoundingClientRect();
    let scale = wide ? 0.32 : 0.26;
    const archRadiusPx = () => 0.48 * scale * canvasRect.height;

    if (wide) {
      const room = artRect.left - canvasRect.left - 36;
      if (archRadiusPx() > room) scale = Math.max(0.18, room / (0.48 * canvasRect.height));
      const radius = archRadiusPx();
      const cx = artRect.left - 28 - radius;
      place.x = (cx - canvasRect.left) / canvasRect.width;
      const cy = artRect.top + artRect.height * 0.46;
      place.y = 1 - (cy - canvasRect.top) / canvasRect.height;
    } else {
      const cy = artRect.bottom + 36;
      place.x = 0.5;
      place.y = 1 - (cy - canvasRect.top) / canvasRect.height;
    }
    place.x = Math.min(0.92, Math.max(0.08, place.x));
    place.y = Math.min(0.86, Math.max(0.14, place.y));
    place.scale = scale;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(2, Math.round(rect.width * dpr));
    const h = Math.max(2, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    layout();
  }

  function frame(now) {
    if (!running) return;
    resize();
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, reduced ? 1.2 : now * 0.001);
    gl.uniform2f(uPointer, pointer.x, pointer.y);
    gl.uniform2f(uCenter, place.x, place.y);
    gl.uniform1f(uScale, place.scale);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!reduced) raf = requestAnimationFrame(frame);
  }

  hero.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = (e.clientX - rect.left) / rect.width;
    pointer.y = 1 - (e.clientY - rect.top) / rect.height;
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else if (!reduced) {
      running = true;
      raf = requestAnimationFrame(frame);
    }
  });

  new ResizeObserver(() => {
    if (reduced) frame(0);
  }).observe(hero);

  frame(0);
}
