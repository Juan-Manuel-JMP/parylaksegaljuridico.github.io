document.addEventListener("DOMContentLoaded", () => {

    // ==========================================================================
    // 1. REQUISITO 3: EFECTO DE ESCRITURA AUTOMÁTICA (Typing Effect)
    // ==========================================================================
    const typingElement = document.querySelector('.typing-effect');
    if (typingElement) {
        const textToType = typingElement.getAttribute('data-text');
        let charIndex = 0;

        function type() {
            if (charIndex < textToType.length) {
                typingElement.textContent += textToType.charAt(charIndex);
                charIndex++;
                setTimeout(type, 150); // Velocidad al escribir cada letra
            }
        }
        // Iniciar después de un breve delay estético
        setTimeout(type, 600);
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
        slideInterval = setInterval(nextSlide, 5000);
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
    // 3. GESTIÓN MULTILENGUAJE DINÁMICO (ES || EN)
    // ==========================================================================
    const langToggle = document.getElementById("langToggle");
    let activeLanguage = "ES";

    langToggle.addEventListener("click", () => {
        activeLanguage = activeLanguage === "ES" ? "EN" : "ES";
        langToggle.innerText = activeLanguage === "ES" ? "EN" : "ES";

        document.querySelectorAll("[data-es]").forEach(element => {
            element.innerText = element.getAttribute(`data-${activeLanguage.toLowerCase()}`);
        });
    });

    // ==========================================================================
    // 4. MENÚ FLOTANTE MÓVIL ASIMÉTRICO
    // ==========================================================================
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
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

    // ==========================================================================
    // 5. BOTÓN SCROLL TOP & SCROLL SPY
    // ==========================================================================
    const scrollTopBtn = document.getElementById("scrollTop");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add("show");
        } else {
            scrollTopBtn.classList.remove("show");
        }
        navigationSpy();
    });

    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

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

                // Quitamos las animaciones de Animate.css de los círculos 
                // para que no interfieran con el vaivén infinito del CSS.
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