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
        heroVideo.style.transform = `translateY(${offset}px)`;
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

// =========================
// TRADUCCIÓN ES / EN
// =========================

const translations = {
    es: {
        juega: "Juega ya",

        nav_home: "Inicio",
        nav_about: "Sobre mí",
        nav_goals: "Objetivos",
        nav_services: "Servicios",
        nav_partners: "Partners",
        nav_gallery: "Galería",
        nav_contact: "Contactar",
        hero_subtitle: "ENTRENADORA · CREADORA DE CONTENIDO · ATLETA PATROCINADA",
        hero_title: "Transforma tu físico y construye tu marca personal.",
        hero_text: "Entrenamiento personalizado, creación de contenido, edición de vídeo, asesoramiento para redes sociales y acompañamiento completo para ayudarte a crecer tanto dentro como fuera del gimnasio.",
        hero_btn1: "Empezar ahora",
        hero_btn2: "Ver mis trabajos",


        stats_clients: "Clientes",
        stats_transformations: "Colaboraciones",
        stats_years: "Años de experiencia",
        stats_satisfaction: "Satisfacción",

        about_sub: "SOBRE MÍ",
        about_title: "Mucho más que una entrenadora.",
        about_text1: "Soy Karol, entrenadora personal, creadora de contenido fitness y atleta patrocinada. Mi objetivo es ayudarte a transformar tu físico mientras desarrollamos una imagen profesional y auténtica tanto dentro como fuera del gimnasio.",
        about_text2: "Trabajo con personas que quieren aprender a entrenar correctamente, mejorar su rendimiento, resolver dudas sobre suplementación, crear contenido para redes sociales y construir una marca personal con proyección.",

        about_feature1: "Entrenamiento personalizado",
        about_feature2: "Seguimiento semanal",
        about_feature3: "Asesoramiento en suplementación",
        about_feature4: "Creación de contenido y redes sociales",
        about_btn: "Descubrir servicios",

        goals_sub: "OBJETIVOS",
        goals_title: "Todo lo que puedo ayudarte a conseguir",
        goals_text: "Trabajo de forma personalizada para ayudarte tanto en tu progreso físico como en tu imagen y presencia en redes sociales.",

        goals_titulo3: "Entrenamiento personalizado",
        goals_texto3: "Rutinas adaptadas a tu nivel, objetivos y disponibilidad para conseguir resultados reales y sostenibles.",
        goals_titulo4: "Seguimiento y asesoramiento",
        goals_texto4: "Resuelvo tus dudas, ajusto tus entrenamientos y te acompaño durante todo el proceso para que no entrenes solo/a.",
        goals_titulo5: "Asesoramiento en suplementación",
        goals_texto5: "Te oriento sobre el uso responsable de suplementos deportivos y cómo integrarlos en tu planificación.",
        goals_titulo6: "Edición de vídeo",
        goals_texto6: "Edición profesional de vídeos para redes sociales, marcas, promociones y contenido fitness de alto impacto.",
        goals_titulo7: "Redes sociales y contenido",
        goals_texto7: "Te ayudo a crear contenido atractivo y mejorar tu presencia en Instagram, TikTok y otras plataformas.",
        goals_titulo8: "Marca personal",
        goals_texto8: "Desarrolla una imagen profesional para colaborar con marcas, atraer clientes y crecer como creador/a de contenido.",

        services_sub: "SERVICIOS",
        services_title: "Servicios diseñados para transformar tu físico y tu imagen",
        services_text: "Entrenamiento, asesoramiento, creación de contenido y colaboraciones para ayudarte a crecer tanto a nivel físico como profesional.",

        services_titulo1: "Entrenamiento Personal",
        services_texto1: "Planes completamente personalizados con seguimiento continuo, adaptados a tus objetivos y nivel.",
        services_titulo2: "Edición de Vídeo",
        services_texto2: "Reels, TikToks, Shorts y contenido profesional para redes sociales, marcas y proyectos personales.",
        services_titulo3: "Sesiones Fotográficas",
        services_texto3: "Fotografía fitness profesional para redes sociales, portfolios, campañas y colaboraciones con marcas.",
        services_titulo4: "Redes Sociales",
        services_texto4: "Estrategia, imagen, contenido y crecimiento para potenciar tu presencia en Instagram y TikTok.",
        services_titulo5: "Asesoramiento en Suplementación",
        services_texto5: "Orientación personalizada para elegir suplementos de forma responsable según tus objetivos.",
        services_titulo6: "Seguimiento Online",
        services_texto6: "Comunicación directa para resolver dudas, ajustar entrenamientos y mantener el progreso constante.",
        services_titulo7: "Colaboraciones con Marcas",
        services_texto7: "Creación de contenido promocional, campañas y acciones para empresas del sector fitness y bienestar.",
        services_titulo8: "Marca Personal",
        services_texto8: "Construye una imagen profesional para atraer clientes, colaborar con marcas y crecer como creador de contenido.",

        partners_title: "Marcas con las que colaboro",
        partners_text: "Como atleta patrocinada, trabajo junto a marcas reconocidas del sector fitness y bienestar para ofrecer productos de calidad y contenido profesional.",
        partners_text1: "Suplementación deportiva, nutrición avanzada y productos orientados al rendimiento físico y la salud.",
        partners_text2: "Colaboración enfocada en bienestar, salud y mejora del rendimiento a través de productos y contenido especializado.",

        gallery_sub: "GALERÍA",
        gallery_title: "Mis trabajos más recientes",
        gallery_text: "Descubre mi trabajo y la transformación de mis clientes.",

        testimonials_sub: "OPINIONES",
        testimonials_title: "Lo que dicen quienes han trabajado conmigo",
        testimonials_text: "Resultados reales, seguimiento cercano y una forma de trabajar basada en la confianza y la constancia.",
        testimonial1: "Nunca había seguido un plan tan personalizado. En pocos meses mejoré mi físico y aprendí a entrenar correctamente.",
        testimonial1_position: "Entrenamiento Online",
        testimonial2: "Me ayudó con el contenido para redes y la edición de vídeos. La diferencia en mi perfil fue enorme.",
        testimonial2_position: "Creadora de contenido",
        testimonial3: "Atención rápida, seguimiento constante y asesoramiento muy claro sobre entrenamiento y suplementación.",
        testimonial3_position: "Asesoría Personalizada",

        cta_sub: "EMPIEZA HOY",
        cta_title: "Tu transformación empieza con un solo mensaje",
        cta_text: "Si quieres mejorar tu físico, crear contenido profesional o hacer crecer tu marca personal, estaré encantada de ayudarte.",
        cta_button: "Contáctame ahora",

        contact_sub: "CONTACTO",
        contact_title: "Cuéntame cuál es tu objetivo",
        contact_text: "Rellena el formulario y me pondré en contacto contigo lo antes posible.",
        send: "Enviar solicitud",

        contact_name: "Nombre completo",
        contact_email: "Correo electrónico",
        contact_phone: "Teléfono",

        contact_message: "Mensaje",
        send: "Enviar solicitud",

        footer_text: "Entrenadora personal, creadora de contenido y atleta patrocinada. Ayudando a transformar físicos, potenciar marcas personales y crear contenido de alto nivel.",
        footer_navigation: "Navegación",
        footer_home: "Inicio",
        footer_about: "Sobre mí",
        footer_goals: "Objetivos",
        footer_services: "Servicios",
        footer_partners: "Partners",
        footer_gallery: "Galería",
        footer_contact: "Contacto",
        footer_follow: "Sígueme",
        footer_contact_info: "Contacto",
        footer_copyright: "© 2026 Karol Performance. Todos los derechos reservados."

    },

    en: {
        juega: "Play now",

        nav_home: "Home",
        nav_about: "About me",
        nav_goals: "Goals",
        nav_services: "Services",
        nav_partners: "Partners",
        nav_gallery: "Gallery",
        nav_contact: "Contact",
        hero_subtitle: "TRAINER · CONTENT CREATOR · SPONSORED ATHLETE",
        hero_title: "Transform your physique and build your personal brand.",
        hero_text: "Personalized coaching, content creation, video editing, social media consulting, and complete guidance to help you grow both inside and outside the gym.",
        hero_btn1: "Get started",
        hero_btn2: "View my work",

        stats_clients: "Clients",
        stats_transformations: "Collaborations",
        stats_years: "Years of experience",
        stats_satisfaction: "Satisfaction",

        about_sub: "ABOUT ME",
        about_title: "Much more than a personal trainer.",
        about_text1: "I'm Karol, a personal trainer, fitness content creator, and sponsored athlete. My goal is to help you transform your physique while building a professional and authentic image both inside and outside the gym.",
        about_text2: "I work with people who want to learn how to train properly, improve performance, get guidance on supplements, create content for social media, and build a strong personal brand.",

        about_feature1: "Personalized training",
        about_feature2: "Weekly follow-up",
        about_feature3: "Supplement guidance",
        about_feature4: "Content creation and social media",
        about_btn: "Discover services",

        goals_sub: "GOALS",
        goals_title: "Everything I can help you achieve",
        goals_text: "I work in a personalized way to help you both in your physical progress and in your image and presence on social media.",

        goals_feature1: "Personalized training",
        goals_feature2: "Weekly follow-up",
        goals_feature3: "Supplement guidance",

        goals_titulo3: "Personalized training",
        goals_texto3: "Routines adapted to your level, goals, and availability to achieve real and sustainable results.",
        goals_titulo4: "Follow-up and guidance",
        goals_texto4: "I answer your questions, adjust your training, and accompany you throughout the process so you don't train alone.",
        goals_titulo5: "Supplement guidance",
        goals_texto5: "I guide you on the responsible use of sports supplements and how to integrate them into your planning.",
        goals_titulo6: "Video editing",
        goals_texto6: "Professional video editing for social media, brands, promotions, and high-impact fitness content.",
        goals_titulo7: "Social media and content",
        goals_texto7: "I help you create engaging content and improve your presence on Instagram, TikTok, and other platforms.",
        goals_titulo8: "Personal brand",
        goals_texto8: "Develop a professional image to collaborate with brands, attract clients, and grow as a content creator.",

        services_sub: "SERVICES",
        services_title: "Services designed to transform your physique and image",
        services_text: "Training, guidance, content creation, and collaborations to help you grow both physically and professionally.",

        services_titulo1: "Personal Training",
        services_texto1: "Fully personalized plans with continuous follow-up, tailored to your goals and level.",
        services_titulo2: "Video Editing",
        services_texto2: "Reels, TikToks, Shorts, and professional content for social media, brands, and personal projects.",
        services_titulo3: "Photo Sessions",
        services_texto3: "Professional fitness photography for social media, portfolios, campaigns, and brand collaborations.",
        services_titulo4: "Social Media",
        services_texto4: "Strategy, image, content, and growth to enhance your presence on Instagram and TikTok.",
        services_titulo5: "Supplement Guidance",
        services_texto5: "Personalized guidance to choose supplements responsibly according to your goals.",
        services_titulo6: "Online Follow-up",
        services_texto6: "Direct communication to resolve doubts, adjust training, and maintain constant progress.",
        services_titulo7: "Brand Collaborations",
        services_texto7: "Creation of promotional content, campaigns, and actions for companies in the fitness and wellness sector.",
        services_titulo8: "Personal Brand",
        services_texto8: "Build a professional image to attract clients, collaborate with brands, and grow as a content creator.",

        partners_title: "Brands I collaborate with",
        partners_text: "As a sponsored athlete, I work with well-known brands in the fitness and wellness sector to offer quality products and professional content.",
        partners_text1: "Sports supplementation, advanced nutrition, and products aimed at physical performance and health.",
        partners_text2: "Collaboration focused on wellness, health, and performance improvement through specialized products and content.",

        gallery_sub: "GALLERY",
        gallery_title: "My most recent work",
        gallery_text: "Discover my work and the transformation of my clients.",

        testimonials_sub: "TESTIMONIALS",
        testimonials_title: "What people say about working with me",
        testimonials_text: "Real results, close follow-up, and a way of working based on trust and consistency.",
        testimonial1: "I had never followed such a personalized plan. In a few months, I improved my physique and learned how to train correctly.",
        testimonial1_position: "Online Training",
        testimonial2: "She helped me with content for social media and video editing. The difference in my profile was huge.",
        testimonial2_position: "Content Creator",
        testimonial3: "Quick attention, constant follow-up, and very clear advice on training and supplementation.",
        testimonial3_position: "Personalized Consulting",

        cta_sub: "START TODAY",
        cta_title: "Your transformation starts with a single message",
        cta_text: "If you want to improve your physique, create professional content, or grow your personal brand, I would be happy to help you.",
        cta_button: "Contact me now",

        contact_sub: "CONTACT",
        contact_title: "Tell me about your goal",
        contact_text: "Fill out the form and I'll get back to you as soon as possible.",
        send: "Send request",

        contact_name: "Full name",
        contact_email: "Email",
        contact_phone: "Phone",

        contact_message: "Message",
        send: "Send request",

        footer_text: "Personal trainer, content creator, and sponsored athlete. Helping to transform physiques, enhance personal brands, and create high-level content.",
        footer_navigation: "Navigation",
        footer_home: "Home",
        footer_about: "About me",
        footer_goals: "Goals",
        footer_services: "Services",
        footer_partners: "Partners",
        footer_gallery: "Gallery",
        footer_contact: "Contact",
        footer_follow: "Follow me",
        footer_contact_info: "Contact",
        footer_copyright: "© 2026 Karol Performance. All rights reserved."

    }
};

function setLanguage(lang) {
    // Traducir textos normales
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Traducir placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    // Traducir opciones del select de servicios
    const servicio = document.querySelector('select[name="servicio"]');
    if (servicio) {
        if (lang === 'es') {
            servicio.innerHTML = `
                <option value="">Selecciona un servicio</option>
                <option>Entrenamiento personalizado</option>
                <option>Seguimiento online</option>
                <option>Asesoramiento en suplementación</option>
                <option>Edición de vídeo</option>
                <option>Redes sociales y contenido</option>
                <option>Marca personal</option>
                <option>Colaboración con marcas</option>
            `;
        } else {
            servicio.innerHTML = `
                <option value="">Select a service</option>
                <option>Personalized training</option>
                <option>Online follow-up</option>
                <option>Supplement guidance</option>
                <option>Video editing</option>
                <option>Social media and content</option>
                <option>Personal brand</option>
                <option>Brand collaboration</option>
            `;
        }
    }

    // Guardar idioma
    localStorage.setItem('language', lang);
}

// Selector de idioma
const languageSwitcher = document.getElementById("languageSwitcher");

if (languageSwitcher) {
    const savedLang = localStorage.getItem("language") || "es";
    languageSwitcher.value = savedLang;
    setLanguage(savedLang);

    languageSwitcher.addEventListener("change", (e) => {
        setLanguage(e.target.value);
    });
}