


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

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.0001; 
    mouseY = (event.clientY - windowHalfY) * 0.0001;
});


const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    
    starMesh.rotation.y += 0.0001; 
    starMesh.rotation.x += 0.00005; 

    
    starMesh.rotation.y += mouseX * 0.5;
    starMesh.rotation.x += mouseY * 0.5;

    
    

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


gsap.registerPlugin(ScrollTrigger);





const hero = document.querySelector('.hero');
if (hero) {
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


function animateSection(selector, directionX) {
    const element = document.querySelector(selector);
    if (element) {
        gsap.fromTo(element,
            { opacity: 0, x: directionX },
            {
                opacity: 1,
                x: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }
}


animateSection('.projects-section', -100);


const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach((item, index) => {
    
    
    const direction = index % 2 === 0 ? -100 : 100;

    gsap.fromTo(item,
        { opacity: 0, x: direction },
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


animateSection('.skills-section', 100);


animateSection('.certifications-section', -100);


animateSection('.contact-section', 100);

