document.addEventListener("DOMContentLoaded", () => {

    // Variable global para que el sistema multilenguaje pueda reiniciar la escritura
    let resetTypingEffect = () => {};

    // ==========================================================================
    // 1. EFECTO DE ESCRITURA AUTOMÁTICA EN BUCLE INFINITO (Sincronizado)
    // ==========================================================================
    const typingElement = document.querySelector('.typing-effect');
    
    if (typingElement) {
        let charIndex = 0;
        let isDeleting = false;
        let timeoutId = null; // Guardamos el temporizador para poder cancelarlo

        function typeLoop() {
            // Lee el idioma actual dinámicamente desde el atributo data-text o data-es
            const currentText = typingElement.getAttribute('data-text') || typingElement.getAttribute('data-es') || "Jurídica";
            
            if (!isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === currentText.length) {
                    isDeleting = true;
                    timeoutId = setTimeout(typeLoop, 2000);
                    return;
                }
                timeoutId = setTimeout(typeLoop, 150);
            } else {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    isDeleting = false;
                    timeoutId = setTimeout(typeLoop, 500);
                    return;
                }
                timeoutId = setTimeout(typeLoop, 75);
            }
        }

        // Función externa que llamará el botón de idioma para reiniciar el bucle limpio
        resetTypingEffect = () => {
            clearTimeout(timeoutId); // Frenamos la escritura del idioma anterior
            charIndex = 0;
            isDeleting = false;
            typingElement.textContent = "";
            typeLoop(); // Arrancamos con la nueva palabra
        };

        // Inicio inicial
        setTimeout(typeLoop, 400);
    }

    // ==========================================================================
    // 2. CAROUSEL AUTOMÁTICO DE TESTIMONIOS
    // ==========================================================================
    const slides = document.querySelectorAll(".carousel-slides .slide");
    const dots = document.querySelectorAll(".carousel-indicators .dot");
    let currentSlideIndex = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove("active"));
        dots.forEach(dot => dot.classList.remove("active"));
        
        if(slides[index]) slides[index].classList.add("active");
        if(dots[index]) dots[index].classList.add("active");
    }

    function nextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(currentSlideIndex);
    }

    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 7000);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            clearInterval(slideInterval);
            currentSlideIndex = index;
            showSlide(currentSlideIndex);
            startSlideShow();
        });
    });

    if(slides.length > 0) {
        startSlideShow();
    }

    // ==========================================================================
    // 3. GESTIÓN MULTILENGUAJE DINÁMICO (ES || EN) - ¡REPARADO PARA EL CURSOR!
    // ==========================================================================
    const langToggle = document.getElementById("langToggle");
    let activeLanguage = "ES";

    if (langToggle) {
        langToggle.addEventListener("click", () => {
            activeLanguage = activeLanguage === "ES" ? "EN" : "ES";
            langToggle.innerText = activeLanguage === "ES" ? "EN" : "ES";

            document.querySelectorAll("[data-es]").forEach(element => {
                const translation = element.getAttribute(`data-${activeLanguage.toLowerCase()}`);
                
                if (element.classList.contains('typing-effect')) {
                    // En lugar de romper el texto, actualizamos el atributo que lee el typeLoop
                    element.setAttribute('data-text', translation);
                    // Reiniciamos el efecto de máquina de escribir con la nueva palabra
                    resetTypingEffect();
                } else {
                    // Para el resto de textos normales de la web
                    element.innerText = translation;
                }
            });
        });
    }

    // ==========================================================================
    // 4. MENÚ FLOTANTE MÓVIL ASIMÉTRICO
    // ==========================================================================
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    
    if (menuBtn && mobileMenu) {
        const menuIcon = menuBtn.querySelector("i");

        menuBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            mobileMenu.classList.toggle("active");

            if (mobileMenu.classList.contains("active")) {
                menuIcon.className = "fas fa-times animate__animated animate__rotateIn";
            } else {
                menuIcon.className = "fas fa-bars-staggered animate__animated animate__fadeIn";
            }
        });

        document.addEventListener("click", (event) => {
            if (!mobileMenu.contains(event.target) && !menuBtn.contains(event.target)) {
                mobileMenu.classList.remove("active");
                menuIcon.className = "fas fa-bars-staggered";
            }
        });

        mobileMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("active");
                menuIcon.className = "fas fa-bars-staggered";
            });
        });
    }

    // ==========================================================================
    // 5. BOTÓN SCROLL TOP & SCROLL SPY
    // ==========================================================================
    const scrollTopBtn = document.getElementById("scrollTop");

    window.addEventListener("scroll", () => {
        if (scrollTopBtn) {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add("show");
            } else {
                scrollTopBtn.classList.remove("show");
            }
        }
        navigationSpy();
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // ==========================================================================
    // 6. SCROLLYTELLING (Intersection Observer)
    // ==========================================================================
    const allSections = document.querySelectorAll(".target-section");
    
    const observerOptions = {
        root: null,
        threshold: 0.08,
        rootMargin: "0px"
    };

    const scrollytellingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");

                if (entry.target.id === "values") {
                    entry.target.querySelectorAll(".value-card").forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add("animate__animated", "animate__fadeInUp");
                        }, index * 60);
                    });
                }
            }
        });
    }, observerOptions);

    allSections.forEach(section => {
        scrollytellingObserver.observe(section);
    });

    const desktopMenuItems = document.querySelectorAll(".desktop-menu .nav-item");

    function navigationSpy() {
        let currentActiveSectionId = "";
        
        allSections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 280)) {
                currentActiveSectionId = section.getAttribute("id");
            }
        });

        desktopMenuItems.forEach(item => {
            item.classList.remove("active");
            if (item.getAttribute("href") === `#${currentActiveSectionId}`) {
                item.classList.add("active");
            }
        });
    }
});
