// Enhanced Theme Controller
class ThemeController {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeToggleMobile = document.getElementById('theme-toggle-mobile');
        this.themeIcon = document.getElementById('theme-icon');
        this.themeIconMobile = document.getElementById('theme-icon-mobile');
        this.body = document.body;
        
        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.setupEventListeners();
        this.setupSystemThemeListener();
    }

    setTheme(theme, animate = true) {
        // Add transition class for smooth theme switching
        if (animate) {
            this.body.classList.add('theme-transitioning');
            setTimeout(() => {
                this.body.classList.remove('theme-transitioning');
            }, 400);
        }

        this.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        this.updateIcons(theme);
        this.updateMetaThemeColor(theme);
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }

    updateIcons(theme) {
        const isDark = theme === 'dark';
        const iconClass = isDark ? 'fa-moon' : 'fa-sun';
        const removeIconClass = isDark ? 'fa-sun' : 'fa-moon';

        [this.themeIcon, this.themeIconMobile].forEach(icon => {
            if (icon) {
                icon.classList.remove(removeIconClass);
                icon.classList.add(iconClass);
                
                // Add rotation animation
                icon.style.transform = 'rotate(360deg)';
                setTimeout(() => {
                    icon.style.transform = 'rotate(0deg)';
                }, 300);
            }
        });
    }

    updateMetaThemeColor(theme) {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        const color = theme === 'dark' ? '#0f172a' : '#f8fafc';
        
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', color);
        } else {
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = color;
            document.head.appendChild(meta);
        }
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.setTheme(savedTheme, false);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            this.setTheme('light', false);
        } else {
            this.setTheme('dark', false);
        }
    }

    setupEventListeners() {
        [this.themeToggle, this.themeToggleMobile].forEach(toggle => {
            if (toggle) {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    const currentTheme = this.body.getAttribute('data-theme');
                    this.setTheme(currentTheme === 'dark' ? 'light' : 'dark');
                    
                    // Add click animation
                    toggle.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        toggle.style.transform = 'scale(1)';
                    }, 150);
                });
            }
        });

        // Keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + T)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                const currentTheme = this.body.getAttribute('data-theme');
                this.setTheme(currentTheme === 'dark' ? 'light' : 'dark');
            }
        });
    }

    setupSystemThemeListener() {
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    // Method to get current theme
    getCurrentTheme() {
        return this.body.getAttribute('data-theme') || 'dark';
    }
}

// Add theme transition styles
const themeStyles = document.createElement('style');
themeStyles.textContent = `
    .theme-transitioning * {
        transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                   color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                   border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                   box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
`;
document.head.appendChild(themeStyles);

// Initialize theme controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeController = new ThemeController();
});