// Main Engine: Detection and Initialization
const App = {
    init: () => {
        App.detectDevice();
        App.initTheme();
        App.initMenu();
        App.initAnimations();
        
        // Listen for resize to update device detection if needed
        window.addEventListener('resize', App.detectDevice);
    },

    detectDevice: () => {
        const width = window.innerWidth;
        const body = document.body;
        
        if (width <= 992) {
            if (!body.classList.contains('mobile-device')) {
                body.classList.add('mobile-device');
                body.classList.remove('desktop-device');
                console.log('Mobile device detected');
            }
        } else {
            if (!body.classList.contains('desktop-device')) {
                body.classList.add('desktop-device');
                body.classList.remove('mobile-device');
                console.log('Desktop device detected');
            }
        }
    },

    initTheme: () => {
        const themeToggle = document.getElementById('theme-toggle');
        const htmlElement = document.documentElement;
        if (!themeToggle) return;
        
        const icon = themeToggle.querySelector('i');

        // Check saved preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            htmlElement.setAttribute('data-theme', 'dark');
            icon.classList.replace('fa-moon', 'fa-sun');
        }

        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Icon Toggle
            if (newTheme === 'dark') {
                icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
            }
        });
    },

    initMenu: () => {
        const menuToggle = document.getElementById('menu-toggle');
        const navLinks = document.getElementById('nav-links');

        if (menuToggle && navLinks) {
            // Helper functions
            const closeMenu = () => {
                if (!navLinks.classList.contains('active')) return;
                
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i') || document.querySelector('#menu-toggle i'); // Ensure we find the icon
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                
                // Unlock scroll and restore position without jump or animation
                const scrollY = document.body.style.top;
                
                // Temporarily disable smooth scroll to prevent jump animation
                document.documentElement.style.scrollBehavior = 'auto';
                
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
                
                // Restore smooth scroll after a tick
                setTimeout(() => {
                    document.documentElement.style.removeProperty('scroll-behavior');
                }, 10);
            };

            const openMenu = () => {
                if (navLinks.classList.contains('active')) return;
                
                // Capture scroll position immediately
                const currentScrollY = window.scrollY;
                
                navLinks.classList.add('active');
                const icon = menuToggle.querySelector('i') || document.querySelector('#menu-toggle i');
                if (icon) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                }
                
                // Robust scroll lock
                document.body.style.position = 'fixed';
                document.body.style.top = `-${currentScrollY}px`;
                document.body.style.width = '100%';
                document.body.style.overflow = 'hidden';
            };

            const toggleMenu = () => {
                if (navLinks.classList.contains('active')) {
                    closeMenu();
                } else {
                    openMenu();
                }
            };

            // Remove existing event listeners to avoid duplicates if re-initialized (defensive)
            const newMenuToggle = menuToggle.cloneNode(true);
            menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
            
            // Toggle Button Listener
            newMenuToggle.addEventListener('click', (e) => {
                e.preventDefault(); 
                toggleMenu();
            });
            
            // Link Click Listener (Close menu)
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    closeMenu();
                });
            });

            // Click Outside Listener
            document.addEventListener('click', (e) => {
                if (navLinks.classList.contains('active')) {
                    // Check if click is outside navLinks AND outside the toggle button
                    // Note: newMenuToggle is the current active element in DOM
                    if (!navLinks.contains(e.target) && !newMenuToggle.contains(e.target)) {
                        closeMenu();
                    }
                }
            });
        }
    },

    initAnimations: () => {
        const observerOptions = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Apply fade-in to sections
        document.querySelectorAll('.glass-card, .timeline-item, .project-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    }
};

document.addEventListener('DOMContentLoaded', App.init);
