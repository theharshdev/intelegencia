// --- Custom Cursor ---
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

// Update mouse coordinates
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Smoothly interpolate cursor position
const renderCursor = () => {
  cursorX += (mouseX - cursorX) * 0.2;
  cursorY += (mouseY - cursorY) * 0.2;
  cursor.style.transform = `translate(${cursorX - cursor.offsetWidth / 2}px, ${cursorY - cursor.offsetHeight / 2}px)`;
  requestAnimationFrame(renderCursor);
};
renderCursor();

// Attach hover effect on all clickable elements
const attachHoverEffects = () => {
  const hoverables = document.querySelectorAll('a, button, .hoverable');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
};


document.addEventListener('DOMContentLoaded', () => {
  attachHoverEffects();

  // --- GSAP Registration ---
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  initThreeJS();
  initGSAPTextReveals();
});

// --- Three.js Background Implementation ---
function initThreeJS() {
  const canvasContainer = document.getElementById('three-canvas');
  if (!canvasContainer || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.appendChild(renderer.domElement);

  // Particles / Artistic Geometry
  const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 200, 32);

  // Custom Shader Material mimicking the ethereal screenshots
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x9D4EDD, // brand purple
    emissive: 0x111111,
    roughness: 0.1,
    metalness: 0.8,
    transmission: 0.9,     // glass-like
    thickness: 1.5,
    clearcoat: 1.0,
    wireframe: false
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight1 = new THREE.DirectionalLight(0xFF006E, 2); // Pink light
  directionalLight1.position.set(5, 5, 5);
  scene.add(directionalLight1);

  const directionalLight2 = new THREE.DirectionalLight(0x3A86FF, 2); // Blue light
  directionalLight2.position.set(-5, -5, 5);
  scene.add(directionalLight2);

  // Animation Loop
  let targetRotationX = 0;
  let targetRotationY = 0;

  const animate = () => {
    requestAnimationFrame(animate);

    // Mouse interactive rotation
    targetRotationY = (mouseX / window.innerWidth) * 2 - 1;
    targetRotationX = (mouseY / window.innerHeight) * 2 - 1;

    mesh.rotation.y += (targetRotationY * 0.5 - mesh.rotation.y) * 0.05;
    mesh.rotation.x += (targetRotationX * 0.5 - mesh.rotation.x) * 0.05;

    // Constant slow rotation
    mesh.rotation.z -= 0.002;

    // Dynamic Theme Evaluation to prevent Light Mode whiteouts
    const isDark = document.documentElement.classList.contains('dark');
    material.emissive.setHex(isDark ? 0x111111 : 0x110022);

    renderer.render(scene, camera);
  };
  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// --- GSAP Animations ---
function initGSAPTextReveals() {
  if (typeof gsap === 'undefined') return;

  // Hero Text Reveal
  const heroTitle = document.querySelector('.brutalist-title');
  if (heroTitle) {
    gsap.fromTo(heroTitle,
      { y: 100, opacity: 0, rotationX: -20 },
      { y: 0, opacity: 1, rotationX: 0, duration: 1.5, ease: "power4.out", delay: 0.2 }
    );
  }

  const heroSub = document.querySelector('.hero-subtitle');
  if (heroSub) {
    gsap.fromTo(heroSub,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.6 }
    );
  }

  // Scroll triggers for brutalist text blocks
  const revealBlocks = document.querySelectorAll('.text-reveal-block');
  revealBlocks.forEach(block => {
    gsap.fromTo(block,
      { y: 80, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
        scrollTrigger: {
          trigger: block,
          start: "top 85%"
        }
      }
    );
  });

  // Card reveal animations
  const cards = document.querySelectorAll('.card-reveal');
  cards.forEach(card => {
    gsap.fromTo(card,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%"
        }
      }
    );
  });

  // Marquee Animation
  const marquees = document.querySelectorAll('.marquee-content');
  marquees.forEach(marquee => {
    gsap.to(marquee, {
      xPercent: -50,
      repeat: -1,
      duration: 35,
      ease: "linear"
    });
  });

  // Number Counters Trigger
  const counters = document.querySelectorAll('.stat-counter');
  counters.forEach(counter => {
    let targetObj = { val: 0 };
    let finalValue = parseInt(counter.getAttribute('data-target'));

    gsap.to(targetObj, {
      val: finalValue,
      scrollTrigger: {
        trigger: counter,
        start: "top 90%",
      },
      duration: 2,
      ease: "power2.out",
      onUpdate: function () {
        counter.innerHTML = Math.ceil(targetObj.val);
      }
    });
  });

  // Horizontal Scroll Timeline (For About Page)
  const horizontalSection = document.querySelector('.horizontal-scroll-container');
  const horizontalContent = document.querySelector('.horizontal-content');

  if (horizontalSection && horizontalContent) {
    // Need to wait for rendering to get accurate scrollWidth
    setTimeout(() => {
      let getScrollAmount = () => -(horizontalContent.scrollWidth - window.innerWidth + 40);
      const tween = gsap.to(horizontalContent, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: horizontalSection,
          start: "top top",
          end: () => `+=${horizontalContent.scrollWidth}`,
          pin: true,
          animation: tween,
          scrub: 1,
          invalidateOnRefresh: true,
          markers: false
        }
      });
    }, 100);
  }
}

// --- Theme Toggle Logic ---
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }
});
