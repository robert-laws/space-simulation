// ============================================
// Apollo Mission Scroll Animation
// Three.js + Scroll-based Animation
// ============================================

// Mission Stage Data
const missionStages = [
    {
        id: 1,
        name: "LAUNCH",
        title: "Saturn V Launch",
        description: "The Saturn V rocket stands 363 feet tall, generating 7.6 million pounds of thrust at liftoff from Kennedy Space Center, Florida.",
        altitude: 0,
        velocity: 0,
        distance: 0
    },
    {
        id: 2,
        name: "STAGE SEPARATION",
        title: "First Stage Separation",
        description: "At 42 miles altitude, the S-IC first stage separates after burning 203,000 gallons of fuel in just 2.5 minutes. The S-II second stage ignites.",
        altitude: 67,
        velocity: 2.7,
        distance: 93
    },
    {
        id: 3,
        name: "EARTH ORBIT",
        title: "Parking Orbit",
        description: "The spacecraft enters a 185 km circular orbit around Earth. The crew performs system checks before committing to the lunar journey.",
        altitude: 185,
        velocity: 7.8,
        distance: 185
    },
    {
        id: 4,
        name: "TLI BURN",
        title: "Trans-Lunar Injection",
        description: "The S-IVB third stage reignites for 6 minutes, accelerating the spacecraft to 24,500 mph—fast enough to escape Earth's gravity.",
        altitude: 334,
        velocity: 10.8,
        distance: 1850
    },
    {
        id: 5,
        name: "DOCKING",
        title: "CSM/LM Docking",
        description: "The Command/Service Module separates, rotates 180°, and docks with the Lunar Module. This maneuver is called transposition and docking.",
        altitude: 5000,
        velocity: 10.4,
        distance: 25000
    },
    {
        id: 6,
        name: "LUNAR TRANSIT",
        title: "Coast to the Moon",
        description: "For three days, the spacecraft coasts toward the Moon, covering 240,000 miles. The crew monitors systems and makes minor course corrections.",
        altitude: 180000,
        velocity: 3.5,
        distance: 200000
    },
    {
        id: 7,
        name: "LOI",
        title: "Lunar Orbit Insertion",
        description: "The Service Module engine fires to slow the spacecraft, allowing the Moon's gravity to capture it into a 110 km lunar orbit.",
        altitude: 110,
        velocity: 1.6,
        distance: 384400
    },
    {
        id: 8,
        name: "LM DESCENT",
        title: "Lunar Module Descent",
        description: "Two astronauts transfer to the Lunar Module and undock. The descent engine fires, beginning the 12-minute journey to the surface.",
        altitude: 15,
        velocity: 0.5,
        distance: 384400
    },
    {
        id: 9,
        name: "MOON LANDING",
        title: "Lunar Surface",
        description: "\"The Eagle has landed.\" Astronauts spend up to 3 days on the Moon, conducting experiments and collecting samples.",
        altitude: 0,
        velocity: 0,
        distance: 384400
    },
    {
        id: 10,
        name: "LM ASCENT",
        title: "Lunar Module Ascent",
        description: "The ascent stage launches from the Moon using the descent stage as a launchpad. It rendezvous and docks with the orbiting Command Module.",
        altitude: 110,
        velocity: 1.6,
        distance: 384400
    },
    {
        id: 11,
        name: "TEI",
        title: "Trans-Earth Injection",
        description: "The Service Module engine fires behind the Moon, sending the spacecraft on a trajectory back to Earth. The journey home takes about 3 days.",
        altitude: 180000,
        velocity: 2.5,
        distance: 200000
    },
    {
        id: 12,
        name: "SPLASHDOWN",
        title: "Reentry & Splashdown",
        description: "The Command Module hits the atmosphere at 25,000 mph. Parachutes deploy, and the capsule splashes down in the Pacific Ocean.",
        altitude: 0,
        velocity: 0,
        distance: 0
    }
];

// Global Variables
let scene, camera, renderer;
let earth, moon, spacecraft, lunarModule;
let stars = [];
let scrollProgress = 0;
let currentStage = 0;
let targetCameraPosition = new THREE.Vector3();
let targetCameraLookAt = new THREE.Vector3();

// Initialize the scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a12);

    // Create camera
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        100000
    );
    camera.position.set(0, 50, 200);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(500, 200, 500);
    scene.add(sunLight);

    // Create celestial bodies and spacecraft
    createStars();
    createEarth();
    createMoon();
    createSpacecraft();
    createLunarModule();
    createTrajectoryPath();

    // Setup progress markers
    setupProgressMarkers();

    // Event listeners
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);

    // Start animation loop
    animate();

    // Show info panel after a delay
    setTimeout(() => {
        document.getElementById('info-panel').classList.add('visible');
    }, 1000);
}

// Create star field
function createStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 5000;
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
        const radius = 5000 + Math.random() * 10000;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        sizes[i] = Math.random() * 2 + 0.5;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
}

// Create Earth
function createEarth() {
    const earthGroup = new THREE.Group();

    // Earth sphere
    const earthGeometry = new THREE.SphereGeometry(100, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
        color: 0x2233aa,
        emissive: 0x112244,
        shininess: 25
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earthMesh);

    // Add continents (simplified)
    const continentGeometry = new THREE.SphereGeometry(100.5, 64, 64);
    const continentMaterial = new THREE.MeshPhongMaterial({
        color: 0x33aa55,
        transparent: true,
        opacity: 0.7
    });
    const continents = new THREE.Mesh(continentGeometry, continentMaterial);
    earthGroup.add(continents);

    // Atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(105, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x4facfe,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    earthGroup.add(atmosphere);

    // Clouds
    const cloudGeometry = new THREE.SphereGeometry(102, 64, 64);
    const cloudMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    clouds.name = 'clouds';
    earthGroup.add(clouds);

    earthGroup.position.set(0, 0, 0);
    scene.add(earthGroup);
    earth = earthGroup;
}

// Create Moon
function createMoon() {
    const moonGroup = new THREE.Group();

    // Moon sphere
    const moonGeometry = new THREE.SphereGeometry(27, 64, 64);
    const moonMaterial = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa,
        emissive: 0x222222,
        shininess: 5
    });
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);

    // Add crater details (simple bump effect using darker patches)
    const craterGeometry = new THREE.SphereGeometry(27.2, 32, 32);
    const craterMaterial = new THREE.MeshBasicMaterial({
        color: 0x666666,
        transparent: true,
        opacity: 0.3
    });
    const craters = new THREE.Mesh(craterGeometry, craterMaterial);

    moonGroup.add(moonMesh);
    moonGroup.add(craters);

    // Position moon far from Earth (scaled down for visualization)
    moonGroup.position.set(2000, 0, 0);
    scene.add(moonGroup);
    moon = moonGroup;
}

// Create Spacecraft (Command/Service Module + Lunar Module stack)
function createSpacecraft() {
    const spacecraftGroup = new THREE.Group();

    // Command Module (cone)
    const cmGeometry = new THREE.ConeGeometry(3, 5, 8);
    const cmMaterial = new THREE.MeshPhongMaterial({
        color: 0xcccccc,
        metalness: 0.8
    });
    const commandModule = new THREE.Mesh(cmGeometry, cmMaterial);
    commandModule.rotation.x = Math.PI;
    commandModule.position.y = 2.5;
    spacecraftGroup.add(commandModule);

    // Service Module (cylinder)
    const smGeometry = new THREE.CylinderGeometry(3, 3, 10, 8);
    const smMaterial = new THREE.MeshPhongMaterial({
        color: 0x888888,
        metalness: 0.6
    });
    const serviceModule = new THREE.Mesh(smGeometry, smMaterial);
    serviceModule.position.y = -5;
    spacecraftGroup.add(serviceModule);

    // Engine nozzle
    const nozzleGeometry = new THREE.CylinderGeometry(1, 2, 3, 8);
    const nozzleMaterial = new THREE.MeshPhongMaterial({
        color: 0x444444
    });
    const nozzle = new THREE.Mesh(nozzleGeometry, nozzleMaterial);
    nozzle.position.y = -11.5;
    spacecraftGroup.add(nozzle);

    // Solar panels (simplified as flat rectangles during certain phases)
    const panelGeometry = new THREE.BoxGeometry(15, 0.2, 3);
    const panelMaterial = new THREE.MeshPhongMaterial({
        color: 0x2244aa,
        emissive: 0x112233
    });

    const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    leftPanel.position.set(-9, -5, 0);
    leftPanel.visible = false; // Only visible during certain phases
    leftPanel.name = 'leftPanel';
    spacecraftGroup.add(leftPanel);

    const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    rightPanel.position.set(9, -5, 0);
    rightPanel.visible = false;
    rightPanel.name = 'rightPanel';
    spacecraftGroup.add(rightPanel);

    spacecraftGroup.position.set(0, 120, 0);
    scene.add(spacecraftGroup);
    spacecraft = spacecraftGroup;
}

// Create Lunar Module (separate vehicle)
function createLunarModule() {
    const lmGroup = new THREE.Group();

    // Descent stage (octagonal base)
    const descentGeometry = new THREE.CylinderGeometry(4, 5, 4, 8);
    const descentMaterial = new THREE.MeshPhongMaterial({
        color: 0xaaaa44,
        metalness: 0.3
    });
    const descentStage = new THREE.Mesh(descentGeometry, descentMaterial);
    lmGroup.add(descentStage);

    // Ascent stage (boxy top)
    const ascentGeometry = new THREE.BoxGeometry(5, 4, 5);
    const ascentMaterial = new THREE.MeshPhongMaterial({
        color: 0xcccccc,
        metalness: 0.5
    });
    const ascentStage = new THREE.Mesh(ascentGeometry, ascentMaterial);
    ascentStage.position.y = 4;
    lmGroup.add(ascentStage);

    // Window
    const windowGeometry = new THREE.BoxGeometry(2, 1.5, 0.5);
    const windowMaterial = new THREE.MeshBasicMaterial({
        color: 0x4facfe,
        transparent: true,
        opacity: 0.7
    });
    const lmWindow = new THREE.Mesh(windowGeometry, windowMaterial);
    lmWindow.position.set(0, 4.5, 2.8);
    lmGroup.add(lmWindow);

    // Landing legs
    const legMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const legGeometry = new THREE.CylinderGeometry(0.2, 0.2, 6, 4);
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(
            Math.cos(angle) * 5,
            -3,
            Math.sin(angle) * 5
        );
        leg.rotation.z = Math.cos(angle) * 0.4;
        leg.rotation.x = Math.sin(angle) * 0.4;
        lmGroup.add(leg);

        // Footpad
        const padGeometry = new THREE.CylinderGeometry(1, 1, 0.3, 8);
        const pad = new THREE.Mesh(padGeometry, legMaterial);
        pad.position.set(
            Math.cos(angle) * 7,
            -6,
            Math.sin(angle) * 7
        );
        lmGroup.add(pad);
    }

    lmGroup.visible = false;
    lmGroup.position.copy(spacecraft.position);
    scene.add(lmGroup);
    lunarModule = lmGroup;
}

// Create trajectory path
function createTrajectoryPath() {
    const pathPoints = [];

    // Earth to Moon trajectory (figure-8 pattern simplified)
    for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const x = t * 2000; // Move toward moon
        const y = Math.sin(t * Math.PI) * 300; // Arc upward
        const z = Math.sin(t * Math.PI * 0.5) * 100;
        pathPoints.push(new THREE.Vector3(x, y, z));
    }

    const pathGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
    const pathMaterial = new THREE.LineDashedMaterial({
        color: 0x4facfe,
        dashSize: 10,
        gapSize: 5,
        transparent: true,
        opacity: 0.3
    });

    const trajectoryPath = new THREE.Line(pathGeometry, pathMaterial);
    trajectoryPath.computeLineDistances();
    trajectoryPath.visible = false;
    trajectoryPath.name = 'trajectory';
    scene.add(trajectoryPath);
}

// Setup progress markers
function setupProgressMarkers() {
    const markersContainer = document.getElementById('progress-markers');

    missionStages.forEach((stage, index) => {
        const marker = document.createElement('div');
        marker.className = 'progress-marker';
        marker.style.top = `${(index / (missionStages.length - 1)) * 100}%`;
        marker.setAttribute('data-stage', index);
        markersContainer.appendChild(marker);
    });
}

// Handle scroll
function onScroll() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = window.scrollY / scrollHeight;

    // Update progress bar
    document.getElementById('progress-bar').style.height = `${scrollProgress * 100}%`;

    // Calculate current stage
    const newStage = Math.min(
        Math.floor(scrollProgress * missionStages.length),
        missionStages.length - 1
    );

    // Update progress markers
    document.querySelectorAll('.progress-marker').forEach((marker, index) => {
        marker.classList.remove('active', 'completed');
        if (index < newStage) {
            marker.classList.add('completed');
        } else if (index === newStage) {
            marker.classList.add('active');
        }
    });

    // Hide scroll indicator after scrolling
    if (scrollProgress > 0.01) {
        document.getElementById('scroll-indicator').classList.add('hidden');
    } else {
        document.getElementById('scroll-indicator').classList.remove('hidden');
    }

    // Update stage if changed
    if (newStage !== currentStage) {
        currentStage = newStage;
        updateStageInfo();
    }
}

// Update stage information display
function updateStageInfo() {
    const stage = missionStages[currentStage];

    document.getElementById('stage-number').textContent =
        String(stage.id).padStart(2, '0');
    document.getElementById('stage-name').textContent = stage.name;
    document.getElementById('info-title').textContent = stage.title;
    document.getElementById('info-description').textContent = stage.description;

    // Animate stats
    animateValue('stat-altitude', stage.altitude);
    animateValue('stat-velocity', stage.velocity);
    animateValue('stat-distance', stage.distance);
}

// Animate numeric values
function animateValue(elementId, targetValue) {
    const element = document.getElementById(elementId);
    const startValue = parseFloat(element.textContent) || 0;
    const duration = 1000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        const currentValue = startValue + (targetValue - startValue) * easeProgress;

        if (targetValue >= 1000) {
            element.textContent = Math.round(currentValue).toLocaleString();
        } else if (targetValue >= 1) {
            element.textContent = currentValue.toFixed(1);
        } else {
            element.textContent = currentValue.toFixed(2);
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Handle window resize
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Update spacecraft position based on scroll
function updateSpacecraftPosition() {
    const stageProgress = (scrollProgress * missionStages.length) % 1;

    // Different behaviors for each stage
    switch(currentStage) {
        case 0: // Launch
            spacecraft.position.y = 100 + stageProgress * 50;
            spacecraft.position.x = 0;
            spacecraft.rotation.z = 0;
            camera.position.set(50, spacecraft.position.y + 30, 150);
            camera.lookAt(spacecraft.position);
            break;

        case 1: // Stage separation
            spacecraft.position.y = 150 + stageProgress * 100;
            spacecraft.rotation.z = stageProgress * 0.1;
            camera.position.set(30, spacecraft.position.y + 20, 100);
            camera.lookAt(spacecraft.position);
            break;

        case 2: // Earth orbit
            const orbitAngle = stageProgress * Math.PI;
            spacecraft.position.x = Math.cos(orbitAngle) * 150;
            spacecraft.position.z = Math.sin(orbitAngle) * 150;
            spacecraft.position.y = 0;
            spacecraft.rotation.y = orbitAngle + Math.PI / 2;
            camera.position.set(
                spacecraft.position.x + 50,
                50,
                spacecraft.position.z + 100
            );
            camera.lookAt(earth.position);
            break;

        case 3: // TLI burn
            const tliProgress = stageProgress;
            spacecraft.position.x = 150 + tliProgress * 200;
            spacecraft.position.y = tliProgress * 150;
            spacecraft.position.z = 0;
            camera.position.set(
                spacecraft.position.x - 50,
                spacecraft.position.y + 30,
                100
            );
            camera.lookAt(spacecraft.position);
            // Show trajectory
            scene.getObjectByName('trajectory').visible = true;
            break;

        case 4: // Docking
            spacecraft.position.x = 350 + stageProgress * 100;
            spacecraft.position.y = 150 + stageProgress * 50;
            spacecraft.rotation.y = stageProgress * Math.PI * 2;
            camera.position.set(
                spacecraft.position.x + 30,
                spacecraft.position.y + 10,
                50
            );
            camera.lookAt(spacecraft.position);
            break;

        case 5: // Lunar transit
            const transitProgress = stageProgress;
            spacecraft.position.x = 450 + transitProgress * 1000;
            spacecraft.position.y = 200 + Math.sin(transitProgress * Math.PI) * 100;
            spacecraft.position.z = Math.sin(transitProgress * Math.PI * 0.5) * 50;
            camera.position.set(
                spacecraft.position.x - 100,
                spacecraft.position.y + 50,
                200
            );
            camera.lookAt(spacecraft.position);
            break;

        case 6: // LOI - Lunar Orbit Insertion
            const loiAngle = stageProgress * Math.PI;
            spacecraft.position.x = moon.position.x + Math.cos(loiAngle) * 80;
            spacecraft.position.z = Math.sin(loiAngle) * 80;
            spacecraft.position.y = 0;
            camera.position.set(
                moon.position.x + 150,
                50,
                150
            );
            camera.lookAt(moon.position);
            break;

        case 7: // LM Descent
            lunarModule.visible = true;
            const descentProgress = stageProgress;
            lunarModule.position.x = moon.position.x + 30 - descentProgress * 3;
            lunarModule.position.y = 50 - descentProgress * 50;
            lunarModule.position.z = 0;
            spacecraft.position.x = moon.position.x + Math.cos(descentProgress * Math.PI * 0.5) * 80;
            spacecraft.position.z = Math.sin(descentProgress * Math.PI * 0.5) * 80;
            camera.position.set(
                lunarModule.position.x + 30,
                lunarModule.position.y + 20,
                60
            );
            camera.lookAt(lunarModule.position);
            break;

        case 8: // Moon landing
            lunarModule.visible = true;
            lunarModule.position.x = moon.position.x + 27;
            lunarModule.position.y = 27 + 6; // On surface
            lunarModule.position.z = 0;
            camera.position.set(
                lunarModule.position.x + 20,
                lunarModule.position.y + 10,
                40
            );
            camera.lookAt(lunarModule.position);
            break;

        case 9: // LM Ascent
            const ascentProgress = stageProgress;
            lunarModule.position.y = 33 + ascentProgress * 50;
            spacecraft.position.x = moon.position.x + Math.cos(ascentProgress * Math.PI) * 80;
            spacecraft.position.z = Math.sin(ascentProgress * Math.PI) * 80;
            camera.position.set(
                moon.position.x + 100,
                50,
                100
            );
            camera.lookAt(lunarModule.position);
            break;

        case 10: // TEI
            lunarModule.visible = false;
            const teiProgress = stageProgress;
            spacecraft.position.x = moon.position.x - teiProgress * 500;
            spacecraft.position.y = teiProgress * 100;
            camera.position.set(
                spacecraft.position.x + 100,
                spacecraft.position.y + 50,
                200
            );
            camera.lookAt(spacecraft.position);
            break;

        case 11: // Splashdown
            const reentryProgress = stageProgress;
            spacecraft.position.x = 1500 - reentryProgress * 1500;
            spacecraft.position.y = 100 - reentryProgress * 100;
            spacecraft.rotation.x = reentryProgress * Math.PI * 0.5;
            camera.position.set(
                spacecraft.position.x + 50,
                spacecraft.position.y + 30,
                100
            );
            camera.lookAt(spacecraft.position);
            break;
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate Earth slowly
    if (earth) {
        const clouds = earth.getObjectByName('clouds');
        if (clouds) {
            clouds.rotation.y += 0.0005;
        }
        earth.rotation.y += 0.0002;
    }

    // Rotate Moon slowly
    if (moon) {
        moon.rotation.y += 0.0001;
    }

    // Update spacecraft position based on scroll
    updateSpacecraftPosition();

    // Smooth camera movement
    camera.position.lerp(targetCameraPosition, 0.05);

    renderer.render(scene, camera);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
