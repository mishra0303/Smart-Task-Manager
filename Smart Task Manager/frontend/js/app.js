// Smart Task Manager Frontend Application
// Uses local storage for data persistence

class TaskManagerApp {
    constructor() {
        this.currentUser = null;
        this.tasks = [];
        this.categories = [];
        this.currentView = 'dashboard';
        this.initializeApp();
    }

    initializeApp() {
        this.loadFromLocalStorage();
        this.setupEventListeners();
        this.setupVoiceAssistant();
        this.setupGlobalVoiceCommands();
        this.setupConversationalVoiceCreateTask();
        this.setupVoiceHelp();
        this.checkAuthentication();
        this.showWelcomeMessage();
    }

    setupVoiceAssistant() {
        const voiceBtn = document.getElementById('voice-description-btn');
        const descInput = document.getElementById('task-description');
        
        // Check if voice recognition is supported
        if (!voiceBtn || !descInput) {
            console.log('Voice assistant elements not found');
            return;
        }
        
        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
            console.log('Speech recognition not supported in this browser');
            voiceBtn.style.display = 'none';
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;
        
        voiceBtn.addEventListener('click', () => {
            try {
            recognition.start();
                voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
                voiceBtn.style.background = '#dc3545';
            this.showNotification('Listening... Speak your task description.', 'info');
            } catch (error) {
                this.showNotification('Failed to start voice recognition: ' + error.message, 'error');
            }
        });
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            descInput.value = transcript;
            this.showNotification('Description filled from voice input!', 'success');
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceBtn.style.background = '';
        };
        
        recognition.onerror = (event) => {
            console.error('Voice recognition error:', event.error);
            let errorMessage = 'Voice recognition error';
            
            switch (event.error) {
                case 'not-allowed':
                    errorMessage = 'Microphone access denied. Please allow microphone access and try again.';
                    break;
                case 'no-speech':
                    errorMessage = 'No speech detected. Please try again.';
                    break;
                case 'audio-capture':
                    errorMessage = 'Audio capture failed. Please check your microphone.';
                    break;
                case 'network':
                    errorMessage = 'Network error. Please check your connection.';
                    break;
                case 'service-not-allowed':
                    errorMessage = 'Voice recognition service not allowed. Try using localhost or HTTPS.';
                    break;
                default:
                    errorMessage = 'Voice recognition error: ' + event.error;
            }
            
            this.showNotification(errorMessage, 'error');
            
            // Show additional help for common issues
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                setTimeout(() => {
                    this.showNotification('💡 Tip: Use the local server (run-node-server.bat) for better voice recognition support.', 'info');
                }, 2000);
            }
            
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceBtn.style.background = '';
        };
        
        recognition.onend = () => {
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceBtn.style.background = '';
        };
    }

    setupGlobalVoiceCommands() {
        const globalVoiceBtn = document.getElementById('global-voice-btn');
        
        // Check if voice recognition is supported
        if (!globalVoiceBtn) {
            console.log('Global voice button not found');
            return;
        }
        
        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
            console.log('Speech recognition not supported in this browser');
            globalVoiceBtn.style.display = 'none';
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;
        
        globalVoiceBtn.addEventListener('click', () => {
            try {
            recognition.start();
                globalVoiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
                globalVoiceBtn.style.background = '#dc3545';
            this.showNotification('Listening for command...', 'info');
            } catch (error) {
                this.showNotification('Failed to start voice recognition: ' + error.message, 'error');
            }
        });
        
        recognition.onresult = async (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            this.showNotification('Heard: ' + transcript, 'info');
            await this.handleVoiceCommand(transcript);
            globalVoiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            globalVoiceBtn.style.background = '#007bff';
        };
        
        recognition.onerror = (event) => {
            console.error('Global voice recognition error:', event.error);
            let errorMessage = 'Voice recognition error';
            
            switch (event.error) {
                case 'not-allowed':
                    errorMessage = 'Microphone access denied. Please allow microphone access and try again.';
                    break;
                case 'no-speech':
                    errorMessage = 'No speech detected. Please try again.';
                    break;
                case 'audio-capture':
                    errorMessage = 'Audio capture failed. Please check your microphone.';
                    break;
                case 'network':
                    errorMessage = 'Network error. Please check your connection.';
                    break;
                case 'service-not-allowed':
                    errorMessage = 'Voice recognition service not allowed. Try using localhost or HTTPS.';
                    break;
                default:
                    errorMessage = 'Voice recognition error: ' + event.error;
            }
            
            this.showNotification(errorMessage, 'error');
            
            // Show additional help for common issues
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                setTimeout(() => {
                    this.showNotification('💡 Tip: Use the local server (run-node-server.bat) for better voice recognition support.', 'info');
                }, 2000);
            }
            
            globalVoiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            globalVoiceBtn.style.background = '#007bff';
        };
        
        recognition.onend = () => {
            globalVoiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            globalVoiceBtn.style.background = '#007bff';
        };
    }

    async handleVoiceCommand(command) {
        // Add Task: "add task [title] [description]"
        let match = command.match(/^add task (.+?)(?: description (.+))?$/);
        if (match) {
            const title = match[1].trim();
            const description = match[2] ? match[2].trim() : '';
            await this.voiceCreateTask(title, description);
            return;
        }
        // Edit Task: "edit task [old title] to [new title]"
        match = command.match(/^edit task (.+?) to (.+)$/);
        if (match) {
            const oldTitle = match[1].trim();
            const newTitle = match[2].trim();
            await this.voiceEditTask(oldTitle, newTitle);
            return;
        }
        // Delete Task: "delete task [title]"
        match = command.match(/^delete task (.+)$/);
        if (match) {
            const title = match[1].trim();
            await this.voiceDeleteTask(title);
            return;
        }
        // Complete Task: "complete task [title]"
        match = command.match(/^complete task (.+)$/);
        if (match) {
            const title = match[1].trim();
            await this.voiceCompleteTask(title);
            return;
        }
        // Show Tasks: "show (all|completed|pending) tasks"
        match = command.match(/^show (all|completed|pending) tasks?$/);
        if (match) {
            const filter = match[1];
            this.showView('tasks');
            if (filter === 'completed') {
                this.renderTasks(this.tasks.filter(t => t.status === 'COMPLETED'));
            } else if (filter === 'pending') {
                this.renderTasks(this.tasks.filter(t => t.status === 'PENDING'));
            } else {
                this.renderTasks(this.tasks);
            }
            this.showNotification('Showing ' + filter + ' tasks.', 'success');
            return;
        }
        this.showNotification('Sorry, command not recognized.', 'error');
    }

    async voiceCreateTask(title, description) {
        if (!this.currentUser) {
            this.showNotification('Please log in to add tasks.', 'error');
            return;
        }
        const newTask = {
            id: this.generateId(),
            title,
            description,
            priority: 'MEDIUM',
            status: 'PENDING',
            categoryId: null,
            dueDate: null,
            userId: this.currentUser.id,
            createdAt: new Date().toISOString()
        };
        
        this.tasks.push(newTask);
                this.saveToLocalStorage();
                this.showNotification('Task added via voice!', 'success');
                this.showView('dashboard');
    }

    async voiceEditTask(oldTitle, newTitle) {
        if (!this.currentUser) {
            this.showNotification('Please log in to edit tasks.', 'error');
            return;
        }
        const task = this.tasks.find(t => t.title.toLowerCase() === oldTitle.toLowerCase());
        if (!task) {
            this.showNotification('Task not found: ' + oldTitle, 'error');
            return;
        }
        task.title = newTitle;
        this.saveToLocalStorage();
        this.showNotification('Task updated via voice!', 'success');
    }

    async voiceDeleteTask(title) {
        if (!this.currentUser) {
            this.showNotification('Please log in to delete tasks.', 'error');
            return;
        }
        const task = this.tasks.find(t => t.title.toLowerCase() === title.toLowerCase());
        if (!task) {
            this.showNotification('Task not found: ' + title, 'error');
            return;
        }
        this.tasks = this.tasks.filter(t => t.id !== task.id);
        this.saveToLocalStorage();
        this.showNotification('Task deleted via voice!', 'success');
    }

    async voiceCompleteTask(title) {
        if (!this.currentUser) {
            this.showNotification('Please log in to complete tasks.', 'error');
            return;
        }
        const task = this.tasks.find(t => t.title.toLowerCase() === title.toLowerCase());
        if (!task) {
            this.showNotification('Task not found: ' + title, 'error');
            return;
        }
        task.status = 'COMPLETED';
        task.completedAt = new Date().toISOString();
        this.saveToLocalStorage();
        this.showNotification('Task completed via voice!', 'success');
    }

    setupConversationalVoiceCreateTask() {
        const btn = document.getElementById('voice-create-task-btn');
        const listeningIndicator = document.getElementById('voice-listening-indicator');
        const beep = document.getElementById('voice-beep');
        if (!btn || !window.SpeechRecognition && !window.webkitSpeechRecognition) return;
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        let recognition = null;
        let step = 0;
        let title = '';
        let description = '';
        let retryStep = null;
        function showListening(show) {
            listeningIndicator.style.display = show ? 'block' : 'none';
            if (show) {
                app.showNotification('DEBUG: Listening started', 'info');
                console.log('DEBUG: Listening started');
            } else {
                app.showNotification('DEBUG: Listening stopped', 'info');
                console.log('DEBUG: Listening stopped');
            }
        }
        function playBeep() {
            if (beep) { beep.currentTime = 0; beep.play(); }
        }
        function askForStep(stepNum) {
            showListening(false);
            if (stepNum === 0) {
                btn.disabled = true;
                setTimeout(() => {
                    playBeep();
                    showListening(true);
                    recognition.start();
                }, 1200);
            } else if (stepNum === 1) {
                setTimeout(() => {
                    playBeep();
                    showListening(true);
                    recognition.start();
                }, 1200);
            }
        }
        btn.addEventListener('click', () => {
            // Always create a new recognition instance for each session
            if (recognition) {
                recognition.onresult = null;
                recognition.onerror = null;
                recognition.onend = null;
            }
            recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;
            // Reset state
            step = 0;
            title = '';
            description = '';
            retryStep = null;
            // Check which fields are already filled
            const titleInput = document.getElementById('task-title');
            const descInput = document.getElementById('task-description');
            title = titleInput && titleInput.value ? titleInput.value : '';
            description = descInput && descInput.value ? descInput.value : '';
            if (!title) {
                step = 0;
                this.showNotification('Voice task creation started. Please say the task title after the beep.', 'info');
                askForStep(0);
            } else if (!description) {
                step = 1;
                this.showNotification('Voice task creation: Please say the description after the beep.', 'info');
                askForStep(1);
            } else {
                this.showNotification('Both title and description are already filled.', 'info');
                btn.disabled = false;
            }
            recognition.onresult = (event) => {
                showListening(false);
                const transcript = event.results[0][0].transcript;
                app.showNotification('DEBUG: Recognized: ' + transcript, 'info');
                console.log('DEBUG: Recognized:', transcript);
                if (step === 0) {
                    title = transcript;
                    const titleInput = document.getElementById('task-title');
                    if (titleInput) {
                        titleInput.value = title;
                        app.showNotification('DEBUG: Title field filled', 'info');
                        console.log('DEBUG: Title field filled');
                    } else {
                        app.showNotification('DEBUG: Title input not found', 'error');
                        console.error('DEBUG: Title input not found');
                    }
                    this.showNotification('Title captured: ' + title + '. Now say the description after the beep.', 'info');
                    step = 1;
                    askForStep(1);
                } else if (step === 1) {
                    description = transcript;
                    const descInput = document.getElementById('task-description');
                    if (descInput) {
                        descInput.value = description;
                        app.showNotification('DEBUG: Description field filled', 'info');
                        console.log('DEBUG: Description field filled');
                    } else {
                        app.showNotification('DEBUG: Description input not found', 'error');
                        console.error('DEBUG: Description input not found');
                    }
                    this.showNotification('Description captured: ' + description + '.', 'success');
                    btn.disabled = false;
                }
            };
            recognition.onerror = (event) => {
                showListening(false);
                app.showNotification('DEBUG: Recognition error: ' + event.error, 'error');
                console.error('DEBUG: Recognition error:', event.error);
                this.showNotification('Voice recognition error: ' + event.error, 'error');
                // Show retry button
                this.showVoiceRetryDialog(() => {
                    askForStep(step);
                }, () => {
                    btn.disabled = false;
                });
            };
            recognition.onend = () => {
                showListening(false);
                app.showNotification('DEBUG: Recognition ended', 'info');
                console.log('DEBUG: Recognition ended');
                btn.disabled = false;
            };
        });
    }

    showVoiceConfirmDialog(title, description, onConfirm, onRetry) {
        // Simple confirm dialog using window.confirm for now
        if (window.confirm(`Create task with title: "${title}" and description: "${description}"?\nPress OK to submit, Cancel to retry description.`)) {
            onConfirm();
        } else {
            onRetry();
        }
    }

    showVoiceRetryDialog(onRetry, onCancel) {
        if (window.confirm('Voice recognition failed. Retry?')) {
            onRetry();
        } else {
            onCancel();
        }
    }

    loadFromLocalStorage() {
        const user = localStorage.getItem('currentUser');
        const tasks = localStorage.getItem('tasks');
        const categories = localStorage.getItem('categories');
        if (user) this.currentUser = JSON.parse(user);
        if (tasks) this.tasks = JSON.parse(tasks);
        if (categories) this.categories = JSON.parse(categories);
        
        // Initialize default categories if none exist
        if (!this.categories || this.categories.length === 0) {
            this.categories = [
                { id: '1', name: 'Work', description: 'Work-related tasks', color: '#007bff' },
                { id: '2', name: 'Personal', description: 'Personal tasks', color: '#28a745' },
                { id: '3', name: 'Shopping', description: 'Shopping tasks', color: '#ffc107' },
                { id: '4', name: 'Health', description: 'Health and fitness tasks', color: '#dc3545' }
            ];
            this.saveToLocalStorage();
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        localStorage.setItem('categories', JSON.stringify(this.categories));
    }

    showWelcomeMessage() {
        console.log('🚀 Smart Task Manager loaded with local storage!');
        this.checkVoiceRecognitionSupport();
    }

    checkVoiceRecognitionSupport() {
        const isSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
        if (!isSupported) {
            this.showNotification('Voice recognition not supported in this browser. Try Chrome, Edge, or Safari.', 'info');
        } else {
            console.log('✅ Voice recognition supported');
            
            // Check if running on localhost or HTTPS
            const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            if (!isSecure) {
                this.showNotification('Voice recognition works best with HTTPS or localhost. Use the local server for full functionality.', 'info');
                this.setupFileProtocolFallback();
            }
        }
    }

    setupFileProtocolFallback() {
        // Add a banner to help users
        const banner = document.createElement('div');
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ffc107;
            color: #000;
            padding: 10px;
            text-align: center;
            z-index: 9999;
            font-weight: bold;
        `;
        banner.innerHTML = `
            🎤 Voice recognition may not work properly. 
            <a href="http://localhost:8000" style="color: #007bff; text-decoration: underline;">Click here to use local server</a> 
            or run <code>run-node-server.bat</code>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; color: #000; font-size: 20px; cursor: pointer; margin-left: 10px;">×</button>
        `;
        document.body.appendChild(banner);
    }

    setupVoiceHelp() {
        const helpBtn = document.getElementById('voice-help-btn');
        if (!helpBtn) return;
        
        helpBtn.addEventListener('click', () => {
            this.showVoiceHelpModal();
        });
    }

    showVoiceHelpModal() {
        const modal = document.getElementById('modal-overlay');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        modalTitle.textContent = 'Voice Commands Help';
        modalBody.innerHTML = `
            <div style="max-height: 400px; overflow-y: auto;">
                <h4>Available Voice Commands:</h4>
                <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 1rem; padding: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                        <strong>"Add task [title] [description]"</strong><br>
                        <small>Example: "Add task buy groceries description milk and bread"</small>
                    </li>
                    <li style="margin-bottom: 1rem; padding: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                        <strong>"Edit task [old title] to [new title]"</strong><br>
                        <small>Example: "Edit task buy groceries to buy vegetables"</small>
                    </li>
                    <li style="margin-bottom: 1rem; padding: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                        <strong>"Delete task [title]"</strong><br>
                        <small>Example: "Delete task buy groceries"</small>
                    </li>
                    <li style="margin-bottom: 1rem; padding: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                        <strong>"Complete task [title]"</strong><br>
                        <small>Example: "Complete task buy groceries"</small>
                    </li>
                    <li style="margin-bottom: 1rem; padding: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                        <strong>"Show all tasks"</strong><br>
                        <small>Shows all tasks</small>
                    </li>
                    <li style="margin-bottom: 1rem; padding: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                        <strong>"Show completed tasks"</strong><br>
                        <small>Shows only completed tasks</small>
                    </li>
                    <li style="margin-bottom: 1rem; padding: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                        <strong>"Show pending tasks"</strong><br>
                        <small>Shows only pending tasks</small>
                    </li>
                </ul>
                
                <h4>Tips:</h4>
                <ul>
                    <li>Speak clearly and at a normal pace</li>
                    <li>Use the blue microphone button for voice commands</li>
                    <li>Use the microphone button next to description field for voice input</li>
                    <li>Make sure your microphone is enabled and working</li>
                    <li>Works best in Chrome, Edge, or Safari browsers</li>
                </ul>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-primary" onclick="closeModal()">Got it!</button>
            </div>
        `;
        
        modal.classList.remove('hidden');
    }

    setupEventListeners() {
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('register-form').addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('show-register').addEventListener('click', (e) => this.toggleAuthForm(e));
        document.getElementById('show-login').addEventListener('click', (e) => this.toggleAuthForm(e));
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });
        document.getElementById('create-task-form').addEventListener('submit', (e) => this.handleCreateTask(e));
        document.getElementById('task-search').addEventListener('input', (e) => this.handleSearch(e));
        document.getElementById('status-filter').addEventListener('change', (e) => this.handleFilter(e));
        document.getElementById('priority-filter').addEventListener('change', (e) => this.handleFilter(e));
        document.getElementById('profile-form').addEventListener('submit', (e) => this.handleUpdateProfile(e));
        document.getElementById('password-form').addEventListener('submit', (e) => this.handleChangePassword(e));
    }

    // --- AUTH ---
    checkAuthentication() {
        // Check if user is logged in from local storage
        if (this.currentUser) {
            this.showMainApp();
            this.updateUserInterface();
        } else {
        this.showAuthForm();
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        
        // Simple local authentication
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            this.currentUser = user;
                this.saveToLocalStorage();
                this.showMainApp();
                this.updateUserInterface();
                this.showNotification(`Welcome back, ${this.currentUser.fullName}!`, 'success');
            } else {
                this.showNotification('Invalid username or password', 'error');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const fullName = document.getElementById('register-fullname').value.trim();
        const username = document.getElementById('register-username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        
        // Check if username already exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.username === username)) {
            this.showNotification('Username already exists', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            id: this.generateId(),
            fullName,
            username,
            email,
            password,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
                this.showNotification('Registration successful! Please log in with your new credentials.', 'success');
                // Switch to login form
                document.getElementById('register-form').classList.add('hidden');
                document.getElementById('login-form').classList.remove('hidden');
    }

    logout() {
        this.currentUser = null;
        this.tasks = [];
        this.categories = [];
        localStorage.removeItem('currentUser');
        localStorage.removeItem('tasks');
        localStorage.removeItem('categories');
        this.showAuthForm();
        this.showNotification('Logged out successfully', 'info');
    }

    toggleAuthForm(e) {
        e.preventDefault();
        document.getElementById('login-form').classList.toggle('hidden');
        document.getElementById('register-form').classList.toggle('hidden');
    }

    // --- NAVIGATION ---
    handleNavigation(e) {
        const view = e.currentTarget.dataset.view;
        this.showView(view);
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        e.currentTarget.classList.add('active');
    }

    showView(viewName) {
        this.currentView = viewName;
        document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) targetView.classList.add('active');
        this.loadViewData(viewName);
    }

    loadViewData(viewName) {
        switch (viewName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'tasks':
                this.renderTasks(this.tasks);
                this.populateCategorySelect();
                break;
            case 'categories':
                this.renderCategories();
                break;
            case 'profile':
                this.loadProfile();
                break;
        }
    }

    // --- TASKS ---
    handleCreateTask(e) {
        e.preventDefault();
        const title = document.getElementById('task-title').value.trim();
        const description = document.getElementById('task-description').value.trim();
        const priority = document.getElementById('task-priority').value;
        const categoryId = document.getElementById('task-category').value;
        const dueDate = document.getElementById('task-due-date').value;
        
        if (!title) {
            this.showNotification('Task title is required', 'error');
            return;
        }
        
        const newTask = {
            id: this.generateId(),
            title,
            description,
            priority,
            status: 'PENDING',
            categoryId: categoryId || null,
            dueDate: dueDate || null,
            userId: this.currentUser.id,
            createdAt: new Date().toISOString()
        };
        
        this.tasks.push(newTask);
                this.saveToLocalStorage();
                this.showNotification('Task created successfully!', 'success');
                this.showView('dashboard');
                document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
                document.querySelector('[data-view="dashboard"]').classList.add('active');
        
        e.target.reset();
    }

    renderTasks(tasks) {
        const container = document.getElementById('tasks-container');
        if (tasks.length === 0) {
            container.innerHTML = '<p class="no-tasks">No tasks found. Create your first task!</p>';
            return;
        }
        container.innerHTML = tasks.map(task => this.createTaskCard(task)).join('');
    }

    createTaskCard(task) {
        const category = this.categories.find(cat => cat.id === task.categoryId);
        const isOverdue = this.isTaskOverdue(task);
        const statusClass = task.status.toLowerCase().replace('_', '-');
        const priorityClass = task.priority.toLowerCase();
        return `
            <div class="task-card ${task.status === 'COMPLETED' ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}">
                <div class="task-header">
                    <div>
                        <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
                        ${task.description ? `<p class="task-description">${this.escapeHtml(task.description)}</p>` : ''}
                    </div>
                    <div class="task-actions">
                        ${task.status !== 'COMPLETED' ? 
                            `<button class="btn btn-primary" onclick="app.completeTask('${task.id}')">
                                <i class="fas fa-check"></i> Complete
                            </button>` : ''
                        }
                        <button class="btn btn-outline" onclick="app.editTask('${task.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger" onclick="app.deleteTask('${task.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
                <div class="task-meta">
                    <span class="task-priority ${priorityClass}">${task.priority}</span>
                    <span class="task-status ${statusClass}">${task.status.replace('_', ' ')}</span>
                    ${category ? `<span class="task-category">${category.name}</span>` : ''}
                    ${task.dueDate ? `<span class="task-due-date">Due: ${this.formatDate(task.dueDate)}</span>` : ''}
                </div>
            </div>
        `;
    }

    completeTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = 'COMPLETED';
            task.completedAt = new Date().toISOString();
            this.saveToLocalStorage();
            this.showNotification('Task marked as complete!', 'success');
            this.renderTasks(this.tasks);
        }
    }

    updateTask(task) {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
            this.tasks[index] = task;
        this.saveToLocalStorage();
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveToLocalStorage();
            this.showNotification('Task deleted successfully!', 'success');
            this.renderTasks(this.tasks);
        }
    }

    editTask(taskId) {
        this.showNotification('Edit functionality coming soon!', 'info');
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredTasks = this.tasks.filter(task => 
            task.title.toLowerCase().includes(searchTerm) ||
            (task.description && task.description.toLowerCase().includes(searchTerm))
        );
        this.renderTasks(filteredTasks);
    }

    handleFilter(e) {
        const statusFilter = document.getElementById('status-filter').value;
        const priorityFilter = document.getElementById('priority-filter').value;
        let filtered = this.tasks;
        if (statusFilter) filtered = filtered.filter(task => task.status === statusFilter);
        if (priorityFilter) filtered = filtered.filter(task => task.priority === priorityFilter);
        this.renderTasks(filtered);
    }

    // --- CATEGORIES ---
    renderCategories() {
        const container = document.getElementById('categories-container');
        container.innerHTML = this.categories.map(category => this.createCategoryCard(category)).join('');
    }

    createCategoryCard(category) {
        const categoryTasks = this.tasks.filter(task => task.categoryId === category.id);
        return `
            <div class="category-card" style="border-left-color: ${category.color}">
                <div class="category-header">
                    <h3 class="category-name">${category.name}</h3>
                    <div class="category-actions">
                    <span class="category-count">${categoryTasks.length} tasks</span>
                        <button class="btn btn-danger btn-sm" onclick="app.deleteCategory('${category.id}')" title="Delete Category">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p class="category-description">${category.description}</p>
                <div class="category-stats">
                    <span>${categoryTasks.filter(t => t.status === 'COMPLETED').length} completed</span>
                    <span>${categoryTasks.filter(t => t.status === 'PENDING').length} pending</span>
                </div>
            </div>
        `;
    }

    populateCategorySelect() {
        const select = document.getElementById('task-category');
        select.innerHTML = '<option value="">No Category</option>' +
            this.categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
    }

    // Category management functions
    showAddCategoryModal() {
        const modal = document.getElementById('modal-overlay');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        modalTitle.textContent = 'Add New Category';
        modalBody.innerHTML = `
            <form id="add-category-form">
                <div class="form-group">
                    <label for="category-name">Category Name</label>
                    <input type="text" id="category-name" required>
                </div>
                <div class="form-group">
                    <label for="category-description">Description</label>
                    <textarea id="category-description" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label for="category-color">Color</label>
                    <input type="color" id="category-color" value="#007bff">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Add Category</button>
                </div>
            </form>
        `;
        
        modal.classList.remove('hidden');
        
        // Add event listener for the form
        document.getElementById('add-category-form').addEventListener('submit', (e) => this.handleAddCategory(e));
    }

    handleAddCategory(e) {
        e.preventDefault();
        const name = document.getElementById('category-name').value.trim();
        const description = document.getElementById('category-description').value.trim();
        const color = document.getElementById('category-color').value;
        
        if (!name) {
            this.showNotification('Category name is required', 'error');
            return;
        }
        
        // Check if category name already exists
        if (this.categories.find(cat => cat.name.toLowerCase() === name.toLowerCase())) {
            this.showNotification('Category name already exists', 'error');
            return;
        }
        
        const newCategory = {
            id: this.generateId(),
            name,
            description: description || 'No description',
            color
        };
        
        this.categories.push(newCategory);
        this.saveToLocalStorage();
        this.showNotification('Category added successfully!', 'success');
        this.renderCategories();
        this.populateCategorySelect();
        closeModal();
    }

    deleteCategory(categoryId) {
        if (confirm('Are you sure you want to delete this category? Tasks in this category will become uncategorized.')) {
            // Remove category from tasks
            this.tasks.forEach(task => {
                if (task.categoryId === categoryId) {
                    task.categoryId = null;
                }
            });
            
            // Remove category
            this.categories = this.categories.filter(cat => cat.id !== categoryId);
            this.saveToLocalStorage();
            this.showNotification('Category deleted successfully!', 'success');
            this.renderCategories();
            this.populateCategorySelect();
        }
    }

    // --- PROFILE ---
    loadProfile() {
        document.getElementById('profile-fullname').value = this.currentUser.fullName;
        document.getElementById('profile-email').value = this.currentUser.email;
        document.getElementById('profile-username').value = this.currentUser.username;
    }

    handleUpdateProfile(e) {
        e.preventDefault();
        const fullName = document.getElementById('profile-fullname').value.trim();
        const email = document.getElementById('profile-email').value.trim();
        
        this.currentUser.fullName = fullName;
        this.currentUser.email = email;
        
        // Update in users array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = this.currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        this.saveToLocalStorage();
        this.showNotification('Profile updated successfully!', 'success');
    }

    handleChangePassword(e) {
        e.preventDefault();
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (currentPassword !== this.currentUser.password) {
            this.showNotification('Current password is incorrect', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            this.showNotification('New passwords do not match', 'error');
            return;
        }
        
        this.currentUser.password = newPassword;
        
        // Update in users array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = this.currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        this.saveToLocalStorage();
        this.showNotification('Password changed successfully!', 'success');
        e.target.reset();
    }

    // --- DASHBOARD ---
    loadDashboard() {
        const stats = this.calculateStats(this.tasks);
        this.updateStatistics(stats);
        this.loadRecentTasks(this.tasks);
        this.renderStreakBar();
    }

    calculateStats(tasks) {
        const total = tasks.length;
        const completed = tasks.filter(task => task.status === 'COMPLETED').length;
        const pending = tasks.filter(task => task.status === 'PENDING').length;
        const overdue = tasks.filter(task => this.isTaskOverdue(task)).length;
        return {
            total,
            completed,
            pending,
            overdue,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }

    updateStatistics(stats) {
        document.getElementById('total-tasks').textContent = stats.total;
        document.getElementById('completed-tasks').textContent = stats.completed;
        document.getElementById('pending-tasks').textContent = stats.pending;
        document.getElementById('overdue-tasks').textContent = stats.overdue;
    }

    loadRecentTasks(tasks) {
        const recentTasks = tasks
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
        const container = document.getElementById('recent-tasks');
        container.innerHTML = recentTasks.length > 0 
            ? recentTasks.map(task => this.createTaskCard(task)).join('')
            : '<p class="no-tasks">No tasks yet. Create your first task!</p>';
    }

    // --- STREAK SYSTEM ---
    renderStreakBar() {
        const streakBar = document.getElementById('streak-bar');
        if (!streakBar) return;
        // Get all completed task dates (as yyyy-mm-dd)
        const completedDates = this.tasks
            .filter(t => t.status === 'COMPLETED' && t.completedAt)
            .map(t => t.completedAt.slice(0, 10));
        const uniqueDates = Array.from(new Set(completedDates));
        // Sort dates descending
        uniqueDates.sort((a, b) => b.localeCompare(a));
        // Calculate streak: consecutive days ending today
        let streak = 0;
        let current = new Date();
        for (let i = 0; i < uniqueDates.length; i++) {
            const dateStr = uniqueDates[i];
            const date = new Date(dateStr);
            // Compare only yyyy-mm-dd
            if (date.toISOString().slice(0, 10) === current.toISOString().slice(0, 10)) {
                streak++;
                // Move to previous day
                current.setDate(current.getDate() - 1);
            } else {
                break;
            }
        }
        // Render streak visually (e.g., fire icon for each day)
        let html = '';
        for (let i = 0; i < streak; i++) {
            html += '<span class="streak-fire" title="Day ' + (i+1) + '">🔥</span>';
        }
        html += `<span class="streak-count">${streak} day${streak === 1 ? '' : 's'} streak</span>`;
        streakBar.innerHTML = html;
    }

    // --- UTILS ---
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    isTaskOverdue(task) {
        if (!task.dueDate || task.status === 'COMPLETED') return false;
        return new Date(task.dueDate) < new Date();
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // --- UI ---
    showAuthForm() {
        document.getElementById('auth-section').classList.remove('hidden');
        document.getElementById('main-section').classList.add('hidden');
    }

    showMainApp() {
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('main-section').classList.remove('hidden');
    }

    updateUserInterface() {
        if (this.currentUser) {
            document.getElementById('user-name').textContent = this.currentUser.fullName;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentElement) notification.remove();
        }, 3000);
    }
}

window.showView = function(viewName) { app.showView(viewName); };
window.closeModal = function() { document.getElementById('modal-overlay').classList.add('hidden'); };
window.showAddCategoryModal = function() { app.showAddCategoryModal(); };
const app = new TaskManagerApp();

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-content button {
        background: none;
        border: none;
        color: white;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .no-tasks {
        text-align: center;
        color: #666;
        font-style: italic;
        padding: 2rem;
    }
    
    /* Keyboard shortcuts hint */
    .keyboard-hints {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.75rem;
        z-index: 1000;
    }
`;
document.head.appendChild(style);

// Add keyboard shortcuts hint
const keyboardHints = document.createElement('div');
keyboardHints.className = 'keyboard-hints';
keyboardHints.innerHTML = '⌨️ Ctrl+N: New Task | Ctrl+L: Logout | Esc: Dashboard';
document.body.appendChild(keyboardHints); 