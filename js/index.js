// =========================
// NAVBAR AL HACER SCROLL
// =========================

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// =========================
// CONTADORES ANIMADOS
// =========================

const counters = document.querySelectorAll('.counter');
let countersStarted = false;

function startCounters() {
    if (countersStarted) return;
    countersStarted = true;

    counters.forEach(counter => {
        const target = Number(counter.dataset.target);
        let current = 0;
        const increment = Math.max(1, target / 80);

        const updateCounter = () => {
            current += increment;

            if (current < target) {
                counter.innerText = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target + '+';
            }
        };

        updateCounter();
    });
}

const statsSection = document.querySelector('.stats');

if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            startCounters();
            observer.disconnect();
        }
    }, {
        threshold: 0.3
    });

    observer.observe(statsSection);
}

// =========================
// RESALTAR MENÚ SEGÚN SECCIÓN
// =========================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');

        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// =========================
// PARALLAX SUAVE EN EL HERO
// =========================

const heroVideo = document.querySelector('.hero-video');

window.addEventListener('scroll', () => {
    if (heroVideo) {
        const offset = window.scrollY * 0.25;
        heroVideo.style.transform = `scale(1.05) translateY(${offset}px)`;
    }
});

// =========================
// EFECTO BRILLO EN BOTONES
// =========================

document.querySelectorAll('.btn-danger').forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        button.style.setProperty('--x', x + 'px');
        button.style.setProperty('--y', y + 'px');
    });
});

// =========================
// ANIMACIÓN VÍDEOS GALERÍA
// =========================

const galleryVideos = document.querySelectorAll('.gallery video');

const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.play();
        } else {
            entry.target.pause();
        }
    });
}, {
    threshold: 0.4
});

galleryVideos.forEach(video => {
    videoObserver.observe(video);
});

// =========================
// REVELAR TARJETAS AL SCROLL
// =========================

const cards = document.querySelectorAll(
    '.goal-card, .service-card, .partner-card, .testimonial-card, .stat-card'
);

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            cardObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

cards.forEach(card => {
    card.classList.add('hidden-card');
    cardObserver.observe(card);
});

// =========================
// SCROLL SUAVE EXTRA
// =========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            e.preventDefault();

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// =========================
// INICIALIZAR EMAILJS
// =========================

emailjs.init({
    publicKey: '574IoXgn_wG6a1wW4'
});

// =========================
// FORMULARIO EMAILJS
// =========================

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {

    contactForm.addEventListener('submit', function (e) {

        e.preventDefault();

        const button = contactForm.querySelector('button');
        button.innerText = 'Enviando...';
        button.disabled = true;

        // Ocultar mensaje anterior
        formMessage.textContent = '';
        formMessage.className = 'form-message';

        emailjs.sendForm(
            'service_3nzigpx',
            'template_xbyd6b2',
            this
        ).then(() => {

            formMessage.textContent =
                '✓ Solicitud enviada correctamente. Me pondré en contacto contigo lo antes posible.';
            formMessage.className = 'form-message success';

            contactForm.reset();

            button.innerText = 'Enviar solicitud';
            button.disabled = false;

        }).catch((error) => {

            console.error(error);

            formMessage.textContent =
                '✕ Ha ocurrido un error al enviar el formulario. Inténtalo de nuevo.';
            formMessage.className = 'form-message error';

            button.innerText = 'Enviar solicitud';
            button.disabled = false;

        });

    });

}