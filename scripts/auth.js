// Authentication System
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('users') || '{}');
        this.init();
    }

    init() {
        this.checkAuthState();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Modal dışına tıklama ile kapatma
        document.getElementById('authModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'authModal') {
                this.closeAuthModal();
            }
        });
    }

    checkAuthState() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUI();
        }
    }

    showLoginModal() {
        this.showAuthModal('login');
    }

    showSignupModal() {
        this.showAuthModal('signup');
    }

    showAuthModal(type = 'login') {
        const modal = document.getElementById('authModal');
        const authForms = document.getElementById('authForms');
        
        authForms.innerHTML = this.getAuthFormHTML(type);
        modal.style.display = 'block';
        
        // Tab switching
        this.setupAuthTabs();
        
        // Form submission
        this.setupAuthForm(type);
    }

    closeAuthModal() {
        document.getElementById('authModal').style.display = 'none';
    }

    getAuthFormHTML(type) {
        return `
            <div class="auth-form">
                <div class="auth-tabs">
                    <button class="auth-tab ${type === 'login' ? 'active' : ''}" data-tab="login">Giriş Yap</button>
                    <button class="auth-tab ${type === 'signup' ? 'active' : ''}" data-tab="signup">Kayıt Ol</button>
                </div>
                
                <form id="authForm" class="auth-form-content">
                    <h2>${type === 'login' ? 'Hesabına Giriş Yap' : 'Yeni Hesap Oluştur'}</h2>
                    
                    <div id="authMessage"></div>
                    
                    ${type === 'signup' ? `
                    <div class="form-group">
                        <label for="fullName">Ad Soyad</label>
                        <input type="text" id="fullName" required>
                    </div>
                    ` : ''}
                    
                    <div class="form-group">
                        <label for="email">E-posta</label>
                        <input type="email" id="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Şifre</label>
                        <input type="password" id="password" required 
                               minlength="6" placeholder="${type === 'signup' ? 'En az 6 karakter' : ''}">
                    </div>
                    
                    ${type === 'signup' ? `
                    <div class="form-group">
                        <label for="confirmPassword">Şifre Tekrar</label>
                        <input type="password" id="confirmPassword" required>
                    </div>
                    ` : ''}
                    
                    <button type="submit" class="auth-submit-btn">
                        ${type === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
                    </button>
                    
                    <div class="auth-footer">
                        ${type === 'login' ? 
                            'Hesabın yok mu? <a href="#" onclick="showSignupModal()">Kayıt Ol</a>' : 
                            'Zaten hesabın var mı? <a href="#" onclick="showLoginModal()">Giriş Yap</a>'
                        }
                    </div>
                </form>
            </div>
        `;
    }

    setupAuthTabs() {
        const tabs = document.querySelectorAll('.auth-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabType = tab.dataset.tab;
                this.showAuthModal(tabType);
            });
        });
    }

    setupAuthForm(type) {
        const form = document.getElementById('authForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (type === 'login') {
                this.login();
            } else {
                this.signup();
            }
        });
    }

    signup() {
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value.toLowerCase();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validasyon
        if (password !== confirmPassword) {
            this.showAuthMessage('Şifreler eşleşmiyor!', 'error');
            return;
        }

        if (password.length < 6) {
            this.showAuthMessage('Şifre en az 6 karakter olmalı!', 'error');
            return;
        }

        if (this.users[email]) {
            this.showAuthMessage('Bu e-posta adresi zaten kullanılıyor!', 'error');
            return;
        }

        // Kullanıcı oluştur
        this.users[email] = {
            id: this.generateUserId(),
            fullName,
            email,
            password: this.hashPassword(password),
            createdAt: new Date().toISOString(),
            calendar: {
                events: [],
                settings: {}
            }
        };

        localStorage.setItem('users', JSON.stringify(this.users));
        this.showAuthMessage('Kayıt başarılı! Giriş yapabilirsiniz.', 'success');
        
        // 2 saniye sonra login sayfasına geç
        setTimeout(() => {
            this.showAuthModal('login');
        }, 2000);
    }

    login() {
        const email = document.getElementById('email').value.toLowerCase();
        const password = document.getElementById('password').value;

        const user = this.users[email];
        
        if (!user || user.password !== this.hashPassword(password)) {
            this.showAuthMessage('E-posta veya şifre hatalı!', 'error');
            return;
        }

        // Giriş başarılı
        this.currentUser = {
            id: user.id,
            fullName: user.fullName,
            email: user.email
        };

        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.closeAuthModal();
        this.updateUI();
        this.showAuthMessage(`Hoş geldin, ${user.fullName}!`, 'success', 3000);
    }

    logout() {
        // Tool container'ı temizle (eğer takvim açıksa)
        const toolContainer = document.getElementById('tool-container');
        if (toolContainer) {
            toolContainer.innerHTML = '';
        }
        
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUI();
        this.showAuthMessage('Başarıyla çıkış yapıldı.', 'success', 3000);
    }

    updateUI() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        const calendarTool = document.getElementById('calendarTool');
        const userGreeting = document.getElementById('userGreeting');
        const toolContainer = document.getElementById('tool-container');

        if (this.currentUser) {
            // Kullanıcı giriş yapmış
            authButtons.style.display = 'none';
            userMenu.style.display = 'flex';
            calendarTool.style.display = 'block';
            userGreeting.textContent = `Merhaba, ${this.currentUser.fullName}`;
        } else {
            // Kullanıcı çıkış yapmış
            authButtons.style.display = 'flex';
            userMenu.style.display = 'none';
            calendarTool.style.display = 'none';
            
            // Eğer takvim açıksa, tool container'ı temizle
            if (toolContainer && toolContainer.innerHTML.includes('calendar')) {
                toolContainer.innerHTML = '';
            }
        }
    }

    showAuthMessage(message, type = 'info', duration = 5000) {
        const messageDiv = document.getElementById('authMessage');
        messageDiv.innerHTML = `<div class="auth-message ${type}">${message}</div>`;
        
        if (duration > 0) {
            setTimeout(() => {
                messageDiv.innerHTML = '';
            }, duration);
        }
    }

    hashPassword(password) {
        // Basit hash fonksiyonu (gerçek uygulamada daha güvenli hash kullanın)
        return btoa(password + 'mini-tools-salt');
    }

    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getUserData() {
        if (!this.currentUser) return null;
        return this.users[this.currentUser.email];
    }

    saveUserData(userData) {
        if (!this.currentUser) return;
        
        this.users[this.currentUser.email] = {
            ...this.users[this.currentUser.email],
            ...userData
        };
        
        localStorage.setItem('users', JSON.stringify(this.users));
    }
}

// Global auth instance
const auth = new AuthSystem();

// Global functions for HTML onclick events
function showLoginModal() {
    auth.showLoginModal();
}

function showSignupModal() {
    auth.showSignupModal();
}

function closeAuthModal() {
    auth.closeAuthModal();
}

function logout() {
    auth.logout();
}