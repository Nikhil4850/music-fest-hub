// Authentication Manager - Handles login state across all pages
class AuthManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    init() {
        // Refresh current user from localStorage
        this.currentUser = this.getCurrentUser();
        this.updateNavigation();
        this.setupAuthListeners();
        
        // Debug logging
        console.log('Auth Manager initialized, current user:', this.currentUser);
    }

    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    updateNavigation() {
        const authNavItem = document.getElementById('authNavItem');
        
        if (!authNavItem) {
            // Try again after a short delay if elements not found
            setTimeout(() => this.updateNavigation(), 100);
            return;
        }

        console.log('Updating navigation, current user:', this.currentUser);

        if (this.currentUser && this.currentUser.isLoggedIn) {
            // User is logged in - show profile dropdown
            this.createUserDropdown(authNavItem);
        } else {
            // User is not logged in - show login link
            if (authNavItem.closest('.user-profile')) {
                // For events page structure
                authNavItem.innerHTML = `
                    <a href="login.html" id="authNavLink">
                        <i class="fas fa-user-circle"></i>
                        <span>Login</span>
                    </a>
                `;
            } else {
                // For index page structure
                authNavItem.innerHTML = `<a href="login.html" class="nav-link" id="authNavLink">Login</a>`;
            }
        }
    }

    createUserDropdown(authNavItem) {
        // Create dropdown menu
        const dropdown = document.createElement('div');
        dropdown.className = 'user-dropdown';
        dropdown.innerHTML = `
            <div class="dropdown-content">
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <span class="user-name">${this.currentUser.name || 'User'}</span>
                        <span class="user-email">${this.currentUser.email}</span>
                    </div>
                </div>
                <div class="dropdown-divider"></div>
                <a href="profile.html" class="dropdown-item">
                    <i class="fas fa-user"></i>
                    My Profile
                </a>
                <a href="#my-bookings" class="dropdown-item">
                    <i class="fas fa-ticket-alt"></i>
                    My Bookings
                </a>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item logout-btn" onclick="authManager.logout()">
                    <i class="fas fa-sign-out-alt"></i>
                    Logout
                </button>
            </div>
        `;

        // Add dropdown styles
        this.addDropdownStyles();

        // Replace the auth nav item with dropdown
        if (authNavItem.closest('.user-profile')) {
            // For events page structure
            authNavItem.innerHTML = `
                <div class="user-nav-dropdown">
                    <button class="user-nav-btn" onclick="authManager.toggleDropdown()">
                        <i class="fas fa-user-circle"></i>
                        <span>${this.currentUser.name || 'Profile'}</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    ${dropdown.outerHTML}
                </div>
            `;
        } else {
            // For index page structure
            authNavItem.innerHTML = `
                <div class="user-nav-dropdown">
                    <button class="user-nav-btn nav-link" onclick="authManager.toggleDropdown()">
                        <i class="fas fa-user-circle"></i>
                        <span>${this.currentUser.name || 'Profile'}</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    ${dropdown.outerHTML}
                </div>
            `;
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-nav-dropdown')) {
                this.closeDropdown();
            }
        });
    }

    addDropdownStyles() {
        if (document.getElementById('auth-dropdown-styles')) return;

        const style = document.createElement('style');
        style.id = 'auth-dropdown-styles';
        style.textContent = `
            .user-nav-dropdown {
                position: relative;
            }

            .user-nav-btn {
                background: none;
                border: none;
                color: #ffffff;
                font-size: 1rem;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                transition: all 0.3s ease;
            }

            .user-nav-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                color: #667eea;
            }

            .user-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                margin-top: 0.5rem;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                min-width: 250px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                z-index: 1000;
            }

            .user-dropdown.active {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .dropdown-content {
                padding: 1rem;
            }

            .user-info {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1rem;
            }

            .user-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.2rem;
            }

            .user-details {
                display: flex;
                flex-direction: column;
            }

            .user-name {
                font-weight: 600;
                color: #333;
                font-size: 0.95rem;
            }

            .user-email {
                font-size: 0.8rem;
                color: #666;
            }

            .dropdown-divider {
                height: 1px;
                background: rgba(0, 0, 0, 0.1);
                margin: 0.5rem 0;
            }

            .dropdown-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem;
                color: #333;
                text-decoration: none;
                border-radius: 8px;
                transition: all 0.3s ease;
                cursor: pointer;
                border: none;
                background: none;
                width: 100%;
                text-align: left;
                font-size: 0.9rem;
            }

            .dropdown-item:hover {
                background: rgba(102, 126, 234, 0.1);
                color: #667eea;
            }

            .dropdown-item.logout-btn {
                color: #dc2626;
            }

            .dropdown-item.logout-btn:hover {
                background: rgba(220, 38, 38, 0.1);
                color: #dc2626;
            }

            @media (max-width: 768px) {
                .user-dropdown {
                    right: -1rem;
                    left: -1rem;
                    min-width: auto;
                }
            }
        `;
        document.head.appendChild(style);
    }

    toggleDropdown() {
        const dropdown = document.querySelector('.user-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }

    closeDropdown() {
        const dropdown = document.querySelector('.user-dropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    }

    setupAuthListeners() {
        // Listen for login/logout events
        window.addEventListener('storage', (e) => {
            if (e.key === 'currentUser') {
                this.currentUser = this.getCurrentUser();
                this.updateNavigation();
            }
        });

        // Listen for custom auth events
        window.addEventListener('authStateChanged', () => {
            this.currentUser = this.getCurrentUser();
            this.updateNavigation();
        });
    }

    login(userData) {
        this.currentUser = userData;
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('authStateChanged'));
        
        // Force navigation update
        setTimeout(() => {
            this.updateNavigation();
        }, 50);
    }

    logout() {
        const confirmed = confirm('Are you sure you want to logout?');
        if (!confirmed) return;

        localStorage.removeItem('currentUser');
        this.currentUser = null;
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('authStateChanged'));
        
        this.updateNavigation();
        
        // Show success message if showMessage function exists
        if (typeof showMessage === 'function') {
            showMessage('Logged out successfully. Redirecting...', 'success');
        }

        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    isLoggedIn() {
        return !!this.currentUser;
    }

    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
}

// Global auth manager instance
let authManager;

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    authManager = new AuthManager();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!authManager) {
            authManager = new AuthManager();
        }
    });
} else {
    // DOM is already loaded
    if (!authManager) {
        authManager = new AuthManager();
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
