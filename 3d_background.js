
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const starsGeometry = new THREE.BufferGeometry();
const starsCount = 3200;
const posArray = new Float32Array(starsCount * 3);

for (let i = 0; i < starsCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

function createStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;

    const ctx = canvas.getContext('2d');
    const center = 16;
    const radius = 14;

    const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
}

const starsMaterial = new THREE.PointsMaterial({
    size: 0.15,
    map: createStarTexture(),
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    depthWrite: false
});

const starMesh = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starMesh);

camera.position.z = 20;

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    targetX = (event.clientX - windowHalfX) * 0.0003;
    targetY = (event.clientY - windowHalfY) * 0.0003;
}, { passive: true });

const clock = new THREE.Clock();
let isTabVisible = true;
let animationFrameId = null;

function animate() {
    if (!isTabVisible) return;

    starMesh.rotation.y += 0.00015;
    starMesh.rotation.x += 0.00008;

    // Smooth subtle parallax easing
    starMesh.rotation.y += (targetX - (starMesh.rotation.y % 1)) * 0.05;
    starMesh.rotation.x += (targetY - (starMesh.rotation.x % 1)) * 0.05;

    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(animate);
}

// ── Pause rendering when tab is hidden to save GPU/battery ──
document.addEventListener('visibilitychange', () => {
    isTabVisible = !document.hidden;
    if (isTabVisible) {
        clock.start();
        animate();
    } else if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
});

animate();

window.addEventListener('resize', () => {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


gsap.registerPlugin(ScrollTrigger);


function initHeroAnimation() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 1 } });

    tl.fromTo(".sub-title",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0 }
    )
        .fromTo(".year",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0 },
            "-=0.5"
        )
        .fromTo(".main-title",
            { opacity: 0, scale: 0.9, y: 20 },
            { opacity: 1, scale: 1, y: 0 },
            "-=0.5"
        )
        .fromTo(".hero-buttons .btn-resume:first-child",
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0 },
            "-=0.5"
        )
        .fromTo(".hero-buttons .btn-resume:last-child",
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0 },
            "<"
        );
}

// ── Sync hero entrance animation with preloader completion ──
if (document.getElementById('preloader')) {
    window.addEventListener('preloaderComplete', initHeroAnimation, { once: true });
} else {
    initHeroAnimation();
}


document.querySelectorAll('.section-title').forEach(title => {
    gsap.fromTo(title,
        { opacity: 0, y: 40 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
                trigger: title,
                start: "top 88%",
                toggleActions: "play none none reverse"
            }
        }
    );
});


const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach((item) => {
    const isLeft = item.classList.contains('left');
    gsap.fromTo(item,
        { opacity: 0, x: isLeft ? -80 : 80 },
        {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
    );
});


const projectCards = document.querySelectorAll('.experience-card');
if (projectCards.length) {
    gsap.fromTo(projectCards,
        { opacity: 0, y: 60, scale: 0.95 },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "back.out(1.4)",
            stagger: 0.12,
            scrollTrigger: {
                trigger: '.experience-grid',
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );
}


const skillCards = document.querySelectorAll('.skill-grid .skill-card');
if (skillCards.length) {
    gsap.fromTo(skillCards,
        { opacity: 0, y: 40, scale: 0.9 },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
            stagger: {
                each: 0.05,
                from: "start"
            },
            scrollTrigger: {
                trigger: '.skill-grid',
                start: "top 82%",
                toggleActions: "play none none reverse"
            }
        }
    );
}


const contactContainer = document.querySelector('.contact-container');
if (contactContainer) {
    gsap.fromTo(contactContainer,
        { opacity: 0, scale: 0.92, filter: "blur(8px)" },
        {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: contactContainer,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );
}


const certItems = document.querySelectorAll('.cert-item');
if (certItems.length) {
    gsap.fromTo(certItems,
        { opacity: 0, scale: 0.92, filter: "blur(8px)" },
        {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
                trigger: '.cert-grid',
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );
}
