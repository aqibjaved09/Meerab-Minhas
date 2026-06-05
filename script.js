/**
 * PREMIUM PORTFOLIO SCRIPT
 * Uses GSAP for ultra-smooth animations & Lenis for Smooth Scrolling
 */

// 1. Initialize Lenis for buttery smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
})

// Get animation frame for Lenis
function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// 2. Custom Cursor Logic
const dot = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Quick snap for dot
    dot.style.left = `${posX}px`;
    dot.style.top = `${posY}px`;

    // Smooth follow for outline (using GSAP for performance)
    gsap.to(outline, {
        x: posX,
        y: posY,
        duration: 0.15,
        ease: "power2.out"
    });
});

// Cursor Hover States
const links = document.querySelectorAll('a, button, .bento-card, .feature-card, .testimonial-card');
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        outline.classList.add('hover-state');
    });
    link.addEventListener('mouseleave', () => {
        outline.classList.remove('hover-state');
    });
});

// 3. Preloader & Initial Animations
window.addEventListener('load', () => {
    const tl = gsap.timeline();

    // Animate loader text up
    tl.to('.loader-text span', {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: "power4.out"
    })
        // Delay slightly and fade loader out
        .to('.preloader', {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            delay: 0.5,
            onComplete: () => {
                document.querySelector('.preloader').style.display = 'none';
            }
        })
        // Animate Hero Elements
        .from('.fade-up', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "all"
        }, "-=0.2");
});

// 4. GSAP ScrollTrigger Animations
gsap.registerPlugin(ScrollTrigger);

// Navbar collapse effect on scroll
const navbar = document.querySelector('.navbar');
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinksContainer = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
mobileToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
    mobileToggle.querySelector('i').classList.toggle('fa-bars');
    mobileToggle.querySelector('i').classList.toggle('fa-times');
});

// Close menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        mobileToggle.querySelector('i').classList.add('fa-bars');
        mobileToggle.querySelector('i').classList.remove('fa-times');
    });
});

// Fade up elements on scroll
const fadeElements = document.querySelectorAll('.fade-up');
fadeElements.forEach(el => {
    // Only apply ScrollTrigger to elements NOT in hero section (hero is handled by preloader timeline)
    if (!el.closest('#home')) {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%", // Trigger when element is 85% down viewport
                toggleActions: "play none none reverse"
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    }
});

// 5. Typing Effect (Vanilla JS Implementation)
const typedSpan = document.querySelector('.typed-text');
const words = ["Content Writer", "Off-Page SEO Specialist", "UI/UX Designer", "Growth Hacker"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
        typedSpan.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedSpan.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500; // Pause before next word
    }

    setTimeout(typeEffect, typeSpeed);
}
// 6. Testimonial Slider Logic
const slider = document.querySelector('.testimonials-slider');
const testimonialCards = document.querySelectorAll('.testimonials-slider .testimonial-card');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentSlide = 0;
let slideInterval;

function updateSlider() {
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function startAutoSlide() {
    slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonialCards.length;
        updateSlider();
    }, 2000); // 2 seconds as requested
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % testimonialCards.length;
        updateSlider();
        resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
        updateSlider();
        resetAutoSlide();
    });

    // Start auto-slide initially
    startAutoSlide();
}

// 7. FAQ Accordion Logic
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        // Close other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        item.classList.toggle('active');
    });
});

// Start typing effect slightly delayed
setTimeout(typeEffect, 2500);
