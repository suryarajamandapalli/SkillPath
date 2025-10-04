// Dashboard functionality for NCVET AI Skilling Assistant
class Dashboard {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'overview';
        this.charts = {};
        this.aiTeachers = {
            maya: {
                name: 'Maya',
                specialty: 'Electronics Expert',
                avatar: '👩‍🏫',
                responses: [
                    "Great question! Let me explain this concept step by step...",
                    "I can help you understand this better with a practical example.",
                    "That's an excellent observation! Here's what you need to know...",
                    "Let's break this down into simpler components for better understanding."
                ]
            },
            alex: {
                name: 'Alex',
                specialty: 'Tech Specialist',
                avatar: '👨‍💻',
                responses: [
                    "Interesting! This is a common challenge in the tech industry.",
                    "Let me show you the most efficient approach to solve this.",
                    "From my experience, here's what works best in real-world scenarios.",
                    "Perfect! You're thinking like a true tech professional."
                ]
            },
            priya: {
                name: 'Priya',
                specialty: 'Healthcare Mentor',
                avatar: '👩‍⚕️',
                responses: [
                    "In healthcare, safety and accuracy are paramount. Here's why...",
                    "This procedure is critical in patient care. Let me demonstrate...",
                    "Excellent question! Patient safety depends on understanding this concept.",
                    "In clinical practice, we follow these established protocols..."
                ]
            }
        };
        this.activeTeacher = 'maya';
        this.mentorMessages = [];
        this.pathways = [];
        this.marketData = [];
        this.init();
    }

    async init() {
        await this.loadUserData();
        await this.loadPathways();
        await this.loadMarketData();
        this.initNavigation();
        this.initCharts();
        this.initAITeacher();
        this.initMentor();
        this.initSimulator();
        this.populateUserStats();
        this.loadAIRecommendations();
        this.loadRecentActivity();
    }

    async loadUserData() {
        const userData = localStorage.getItem('ncvet_user_data');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                document.getElementById('userName').textContent = this.currentUser.full_name.split(' ')[0];
                document.getElementById('welcomeUserName').textContent = this.currentUser.full_name.split(' ')[0];
                
                // Load profile picture if available
                const userAvatar = document.getElementById('userAvatar');
                if (this.currentUser.profile_pic) {
                    userAvatar.innerHTML = `<img src="${this.currentUser.profile_pic}" alt="Profile">`;
                }
            } catch (error) {
                console.error('Error loading user data:', error);
                this.redirectToAuth();
            }
        } else {
            this.redirectToAuth();
        }
    }

    async loadPathways() {
        try {
            const response = await this.apiCall('tables/learning_pathways');
            this.pathways = response.data;
            this.displayPathways();
        } catch (error) {
            console.error('Error loading pathways:', error);
        }
    }

    async loadMarketData() {
        try {
            const response = await this.apiCall('tables/labor_market_data');
            this.marketData = response.data;
            this.updateMarketForecast();
        } catch (error) {
            console.error('Error loading market data:', error);
        }
    }

    redirectToAuth() {
        window.location.href = 'auth.html';
    }

    // Navigation
    initNavigation() {
        const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                if (section) {
                    this.showSection(section);
                }
            });
        });
    }

    showSection(sectionId) {
        // Update active nav item
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

        // Show content section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        this.currentSection = sectionId;

        // Initialize section-specific features
        if (sectionId === 'market-forecast') {
            this.initMarketChart();
        }
    }

    // Charts initialization
    initCharts() {
        this.initProgressChart();
    }

    initProgressChart() {
        const ctx = document.getElementById('progressChart').getContext('2d');
        
        this.charts.progress = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'In Progress', 'Not Started'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: [
                        '#4caf50',
                        '#ff9800',
                        '#e0e0e0'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    initMarketChart() {
        if (this.charts.market) {
            this.charts.market.destroy();
        }

        const ctx = document.getElementById('marketTrendChart');
        if (!ctx) return;

        const chartCtx = ctx.getContext('2d');
        
        // Sample data - in real app, this would come from market data API
        const monthlyData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Electronics Technician',
                    data: [12000, 13500, 15000, 16200, 17800, 19500],
                    borderColor: '#2196f3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Digital Marketing',
                    data: [8000, 9200, 11500, 13800, 16200, 18500],
                    borderColor: '#4caf50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Healthcare Assistant',
                    data: [15000, 16500, 18200, 20500, 22800, 25000],
                    borderColor: '#ff9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    tension: 0.4
                }
            ]
        };

        this.charts.market = new Chart(chartCtx, {
            type: 'line',
            data: monthlyData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // AI Teacher functionality
    initAITeacher() {
        // Teacher selection
        const teacherCards = document.querySelectorAll('.teacher-card');
        teacherCards.forEach(card => {
            card.addEventListener('click', () => {
                teacherCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.activeTeacher = card.dataset.teacher;
                this.updateTeacherDisplay();
            });
        });

        // Initialize with default teacher
        this.updateTeacherDisplay();
    }

    updateTeacherDisplay() {
        const teacher = this.aiTeachers[this.activeTeacher];
        const teacherElement = document.getElementById('activeTeacher');
        const speechElement = document.getElementById('teacherSpeech');
        
        // Update avatar
        const avatarHead = teacherElement.querySelector('.avatar-head');
        avatarHead.textContent = teacher.avatar;
        
        // Update speech
        speechElement.textContent = `Hello! I'm ${teacher.name}, your AI ${teacher.specialty.toLowerCase()}. What would you like to learn today?`;
    }

    sendTeacherMessage() {
        const input = document.getElementById('teacherChat');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Clear input
        input.value = '';
        
        // Simulate AI response
        const teacher = this.aiTeachers[this.activeTeacher];
        const response = teacher.responses[Math.floor(Math.random() * teacher.responses.length)];
        
        // Update speech bubble
        const speechElement = document.getElementById('teacherSpeech');
        speechElement.textContent = response;
        
        // Add typing animation
        speechElement.style.opacity = '0';
        setTimeout(() => {
            speechElement.style.opacity = '1';
        }, 300);
    }

    askQuestion(type) {
        const responses = {
            'explain-concept': 'Let me break down this concept with a visual demonstration. First, we need to understand the fundamental principles...',
            'practice-quiz': 'Great idea! I\'ll create a personalized quiz based on your current progress. Here\'s your first question...',
            'real-examples': 'Excellent! Let me show you how this applies in real industry scenarios. For instance, in electronics manufacturing...'
        };
        
        const speechElement = document.getElementById('teacherSpeech');
        speechElement.textContent = responses[type] || 'I\'m here to help you learn! What specific topic would you like to explore?';
    }

    // AI Mentor functionality
    initMentor() {
        this.mentorMessages = [
            {
                type: 'mentor',
                content: 'Welcome! I\'ve analyzed your learning profile and have some personalized recommendations for you.',
                time: new Date().toLocaleTimeString()
            },
            {
                type: 'mentor',
                content: 'Based on your progress in electronics, I suggest focusing on digital circuits next. The job market shows high demand for these skills.',
                time: new Date().toLocaleTimeString()
            }
        ];
        
        this.displayMentorMessages();
        
        // Add enter key support for chat input
        const chatInput = document.getElementById('mentorChatInput');
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMentorMessage();
            }
        });
    }

    displayMentorMessages() {
        const messagesContainer = document.getElementById('mentorMessages');
        messagesContainer.innerHTML = '';
        
        this.mentorMessages.forEach(message => {
            const messageEl = document.createElement('div');
            messageEl.className = `message ${message.type}`;
            
            messageEl.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-${message.type === 'mentor' ? 'robot' : 'user'}"></i>
                </div>
                <div class="message-content">
                    <p>${message.content}</p>
                    <div class="message-time">${message.time}</div>
                </div>
            `;
            
            messagesContainer.appendChild(messageEl);
        });
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    sendMentorMessage() {
        const input = document.getElementById('mentorChatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.mentorMessages.push({
            type: 'user',
            content: message,
            time: new Date().toLocaleTimeString()
        });
        
        // Clear input
        input.value = '';
        
        // Simulate mentor response
        setTimeout(() => {
            const responses = [
                'That\'s a great question! Based on current market trends, I recommend focusing on these key areas...',
                'I understand your concern. Let me suggest a personalized learning path that aligns with your goals.',
                'Excellent progress! Your dedication is impressive. Here\'s what I suggest for your next steps...',
                'Based on your learning style, I think this approach will work well for you...',
                'The industry data shows promising opportunities in your chosen field. Let me share some insights...'
            ];
            
            const response = responses[Math.floor(Math.random() * responses.length)];
            
            this.mentorMessages.push({
                type: 'mentor',
                content: response,
                time: new Date().toLocaleTimeString()
            });
            
            this.displayMentorMessages();
        }, 1000);
        
        this.displayMentorMessages();
    }

    // Career Simulator functionality
    initSimulator() {
        const scenarioCards = document.querySelectorAll('.scenario-card');
        const startButton = document.getElementById('startSimulation');
        let selectedScenario = null;
        
        scenarioCards.forEach(card => {
            card.addEventListener('click', () => {
                scenarioCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                selectedScenario = card.dataset.scenario;
                startButton.disabled = false;
                this.updateSimulatorScreen(selectedScenario);
            });
        });
        
        startButton.addEventListener('click', () => {
            if (selectedScenario) {
                this.startSimulation(selectedScenario);
            }
        });
    }

    updateSimulatorScreen(scenario) {
        const screen = document.getElementById('simulatorScreen');
        const scenarios = {
            'electronics-lab': {
                title: 'Electronics Laboratory',
                description: 'Virtual circuit building and component testing environment',
                preview: '<div class="circuit-preview"><i class="fas fa-microchip"></i><div class="connection-lines"></div></div>'
            },
            'telecom-installation': {
                title: 'Telecom Installation Site',
                description: 'Network infrastructure setup and maintenance simulation',
                preview: '<div class="network-preview"><i class="fas fa-broadcast-tower"></i><div class="signal-waves"></div></div>'
            },
            'healthcare-practice': {
                title: 'Healthcare Training Center',
                description: 'Patient care and medical procedure simulation',
                preview: '<div class="medical-preview"><i class="fas fa-heartbeat"></i><div class="vital-monitors"></div></div>'
            },
            'automation-control': {
                title: 'Industrial Automation Floor',
                description: 'Robotic systems and process control simulation',
                preview: '<div class="automation-preview"><i class="fas fa-robot"></i><div class="control-panels"></div></div>'
            }
        };
        
        const scenarioData = scenarios[scenario];
        screen.innerHTML = `
            <div class="scenario-preview-large">
                ${scenarioData.preview}
                <h4>${scenarioData.title}</h4>
                <p>${scenarioData.description}</p>
            </div>
        `;
    }

    startSimulation(scenario) {
        this.showNotification('Starting VR/AR simulation... Please put on your headset.', 'info');
        
        // Simulate simulation start
        setTimeout(() => {
            this.showNotification('Simulation started successfully! Follow the AI instructor\'s guidance.', 'success');
        }, 2000);
    }

    // Pathways display
    displayPathways() {
        const container = document.getElementById('pathwaysContainer');
        container.innerHTML = '';
        
        // Sort by AI recommendation score
        const sortedPathways = [...this.pathways].sort((a, b) => b.ai_recommendation_score - a.ai_recommendation_score);
        
        sortedPathways.forEach((pathway, index) => {
            const isRecommended = index < 2; // Top 2 are AI recommended
            
            const pathwayCard = document.createElement('div');
            pathwayCard.className = `pathway-card ${isRecommended ? 'recommended' : ''}`;
            
            pathwayCard.innerHTML = `
                <div class="pathway-header">
                    <div>
                        <h4 class="pathway-title">${pathway.title}</h4>
                        <div class="pathway-meta">
                            <span><i class="fas fa-layer-group me-1"></i>NSQF Level ${pathway.nsqf_level}</span>
                            <span><i class="fas fa-clock me-1"></i>${pathway.duration_months} months</span>
                            <span><i class="fas fa-industry me-1"></i>${pathway.industry_sector}</span>
                        </div>
                    </div>
                </div>
                
                <p class="pathway-description">${pathway.description}</p>
                
                <div class="pathway-skills">
                    <h6>Skills You'll Learn:</h6>
                    <div class="skills-tags">
                        ${pathway.skills_covered.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
                
                <div class="pathway-demand">
                    <span class="demand-indicator ${pathway.market_demand.toLowerCase()}">${pathway.market_demand} Demand</span>
                    <span class="salary-range">${pathway.salary_range}</span>
                </div>
                
                <div class="pathway-actions">
                    <button class="btn btn-primary" onclick="dashboard.enrollInPathway('${pathway.id}')">
                        <i class="fas fa-play me-2"></i>Start Learning
                    </button>
                    <button class="btn btn-outline-secondary" onclick="dashboard.viewPathwayDetails('${pathway.id}')">
                        <i class="fas fa-info-circle me-2"></i>View Details
                    </button>
                </div>
            `;
            
            container.appendChild(pathwayCard);
        });
    }

    enrollInPathway(pathwayId) {
        const pathway = this.pathways.find(p => p.id === pathwayId);
        this.showNotification(`Enrolled in ${pathway.title}! Your personalized learning plan is being prepared.`, 'success');
    }

    viewPathwayDetails(pathwayId) {
        const pathway = this.pathways.find(p => p.id === pathwayId);
        alert(`Pathway Details:\n\n${pathway.title}\n\nDuration: ${pathway.duration_months} months\nLevel: NSQF ${pathway.nsqf_level}\n\nJob Roles: ${pathway.job_roles.join(', ')}\n\nSalary Range: ${pathway.salary_range}\n\nMarket Demand: ${pathway.market_demand}`);
    }

    // Market forecast
    updateMarketForecast() {
        // This will be called when market data is loaded
        // The chart and insights will be updated with real data
    }

    // User statistics
    populateUserStats() {
        // Simulate user progress data
        const stats = {
            coursesCompleted: Math.floor(Math.random() * 10) + 1,
            certificatesEarned: Math.floor(Math.random() * 5) + 1,
            hoursLearned: Math.floor(Math.random() * 100) + 20,
            skillLevel: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)]
        };

        document.getElementById('coursesCompleted').textContent = stats.coursesCompleted;
        document.getElementById('certificatesEarned').textContent = stats.certificatesEarned;
        document.getElementById('hoursLearned').textContent = stats.hoursLearned + 'h';
        document.getElementById('skillLevel').textContent = stats.skillLevel;
    }

    // AI Recommendations
    loadAIRecommendations() {
        setTimeout(() => {
            const container = document.getElementById('aiRecommendations');
            container.innerHTML = `
                <div class="recommendation-item">
                    <div class="recommendation-icon">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <div class="recommendation-content">
                        <h6>Recommended Next Course</h6>
                        <p>Based on your electronics foundation, I suggest "Digital Circuit Design" to enhance your skills.</p>
                    </div>
                </div>
                
                <div class="recommendation-item">
                    <div class="recommendation-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="recommendation-content">
                        <h6>Market Opportunity</h6>
                        <p>Electronics Technician roles are growing by 18% in your region. Perfect timing for your career!</p>
                    </div>
                </div>
                
                <div class="recommendation-item">
                    <div class="recommendation-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="recommendation-content">
                        <h6>Study Group Match</h6>
                        <p>I found 3 learners with similar goals nearby. Join a study group for better engagement.</p>
                    </div>
                </div>
            `;
        }, 2000);
    }

    // Recent Activity
    loadRecentActivity() {
        const activities = [
            {
                type: 'course_completed',
                title: 'Completed: Basic Electronics Theory',
                description: 'Successfully finished the foundational electronics course with 92% score.',
                time: '2 hours ago',
                icon: 'fas fa-graduation-cap'
            },
            {
                type: 'certificate_earned',
                title: 'Certificate Earned: NSQF Level 3',
                description: 'Received certification in Basic Electronics from NCVET.',
                time: '1 day ago',
                icon: 'fas fa-certificate'
            },
            {
                type: 'ai_recommendation',
                title: 'New AI Recommendation',
                description: 'Your AI mentor suggests focusing on digital circuits for career advancement.',
                time: '2 days ago',
                icon: 'fas fa-robot'
            },
            {
                type: 'market_update',
                title: 'Market Intelligence Update',
                description: 'New job opportunities in electronics sector increased by 15% this month.',
                time: '3 days ago',
                icon: 'fas fa-chart-line'
            }
        ];

        const container = document.getElementById('activityTimeline');
        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-content">
                    <div class="activity-meta">
                        <i class="${activity.icon} me-2"></i>${activity.time}
                    </div>
                    <h6 class="activity-title">${activity.title}</h6>
                    <p class="activity-description">${activity.description}</p>
                </div>
            </div>
        `).join('');
    }

    // Utility functions
    showNotification(message, type = 'info') {
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
            throw error;
        }
    }
}

// Global functions for HTML onclick events
function logout() {
    localStorage.removeItem('ncvet_auth_token');
    localStorage.removeItem('ncvet_user_data');
    localStorage.removeItem('ncvet_remember_me');
    window.location.href = 'index.html';
}

function sendTeacherMessage() {
    if (window.dashboard) {
        window.dashboard.sendTeacherMessage();
    }
}

function sendMentorMessage() {
    if (window.dashboard) {
        window.dashboard.sendMentorMessage();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});

// Add notification styles
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
</style>
`);