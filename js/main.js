// Main JavaScript for NCVET AI Skilling Assistant
class NCVETApp {
    constructor() {
        this.currentUser = null;
        this.loadingMessages = [
            'Initializing AI Systems...',
            'Loading NSQF Database...',
            'Connecting to Labor Market Intelligence...',
            'Preparing AI Character Teachers...',
            'Setting up Virtual Mentors...',
            'Configuring Career Simulators...',
            'Analyzing Market Trends...',
            'Optimizing Learning Pathways...',
            'Ready to Transform Your Career!'
        ];
        this.currentMessageIndex = 0;
        this.init();
    }

    init() {
        this.showLoadingScreen();
        this.initEventListeners();
    }

    showLoadingScreen() {
        const progressFill = document.getElementById('progressFill');
        const loadingText = document.getElementById('loadingText');
        let progress = 0;

        const updateProgress = () => {
            if (progress <= 100) {
                progressFill.style.width = progress + '%';
                
                // Update loading messages
                const messageProgress = Math.floor((progress / 100) * this.loadingMessages.length);
                if (messageProgress < this.loadingMessages.length && messageProgress !== this.currentMessageIndex) {
                    this.currentMessageIndex = messageProgress;
                    loadingText.textContent = this.loadingMessages[messageProgress];
                    
                    // Add typing effect
                    loadingText.style.opacity = '0';
                    setTimeout(() => {
                        loadingText.style.opacity = '1';
                    }, 200);
                }
                
                progress += Math.random() * 15 + 5; // Random increment for realistic loading
                
                if (progress < 100) {
                    setTimeout(updateProgress, 300 + Math.random() * 400);
                } else {
                    setTimeout(() => {
                        this.hideLoadingScreen();
                    }, 1000);
                }
            }
        };

        updateProgress();
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const mainContent = document.getElementById('mainContent');
        
        loadingScreen.style.transition = 'opacity 0.8s ease';
        loadingScreen.style.opacity = '0';
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainContent.style.display = 'block';
            mainContent.style.opacity = '0';
            mainContent.style.transition = 'opacity 0.8s ease';
            
            setTimeout(() => {
                mainContent.style.opacity = '1';
            }, 100);
        }, 800);
    }

    initEventListeners() {
        // Navigation scroll effect
        window.addEventListener('scroll', this.handleNavbarScroll);
        
        // Smooth scrolling for anchor links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
        
        // Initialize animations on scroll
        this.initScrollAnimations();
    }

    handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(30, 60, 114, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(30, 60, 114, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.feature-card, .stat-item, .workflow-step').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }

    // Animation utilities
    animateCountUp(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    // Utility functions for later use
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} notification-toast`;
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // API helper functions for future use
    async apiCall(endpoint, options = {}) {
        try {
            const response = await fetch(endpoint, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            this.showNotification('Network error occurred. Please try again.', 'error');
            throw error;
        }
    }

    // Storage utilities
    setStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Storage error:', error);
        }
    }

    getStorage(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Storage retrieval error:', error);
            return null;
        }
    }
}

// Global functions for HTML onclick events
function showAboutSection() {
    const aboutSection = document.getElementById('aboutSection');
    aboutSection.style.display = 'block';
    aboutSection.scrollIntoView({ behavior: 'smooth' });
    
    // Trigger feature card animations
    setTimeout(() => {
        document.querySelectorAll('.feature-card').forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, index * 200);
        });
    }, 500);
}

function showAuthSection() {
    window.location.href = 'auth.html';
}

function startLearningJourney() {
    window.location.href = 'dashboard.html';
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ncvetApp = new NCVETApp();
    
    // Add some interactive effects
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add parallax effect to hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Language selector functionality
    const languageSelector = document.querySelector('.language-selector select');
    if (languageSelector) {
        languageSelector.addEventListener('change', function() {
            window.ncvetApp.showNotification(`Language changed to ${this.value}`, 'success');
            // Here you would implement actual language switching logic
        });
    }
});

// Add CSS for notification toast
const notificationStyles = `
<style>
.notification-toast {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    min-width: 300px;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    animation: slideInRight 0.3s ease;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.feature-card {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', notificationStyles);