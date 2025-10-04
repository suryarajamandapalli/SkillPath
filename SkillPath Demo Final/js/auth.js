// Authentication functionality for NCVET AI Skilling Assistant
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.showcaseInterval = null;
        this.currentShowcase = 1;
        this.init();
    }

    init() {
        this.initFormSwitching();
        this.initProfilePicture();
        this.initPasswordStrength();
        this.initShowcase();
        this.initCountAnimation();
        this.checkAuthState();
    }

    // Form switching functionality
    initFormSwitching() {
        // Auto-switch showcase every 4 seconds
        this.showcaseInterval = setInterval(() => {
            this.currentShowcase = this.currentShowcase < 3 ? this.currentShowcase + 1 : 1;
            this.showShowcase(this.currentShowcase);
        }, 4000);
    }

    showLoginForm() {
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('signupForm').classList.remove('active');
        this.resetForms();
    }

    showSignupForm() {
        document.getElementById('signupForm').classList.add('active');
        document.getElementById('loginForm').classList.remove('active');
        this.resetForms();
    }

    resetForms() {
        document.querySelectorAll('form').forEach(form => form.reset());
        this.resetProfilePreview();
        this.updatePasswordStrength('');
    }

    // Profile picture handling
    initProfilePicture() {
        const profileInput = document.getElementById('profilePicture');
        const profilePreview = document.getElementById('profilePreview');

        profileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (this.validateImageFile(file)) {
                    this.previewImage(file, profilePreview);
                } else {
                    this.showNotification('Please select a valid image file (JPG, PNG) under 5MB', 'error');
                    profileInput.value = '';
                }
            }
        });

        // Click to upload
        profilePreview.addEventListener('click', () => {
            profileInput.click();
        });
    }

    validateImageFile(file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        return validTypes.includes(file.type) && file.size <= maxSize;
    }

    previewImage(file, previewElement) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewElement.innerHTML = `<img src="${e.target.result}" alt="Profile Preview">`;
            previewElement.classList.add('has-image');
        };
        reader.readAsDataURL(file);
    }

    resetProfilePreview() {
        const profilePreview = document.getElementById('profilePreview');
        profilePreview.innerHTML = `
            <i class="fas fa-user-plus"></i>
            <span>Add Photo</span>
        `;
        profilePreview.classList.remove('has-image');
    }

    // Password strength checking
    initPasswordStrength() {
        const passwordInput = document.getElementById('signupPassword');
        const strengthBar = document.getElementById('strengthBar');
        const strengthText = document.getElementById('strengthText');

        passwordInput.addEventListener('input', (e) => {
            this.updatePasswordStrength(e.target.value);
        });
    }

    updatePasswordStrength(password) {
        const strengthBar = document.getElementById('strengthBar');
        const strengthText = document.getElementById('strengthText');
        
        if (!strengthBar || !strengthText) return;

        const strength = this.calculatePasswordStrength(password);
        
        strengthBar.className = `strength-bar ${strength.class}`;
        strengthText.textContent = `Password strength: ${strength.text}`;
        strengthText.className = `text-${strength.color}`;
    }

    calculatePasswordStrength(password) {
        if (password.length === 0) {
            return { class: '', text: 'Enter password', color: 'muted' };
        }

        let score = 0;
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        score = Object.values(checks).filter(Boolean).length;

        if (score < 2) return { class: 'weak', text: 'Weak', color: 'danger' };
        if (score < 3) return { class: 'fair', text: 'Fair', color: 'warning' };
        if (score < 4) return { class: 'good', text: 'Good', color: 'info' };
        return { class: 'strong', text: 'Strong', color: 'success' };
    }

    // Showcase functionality
    initShowcase() {
        // Manual showcase control
        window.showShowcase = (index) => {
            this.currentShowcase = index;
            this.showShowcase(index);
            
            // Reset interval
            clearInterval(this.showcaseInterval);
            this.showcaseInterval = setInterval(() => {
                this.currentShowcase = this.currentShowcase < 3 ? this.currentShowcase + 1 : 1;
                this.showShowcase(this.currentShowcase);
            }, 4000);
        };
    }

    showShowcase(index) {
        // Hide all showcases
        document.querySelectorAll('.showcase-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Show selected showcase
        const selectedShowcase = document.getElementById(`showcase${index}`);
        if (selectedShowcase) {
            selectedShowcase.classList.add('active');
        }
        
        // Update controls
        document.querySelectorAll('.control-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index - 1);
        });
    }

    // Counter animation for statistics
    initCountAnimation() {
        const statNumbers = document.querySelectorAll('.stat-number[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        statNumbers.forEach(stat => observer.observe(stat));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = this.formatNumber(target);
                clearInterval(timer);
            } else {
                element.textContent = this.formatNumber(Math.floor(current));
            }
        }, 16);
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M+';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(0) + '+';
        }
        return num + '%';
    }

    // Authentication state management
    checkAuthState() {
        const token = localStorage.getItem('ncvet_auth_token');
        const userData = localStorage.getItem('ncvet_user_data');
        
        if (token && userData) {
            try {
                this.currentUser = JSON.parse(userData);
                // Redirect to dashboard if already logged in
                if (window.location.pathname === '/auth.html') {
                    window.location.href = 'dashboard.html';
                }
            } catch (error) {
                localStorage.removeItem('ncvet_auth_token');
                localStorage.removeItem('ncvet_user_data');
            }
        }
    }

    // Login handling
    async handleLogin(formData) {
        const email = formData.get('email');
        const password = formData.get('password');
        const rememberMe = formData.has('rememberMe');

        this.showLoader('Verifying credentials...');

        try {
            // Simulate API call - In real implementation, this would call your backend
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Check if user exists in our table
            const users = await this.apiCall('tables/users', {
                method: 'GET'
            });

            const user = users.data.find(u => u.email === email);
            
            if (!user) {
                throw new Error('User not found. Please sign up first.');
            }

            // In a real app, you'd verify the password hash
            // For demo purposes, we'll just check if it's not empty
            if (!password) {
                throw new Error('Password is required');
            }

            // Generate session token (in real app, this comes from backend)
            const sessionToken = this.generateSessionToken();
            
            // Store authentication data
            localStorage.setItem('ncvet_auth_token', sessionToken);
            localStorage.setItem('ncvet_user_data', JSON.stringify(user));
            
            if (rememberMe) {
                localStorage.setItem('ncvet_remember_me', 'true');
            }

            this.currentUser = user;
            
            this.showNotification('Login successful! Welcome back.', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } catch (error) {
            this.hideLoader();
            this.showNotification(error.message, 'error');
        }
    }

    // Signup handling
    async handleSignup(formData) {
        const userData = this.extractSignupData(formData);
        
        // Validate form data
        const validation = this.validateSignupData(userData);
        if (!validation.isValid) {
            this.showNotification(validation.message, 'error');
            return;
        }

        this.showLoader('Creating your AI learning profile...');

        try {
            // Check if email already exists
            const existingUsers = await this.apiCall('tables/users', {
                method: 'GET'
            });

            const emailExists = existingUsers.data.some(u => u.email === userData.email);
            if (emailExists) {
                throw new Error('An account with this email already exists.');
            }

            // Process profile picture if uploaded
            let profilePicUrl = null;
            const profileFile = document.getElementById('profilePicture').files[0];
            if (profileFile) {
                profilePicUrl = await this.uploadProfilePicture(profileFile);
            }

            // Create user record
            const newUser = {
                email: userData.email,
                full_name: `${userData.firstName} ${userData.lastName}`,
                age: parseInt(userData.age),
                location: userData.state,
                education_level: userData.educationLevel,
                profile_pic: profilePicUrl,
                current_skills: [], // Will be filled in onboarding
                career_aspiration: '', // Will be filled in onboarding
                learning_pace: 'self_paced',
                socio_economic_context: 'middle_class', // Default
                ai_mentor_preferences: 'adaptive',
                created_at: new Date().toISOString()
            };

            // Save to database
            const savedUser = await this.apiCall('tables/users', {
                method: 'POST',
                body: JSON.stringify(newUser)
            });

            // Generate session token
            const sessionToken = this.generateSessionToken();
            
            // Store authentication data
            localStorage.setItem('ncvet_auth_token', sessionToken);
            localStorage.setItem('ncvet_user_data', JSON.stringify(savedUser));
            
            this.currentUser = savedUser;
            
            this.showNotification('Account created successfully! Welcome to NCVET AI Assistant.', 'success');
            
            // Redirect to onboarding/dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } catch (error) {
            this.hideLoader();
            this.showNotification(error.message, 'error');
        }
    }

    extractSignupData(formData) {
        return {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            age: formData.get('age'),
            state: formData.get('state'),
            educationLevel: formData.get('educationLevel'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            agreeTerms: formData.has('agreeTerms')
        };
    }

    validateSignupData(data) {
        if (!data.agreeTerms) {
            return { isValid: false, message: 'Please accept the Terms of Service and Privacy Policy.' };
        }
        
        if (data.password !== data.confirmPassword) {
            return { isValid: false, message: 'Passwords do not match.' };
        }
        
        if (data.password.length < 8) {
            return { isValid: false, message: 'Password must be at least 8 characters long.' };
        }
        
        if (!this.isValidEmail(data.email)) {
            return { isValid: false, message: 'Please enter a valid email address.' };
        }
        
        return { isValid: true };
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async uploadProfilePicture(file) {
        // In a real application, you'd upload to a cloud storage service
        // For demo purposes, we'll convert to base64
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    }

    generateSessionToken() {
        return 'ncvet_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    // Utility functions
    showLoader(text) {
        const loader = document.getElementById('authLoader');
        const loaderText = document.getElementById('loaderText');
        
        if (loaderText) loaderText.textContent = text;
        if (loader) loader.style.display = 'flex';
    }

    hideLoader() {
        const loader = document.getElementById('authLoader');
        if (loader) loader.style.display = 'none';
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} notification-toast`;
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
                ${message}
                <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

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
            throw new Error('Network error occurred. Please try again.');
        }
    }
}

// Global functions for HTML onclick events
function showLoginForm() {
    window.authManager.showLoginForm();
}

function showSignupForm() {
    window.authManager.showSignupForm();
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.nextElementSibling.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        toggle.className = 'fas fa-eye';
    }
}

function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    window.authManager.handleLogin(formData);
}

function handleSignup(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    window.authManager.handleSignup(formData);
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
    
    // Show login form by default
    showLoginForm();
});

// Add styles for notification
document.head.insertAdjacentHTML('beforeend', `
<style>
.notification-toast {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10001;
    min-width: 350px;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
    animation: slideInRight 0.3s ease;
    border: none;
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

.notification-toast .btn-close {
    font-size: 0.8rem;
}

.alert-success {
    background-color: #d4edda;
    border-color: #c3e6cb;
    color: #155724;
}

.alert-danger {
    background-color: #f8d7da;
    border-color: #f5c6cb;
    color: #721c24;
}

.alert-info {
    background-color: #cce7ff;
    border-color: #b6d7ff;
    color: #004085;
}
</style>
`);