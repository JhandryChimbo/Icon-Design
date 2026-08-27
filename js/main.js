/**
 * Icon Design — main.js
 * Robust, scalable JavaScript for the landing page.
 * Architecture: Module pattern with named IIFE sections.
 */

'use strict';

/* ============================================================
   CONFIG / CONSTANTS
   ============================================================ */
const CONFIG = {
    WHATSAPP_NUMBER: '593986204544',
    SCROLL_OFFSET: 80,
    HEADER_SCROLL_THRESHOLD: 50,
    COUNTER_DURATION: 2000,
    TOAST_DURATION: 4000,
};

/* ============================================================
   UTILITY HELPERS
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const debounce = (fn, delay = 100) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
};
const throttle = (fn, limit = 100) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) { fn(...args); inThrottle = true; setTimeout(() => inThrottle = false, limit); }
    };
};

/* ============================================================
   DOM READY BOOTSTRAP
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initScrollSpy();
    initScrollProgress();
    initBackToTop();
    initGalleryFilter();
    initLightbox();
    initCalculator();
    initContactForm();
    initFAQ();
    initAnimatedCounters();
    initScrollAnimations();
    initToastSystem();
    initNewsletterForm();
    initKeyboardNav();
    initWhatsAppFloat();
});

/* ============================================================
   1. HEADER – scroll shrink & glassmorphism
   ============================================================ */
function initHeader() {
    const header = $('#header');
    if (!header) return;

    const onScroll = throttle(() => {
        header.classList.toggle('scrolled', window.scrollY > CONFIG.HEADER_SCROLL_THRESHOLD);
    }, 50);

    window.addEventListener('scroll', onScroll, { passive: true });
}

/* ============================================================
   2. MOBILE MENU
   ============================================================ */
function initMobileMenu() {
    const toggle = $('#menuToggle');
    const menu   = $('#navMenu');
    const links  = $$('.nav-link');
    if (!toggle || !menu) return;

    const openMenu  = () => { menu.classList.add('active'); toggle.setAttribute('aria-expanded', 'true'); toggle.querySelector('i')?.classList.replace('fa-bars', 'fa-times'); };
    const closeMenu = () => { menu.classList.remove('active'); toggle.setAttribute('aria-expanded', 'false'); toggle.querySelector('i')?.classList.replace('fa-times', 'fa-bars'); };

    toggle.addEventListener('click', () => menu.classList.contains('active') ? closeMenu() : openMenu());
    links.forEach(l => l.addEventListener('click', closeMenu));

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (menu.classList.contains('active') && !menu.contains(e.target) && !toggle.contains(e.target)) closeMenu();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
}

/* ============================================================
   3. SCROLLSPY – highlight active nav link
   ============================================================ */
function initScrollSpy() {
    const sections = $$('section[id]');
    const navLinks = $$('.nav-link');
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(l => {
                    l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: `-${CONFIG.SCROLL_OFFSET}px 0px -60% 0px` });

    sections.forEach(s => observer.observe(s));
}

/* ============================================================
   4. SCROLL PROGRESS BAR
   ============================================================ */
function initScrollProgress() {
    const bar = document.createElement('div');
    bar.id = 'scrollProgressBar';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-label', 'Progreso de lectura');
    document.body.appendChild(bar);

    const update = throttle(() => {
        const docH   = document.documentElement.scrollHeight - window.innerHeight;
        const pct    = docH > 0 ? (window.scrollY / docH) * 100 : 0;
        bar.style.width = `${pct}%`;
    }, 16);

    window.addEventListener('scroll', update, { passive: true });
}

/* ============================================================
   5. BACK TO TOP BUTTON
   ============================================================ */
function initBackToTop() {
    const btn = document.createElement('button');
    btn.id = 'backToTopBtn';
    btn.setAttribute('aria-label', 'Volver al inicio');
    btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(btn);

    const onScroll = throttle(() => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, 100);

    window.addEventListener('scroll', onScroll, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ============================================================
   6. GALLERY FILTER WITH SMOOTH ANIMATION
   ============================================================ */
function initGalleryFilter() {
    const filterBtns = $$('.filter-btn');
    const items      = $$('.gallery-item');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            items.forEach(item => {
                const match = filter === 'all' || item.dataset.category === filter;
                if (match) {
                    item.style.display = 'block';
                    requestAnimationFrame(() => {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        requestAnimationFrame(() => {
                            item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        });
                    });
                } else {
                    item.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.85)';
                    setTimeout(() => { item.style.display = 'none'; }, 260);
                }
            });
        });
    });
}

/* ============================================================
   7. IMAGE LIGHTBOX
   ============================================================ */
function initLightbox() {
    const items = $$('.gallery-item');
    if (!items.length) return;

    // Build lightbox DOM
    const overlay = document.createElement('div');
    overlay.id = 'lightboxOverlay';
    overlay.innerHTML = `
        <button id="lightboxClose" aria-label="Cerrar"><i class="fas fa-times"></i></button>
        <button id="lightboxPrev" aria-label="Anterior"><i class="fas fa-chevron-left"></i></button>
        <div id="lightboxContent">
            <img id="lightboxImg" src="" alt="">
            <p id="lightboxCaption"></p>
        </div>
        <button id="lightboxNext" aria-label="Siguiente"><i class="fas fa-chevron-right"></i></button>
    `;
    document.body.appendChild(overlay);

    let currentIndex = 0;
    const imgs = items.map(item => ({
        src: item.querySelector('img')?.src || '',
        alt: item.querySelector('img')?.alt || '',
        caption: item.querySelector('.gallery-info h4')?.textContent || ''
    }));

    const lbImg     = $('#lightboxImg');
    const lbCaption = $('#lightboxCaption');

    const show = (i) => {
        currentIndex = (i + imgs.length) % imgs.length;
        lbImg.src = imgs[currentIndex].src;
        lbImg.alt = imgs[currentIndex].alt;
        lbCaption.textContent = imgs[currentIndex].caption;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const close = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    items.forEach((item, i) => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => show(i));
    });

    $('#lightboxClose')?.addEventListener('click', close);
    $('#lightboxPrev')?.addEventListener('click', () => show(currentIndex - 1));
    $('#lightboxNext')?.addEventListener('click', () => show(currentIndex + 1));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'ArrowRight') show(currentIndex + 1);
        if (e.key === 'ArrowLeft')  show(currentIndex - 1);
        if (e.key === 'Escape')     close();
    });
}

/* ============================================================
   8. PRICE CALCULATOR
   ============================================================ */
function initCalculator() {
    const calcProduct  = $('#calcProduct');
    const calcQuantity = $('#calcQuantity');
    const labelQty     = $('#labelQuantity');
    const calcMaterial = $('#calcMaterial');
    const designSvc    = $('#designService');
    const fastDel      = $('#fastDelivery');
    const sumProduct   = $('#sumProduct');
    const sumQty       = $('#sumQty');
    const sumMaterial  = $('#sumMaterial');
    const sumExtras    = $('#sumExtras');
    const sumTotal     = $('#sumTotal');
    const btnSend      = $('#btnSendQuote');

    if (!calcProduct) return;

    const pricingConfig = {
        folletos: {
            name: 'Folletos / Flyers',
            unitName: 'millar(es)',
            materials: {
                brillante: { name: 'Papel Couché Brillante 150g', price: 45 },
                mate:      { name: 'Papel Couché Mate 150g',      price: 48 },
                premium:   { name: 'Papel Couché Grueso 300g',    price: 75 }
            },
            quantities: [1000, 2000, 5000, 10000],
            baseDesignPrice: 15
        },
        vinil: {
            name: 'Vinil Adhesivo',
            unitName: 'm² (Metro cuadrado)',
            materials: {
                brillante: { name: 'Vinil Blanco Brillante',  price: 12 },
                mate:      { name: 'Vinil Blanco Mate',       price: 13 },
                premium:   { name: 'Vinil Microperforado',    price: 18 }
            },
            quantities: [1, 2, 5, 10, 20, 50],
            baseDesignPrice: 10
        },
        habladores: {
            name: 'Habladores Acrílicos',
            unitName: 'unidad(es)',
            materials: {
                brillante: { name: 'Acrílico Cristal 2mm',         price: 3.5 },
                mate:      { name: 'Acrílico Cristal 3mm',         price: 4.5 },
                premium:   { name: 'Acrílico Premium (Base Madera)', price: 7.0 }
            },
            quantities: [10, 25, 50, 100, 200],
            baseDesignPrice: 8
        },
        senaletica: {
            name: 'Señaléticas / Rótulos',
            unitName: 'unidad(es)',
            materials: {
                brillante: { name: 'PVC / Sintra 3mm con Vinil',        price: 10 },
                mate:      { name: 'PVC / Sintra 5mm con Vinil',        price: 15 },
                premium:   { name: 'Acrílico con Separadores Metálicos', price: 35 }
            },
            quantities: [1, 5, 10, 20, 50],
            baseDesignPrice: 12
        }
    };

    function getUnitLabel(key) {
        const map = { folletos: 'millar', vinil: 'm²', habladores: 'unidad', senaletica: 'unidad' };
        return map[key] || 'unidad';
    }

    function updateOptions() {
        const key    = calcProduct.value;
        const config = pricingConfig[key];
        if (!config) return;

        labelQty.textContent = `Cantidad (${config.unitName}):`;

        calcQuantity.innerHTML = config.quantities.map(q =>
            `<option value="${q}">${q.toLocaleString()}</option>`
        ).join('');

        calcMaterial.innerHTML = Object.entries(config.materials).map(([k, v]) =>
            `<option value="${k}">${v.name} ($${v.price.toFixed(2)} / ${getUnitLabel(key)})</option>`
        ).join('');

        calculatePrice();
    }

    function calculatePrice() {
        const key      = calcProduct.value;
        const qty      = parseInt(calcQuantity.value) || 1;
        const matKey   = calcMaterial.value;
        const config   = pricingConfig[key];
        const material = config?.materials[matKey];
        if (!material) return;

        let basePrice = 0;
        if (key === 'folletos') {
            const thousands = qty / 1000;
            const discount  = qty >= 5000 ? 0.8 : qty >= 2000 ? 0.9 : 1;
            basePrice = thousands * material.price * discount;
        } else {
            const discount = qty >= 50 ? 0.85 : qty >= 10 ? 0.9 : qty >= 5 ? 0.95 : 1;
            basePrice = qty * material.price * discount;
        }

        const extras = [];
        let extraPrice = 0;
        if (designSvc.checked)  { extraPrice += config.baseDesignPrice; extras.push('Servicio de Diseño'); }
        if (fastDel.checked)    { extraPrice += basePrice * 0.15;       extras.push('Entrega Express (24-48h)'); }

        const total = basePrice + extraPrice;

        // Animate total number
        animateValue(sumTotal, parseFloat(sumTotal.dataset.prev || 0), total);
        sumTotal.dataset.prev = total;

        sumProduct.textContent  = config.name;
        sumQty.textContent      = `${qty.toLocaleString()} ${config.unitName}`;
        sumMaterial.textContent = material.name;
        sumExtras.textContent   = extras.length ? extras.join(', ') : 'Ninguno';

        // Persist data for WhatsApp send
        if (btnSend) {
            btnSend.dataset.product  = config.name;
            btnSend.dataset.qty      = `${qty.toLocaleString()} ${config.unitName}`;
            btnSend.dataset.material = material.name;
            btnSend.dataset.extras   = extras.length ? extras.join(', ') : 'Ninguno';
            btnSend.dataset.total    = `$${total.toFixed(2)}`;
        }
    }

    function animateValue(el, from, to) {
        const startTime = performance.now();
        const duration  = 400;
        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = `$${(from + (to - from) * ease).toFixed(2)}`;
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    calcProduct.addEventListener('change', updateOptions);
    calcQuantity.addEventListener('change', calculatePrice);
    calcMaterial.addEventListener('change', calculatePrice);
    designSvc.addEventListener('change', calculatePrice);
    fastDel.addEventListener('change', calculatePrice);

    // WhatsApp CTA
    btnSend?.addEventListener('click', () => {
        const { product, qty, material, extras, total } = btnSend.dataset;
        const text = [
            '¡Hola Icon Design! Quisiera cotizar el siguiente producto desde su página web:\n',
            `*Producto:* ${product}`,
            `*Cantidad:* ${qty}`,
            `*Material:* ${material}`,
            `*Adicionales:* ${extras}`,
            `*Valor Estimado:* ${total}\n`,
            '¿Cuáles son los pasos para concretar el pedido? Muchas gracias.'
        ].join('\n');
        window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    });

    updateOptions(); // init
}

/* ============================================================
   9. CONTACT FORM – validation + WhatsApp redirect
   ============================================================ */
function initContactForm() {
    const form = $('#contactForm');
    if (!form) return;

    // Real-time validation
    const inputs = $$('input, textarea, select', form);
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) validateField(input);
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        inputs.forEach(inp => { if (!validateField(inp)) valid = false; });
        if (!valid) return;

        const name        = $('#contactName').value.trim();
        const email       = $('#contactEmail').value.trim();
        const productType = $('#contactProductType').value;
        const message     = $('#contactMessage').value.trim();

        const text = [
            `¡Hola Icon Design! Soy *${name}* (${email}).`,
            'Les escribo desde su formulario de contacto:\n',
            `*Interesado en:* ${productType}`,
            `*Mensaje:* ${message}`
        ].join('\n');

        window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
        showToast('¡Mensaje enviado! Te redirigimos a WhatsApp.', 'success');
        form.reset();
        inputs.forEach(inp => inp.classList.remove('valid', 'invalid'));
    });
}

function validateField(input) {
    if (!input.required && !input.value) { clearFieldState(input); return true; }
    let valid = true;
    if (input.type === 'email')  valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
    else if (input.required)     valid = input.value.trim().length >= 2;
    input.classList.toggle('valid',   valid);
    input.classList.toggle('invalid', !valid);
    let errEl = input.parentElement.querySelector('.field-error');
    if (!valid) {
        if (!errEl) { errEl = document.createElement('span'); errEl.className = 'field-error'; input.parentElement.appendChild(errEl); }
        errEl.textContent = input.type === 'email' ? 'Ingresa un correo válido.' : 'Este campo es requerido (mín. 2 caracteres).';
    } else {
        errEl?.remove();
    }
    return valid;
}

function clearFieldState(input) {
    input.classList.remove('valid', 'invalid');
    input.parentElement.querySelector('.field-error')?.remove();
}

/* ============================================================
   10. FAQ ACCORDION
   ============================================================ */
function initFAQ() {
    const faqItems = $$('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            faqItems.forEach(f => { f.classList.remove('active'); f.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false'); });
            if (!isOpen) { item.classList.add('active'); btn.setAttribute('aria-expanded', 'true'); }
        });
    });
}

/* ============================================================
   11. ANIMATED COUNTERS (Intersection Observer trigger)
   ============================================================ */
function initAnimatedCounters() {
    const counters = [
        { el: $('#statProjects'),    target: 500,  suffix: '+' },
        { el: $('#statProductsQty'), target: 15,   suffix: '+' },
        { el: $('#statQuality'),     target: 100,  suffix: '%' },
    ].filter(c => c.el);

    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const { el, target, suffix } = counters.find(c => c.el === entry.target);
            animateCounter(el, target, suffix);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.6 });

    counters.forEach(c => observer.observe(c.el));
}

function animateCounter(el, target, suffix) {
    const start    = 0;
    const startTime = performance.now();
    const step = (now) => {
        const progress = Math.min((now - startTime) / CONFIG.COUNTER_DURATION, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        el.textContent = `${Math.round(start + (target - start) * ease)}${suffix}`;
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

/* ============================================================
   12. SCROLL REVEAL ANIMATIONS (Intersection Observer)
   ============================================================ */
function initScrollAnimations() {
    const animatedEls = $$('.service-card, .feature-box, .other-card, .testimonial-card, .gallery-item, .faq-item, .contact-item, .footer-grid > div');
    animatedEls.forEach((el, i) => {
        el.style.opacity    = '0';
        el.style.transform  = 'translateY(32px)';
        el.style.transition = `opacity 0.55s ease ${(i % 4) * 0.08}s, transform 0.55s ease ${(i % 4) * 0.08}s`;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animatedEls.forEach(el => observer.observe(el));
}

/* ============================================================
   13. TOAST NOTIFICATION SYSTEM
   ============================================================ */
function initToastSystem() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    document.body.appendChild(container);
    window._showToast = showToast; // expose globally
}

function showToast(message, type = 'info') {
    const container = $('#toastContainer');
    if (!container) return;

    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span><button class="toast-close" aria-label="Cerrar"><i class="fas fa-times"></i></button>`;
    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => toast.classList.add('visible'));

    const remove = () => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 400);
    };

    toast.querySelector('.toast-close')?.addEventListener('click', remove);
    setTimeout(remove, CONFIG.TOAST_DURATION);
}

/* ============================================================
   14. NEWSLETTER FORM
   ============================================================ */
function initNewsletterForm() {
    const form = $('#newsletterForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        if (!emailInput?.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
            showToast('Por favor ingresa un correo electrónico válido.', 'error');
            return;
        }
        showToast('¡Gracias por suscribirte! Pronto recibirás nuestras promociones.', 'success');
        form.reset();
    });
}

/* ============================================================
   15. KEYBOARD NAVIGATION IMPROVEMENTS
   ============================================================ */
function initKeyboardNav() {
    // Show focus ring only on keyboard nav
    document.body.addEventListener('mousedown', () => document.body.classList.add('using-mouse'));
    document.body.addEventListener('keydown',   (e) => { if (e.key === 'Tab') document.body.classList.remove('using-mouse'); });
}

/* ============================================================
   16. FLOATING WHATSAPP – pulsing tooltip
   ============================================================ */
function initWhatsAppFloat() {
    const floatBtn = $('.whatsapp-float');
    if (!floatBtn) return;

    // Add tooltip
    const tip = document.createElement('span');
    tip.className = 'wa-tooltip';
    tip.textContent = '¡Escríbenos!';
    floatBtn.appendChild(tip);

    // Show tooltip after 3s automatically, hide after 5s
    setTimeout(() => { tip.classList.add('show'); setTimeout(() => tip.classList.remove('show'), 4000); }, 3000);
}
