/* Gallery: Three.js exhibit carousel for the brand plates.
   Progressive enhancement - the semantic <img> grid ships in the HTML and is
   replaced by the canvas only when WebGL + motion are allowed and the user
   actually scrolls here. Three.js is self-hosted (no CDN dependency). */

const stage = document.getElementById("gallery-stage");
const fallback = document.getElementById("gallery-fallback");

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (stage && fallback && !reduced && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        boot().catch(() => {
          /* WebGL or module load failed: keep the image grid */
        });
      }
    },
    { rootMargin: "200px" }
  );
  io.observe(stage);
}

async function boot() {
  const THREE = await import("./vendor/three.module.min.js");

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
    "Interactive gallery of The Insanity Center brand artwork. Drag to spin."
  );
  stage.appendChild(canvas);

  const hint = document.createElement("p");
  hint.className = "stage-hint";
  hint.textContent = "Drag to spin";
  stage.appendChild(hint);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x070b08, 16, 42);
  const camera = new THREE.PerspectiveCamera(38, 2, 0.1, 100);
  camera.position.set(0, 2.4, 19);
  camera.lookAt(0, -0.4, 0);

  scene.add(new THREE.AmbientLight(0xfff2d8, 1.5));
  const key = new THREE.DirectionalLight(0xe6cd8f, 1.6);
  key.position.set(5, 7, 9);
  scene.add(key);
  const fill = new THREE.PointLight(0xe6cd8f, 40, 0, 2);
  fill.position.set(0, 3, 16);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0x356646, 1.2);
  rim.position.set(-7, -2, -5);
  scene.add(rim);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(11.5, 80),
    new THREE.MeshStandardMaterial({
      color: 0x070b08,
      metalness: 0.72,
      roughness: 0.38,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.55;
  scene.add(floor);

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(7.4, 9.6, 96),
    new THREE.MeshBasicMaterial({
      color: 0xc9a45c,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -1.52;
  scene.add(ring);

  const group = new THREE.Group();
  scene.add(group);

  const loader = new THREE.TextureLoader();
  const COUNT = sources.length;
  const RADIUS = 8.6;
  const STEP = (Math.PI * 2) / COUNT;

  const plates = sources.map((src, i) => {
    const angle = STEP * i;
    const plate = new THREE.Group();

    // gold frame: back panel slightly larger than the photo plane
    const back = new THREE.Mesh(
      new THREE.PlaneGeometry(2.3, 2.3),
      new THREE.MeshStandardMaterial({
        color: 0xc9a45c,
        metalness: 0.85,
        roughness: 0.35,
      })
    );
    back.position.z = -0.045;
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
        const aspect = (tex.image.width / tex.image.height) || 1;
        // fit inside the 2.15 square, never squish: shrink the long side
        if (aspect >= 1) {
          front.scale.y = 1 / aspect;
          back.scale.y = (2.3 / 2.15) / aspect;
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
      i % 2 === 0 ? 0.22 : -0.22,
      Math.cos(angle) * RADIUS
    );
    // face outward so the camera always sees plate fronts
    plate.lookAt(
      Math.sin(angle) * RADIUS * 2,
      plate.position.y,
      Math.cos(angle) * RADIUS * 2
    );
    group.add(plate);
    return plate;
  });

  /* ---- drag to spin, with inertia; no wheel hijack ---- */
  let dragging = false;
  let lastX = 0;
  let velocity = 0;
  let rotY = 0;

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
    rotY += dx * 0.0035;
    velocity = dx * 0.0035;
  });
  function release() {
    dragging = false;
  }
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);

  /* ---- size to stage ---- */
  function resize() {
    const w = stage.clientWidth;
    const h = Math.max(480, Math.min(620, Math.round(w * 0.55)));
    stage.style.height = h + "px";
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  /* ---- render loop: idle spin + inertia, paused off-screen ---- */
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
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!dragging) {
      rotY += velocity;
      velocity *= 0.94;
      // slow perpetual spin once flicks settle
      if (Math.abs(velocity) < 0.0004) rotY += 0.05 * dt;
    }
    group.rotation.y = rotY;
    const t = clock.elapsedTime;
    plates.forEach((p, i) => {
      p.position.y = (i % 2 === 0 ? 0.22 : -0.22) + Math.sin(t * 0.8 + i * 1.7) * 0.06;
    });
    renderer.render(scene, camera);
  });
}
