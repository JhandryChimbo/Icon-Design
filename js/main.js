/* JavaScript Logic for Icon Design Landing Page */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scroll Effect
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.replace('fa-times', 'fa-bars');
            });
        });
    }

    // 3. Scrollspy - Highlight active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    });

    // 4. Portfolio Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active to current button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    // Trigger reflow for fade in
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 5. Interactive Price Calculator
    const calcProduct = document.getElementById('calcProduct');
    const calcQuantity = document.getElementById('calcQuantity');
    const labelQuantity = document.getElementById('labelQuantity');
    const calcMaterial = document.getElementById('calcMaterial');
    const designService = document.getElementById('designService');
    const fastDelivery = document.getElementById('fastDelivery');
    
    // Summary elements
    const summaryProduct = document.getElementById('sumProduct');
    const summaryQty = document.getElementById('sumQty');
    const summaryMaterial = document.getElementById('sumMaterial');
    const summaryExtras = document.getElementById('sumExtras');
    const summaryTotal = document.getElementById('sumTotal');
    const btnSendQuote = document.getElementById('btnSendQuote');

    // Pricing Config
    const pricingConfig = {
        folletos: {
            name: 'Folletos / Flyers',
            unitName: 'millar(es)',
            materials: {
                brillante: { name: 'Papel Couché Brillante 150g', price: 45 },
                mate: { name: 'Papel Couché Mate 150g', price: 48 },
                premium: { name: 'Papel Couché Grueso 300g', price: 75 }
            },
            quantities: [1000, 2000, 5000, 10000],
            baseDesignPrice: 15
        },
        vinil: {
            name: 'Vinil Adhesivo',
            unitName: 'm² (Metro cuadrado)',
            materials: {
                brillante: { name: 'Vinil Blanco Brillante', price: 12 },
                mate: { name: 'Vinil Blanco Mate', price: 13 },
                premium: { name: 'Vinil Microperforado', price: 18 }
            },
            quantities: [1, 2, 5, 10, 20, 50],
            baseDesignPrice: 10
        },
        habladores: {
            name: 'Habladores Acrílicos',
            unitName: 'unidad(es)',
            materials: {
                brillante: { name: 'Acrílico Cristal 2mm', price: 3.5 },
                mate: { name: 'Acrílico Cristal 3mm', price: 4.5 },
                premium: { name: 'Acrílico Premium (Base Madera)', price: 7.0 }
            },
            quantities: [10, 25, 50, 100, 200],
            baseDesignPrice: 8
        },
        senaletica: {
            name: 'Señaléticas / Rótulos',
            unitName: 'unidad(es)',
            materials: {
                brillante: { name: 'PVC / Sintra 3mm con Vinil', price: 10 },
                mate: { name: 'PVC / Sintra 5mm con Vinil', price: 15 },
                premium: { name: 'Acrílico con Separadores Metálicos', price: 35 }
            },
            quantities: [1, 5, 10, 20, 50],
            baseDesignPrice: 12
        }
    };

    function updateCalculatorOptions() {
        const productKey = calcProduct.value;
        const config = pricingConfig[productKey];
        
        // Update quantity label
        labelQuantity.textContent = `Cantidad (${config.unitName}):`;
        
        // Populate quantity dropdown
        calcQuantity.innerHTML = '';
        config.quantities.forEach(qty => {
            const option = document.createElement('option');
            option.value = qty;
            option.textContent = qty.toLocaleString();
            calcQuantity.appendChild(option);
        });

        // Populate materials dropdown
        calcMaterial.innerHTML = '';
        for (const [key, value] of Object.entries(config.materials)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = `${value.name} ($${value.price.toFixed(2)} / ${productKey === 'folletos' ? 'millar' : productKey === 'vinil' ? 'm²' : 'unidad'})`;
            calcMaterial.appendChild(option);
        }

        calculatePrice();
    }

    function calculatePrice() {
        const productKey = calcProduct.value;
        const qty = parseInt(calcQuantity.value) || 1;
        const materialKey = calcMaterial.value;
        
        const config = pricingConfig[productKey];
        const material = config.materials[materialKey];
        
        if (!material) return;

        // Base price calculation
        let basePrice = 0;
        if (productKey === 'folletos') {
            // For flyers, price is per thousand
            const thousands = qty / 1000;
            // Apply volume discount
            let discountFactor = 1;
            if (qty === 2000) discountFactor = 0.9; // 10% off
            if (qty >= 5000) discountFactor = 0.8;  // 20% off
            basePrice = thousands * material.price * discountFactor;
        } else {
            // For other items, price is unit * material price
            let discountFactor = 1;
            if (qty >= 5 && qty < 10) discountFactor = 0.95;
            if (qty >= 10 && qty < 50) discountFactor = 0.9;
            if (qty >= 50) discountFactor = 0.85;
            basePrice = qty * material.price * discountFactor;
        }

        // Extras
        let extraPrice = 0;
        let extrasList = [];

        if (designService.checked) {
            extraPrice += config.baseDesignPrice;
            extrasList.push('Servicio de Diseño');
        }
        if (fastDelivery.checked) {
            extraPrice += basePrice * 0.15; // 15% extra for rush orders
            extrasList.push('Entrega Express (24-48h)');
        }

        const totalPrice = basePrice + extraPrice;

        // Update UI
        summaryProduct.textContent = config.name;
        summaryQty.textContent = `${qty.toLocaleString()} ${config.unitName}`;
        summaryMaterial.textContent = material.name;
        summaryExtras.textContent = extrasList.length > 0 ? extrasList.join(', ') : 'Ninguno';
        summaryTotal.textContent = `$${totalPrice.toFixed(2)}`;

        // Save calculated variables to send-button dataset
        btnSendQuote.dataset.product = config.name;
        btnSendQuote.dataset.qty = `${qty.toLocaleString()} ${config.unitName}`;
        btnSendQuote.dataset.material = material.name;
        btnSendQuote.dataset.extras = extrasList.length > 0 ? extrasList.join(', ') : 'Ninguno';
        btnSendQuote.dataset.total = `$${totalPrice.toFixed(2)}`;
    }

    if (calcProduct) {
        calcProduct.addEventListener('change', updateCalculatorOptions);
        calcQuantity.addEventListener('change', calculatePrice);
        calcMaterial.addEventListener('change', calculatePrice);
        designService.addEventListener('change', calculatePrice);
        fastDelivery.addEventListener('change', calculatePrice);
        
        // Initial setup
        updateCalculatorOptions();
    }

    // 6. WhatsApp API Redirection
    // Business number: We will use a standard format +593987654321 (Loja, Ecuador code)
    const WHATSAPP_NUMBER = '593986204544';

    if (btnSendQuote) {
        btnSendQuote.addEventListener('click', () => {
            const product = btnSendQuote.dataset.product;
            const qty = btnSendQuote.dataset.qty;
            const material = btnSendQuote.dataset.material;
            const extras = btnSendQuote.dataset.extras;
            const total = btnSendQuote.dataset.total;

            const text = `¡Hola Icon Design! Quisiera cotizar el siguiente producto desde su landing page:\n\n` +
                         `*Producto:* ${product}\n` +
                         `*Cantidad:* ${qty}\n` +
                         `*Material:* ${material}\n` +
                         `*Adicionales:* ${extras}\n` +
                         `*Valor Estimado:* ${total}\n\n` +
                         `¿Cuáles son los pasos a seguir para concretar el pedido? Muchas gracias.`;

            const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
        });
    }

    // Contact Form Submission (Format for Whatsapp or show modal)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const productType = document.getElementById('contactProductType').value;
            const message = document.getElementById('contactMessage').value;

            const text = `¡Hola Icon Design! Soy *${name}* (${email}). Les escribo desde su formulario de contacto:\n\n` +
                         `*Interesado en:* ${productType}\n` +
                         `*Mensaje:* ${message}`;

            const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
        });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(other => {
                    other.classList.remove('active');
                    const btn = other.querySelector('.faq-question');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });
});
