/* ============================================
   Dra. Jacqueline Miyuki Viel — Landing Page JS
   Mobile menu, scroll animations, active nav
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- ELEMENTS ----------
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const mobileOverlay = document.getElementById('mobileNavOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav__link');
    const navLinks = document.querySelectorAll('.header__nav-link');
    const sections = document.querySelectorAll('section[id]');
    const animatedElements = document.querySelectorAll('[data-animate]');

    // ---------- MOBILE MENU ----------
    function openMobileMenu() {
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        mobileNav.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.contains('open');
        isOpen ? closeMobileMenu() : openMobileMenu();
    });

    mobileOverlay.addEventListener('click', closeMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    // ---------- HEADER SCROLL EFFECT ----------
    let lastScroll = 0;

    function handleHeaderScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = scrollY;
    }

    // ---------- ACTIVE NAV LINK ON SCROLL ----------
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Desktop nav
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });

                // Mobile nav
                mobileLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ---------- SCROLL ANIMATIONS (Intersection Observer) ----------
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // ---------- SMOOTH SCROLL for anchor links ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---------- SCROLL EVENT (throttled) ----------
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleHeaderScroll();
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // ---------- INITIAL STATE ----------
    handleHeaderScroll();
    updateActiveNav();

    // Make hero visible immediately (no scroll needed)
    document.querySelectorAll('.hero [data-animate]').forEach(el => {
        setTimeout(() => {
            el.classList.add('is-visible');
        }, 300);
    });

    // Also the hero content and image (top-level data-animate)
    const heroContent = document.querySelector('.hero__content');
    const heroImage = document.querySelector('.hero__image');
    if (heroContent && heroContent.dataset.animate) {
        setTimeout(() => heroContent.classList.add('is-visible'), 200);
    }
    if (heroImage && heroImage.dataset.animate) {
        setTimeout(() => heroImage.classList.add('is-visible'), 500);
    }
});
