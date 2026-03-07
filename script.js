// ═══════════════════════════════════════════════════════════
//  OS 95 Portfolio — script.js
// ═══════════════════════════════════════════════════════════

// ── THREE.JS — 3D CRT Monitor ──────────────────────────────
const canvas3d = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvas3d, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x060608);

const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);

// Lighting
scene.add(new THREE.AmbientLight(0x606070, 0.9));
const key = new THREE.DirectionalLight(0xfff5e0, 1.4);
key.position.set(-5, 7, 6); key.castShadow = true;
scene.add(key);
const fill = new THREE.DirectionalLight(0x8090cc, 0.4);
fill.position.set(5, 2, 4);
scene.add(fill);

// Materials
const beigeMat   = new THREE.MeshPhongMaterial({ color:0xd2cdb8, specular:0x444430, shininess:30 });
const beigeShade = new THREE.MeshPhongMaterial({ color:0xb8b4a5, specular:0x222218, shininess:18 });
const darkMat    = new THREE.MeshPhongMaterial({ color:0x9a9690, specular:0x111110, shininess:10 });
const veryDark   = new THREE.MeshPhongMaterial({ color:0x6a6860, specular:0x080808, shininess:5  });

// Bezel
const bezelGeo = new THREE.BoxGeometry(4.4, 3.5, 0.55);
const bezel = new THREE.Mesh(bezelGeo, beigeMat);
bezel.position.y = 0.25;
bezel.castShadow = true;
scene.add(bezel);

// Screen inset
const insetGeo = new THREE.BoxGeometry(3.72, 2.88, 0.14);
const insetMat = new THREE.MeshPhongMaterial({ color:0x0a0a0a, specular:0x050505, shininess:80 });
const inset = new THREE.Mesh(insetGeo, insetMat);
inset.position.set(0, 0.25, 0.24);
scene.add(inset);

// Screen plane
const SW = 3.55, SH = 2.72, SZ = 0.32;
const screenGeo = new THREE.PlaneGeometry(SW, SH);
const screenMat = new THREE.MeshPhongMaterial({
    color:0x000000, emissive:0x000000,
    specular:0x333333, shininess:120
});
const screenMesh = new THREE.Mesh(screenGeo, screenMat);
screenMesh.position.set(0, 0.25, SZ);
scene.add(screenMesh);

// Glass glare
const glareMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(SW, SH),
    new THREE.MeshBasicMaterial({ color:0xffffff, transparent:true, opacity:0.04 })
);
glareMesh.position.set(0, 0.25, SZ + 0.005);
scene.add(glareMesh);

// CRT tube housing
const tube1 = new THREE.Mesh(new THREE.BoxGeometry(3.9, 3.0, 2.2), darkMat);
tube1.position.set(0, 0.25, -1.37); tube1.castShadow = true;
scene.add(tube1);

const tube2 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.2, 0.9), veryDark);
tube2.position.set(0, 0.25, -2.62); tube2.castShadow = true;
scene.add(tube2);

// Side taper wedges
function makeTrap(frontW, backW, h, depth) {
    const s = new THREE.Shape();
    const fw=frontW/2, bw=backW/2, hh=h/2;
    s.moveTo(-fw,-hh); s.lineTo(fw,-hh); s.lineTo(bw,hh); s.lineTo(-bw,hh); s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth, bevelEnabled:false });
}
const wL = new THREE.Mesh(makeTrap(3.0,1.95,2.0,0.05), darkMat);
wL.rotation.y = Math.PI/2; wL.position.set(-2.17, 0.25, -1.6);
scene.add(wL);
const wR = new THREE.Mesh(makeTrap(3.0,1.95,2.0,0.05), veryDark);
wR.rotation.y = -Math.PI/2; wR.position.set(2.22, 0.25, -1.6);
scene.add(wR);

// Stand
const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.17,0.5,14), beigeShade);
neck.position.set(0, -1.67, -0.25); neck.castShadow=true;
scene.add(neck);

const foot = new THREE.Mesh(new THREE.BoxGeometry(2.0,0.12,1.0), beigeShade);
foot.position.set(0, -1.95, -0.2); foot.castShadow=true;
scene.add(foot);

const footCap = new THREE.Mesh(new THREE.BoxGeometry(2.0,0.05,1.0), beigeMat);
footCap.position.set(0, -1.83, -0.2);
scene.add(footCap);

// LED + floppy details
const ledMat = new THREE.MeshPhongMaterial({ color:0x001100, emissive:0x000000 });
const led = new THREE.Mesh(new THREE.SphereGeometry(0.025,8,8), ledMat);
led.position.set(1.58, -1.38, 0.29);
scene.add(led);

const floppy = new THREE.Mesh(new THREE.BoxGeometry(0.32,0.045,0.015),
    new THREE.MeshPhongMaterial({ color:0x0d0d0d }));
floppy.position.set(1.52, -1.22, 0.29);
scene.add(floppy);

// Floor
const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(40,40),
    new THREE.MeshPhongMaterial({ color:0x080808, specular:0x1a1a1a, shininess:30 })
);
floorMesh.rotation.x = -Math.PI/2;
floorMesh.position.y = -2.25;
floorMesh.receiveShadow = true;
scene.add(floorMesh);

// ── Camera positions ────────────────────────────────────────
const CAM_START  = new THREE.Vector3(3.6, 0.5, 6.2);
const CAM_ZOOMED = new THREE.Vector3(0.0, 0.1, 7.8);

const camCur = CAM_START.clone();
const camTgt = CAM_START.clone();
const lookAt = new THREE.Vector3(0, 0, 0);

let isZoomed     = false;
let hovered      = false;
let screenGlow   = 0;
let welcomeShown = false;

function setZoomed(z) {
    isZoomed = z;
    camTgt.copy(z ? CAM_ZOOMED : CAM_START);
    if (!z) screenOverlay.classList.remove('on');
}

// ── Resize ──────────────────────────────────────────────────
const screenOverlay = document.getElementById('screen-overlay');

function onResize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
}
window.addEventListener('resize', onResize);

// ── Project screen corners to DOM px ────────────────────────
function positionOverlay() {
    const w = window.innerWidth, h = window.innerHeight;
    const hw = SW/2, hh = SH/2, SY = 0.25;
    const corners = [
        new THREE.Vector3(-hw, SY-hh, SZ),
        new THREE.Vector3( hw, SY-hh, SZ),
        new THREE.Vector3( hw, SY+hh, SZ),
        new THREE.Vector3(-hw, SY+hh, SZ),
    ];
    const pts = corners.map(v => {
        const p = v.clone().project(camera);
        return { x:(p.x+1)/2*w, y:(-p.y+1)/2*h };
    });
    const minX = Math.min(...pts.map(p=>p.x));
    const maxX = Math.max(...pts.map(p=>p.x));
    const minY = Math.min(...pts.map(p=>p.y));
    const maxY = Math.max(...pts.map(p=>p.y));
    screenOverlay.style.left   = minX + 'px';
    screenOverlay.style.top    = minY + 'px';
    screenOverlay.style.width  = (maxX-minX) + 'px';
    screenOverlay.style.height = (maxY-minY) + 'px';
}

// ── Render loop ──────────────────────────────────────────────
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);

    camCur.lerp(camTgt, dt * 2.2);
    camera.position.copy(camCur);
    camera.lookAt(lookAt);

    const tg = (hovered || isZoomed) ? 1 : 0;
    screenGlow += (tg - screenGlow) * Math.min(dt * 1.8, 1);
    const g = screenGlow;
    screenMat.emissive.setRGB(0, g*0.08, g*0.08);
    screenMat.color.setRGB(0, g*0.06, g*0.06);
    ledMat.color.setRGB(0, g*0.15, 0);
    ledMat.emissive.setRGB(0, g*0.9, 0);

    renderer.render(scene, camera);
    positionOverlay();

    if (isZoomed && screenGlow > 0.75 && camCur.distanceTo(camTgt) < 0.15) {
        screenOverlay.classList.add('on');
        if (!welcomeShown) {
            welcomeShown = true;
            openWin('w-welcome');
        }
    }
}
onResize();
animate();

// ── Raycasting ───────────────────────────────────────────────
const raycaster = new THREE.Raycaster();
const mouse2    = new THREE.Vector2();

function setMouse(e) {
    mouse2.x =  (e.clientX / window.innerWidth)  * 2 - 1;
    mouse2.y = -(e.clientY / window.innerHeight) * 2 + 1;
}

canvas3d.addEventListener('mousemove', e => {
    setMouse(e);
    raycaster.setFromCamera(mouse2, camera);
    hovered = raycaster.intersectObjects([bezel, screenMesh, inset]).length > 0;
    canvas3d.style.cursor = (hovered && !isZoomed) ? 'pointer' : 'default';
});

canvas3d.addEventListener('click', e => {
    if (isZoomed) return;
    setMouse(e);
    raycaster.setFromCamera(mouse2, camera);
    if (raycaster.intersectObjects([bezel, screenMesh, inset]).length > 0) setZoomed(true);
});

// ═══════════════════════════════════════════════════════════
//  OS 95 DESKTOP UI
// ═══════════════════════════════════════════════════════════
let zTop = 200;
const openSet = new Set();

function openWin(id) {
    const w = document.getElementById(id);
    w.classList.add('open'); focusWin(id);
    openSet.add(id); rebuildTaskbar();
    if (id === 'w-cmd')      setTimeout(focusCmd, 80);
    if (id === 'w-explorer') setTimeout(() => navTo('root'), 50);
    // Centre welcome inside the desktop overlay
    if (id === 'w-welcome') {
        const desktop = document.getElementById('desktop');
        setTimeout(() => {
            const dw = desktop.offsetWidth, dh = desktop.offsetHeight;
            const ww = w.offsetWidth,       wh = w.offsetHeight;
            w.style.left = Math.max(0, (dw - ww) / 2) + 'px';
            w.style.top  = Math.max(0, (dh - wh) / 2) + 'px';
        }, 0);
    }
}
function closeWin(id, e) {
    if (e) e.stopPropagation();
    document.getElementById(id).classList.remove('open');
    openSet.delete(id); rebuildTaskbar();
}
function minWin(id, e) {
    if (e) e.stopPropagation();
    document.getElementById(id).classList.remove('open');
    rebuildTaskbar();
}
function focusWin(id) {
    document.querySelectorAll('.win-tb').forEach(t => t.classList.add('inactive'));
    const w = document.getElementById(id);
    w.querySelector('.win-tb').classList.remove('inactive');
    w.style.zIndex = ++zTop;
}
document.querySelectorAll('.win').forEach(w => w.addEventListener('mousedown', () => focusWin(w.id)));

// ── Window icons & labels ────────────────────────────────────
const WIN_ICONS = {
    'w-about':     `data:image/svg+xml,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' shape-rendering='crispEdges'%3E%3Ccircle cx='8' cy='8' r='7' fill='%23ffff00'/%3E%3Ccircle cx='8' cy='8' r='5' fill='%23000080'/%3E%3Crect x='7' y='5' width='2' height='2' fill='%23fff'/%3E%3Crect x='7' y='8' width='2' height='3' fill='%23fff'/%3E%3C/svg%3E`,
    'w-explorer':  `data:image/svg+xml,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' shape-rendering='crispEdges'%3E%3Cpath d='M1 5 L5 5 L7 3 L15 3 L15 13 L1 13Z' fill='%23ffd700'/%3E%3C/svg%3E`,
    'w-cmd':       `data:image/svg+xml,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' shape-rendering='crispEdges'%3E%3Crect width='16' height='16' fill='%23000'/%3E%3Crect x='1' y='5' width='5' height='1' fill='%23c0c0c0'/%3E%3Crect x='1' y='8' width='9' height='1' fill='%23c0c0c0'/%3E%3C/svg%3E`,
    'w-skills':    `data:image/svg+xml,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' shape-rendering='crispEdges'%3E%3Crect x='2' y='1' width='10' height='13' fill='%23fff'/%3E%3Crect x='4' y='4' width='5' height='1' fill='%23000080'/%3E%3Crect x='4' y='6' width='7' height='1' fill='%23808080'/%3E%3C/svg%3E`,
    'w-photo':     `data:image/svg+xml,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' shape-rendering='crispEdges'%3E%3Crect x='1' y='1' width='14' height='14' fill='%23fff'/%3E%3Cpolygon points='2,13 6,8 9,11 11,9 14,13' fill='%2300aa00'/%3E%3Ccircle cx='5' cy='5' r='1' fill='%23ffff00'/%3E%3C/svg%3E`,
    'w-welcome':   `data:image/svg+xml,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' shape-rendering='crispEdges'%3E%3Crect x='1' y='2' width='12' height='9' fill='%23c0c0c0'/%3E%3Crect x='2' y='3' width='10' height='7' fill='%23008080'/%3E%3Crect x='3' y='11' width='8' height='2' fill='%23c0c0c0'/%3E%3C/svg%3E`,
    'w-whats-new': `data:image/svg+xml,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' shape-rendering='crispEdges'%3E%3Crect x='2' y='1' width='10' height='13' fill='%23fff'/%3E%3Crect x='4' y='4' width='5' height='1' fill='%23000080'/%3E%3Crect x='4' y='6' width='7' height='1' fill='%23808080'/%3E%3C/svg%3E`,
    'w-socials':   `data:image/svg+xml,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' shape-rendering='crispEdges'%3E%3Crect x='0' y='3' width='7' height='6' fill='%23c0c0c0'/%3E%3Crect x='1' y='4' width='6' height='5' fill='%23008080'/%3E%3Crect x='9' y='3' width='7' height='6' fill='%23c0c0c0'/%3E%3Crect x='10' y='4' width='6' height='5' fill='%23000080'/%3E%3Crect x='7' y='6' width='2' height='1' fill='%23808080'/%3E%3C/svg%3E`,
    'w-github':    `data:image/svg+xml,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='16' height='16' rx='3' fill='%2324292e'/%3E%3Cpath d='M8 3C5.24 3 3 5.24 3 8c0 2.21 1.43 4.08 3.42 4.74.25.05.34-.11.34-.24v-.85c-1.39.3-1.68-.67-1.68-.67-.23-.58-.55-.73-.55-.73-.45-.31.03-.3.03-.3.5.03.77.52.77.52.45.76 1.17.54 1.46.41.05-.32.17-.54.32-.67-1.11-.13-2.28-.55-2.28-2.47 0-.55.2-.99.52-1.34-.05-.13-.22-.64.05-1.32 0 0 .42-.13 1.37.51.4-.11.82-.17 1.25-.17.43 0 .85.06 1.25.17.96-.64 1.37-.51 1.37-.51.27.68.1 1.19.05 1.32.32.35.52.8.52 1.34 0 1.93-1.17 2.35-2.28 2.47.18.15.34.46.34.93v1.37c0 .13.09.29.34.24C11.57 12.08 13 10.21 13 8c0-2.76-2.24-5-5-5z' fill='%23fff'/%3E%3C/svg%3E`,
    'w-linkedin':  `data:image/svg+xml,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' shape-rendering='crispEdges'%3E%3Crect width='16' height='16' rx='2' fill='%230077b5'/%3E%3Crect x='2' y='2' width='3' height='3' fill='%23fff'/%3E%3Crect x='2' y='7' width='3' height='7' fill='%23fff'/%3E%3Crect x='7' y='7' width='3' height='7' fill='%23fff'/%3E%3Crect x='7' y='7' width='7' height='3' fill='%23fff'/%3E%3Crect x='11' y='10' width='3' height='4' fill='%23fff'/%3E%3C/svg%3E`,
    'w-twitter':   `data:image/svg+xml,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='16' height='16' rx='3' fill='%23000'/%3E%3Cpath d='M9 7.3L12.5 4h-.9L8.6 6.8 6.3 4H4l3.7 5.1L4 13h.9l3.2-3.5 2.6 3.5H13L9 7.3zm-1.1 1.3l-.4-.5-3-4.1h1.3l2.4 3.3.4.5 3.1 4.2H11L7.9 8.6z' fill='%23fff'/%3E%3C/svg%3E`,
    'w-instagram': `data:image/svg+xml,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3CradialGradient id='g' cx='30%25' cy='107%25' r='150%25'%3E%3Cstop offset='0%25' stop-color='%23fdf497'/%3E%3Cstop offset='30%25' stop-color='%23fd5949'/%3E%3Cstop offset='60%25' stop-color='%23d6249f'/%3E%3Cstop offset='90%25' stop-color='%23285aeb'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='16' height='16' rx='4' fill='url(%23g)'/%3E%3Crect x='3' y='3' width='10' height='10' rx='2' fill='none' stroke='%23fff' stroke-width='1.5'/%3E%3Ccircle cx='8' cy='8' r='2.5' fill='none' stroke='%23fff' stroke-width='1.2'/%3E%3Ccircle cx='11.5' cy='4.5' r='0.8' fill='%23fff'/%3E%3C/svg%3E`,
};
const winLabels = {
    'w-about':     'My Portfolio',
    'w-explorer':  'My Briefcase',
    'w-cmd':       'Terminal',
    'w-skills':    'Skills.txt',
    'w-photo':     'Photo Viewer',
    'w-welcome':   'Welcome',
    'w-whats-new': "What's New",
    'w-socials':   'Socials',
    'w-github':    'GitHub.exe',
    'w-linkedin':  'LinkedIn.exe',
    'w-twitter':   'X.exe',
    'w-instagram': 'Instagram.exe',
};

// ── Taskbar ──────────────────────────────────────────────────
function rebuildTaskbar() {
    const tb = document.getElementById('tb-tasks'); tb.innerHTML = '';
    openSet.forEach(id => {
        const btn = document.createElement('div');
        const isOpen = document.getElementById(id).classList.contains('open');
        btn.className = 'tb-task' + (isOpen ? ' active' : '');
        const ico = WIN_ICONS[id]
            ? `<img src="${WIN_ICONS[id]}" width="16" height="16" style="image-rendering:pixelated;">`
            : '';
        btn.innerHTML = ico + (winLabels[id] || id);
        btn.onclick = ev => {
            ev.stopPropagation();
            btn.classList.remove('flash');
            void btn.offsetWidth;
            btn.classList.add('flash');
            setTimeout(() => btn.classList.remove('flash'), 200);
            const w = document.getElementById(id);
            if (w.classList.contains('open')) { minWin(id); }
            else { w.classList.add('open'); focusWin(id); rebuildTaskbar(); }
        };
        tb.appendChild(btn);
    });
}

// ── Window dragging ──────────────────────────────────────────
let dragId=null, dox=0, doy=0;
function startDrag(e, id) {
    e.stopPropagation(); dragId = id; focusWin(id);
    const r  = document.getElementById(id).getBoundingClientRect();
    dox = e.clientX - r.left;
    doy = e.clientY - r.top;
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup',   stopDrag);
}
function doDrag(e) {
    if (!dragId) return;
    const w  = document.getElementById(dragId);
    const dr = document.getElementById('desktop').getBoundingClientRect();
    let nx = e.clientX - dr.left - dox;
    let ny = e.clientY - dr.top  - doy;
    nx = Math.max(0, Math.min(nx, dr.width  - w.offsetWidth));
    ny = Math.max(0, Math.min(ny, dr.height - w.offsetHeight - 28));
    w.style.left = nx + 'px';
    w.style.top  = ny + 'px';
}
function stopDrag() {
    dragId = null;
    document.removeEventListener('mousemove', doDrag);
    document.removeEventListener('mouseup',   stopDrag);
}

// ── Start Menu ───────────────────────────────────────────────
const startMenu = document.getElementById('start-menu');
const startBtn  = document.getElementById('start-btn');
function toggleStartMenu(e) {
    e.stopPropagation();
    startMenu.classList.toggle('open');
    startBtn.classList.toggle('pressed');
}
function closeStartMenu() {
    startMenu.classList.remove('open');
    startBtn.classList.remove('pressed');
}
document.getElementById('desktop').addEventListener('click', () => closeStartMenu());

// ── Terminal ─────────────────────────────────────────────────
const cmdOut = document.getElementById('cmd-out');
const cmdIn  = document.getElementById('cmd-in');
function focusCmd() { cmdIn.focus(); }

const FETCHME_OUTPUT = `
     _______
    |  ___  |   OS 95
    | |   | |   ---------------
    |_|___|_|   OS:       OS 95 v1.0.0
       | |      Host:     CRT Monitor Simulator
      _|_|_     Shell:    Terminal v1.0
     |     |    Engine:   Three.js r128
     |_____|    Stack:    HTML5 / CSS3 / JS
                Theme:    OS 95 Retro
                (C) 2026  Joshua Designs

`;

cmdIn.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter') return;
    const raw = this.value; const cmd = raw.trim().toLowerCase(); this.value = '';
    cmdOut.textContent += `C:\\PORTFOLIO> ${raw}\n`;
    switch (cmd) {
        case 'help':
            cmdOut.textContent += 'Available commands:\n\n  FETCHME  — display system info\n  DIR      — list directory\n  ABOUT    — open My Portfolio\n  SKILLS   — open Skills.txt\n  CLS      — clear screen\n  VER      — show version\n  DATE     — current date\n  TIME     — current time\n  EXIT     — close terminal\n\n';
            break;
        case 'fetchme': cmdOut.textContent += FETCHME_OUTPUT; break;
        case 'cls':     cmdOut.textContent = ''; break;
        case 'ver':     cmdOut.textContent += 'OS 95 [Version 1.0.0 Build 2026.01]\n\n'; break;
        case 'dir':     cmdOut.textContent += ' Directory of C:\\PORTFOLIO\n\nABOUT        <DIR>   Portfolio info\nBRIEFCASE    <DIR>   Projects & Certificates\nSOCIALS      <DIR>   Social links\nSKILLS.TXT           Tech stack & tools\n\n'; break;
        case 'about':   openWin('w-about');  cmdOut.textContent += 'Opening My Portfolio...\n\n'; break;
        case 'skills':  openWin('w-skills'); cmdOut.textContent += 'Opening Skills.txt...\n\n'; break;
        case 'date':    cmdOut.textContent += new Date().toLocaleDateString()  + '\n\n'; break;
        case 'time':    cmdOut.textContent += new Date().toLocaleTimeString()  + '\n\n'; break;
        case 'exit':    closeWin('w-cmd'); break;
        case '':        cmdOut.textContent += '\n'; break;
        default:        cmdOut.textContent += `'${cmd}' is not recognized. Type HELP for commands.\n\n`;
    }
    const b = document.getElementById('cmd-body'); b.scrollTop = b.scrollHeight;
});

// ── Shut Down ────────────────────────────────────────────────
function shutDown() {
    closeStartMenu();
    screenOverlay.classList.remove('on');
    setZoomed(false);
    setTimeout(() => {
        document.querySelectorAll('.win').forEach(w => w.classList.remove('open'));
        openSet.clear(); rebuildTaskbar();
        welcomeShown = false;
    }, 500);
}

// ═══════════════════════════════════════════════════════════
//  FILE EXPLORER  &  PHOTO VIEWER
// ═══════════════════════════════════════════════════════════
const FOLDER_ICON = `data:image/svg+xml,%3Csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' shape-rendering='crispEdges'%3E%3Crect x='1' y='9' width='28' height='20' fill='%23ffd700'/%3E%3Crect x='1' y='9' width='28' height='2' fill='%23fff'/%3E%3Crect x='1' y='9' width='2' height='20' fill='%23fff'/%3E%3Crect x='27' y='9' width='2' height='20' fill='%23a08000'/%3E%3Crect x='1' y='27' width='28' height='2' fill='%23a08000'/%3E%3Crect x='1' y='7' width='12' height='4' fill='%23ffd700'/%3E%3Crect x='1' y='7' width='12' height='2' fill='%23fff'/%3E%3Crect x='11' y='7' width='2' height='4' fill='%23a08000'/%3E%3C/svg%3E`;
const IMG_ICON   = `data:image/svg+xml,%3Csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' shape-rendering='crispEdges'%3E%3Crect x='2' y='2' width='28' height='28' fill='%23fff' stroke='%23808080' stroke-width='1'/%3E%3Crect x='2' y='2' width='28' height='4' fill='%23000080'/%3E%3Crect x='4' y='10' width='24' height='16' fill='%2300aaff' opacity='0.3'/%3E%3Ccircle cx='10' cy='14' r='3' fill='%23ffff00'/%3E%3Cpolygon points='4,26 12,16 18,22 22,18 28,26' fill='%2300aa00' opacity='0.7'/%3E%3C/svg%3E`;

// ─────────────────────────────────────────────────────────────
//  FS — FILESYSTEM DATA
//
//  HOW TO ADD YOUR IMAGES:
//
//  PROFILE PHOTO (Welcome screen):
//    → Put your photo in:  assets/profile/photo.jpg  (or .png)
//    → In index.html find id="welcome-profile-img" and set:
//        src="assets/profile/photo.jpg"
//
//  PROJECT SCREENSHOTS:
//    → Put images in:  assets/projects/
//    → Add entries below like this:
//
//        proj1: { label:'My App',      type:'image', src:'assets/projects/myapp.png'   },
//        proj2: { label:'My Website',  type:'image', src:'assets/projects/website.jpg' },
//
//    → Then list the keys in projects.children:
//        projects: { label:'Projects', type:'folder', children:['proj1','proj2'] },
//
//  CERTIFICATES:
//    → Put images in:  assets/certs/
//    → Add entries below like this:
//
//        cert1: { label:'AWS Cloud',   type:'image', src:'assets/certs/aws.png'      },
//        cert2: { label:'React Dev',   type:'image', src:'assets/certs/react.jpg'    },
//
//    → Then list the keys in certs.children:
//        certs: { label:'Certificates', type:'folder', children:['cert1','cert2'] },
//
// ─────────────────────────────────────────────────────────────
const FS = {
    root:     { label:'C:\\PORTFOLIO',  type:'folder', children:['projects','certs'] },

    // ── ADD YOUR PROJECT KEYS TO children:[] BELOW ──
    projects: { label:'Projects',       type:'folder', children:[
        // 'proj1',
        // 'proj2',
    ]},

    // ── ADD YOUR CERTIFICATE KEYS TO children:[] BELOW ──
    certs:    { label:'Certificates',   type:'folder', children:[
        'cert1',
        'cert2',
    ]},

    // ── CERTIFICATE ENTRIES ──
    cert1: { label:'cert1.png', type:'image', src:'assets/certs/cert1.png' },
    cert2: { label:'cert2.png', type:'image', src:'assets/certs/cert2.png' },
};

// Photo viewer state
let photoImages = [];
let photoIndex  = 0;
let photoZoom   = 1;

let explorerCurrent = 'root';

function navTo(key) {
    explorerCurrent = key;
    const node = FS[key];
    document.getElementById('explorer-addr').textContent  = node.label;
    document.getElementById('explorer-title').textContent = `File Explorer — ${node.label}`;

    document.querySelectorAll('.tree-item').forEach(el => el.classList.remove('tree-sel'));
    const treeEl = document.getElementById('tree-' + key);
    if (treeEl) treeEl.classList.add('tree-sel');

    const pane = document.getElementById('explorer-pane');
    pane.innerHTML = '';

    if (node.children.length === 0 && node.type === 'folder') {
        const empty = document.createElement('div');
        empty.style.cssText = 'width:100%;font-size:11px;color:#808080;padding:8px;font-style:italic;';
        empty.textContent = key === 'root' ? '' : 'This folder is empty.';
        pane.appendChild(empty);
    }

    node.children.forEach(childKey => {
        const child = FS[childKey];
        if (!child) return;
        if (child.type === 'folder') {
            pane.appendChild(makeExplorerItem(FOLDER_ICON, child.label, () => navTo(childKey)));
        } else if (child.type === 'image') {
            pane.appendChild(makeExplorerItem(IMG_ICON, child.label, () => openPhotoViewer(childKey)));
        }
    });

    const folders = node.children.filter(k => FS[k] && FS[k].type === 'folder').length;
    const files   = node.children.filter(k => FS[k] && FS[k].type !== 'folder').length;
    let statusText = '';
    if (folders) statusText += `${folders} folder(s)`;
    if (files)   statusText += (statusText ? ', ' : '') + `${files} file(s)`;
    if (!statusText) statusText = 'Empty';
    document.getElementById('explorer-status').textContent = statusText;
}

function makeExplorerItem(iconSrc, label, onClick) {
    const d = document.createElement('div');
    d.className = 'f-item';
    d.ondblclick = onClick;
    d.innerHTML = `<img src="${iconSrc}" style="image-rendering:pixelated;width:32px;height:32px;display:block;margin:0 auto 3px;">${label}`;
    return d;
}

function openPhotoViewer(key) {
    const img = FS[key];
    if (!img) return;
    const parentKey = Object.keys(FS).find(k => FS[k].children && FS[k].children.includes(key));
    if (parentKey) {
        photoImages = FS[parentKey].children
            .filter(k => FS[k] && FS[k].type === 'image')
            .map(k => ({ key: k, name: FS[k].label, src: FS[k].src }));
        photoIndex = photoImages.findIndex(i => i.key === key);
    } else {
        photoImages = [{ key, name: img.label, src: img.src }];
        photoIndex  = 0;
    }
    photoZoom = 1;
    renderPhoto();
    openWin('w-photo');
}

function renderPhoto() {
    const ph      = document.getElementById('photo-placeholder');
    const im      = document.getElementById('photo-img');
    const counter = document.getElementById('photo-counter');
    const info    = document.getElementById('photo-info');
    const titleEl = document.getElementById('photo-title');
    if (photoImages.length === 0) {
        ph.style.display = 'block'; im.style.display = 'none';
        counter.textContent = 'No images';
        info.textContent    = 'Ready';
        titleEl.textContent = 'Photo Viewer';
        return;
    }
    const cur = photoImages[photoIndex];
    ph.style.display = 'none'; im.style.display = 'block';
    im.src = cur.src;
    im.style.transform  = `scale(${photoZoom})`;
    counter.textContent = `${photoIndex + 1} / ${photoImages.length}`;
    info.textContent    = `${cur.name}  |  Zoom: ${Math.round(photoZoom * 100)}%`;
    titleEl.textContent = `Photo Viewer — ${cur.name}`;
}

function photoPrev()    { if (photoImages.length) { photoIndex = (photoIndex - 1 + photoImages.length) % photoImages.length; photoZoom=1; renderPhoto(); } }
function photoNext()    { if (photoImages.length) { photoIndex = (photoIndex + 1) % photoImages.length; photoZoom=1; renderPhoto(); } }
function photoZoomIn()  { photoZoom = Math.min(photoZoom + 0.25, 4);    renderPhoto(); }
function photoZoomOut() { photoZoom = Math.max(photoZoom - 0.25, 0.25); renderPhoto(); }
function photoActual()  { photoZoom = 1; renderPhoto(); }

function initExplorer() { navTo('root'); }

// ── Clock ────────────────────────────────────────────────────
function tick() {
    const d = new Date(); let h = d.getHours(), m = d.getMinutes();
    const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
    document.getElementById('sys-clock').textContent = `${h}:${String(m).padStart(2,'0')} ${ap}`;
}
setInterval(tick, 1000); tick();