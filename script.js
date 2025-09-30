// Minimal Three.js globe without external textures (works on GitHub Pages)
(function () {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 8;

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', resize);

  // Soft lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambient);
  const dir = new THREE.DirectionalLight(0x3b82f6, 0.6);
  dir.position.set(5, 3, 5);
  scene.add(dir);

  // Sphere with subtle emissive glow
  const geometry = new THREE.SphereGeometry(3, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    color: 0x0b1220,
    emissive: 0x072534,
    emissiveIntensity: 0.35,
    roughness: 0.8,
    metalness: 0.2
  });
  const globe = new THREE.Mesh(geometry, material);
  scene.add(globe);

  // Star field background
  const starsGeom = new THREE.BufferGeometry();
  const starCount = 400;
  const positions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
  }
  starsGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const stars = new THREE.Points(starsGeom, new THREE.PointsMaterial({ color: 0x7089a9, size: 0.06 }));
  scene.add(stars);

  // Glow halo using sprite
  const haloTexture = (() => {
    const size = 128;
    const c = document.createElement('canvas'); c.width = c.height = size;
    const g = c.getContext('2d');
    const gradient = g.createRadialGradient(size/2, size/2, 10, size/2, size/2, size/2);
    gradient.addColorStop(0, 'rgba(59,130,246,0.6)');
    gradient.addColorStop(1, 'rgba(59,130,246,0.0)');
    g.fillStyle = gradient;
    g.beginPath();
    g.arc(size/2, size/2, size/2, 0, Math.PI * 2);
    g.fill();
    const t = new THREE.CanvasTexture(c);
    t.needsUpdate = true;
    return t;
  })();
  const haloMat = new THREE.SpriteMaterial({ map: haloTexture, color: 0x3b82f6 });
  const halo = new THREE.Sprite(haloMat);
  halo.scale.set(9, 9, 1);
  scene.add(halo);

  const animate = () => {
    requestAnimationFrame(animate);
    globe.rotation.y += 0.002;
    stars.rotation.y -= 0.0005;
    renderer.render(scene, camera);
  };

  resize();
  animate();
})();
