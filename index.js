const header = document.getElementById('header');
const nav = document.getElementById('nav');
const menuToggle = document.getElementById('menuToggle');
const toTop = document.getElementById('toTop');
const navLinks = Array.from(nav.querySelectorAll('a'));
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href')));

function closeMenu() {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
}

menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
});

function scrollToTarget(target) {
    const offset = header.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - offset + 1;
    window.scrollTo({ top: target.id === 'home' ? 0 : top, behavior: 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
    const hash = link.getAttribute('href');
    if (hash.length < 2) return;
    link.addEventListener('click', event => {
        const target = document.querySelector(hash);
        if (!target) return;
        event.preventDefault();
        scrollToTarget(target);
        history.replaceState(null, '', hash);
        closeMenu();
    });
});

function setActiveLink() {
    const marker = window.scrollY + header.offsetHeight + window.innerHeight * 0.25;
    let currentIndex = 0;
    sections.forEach((section, index) => {
        if (section && section.offsetTop <= marker) currentIndex = index;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        currentIndex = sections.length - 1;
    }
    navLinks.forEach((link, index) => {
        link.classList.toggle('active', index === currentIndex);
    });
}

function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
    toTop.classList.toggle('show', window.scrollY > 500);
    setActiveLink();
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => {
    if (window.innerWidth > 995) closeMenu();
    setActiveLink();
});
onScroll();

toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealItems.forEach(item => observer.observe(item));
} else {
    revealItems.forEach(item => item.classList.add('visible'));
}

const typed = document.getElementById('typed');
const words = ['Job Seeker', 'Web Developer', 'Video Editor', 'Flexible Worker', 'Generalist'];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
    const word = words[wordIndex];
    typed.textContent = word.substring(0, charIndex);
    let delay = deleting ? 50 : 110;

    if (!deleting && charIndex === word.length) {
        deleting = true;
        delay = 1400;
    } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 400;
    } else {
        charIndex += deleting ? -1 : 1;
    }

    setTimeout(type, delay);
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typed.textContent = words[0];
} else {
    type();
}