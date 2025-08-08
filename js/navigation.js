// Enhanced Navigation Controller
class NavigationController {
    constructor() {
        this.mobileMenuButton = document.getElementById('mobile-menu-button');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.backToTopBtn = document.getElementById('backToTopBtn');
        this.header = document.querySelector('header');
        
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupBackToTop();
        this.setupSmoothScrolling();
        this.setupHeaderScrollEffect();
        this.setupActiveNavigation();
    }

    setupMobileMenu() {
        if (this.mobileMenuButton && this.mobileMenu) {
            this.mobileMenuButton.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.header.contains(e.target) && !this.mobileMenu.classList.contains('hidden')) {
                    this.closeMobileMenu();
                }
            });

            // Close mobile menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !this.mobileMenu.classList.contains('hidden')) {
                    this.closeMobileMenu();
                }
            });

            // Close mobile menu when clicking on nav links
            this.mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });
        }
    }

    toggleMobileMenu() {
        const isHidden = this.mobileMenu.classList.contains('hidden');
        
        if (isHidden) {
            this.openMobileMenu();
        } else {
            this.closeMobileMenu();
        }
    }

    openMobileMenu() {
        this.mobileMenu.classList.remove('hidden');
        this.mobileMenu.style.maxHeight = '0';
        this.mobileMenu.style.opacity = '0';
        
        // Animate in
        requestAnimationFrame(() => {
            this.mobileMenu.style.maxHeight = this.mobileMenu.scrollHeight + 'px';
            this.mobileMenu.style.opacity = '1';
        });

        // Update button icon
        this.updateMobileMenuIcon(true);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        this.mobileMenu.style.maxHeight = '0';
        this.mobileMenu.style.opacity = '0';
        
        setTimeout(() => {
            this.mobileMenu.classList.add('hidden');
            this.mobileMenu.style.maxHeight = '';
            this.mobileMenu.style.opacity = '';
        }, 300);

        // Update button icon
        this.updateMobileMenuIcon(false);
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    updateMobileMenuIcon(isOpen) {
        const icon = this.mobileMenuButton.querySelector('svg');
        if (icon) {
            icon.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
        }
    }

    setupBackToTop() {
        if (!this.backToTopBtn) return;

        let isVisible = false;
        
        const toggleVisibility = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const shouldShow = scrollTop > 300;
            
            if (shouldShow && !isVisible) {
                this.backToTopBtn.style.opacity = '1';
                this.backToTopBtn.style.transform = 'translateY(0)';
                isVisible = true;
            } else if (!shouldShow && isVisible) {
                this.backToTopBtn.style.opacity = '0';
                this.backToTopBtn.style.transform = 'translateY(20px)';
                isVisible = false;
            }
        };

        // Throttled scroll listener
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    toggleVisibility();
                    ticking = false;
                });
                ticking = true;
            }
        });

        this.backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.scrollToTop();
        });
    }

    scrollToTop() {
        const scrollDuration = 800;
        const scrollStep = -window.scrollY / (scrollDuration / 15);
        
        const scrollInterval = setInterval(() => {
            if (window.scrollY !== 0) {
                window.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
            }
        }, 15);
    }

    setupSmoothScrolling() {
        // Enhanced smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = this.header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without jumping
                    history.pushState(null, null, href);
                }
            });
        });
    }

    setupHeaderScrollEffect() {
        if (!this.header) return;

        let lastScrollTop = 0;
        let isHeaderHidden = false;
        
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollingDown = scrollTop > lastScrollTop;
            const shouldHide = scrollingDown && scrollTop > 100;
            
            if (shouldHide && !isHeaderHidden) {
                this.header.style.transform = 'translateY(-100%)';
                isHeaderHidden = true;
            } else if (!shouldHide && isHeaderHidden) {
                this.header.style.transform = 'translateY(0)';
                isHeaderHidden = false;
            }
            
            // Add background blur effect on scroll
            if (scrollTop > 50) {
                this.header.style.backdropFilter = 'blur(20px)';
                this.header.style.backgroundColor = 'rgba(var(--card-bg-rgb), 0.8)';
            } else {
                this.header.style.backdropFilter = 'blur(10px)';
                this.header.style.backgroundColor = 'var(--card-bg)';
            }
            
            lastScrollTop = scrollTop;
        };

        // Throttled scroll listener
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    setupActiveNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');
        
        if (sections.length === 0) return;

        const observerOptions = {
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const navLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                
                if (entry.isIntersecting) {
                    // Remove active class from all nav links
                    navLinks.forEach(link => link.classList.remove('active'));
                    // Add active class to current nav link
                    if (navLink) {
                        navLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }
}

// Add navigation styles
const navStyles = document.createElement('style');
navStyles.textContent = `
    #mobile-menu {
        transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                   opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
    }
    
    header {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                   backdrop-filter 0.3s ease,
                   background-color 0.3s ease;
    }
    
    #backToTopBtn {
        transform: translateY(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    .nav-link.active {
        color: var(--accent-color);
        font-weight: 600;
    }
    
    .nav-link.active::before {
        opacity: 0.2;
        transform: scale(1);
    }
`;
document.head.appendChild(navStyles);

// Initialize navigation controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigationController = new NavigationController();
});