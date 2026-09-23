/* Gallery: Three.js exhibit wall for the brand plates.
   Progressive enhancement - the semantic <img> grid ships in the HTML and is
   replaced by the canvas only when WebGL + motion are allowed and the user
   actually scrolls here. Lazy: three.js is imported on first visibility. */

const stage = document.getElementById("gallery-stage");
const fallback = document.getElementById("gallery-fallback");

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (stage && fallback && !reduced && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        boot().catch(() => {
          /* CDN or WebGL failed: keep the image grid */
        });
      }
    },
    { rootMargin: "200px" }
  );
  io.observe(stage);
}

async function boot() {
  const THREE = await import(
    "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"
  );

  // WebGL support check before tearing out the grid
  const probe = document.createElement("canvas");
  if (
    !(
      probe.getContext("webgl2") ||
      probe.getContext("webgl") ||
      probe.getContext("experimental-webgl")
    )
  ) {
    return;
  }

  const imgs = [...fallback.querySelectorAll("img")];
  const sources = imgs.map((im) => im.getAttribute("src"));

  fallback.style.display = "none";
  const canvas = document.createElement("canvas");
  canvas.setAttribute("role", "img");
  canvas.setAttribute(
    "aria-label",
    "Interactive gallery of The Insanity Center brand artwork. Drag to browse."
  );
  stage.appendChild(canvas);

  const hint = document.createElement("p");
  hint.className = "stage-hint";
  hint.textContent = "Drag to browse";
  stage.appendChild(hint);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 2, 0.1, 100);
  camera.position.set(0, 0, 11);

  scene.add(new THREE.AmbientLight(0xfff2d8, 1.1));
  const key = new THREE.DirectionalLight(0xe6cd8f, 1.4);
  key.position.set(4, 6, 8);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x2e5a3e, 1.2);
  rim.position.set(-6, -2, -4);
  scene.add(rim);

  // Each plate: gold back panel slightly larger than the photo plane
  const group = new THREE.Group();
  scene.add(group);

  const loader = new THREE.TextureLoader();
  const COUNT = sources.length;
  const ARC = Math.PI * 1.35;
  const RADIUS = 13;

  const plates = sources.map((src, i) => {
    const angle = -ARC / 2 + (ARC / (COUNT - 1)) * i;
    const plate = new THREE.Group();

    const back = new THREE.Mesh(
      new THREE.PlaneGeometry(2.3, 2.3),
      new THREE.MeshStandardMaterial({
        color: 0xc9a45c,
        metalness: 0.85,
        roughness: 0.35,
      })
    );
    back.position.z = -0.04;
    plate.add(back);

    const frontMat = new THREE.MeshStandardMaterial({
      color: 0x101b13,
      metalness: 0.1,
      roughness: 0.9,
    });
    const front = new THREE.Mesh(new THREE.PlaneGeometry(2.15, 2.15), frontMat);
    plate.add(front);

    loader.load(
      src,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        frontMat.map = tex;
        frontMat.color.set(0xffffff);
        frontMat.needsUpdate = true;
        const aspect = tex.image.width / tex.image.height || 1;
        if (aspect >= 1) {
          front.scale.y = 1 / aspect;
          back.scale.y = (2.3 / 2.15) * (1 / aspect);
        } else {
          front.scale.x = aspect;
          back.scale.x = (2.3 / 2.15) * aspect;
        }
      },
      undefined,
      () => {
        /* keep the dark plate for images that fail to load */
      }
    );

    plate.position.set(
      Math.sin(angle) * RADIUS,
      (i % 2 === 0 ? 0.18 : -0.18),
      -Math.cos(angle) * RADIUS
    );
    plate.lookAt(0, 0, 0);
    group.add(plate);
    return plate;
  });

  /* ---- drag to orbit, with inertia; no wheel hijack ---- */
  let dragging = false;
  let lastX = 0;
  let velocity = 0;
  let rotY = 0;
  const MAX_Y = 0.62; // radians of travel each way

  function pointerX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }
  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastX = pointerX(e);
    velocity = 0;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const x = pointerX(e);
    const dx = x - lastX;
    lastX = x;
    rotY += dx * 0.0032;
    velocity = dx * 0.0032;
    rotY = Math.max(-MAX_Y, Math.min(MAX_Y, rotY));
  });
  function release() {
    dragging = false;
  }
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);

  /* ---- size to stage ---- */
  function resize() {
    const w = stage.clientWidth;
    const h = Math.max(480, Math.min(640, Math.round(w * 0.56)));
    stage.style.height = h + "px";
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  /* ---- render loop: idle drift + inertia, paused off-screen ---- */
  let visible = true;
  const vio = new IntersectionObserver(
    (entries) => {
      visible = entries.some((e) => e.isIntersecting);
    },
    { threshold: 0.02 }
  );
  vio.observe(stage);

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    if (!visible) return;
    const t = clock.getElapsedTime();
    if (!dragging) {
      rotY += velocity;
      velocity *= 0.94;
      if (Math.abs(velocity) < 0.0004) {
        // gentle idle sway around center
        rotY += (Math.sin(t * 0.22) * 0.24 - rotY) * 0.008;
      }
      rotY = Math.max(-MAX_Y, Math.min(MAX_Y, rotY));
    }
    group.rotation.y = rotY;
    plates.forEach((p, i) => {
      p.position.y += Math.sin(t * 0.9 + i * 1.7) * 0.0006;
    });
    renderer.render(scene, camera);
  });
}
