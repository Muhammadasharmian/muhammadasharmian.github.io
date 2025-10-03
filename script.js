// Three.js 3D Interactive Resume
// Loads from CDN as ES modules for GitHub Pages hosting.
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const container = document.getElementById('scene-container');
const tooltip = document.getElementById('tooltip');
const panel = document.getElementById('info-panel');
const panelClose = document.getElementById('panel-close');

let renderer, scene, camera, controls, raycaster, pointer, hovered = null;
const interactables = []; // clickable 3D objects

init();
animate();

function init(){
  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  if (!renderer.capabilities.isWebGL2){
    showNoWebGL();
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  // Scene and Camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.1, 200);
  camera.position.set(0, 2.4, 7);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.target.set(0, 1.2, 0);
  controls.minDistance = 3;
  controls.maxDistance = 14;
  controls.minPolarAngle = 0.2;
  controls.maxPolarAngle = Math.PI/2.05;

  // Lights
  scene.add(new THREE.AmbientLight(0x9cc9ff, 0.65));
  const key = new THREE.PointLight(0xff66cc, 1.0, 25);
  key.position.set(4, 6, 6);
  scene.add(key);
  const rim = new THREE.PointLight(0x66fff2, 0.8, 25);
  rim.position.set(-6, 5, -4);
  scene.add(rim);

  // Ground
  const groundGeo = new THREE.CircleGeometry(18, 64);
  const groundMat = new THREE.ShaderMaterial({
    transparent:true,
    uniforms:{ uColor1:{value:new THREE.Color('#211a3a')}, uColor2:{value:new THREE.Color('#0b0b12')} },
    vertexShader: /* glsl */`
      varying vec2 vUv;
      void main(){
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */`
      varying vec2 vUv;
      uniform vec3 uColor1; uniform vec3 uColor2;
      void main(){
        float r = smoothstep(0.0, 1.0, length(vUv - .5) * 1.2);
        vec3 col = mix(uColor1, uColor2, r);
        float glow = smoothstep(.8, .2, r) * .25;
        gl_FragColor = vec4(col + vec3(glow), 0.8);
      }
    `
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI/2;
  ground.position.y = 0;
  scene.add(ground);

  // Create interactive objects
  createObjects();

  // Raycaster
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  // Events
  window.addEventListener('resize', onResize);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('click', onClick);
  window.addEventListener('keydown', e => { if(e.key === 'Escape') closePanel(); });
  panelClose.addEventListener('click', closePanel);

  // Tabs
  document.querySelectorAll('.tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      setActiveTab(tab.dataset.tab);
    });
  });
}

function showNoWebGL(){
  const div = document.createElement('div');
  div.className = 'no-webgl';
  div.textContent = 'Your browser/device does not support WebGL2. Please try a modern browser to view the 3D interactive resume.';
  document.body.appendChild(div);
}

function createObjects(){
  // Accent colors per object
  const accents = {
    soccer: '#ffffff',
    pingpong: '#ff7a00',
    paddle: '#ff2a75',
    pawn: '#8f00ff'
  };

  // Soccer ball (white sphere with black wireframe edges)
  const soccerGroup = new THREE.Group(); soccerGroup.name = 'Soccer Ball';
  const soccerGeo = new THREE.SphereGeometry(0.75, 24, 20);
  const soccerMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.15 });
  const soccer = new THREE.Mesh(soccerGeo, soccerMat);
  const soccerEdges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.75, 1)), new THREE.LineBasicMaterial({ color: 0x111111 }));
  soccerGroup.add(soccer, soccerEdges);
  soccerGroup.position.set(-3, 0.8, 0.4);
  addGlowUnder(soccerGroup, accents.soccer);
  scene.add(soccerGroup);
  interactables.push(soccer, soccerEdges);
  soccer.userData = { key:'soccer', icon:'⚽' };

  // Ping pong ball (orange sphere)
  const ppGroup = new THREE.Group(); ppGroup.name = 'Ping Pong Ball';
  const ppGeo = new THREE.SphereGeometry(0.55, 24, 20);
  const ppMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(accents.pingpong), roughness: 0.6, metalness: 0.05 });
  const pingpong = new THREE.Mesh(ppGeo, ppMat);
  ppGroup.add(pingpong);
  ppGroup.position.set(-0.9, 0.65, -0.6);
  addGlowUnder(ppGroup, accents.pingpong);
  scene.add(ppGroup);
  interactables.push(pingpong);
  pingpong.userData = { key:'pingpong', icon:'🏓' };

  // Table tennis racket (paddle head + handle)
  const paddleGroup = new THREE.Group(); paddleGroup.name = 'Table Tennis Racket';
  const head = new THREE.Mesh(
    new THREE.CircleGeometry(0.95, 48),
    new THREE.MeshStandardMaterial({ color: 0xd91e63, roughness: 0.5, metalness: 0.1 })
  );
  head.rotation.x = -Math.PI/2.5;
  head.rotation.z = 0.2;
  head.position.set(0.2, 1.05, 0);
  const rubberTop = new THREE.Mesh(
    new THREE.CircleGeometry(0.92, 48),
    new THREE.MeshStandardMaterial({ color: 0x2b2d55, roughness: 0.75, metalness: 0.05 })
  );
  rubberTop.position.z = 0.02;
  head.add(rubberTop);

  const handle = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.7, 0.28),
    new THREE.MeshStandardMaterial({ color: 0x8a5a3a, roughness: 0.7 })
  );
  handle.position.set(-0.2, 0.6, 0.0);
  handle.rotation.z = 0.2;
  paddleGroup.add(head, handle);
  paddleGroup.position.set(1.7, 0.5, 0.5);
  addGlowUnder(paddleGroup, accents.paddle);
  scene.add(paddleGroup);
  interactables.push(head, handle);
  head.userData = handle.userData = { key:'paddle', icon:'🏓' };

  // Chess pawn (lathe geometry)
  const pawnGroup = new THREE.Group(); pawnGroup.name = 'Chess Pawn';
  const profile = [];
  profile.push(new THREE.Vector2(0,0));
  profile.push(new THREE.Vector2(0.5,0));
  profile.push(new THREE.Vector2(0.6,0.1));
  profile.push(new THREE.Vector2(0.7,0.2));
  profile.push(new THREE.Vector2(0.55,0.5));
  profile.push(new THREE.Vector2(0.45,0.8));
  profile.push(new THREE.Vector2(0.35,1.05));
  profile.push(new THREE.Vector2(0.25,1.25));
  profile.push(new THREE.Vector2(0.3,1.45));
  const pawnGeo = new THREE.LatheGeometry(profile, 48);
  const pawnMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(accents.pawn), roughness: 0.35, metalness: 0.4 });
  const pawn = new THREE.Mesh(pawnGeo, pawnMat);
  const headSphere = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 24), pawnMat);
  headSphere.position.y = 1.6;
  pawnGroup.add(pawn, headSphere);
  pawnGroup.position.set(3.4, 0.2, -0.7);
  addGlowUnder(pawnGroup, accents.pawn);
  scene.add(pawnGroup);
  interactables.push(pawn, headSphere);
  pawn.userData = headSphere.userData = { key:'pawn', icon:'♟️' };

  // Float animation parameters
  soccerGroup.userData.float = { amp:0.06, speed:1.0, rot:0.35 };
  ppGroup.userData.float = { amp:0.08, speed:1.4, rot:0.6 };
  paddleGroup.userData.float = { amp:0.05, speed:1.2, rot:0.25 };
  pawnGroup.userData.float = { amp:0.04, speed:0.9, rot:0.2 };

  // Store roots for animation
  scene.userData.floaters = [soccerGroup, ppGroup, paddleGroup, pawnGroup];
}

function addGlowUnder(group, colorHex){
  const glowMat = new THREE.MeshBasicMaterial({ color:new THREE.Color(colorHex), transparent:true, opacity:0.12 });
  const glow = new THREE.Mesh(new THREE.CircleGeometry(1.1, 40), glowMat);
  glow.rotation.x = -Math.PI/2;
  glow.position.y = 0.01;
  group.add(glow);
}

function onResize(){
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerMove(e){
  if (!renderer) return;
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(interactables, false);

  if (intersects.length){
    const obj = intersects[0].object;
    if (hovered !== obj){
      if (hovered) setEmissive(hovered, 0);
      hovered = obj;
      setEmissive(hovered, 0.35);
    }
    // Tooltip
    const name = getRootName(obj);
    tooltip.textContent = `${name} — open resume`;
    tooltip.style.left = `${e.clientX}px`;
    tooltip.style.top = `${e.clientY}px`;
    tooltip.style.opacity = '1';
    tooltip.setAttribute('aria-hidden', 'false');
    renderer.domElement.style.cursor = 'pointer';
  } else {
    if (hovered) setEmissive(hovered, 0);
    hovered = null;
    tooltip.style.opacity = '0';
    tooltip.setAttribute('aria-hidden', 'true');
    renderer.domElement.style.cursor = 'default';
  }
}

function getRootName(obj){
  let parent = obj;
  while (parent && !parent.name) parent = parent.parent;
  return parent?.name || 'Object';
}

function setEmissive(obj, intensity){
  const mats = collectMaterials(obj);
  mats.forEach(m=>{
    if (!m.emissive) m.emissive = new THREE.Color(0x000000);
    m.emissiveIntensity = intensity;
    m.emissive.set(m.color ? m.color : new THREE.Color(0xffffff));
  });
}
function collectMaterials(obj){
  const list = [];
  obj.traverse ? obj.traverse(o=>{
    if (o.isMesh && o.material) list.push(o.material);
  }) : list.push(obj.material);
  return list;
}

function onClick(e){
  if (!renderer) return;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(interactables, false);
  if (intersects.length){
    const obj = intersects[0].object;
    openPanel(obj.userData?.icon || '🏷️', getRootName(obj));
  }
}

function animate(t=0){
  requestAnimationFrame(animate);
  const time = t/1000;

  // Float items
  const floaters = scene.userData.floaters || [];
  for (const g of floaters){
    const f = g.userData.float;
    if (!f) continue;
    g.position.y = Math.max(0.15, (f.baseY || g.position.y)) + Math.sin(time * (f.speed || 1) + g.position.x)* (f.amp || 0.05);
    g.rotation.y += (f.rot || 0.3) * 0.003;
  }

  controls.update();
  renderer.render(scene, camera);
}

/* Panel logic and resume content */
const RESUME = {
  education: `
    <div class="section">
      <div class="item">
        <h3>Mississippi State University — B.S. Computer Science</h3>
        <div class="meta">Starkville, MS · Class of 2027</div>
        <ul>
          <li>Computer Science GPA: <strong>4.00</strong></li>
          <li>Awarded a <strong>full tuition scholarship</strong> for 4 years</li>
        </ul>
      </div>
    </div>
  `,
  experience: `
    <div class="section">
      <div class="item">
        <h3>Undergraduate Research Assistant — Building Construction Science (MSSTATE)</h3>
        <div class="meta">Starkville, MS · 01/2025 – Present</div>
        <ul>
          <li>Built a real-time AR safety app improving on-site awareness and reducing incidents by ~15%.</li>
          <li>Integrated health-monitoring sensors enabling earlier detection of risks by ~15%.</li>
          <li>Engineered an AR comm server for supervisor alerts, improving communication by ~50%.</li>
          <li>Developed interactive BIM 3D models used in a class of 30 students.</li>
        </ul>
      </div>
      <div class="item">
        <h3>Undergraduate Research Assistant — Plant & Soil Sciences (MSSTATE)</h3>
        <div class="meta">Starkville, MS · 06/2024 – Present</div>
        <ul>
          <li>Automated data collection/processing with Python; reduced manual time by 40%.</li>
          <li>Analyzed large datasets, accelerating soil analysis by 2–3 hours per sample.</li>
        </ul>
      </div>
      <div class="item">
        <h3>Student Researcher — EcoCAR Challenge Team (MSSTATE)</h3>
        <div class="meta">01/2024 – 01/2025</div>
        <ul>
          <li>Improved autonomous control response by ~15% using Python and MATLAB.</li>
          <li>Led testing/simulations to boost perception & control accuracy.</li>
          <li>Streamlined sensor integration (LiDAR, radar, cameras) across conditions.</li>
          <li>Applied Python-based ML to enhance object detection reliability.</li>
        </ul>
      </div>
      <div class="item">
        <h3>Summer Intern — TMR Consulting Pvt. Ltd.</h3>
        <div class="meta">Islamabad, Pakistan · 04/2022 – 08/2022</div>
        <ul>
          <li>Troubleshot client issues to maintain ~95% satisfaction.</li>
          <li>Revamped meeting processes, improving clarity by ~20%.</li>
          <li>Streamlined communication protocols for transparency and collaboration.</li>
        </ul>
      </div>
    </div>
  `,
  projects: `
    <div class="section">
      <div class="item">
        <h3>SafeConstructAR</h3>
        <ul>
          <li>AR application for construction worker safety and OSHA compliance.</li>
        </ul>
      </div>
      <div class="item">
        <h3>CanopyCover Calculator</h3>
        <ul>
          <li>Open-source tool computing average canopy cover from field images.</li>
        </ul>
      </div>
    </div>
  `,
  contact: `
    <div class="section">
      <div class="item">
        <h3>Contact</h3>
        <ul>
          <li>Email: <a href="mailto:asharmian2004@gmail.com">asharmian2004@gmail.com</a></li>
          <li>Phone: <a href="tel:16624978806">+1 (662) 497-8806</a></li>
          <li>GitHub: <a target="_blank" rel="noopener" href="https://github.com/Muhammadasharmian">github.com/Muhammadasharmian</a></li>
          <li>LinkedIn: <a target="_blank" rel="noopener" href="https://www.linkedin.com/in/your-linkedin">Update your LinkedIn URL</a></li>
          <li>Location: Starkville, MS</li>
        </ul>
      </div>
      <div class="item">
        <h3>Leadership & Campus</h3>
        <ul>
          <li>President, PSA (Pakistan Student Association), Mississippi State University</li>
          <li>Team Leader, Mississippi State table tennis team</li>
          <li>Member, chess and Rubik's Cube clubs</li>
        </ul>
      </div>
      <div class="item">
        <h3>Skills</h3>
        <ul>
          <li><strong>Languages:</strong> Python, C, C++, C#, Java, SQL, x86 assembly, MATLAB, HTML/CSS, R</li>
          <li><strong>Tools/Libraries:</strong> Git, Linux, Angular, React, clang, Unity, Autodesk Revit, Pandas, Matplotlib</li>
          <li><strong>Interests:</strong> Robotics, Automation, AR/VR, Data Viz, ML/AI, Vehicles</li>
        </ul>
      </div>
    </div>
  `
};

function openPanel(icon, fromLabel){
  document.getElementById('panel-icon').textContent = icon;
  document.getElementById('panel-heading').textContent = `Resume • ${fromLabel}`;
  // Default tab is Education
  setActiveTab('education');
  panel.setAttribute('aria-hidden', 'false');
}

function closePanel(){
  panel.setAttribute('aria-hidden', 'true');
}

function setActiveTab(which){
  document.querySelectorAll('.tab').forEach(t=>{
    const active = t.dataset.tab === which;
    t.classList.toggle('active', active);
    t.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  document.querySelectorAll('.tab-panel').forEach(p=>{
    p.classList.remove('active');
  });
  const target = document.getElementById(`tab-${which}`);
  if (target){
    target.classList.add('active');
    target.innerHTML = RESUME[which] || '';
  }
}
