/**
 * Apex GTM Website - JavaScript
 * Handles navigation, animations, and interactive elements
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initSmoothScroll();
    initMobileMenu();
    initCounterAnimations();
    initTabNotification();
    initExitIntentPopup();
    initCopyrightYear();
});

/**
 * Set copyright year dynamically
 */
function initCopyrightYear() {
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/**
 * Navigation - Sticky header with scroll effect
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class when page is scrolled
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', () => {
        const isActive = mobileMenu.classList.toggle('active');
        menuBtn.classList.toggle('active');
        menuBtn.setAttribute('aria-expanded', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            menuBtn.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Intersection Observer for scroll animations
 */
function initScrollAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        // Show all elements immediately
        document.querySelectorAll('.pain-card, .service-card, .metric-card, .testimonial-card, .tool-logo, .process-step').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.pain-card, .service-card, .metric-card, .testimonial-card, .tool-logo, .process-step');

    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });

    // Section header animations
    const sectionHeaders = document.querySelectorAll('.section-header');
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                headerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    sectionHeaders.forEach(header => {
        headerObserver.observe(header);
    });
}

/**
 * Counter animation for metrics
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.metric-number');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!prefersReducedMotion && !entry.target.hasAttribute('data-no-animate')) {
                    animateCounter(entry.target);
                }
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

/**
 * Animate a single counter element
 */
function animateCounter(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const hasColon = text.includes(':');

    // Handle ratio format (e.g., "1:72")
    if (hasColon) {
        const parts = text.split(':');
        const targetNum = parseInt(parts[1]);
        let current = Math.max(1, targetNum - 50);

        const interval = setInterval(() => {
            current += 1;
            element.innerHTML = `${parts[0]}:${current}`;

            if (current >= targetNum) {
                clearInterval(interval);
                element.innerHTML = text;
            }
        }, 30);
        return;
    }

    // Extract numeric value
    const numericValue = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (isNaN(numericValue)) return;

    const suffix = hasPlus ? '<span>+</span>' : (hasPercent ? '<span>%</span>' : '');
    const prefix = text.match(/^\$/) ? '$' : '';
    const hasMillion = text.includes('M');

    let current = 0;
    const increment = numericValue / 50;
    const duration = 1500;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;

        if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
        }

        let displayValue;
        if (hasMillion) {
            displayValue = current.toFixed(1) + 'M';
        } else if (numericValue >= 1000) {
            displayValue = Math.floor(current).toLocaleString();
        } else if (Number.isInteger(numericValue)) {
            displayValue = Math.floor(current);
        } else {
            displayValue = current.toFixed(1);
        }

        element.innerHTML = prefix + displayValue + suffix;
    }, stepTime);
}

/**
 * Add parallax effect to hero section (subtle)
 */
function initParallax() {
    const hero = document.querySelector('.hero');
    const heroBg = document.querySelector('.hero-bg');

    if (!hero || !heroBg) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;

        if (scrolled < heroHeight) {
            heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }, { passive: true });
}

/**
 * Initialize testimonial carousel (if needed)
 */
function initTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial-card');

    // Add hover pause for any auto-rotating features
    testimonials.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/**
 * Form validation (if contact form is added)
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic validation
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });

            if (isValid) {
                // Submit form or show success message
                console.log('Form submitted successfully');
            }
        });
    });
}

/**
 * Lazy load images (for performance)
 */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

/**
 * Add keyboard navigation support
 */
function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        // Escape key closes mobile menu
        if (e.key === 'Escape') {
            const mobileMenu = document.querySelector('.mobile-menu');
            const menuBtn = document.querySelector('.mobile-menu-btn');

            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                menuBtn.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }
    });
}

// Initialize keyboard navigation
initKeyboardNav();

/**
 * Add resize handler for responsive adjustments
 */
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Close mobile menu on desktop resize
        if (window.innerWidth > 768) {
            const mobileMenu = document.querySelector('.mobile-menu');
            const menuBtn = document.querySelector('.mobile-menu-btn');

            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                if (menuBtn) {
                    menuBtn.classList.remove('active');
                    menuBtn.setAttribute('aria-expanded', 'false');
                }
                document.body.style.overflow = '';
            }
        }
    }, 250);
});

/**
 * Performance optimization - Debounce scroll events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Track CTA clicks (analytics placeholder)
 */
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function() {
        const buttonText = this.textContent.trim();
        console.log('CTA clicked:', buttonText);
        // Add analytics tracking here
    });
});

/**
 * Exit Intent Popup - Shows when user tries to leave the page
 */
function initExitIntentPopup() {
    const popup = document.getElementById('exitPopup');
    const closeBtn = document.getElementById('exitPopupClose');

    if (!popup || !closeBtn) return;

    let hasShown = false;
    const POPUP_STORAGE_KEY = 'exitPopupShown';
    const POPUP_EXPIRY_HOURS = 24;

    // Check if popup was recently shown
    function wasRecentlyShown() {
        const lastShown = localStorage.getItem(POPUP_STORAGE_KEY);
        if (!lastShown) return false;

        const hoursSinceShown = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60);
        return hoursSinceShown < POPUP_EXPIRY_HOURS;
    }

    // Show the popup
    function showPopup() {
        if (hasShown || wasRecentlyShown()) return;

        hasShown = true;
        localStorage.setItem(POPUP_STORAGE_KEY, Date.now().toString());
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Hide the popup
    function hidePopup() {
        popup.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Exit intent detection (mouse leaves viewport at top)
    document.addEventListener('mouseout', (e) => {
        if (e.clientY <= 0 && !hasShown && !wasRecentlyShown()) {
            showPopup();
        }
    });

    // Close button click
    closeBtn.addEventListener('click', hidePopup);

    // Click outside popup to close
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            hidePopup();
        }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            hidePopup();
        }
    });

    // Mobile: Show popup when user scrolls up quickly (indicating they might leave)
    let lastScrollY = window.scrollY;
    let scrollUpCount = 0;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY < lastScrollY && currentScrollY < 100) {
            scrollUpCount++;
            if (scrollUpCount > 3 && !hasShown && !wasRecentlyShown()) {
                showPopup();
            }
        } else {
            scrollUpCount = 0;
        }

        lastScrollY = currentScrollY;
    }, { passive: true });
}

/**
 * Tab Notification - Shows message when user leaves the tab
 */
function initTabNotification() {
    const originalTitle = document.title;
    const notificationTitle = '(1) New Message | Clay Stan';
    let isTabActive = true;
    let blinkInterval = null;

    // Create and set up favicon with notification dot
    const originalFavicon = document.querySelector("link[rel*='icon']") || createFavicon();
    const notificationFavicon = createNotificationFavicon();

    function createFavicon() {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/svg+xml';
        link.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="%234f46e5"/><rect x="9" y="9" width="14" height="14" rx="2" fill="white"/></svg>';
        document.head.appendChild(link);
        return link;
    }

    function createNotificationFavicon() {
        // Create a favicon with a red notification dot
        return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="%234f46e5"/><rect x="9" y="9" width="14" height="14" rx="2" fill="white"/><circle cx="26" cy="6" r="6" fill="%23ef4444"/></svg>';
    }

    function showNotification() {
        if (isTabActive) return;

        let showingNotification = true;

        // Blink the title
        blinkInterval = setInterval(() => {
            if (showingNotification) {
                document.title = notificationTitle;
                if (originalFavicon) {
                    originalFavicon.href = notificationFavicon;
                }
            } else {
                document.title = originalTitle;
            }
            showingNotification = !showingNotification;
        }, 1000);
    }

    function hideNotification() {
        if (blinkInterval) {
            clearInterval(blinkInterval);
            blinkInterval = null;
        }
        document.title = originalTitle;
        if (originalFavicon) {
            originalFavicon.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="%234f46e5"/><rect x="9" y="9" width="14" height="14" rx="2" fill="white"/></svg>';
        }
    }

    // Listen for visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isTabActive = false;
            // Start notification after a short delay
            setTimeout(showNotification, 3000);
        } else {
            isTabActive = true;
            hideNotification();
        }
    });

    // Also handle window blur/focus for better browser support
    window.addEventListener('blur', () => {
        isTabActive = false;
        setTimeout(showNotification, 3000);
    });

    window.addEventListener('focus', () => {
        isTabActive = true;
        hideNotification();
    });
}
