// Profile Page JavaScript
class ProfileManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    init() {
        if (!this.currentUser) {
            // Redirect to login if not authenticated
            window.location.href = 'login.html';
            return;
        }

        this.initializeNavigation();
        this.initializeForms();
        this.loadUserData();
        this.loadBookings();
        this.setupEventListeners();
    }

    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    initializeNavigation() {
        const navItems = document.querySelectorAll('.profile-nav-item:not(.logout-btn)');
        const sections = document.querySelectorAll('.profile-section');

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const sectionId = item.dataset.section;
                
                // Update active nav item
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Show corresponding section
                sections.forEach(section => section.classList.remove('active'));
                document.getElementById(sectionId).classList.add('active');
            });
        });

        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });
    }

    initializeForms() {
        // Personal Info Form
        document.getElementById('personalInfoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePersonalInfo(e.target);
        });

        // Preferences Form
        document.getElementById('preferencesForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePreferences(e.target);
        });

        // Security Form
        document.getElementById('securityForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updatePassword(e.target);
        });
    }

    setupEventListeners() {
        // Avatar change
        document.getElementById('changeAvatarBtn').addEventListener('click', () => {
            document.getElementById('avatarInput').click();
        });

        document.getElementById('avatarInput').addEventListener('change', (e) => {
            this.handleAvatarChange(e);
        });

        // Delete account
        document.getElementById('deleteAccountBtn').addEventListener('click', () => {
            this.deleteAccount();
        });

        // Mobile menu toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
    }

    async loadUserData() {
        try {
            // Try to load from API first
            const response = await window.apiService.getUserProfile();
            
            if (response.success && response.data && response.data.user) {
                const userData = response.data.user;
                
                // Load personal information
                if (userData.firstName) document.getElementById('firstName').value = userData.firstName;
                if (userData.lastName) document.getElementById('lastName').value = userData.lastName;
                if (userData.name) document.getElementById('email').value = userData.email || this.currentUser.email;
                if (userData.phone) document.getElementById('phone').value = userData.phone;
                if (userData.dateOfBirth) document.getElementById('dateOfBirth').value = userData.dateOfBirth.split('T')[0]; // Format date for input
                if (userData.bio) document.getElementById('bio').value = userData.bio;
                if (userData.location) document.getElementById('location').value = userData.location;

                // Load avatar
                if (userData.avatar) {
                    const avatarElement = document.getElementById('profileAvatar');
                    avatarElement.innerHTML = `<img src="${userData.avatar}" alt="Profile Avatar">`;
                }

                // Load preferences
                if (userData.preferences) {
                    // Load genres
                    if (userData.preferences.genres) {
                        userData.preferences.genres.forEach(genre => {
                            const checkbox = document.querySelector(`input[name="genres"][value="${genre}"]`);
                            if (checkbox) checkbox.checked = true;
                        });
                    }

                    // Load notification preferences
                    if (userData.preferences.notifications) {
                        const notifications = userData.preferences.notifications;
                        if (notifications.emailNotifications !== undefined) {
                            document.getElementById('emailNotifications').checked = notifications.emailNotifications;
                        }
                        if (notifications.smsNotifications !== undefined) {
                            document.getElementById('smsNotifications').checked = notifications.smsNotifications;
                        }
                        if (notifications.eventRecommendations !== undefined) {
                            document.getElementById('eventRecommendations').checked = notifications.eventRecommendations;
                        }
                    }
                }
            } else {
                throw new Error('Failed to load profile from API');
            }
        } catch (error) {
            console.error('Failed to load profile from API, falling back to local storage:', error);
            
            // Fallback to local storage
            const userData = this.getUserData();
            
            // Load personal information from local storage
            if (userData.firstName) document.getElementById('firstName').value = userData.firstName;
            if (userData.lastName) document.getElementById('lastName').value = userData.lastName;
            if (userData.email) document.getElementById('email').value = userData.email;
            if (userData.phone) document.getElementById('phone').value = userData.phone;
            if (userData.dateOfBirth) document.getElementById('dateOfBirth').value = userData.dateOfBirth;
            if (userData.bio) document.getElementById('bio').value = userData.bio;
            if (userData.location) document.getElementById('location').value = userData.location;

            // Load avatar from local storage
            if (userData.avatar) {
                const avatarElement = document.getElementById('profileAvatar');
                avatarElement.innerHTML = `<img src="${userData.avatar}" alt="Profile Avatar">`;
            }

            // Load preferences from local storage
            if (userData.preferences) {
                // Load genres
                if (userData.preferences.genres) {
                    userData.preferences.genres.forEach(genre => {
                        const checkbox = document.querySelector(`input[name="genres"][value="${genre}"]`);
                        if (checkbox) checkbox.checked = true;
                    });
                }

                // Load notification preferences
                if (userData.preferences.notifications) {
                    const notifications = userData.preferences.notifications;
                    if (notifications.emailNotifications !== undefined) {
                        document.getElementById('emailNotifications').checked = notifications.emailNotifications;
                    }
                    if (notifications.smsNotifications !== undefined) {
                        document.getElementById('smsNotifications').checked = notifications.smsNotifications;
                    }
                    if (notifications.eventRecommendations !== undefined) {
                        document.getElementById('eventRecommendations').checked = notifications.eventRecommendations;
                    }
                }
            }
        }

        // Load bookings
        this.loadBookings();
    }

    getUserData() {
        const userData = localStorage.getItem(`userData_${this.currentUser.email}`);
        return userData ? JSON.parse(userData) : {};
    }

    saveUserData(data) {
        const existingData = this.getUserData();
        const updatedData = { ...existingData, ...data };
        localStorage.setItem(`userData_${this.currentUser.email}`, JSON.stringify(updatedData));
    }

    async savePersonalInfo(form) {
        const formData = new FormData(form);
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            dateOfBirth: formData.get('dateOfBirth'),
            bio: formData.get('bio'),
            location: formData.get('location')
        };

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.querySelector('span').textContent;
        submitBtn.querySelector('span').textContent = 'Saving...';
        submitBtn.disabled = true;

        try {
            // Use API service to update profile
            const response = await window.apiService.updateUserProfile(data);
            
            if (response.success) {
                // Update local storage for backward compatibility
                this.saveUserData(data);
                
                // Update current user email if changed
                if (data.email !== this.currentUser.email) {
                    this.currentUser.email = data.email;
                    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                }

                this.showMessage('Personal information updated successfully!', 'success');
            } else {
                throw new Error(response.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            this.showMessage('Failed to update profile. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.querySelector('span').textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async savePreferences(form) {
        const formData = new FormData(form);
        
        // Get selected genres
        const genres = [];
        document.querySelectorAll('input[name="genres"]:checked').forEach(checkbox => {
            genres.push(checkbox.value);
        });

        // Get notification preferences
        const preferences = {
            genres: genres,
            notifications: {
                emailNotifications: document.getElementById('emailNotifications').checked,
                smsNotifications: document.getElementById('smsNotifications').checked,
                eventRecommendations: document.getElementById('eventRecommendations').checked
            }
        };

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.querySelector('span').textContent;
        submitBtn.querySelector('span').textContent = 'Saving...';
        submitBtn.disabled = true;

        try {
            // Use API service to update preferences
            const response = await window.apiService.updateUserProfile({ preferences });
            
            if (response.success) {
                // Update local storage for backward compatibility
                this.saveUserData({ preferences });
                this.showMessage('Preferences updated successfully!', 'success');
            } else {
                throw new Error(response.message || 'Failed to update preferences');
            }
        } catch (error) {
            console.error('Preferences update error:', error);
            this.showMessage('Failed to update preferences. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.querySelector('span').textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async updatePassword(form) {
        const formData = new FormData(form);
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmNewPassword = formData.get('confirmNewPassword');

        // Validation
        if (newPassword !== confirmNewPassword) {
            this.showMessage('New passwords do not match!', 'error');
            return;
        }

        if (newPassword.length < 6) {
            this.showMessage('Password must be at least 6 characters long!', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.querySelector('span').textContent;
        submitBtn.querySelector('span').textContent = 'Updating...';
        submitBtn.disabled = true;

        try {
            // Use API service to update password
            const response = await window.apiService.updateUserPassword({
                currentPassword,
                newPassword
            });
            
            if (response.success) {
                // Update local storage for backward compatibility
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const userIndex = users.findIndex(u => u.email === this.currentUser.email);
                
                if (userIndex !== -1) {
                    users[userIndex].password = newPassword;
                    localStorage.setItem('users', JSON.stringify(users));
                }

                // Reset form
                form.reset();
                this.showMessage('Password updated successfully!', 'success');
            } else {
                throw new Error(response.message || 'Failed to update password');
            }
        } catch (error) {
            console.error('Password update error:', error);
            this.showMessage('Failed to update password. Please check your current password and try again.', 'error');
        } finally {
            // Reset button
            submitBtn.querySelector('span').textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleAvatarChange(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showMessage('Please select a valid image file!', 'error');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showMessage('Image size must be less than 5MB!', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const avatarData = e.target.result;
            
            try {
                // Use API service to update avatar
                const response = await window.apiService.updateUserAvatar(avatarData);
                
                if (response.success) {
                    const avatarElement = document.getElementById('profileAvatar');
                    avatarElement.innerHTML = `<img src="${avatarData}" alt="Profile Avatar">`;
                    
                    // Save avatar data locally for backward compatibility
                    this.saveUserData({ avatar: avatarData });
                    this.showMessage('Profile photo updated successfully!', 'success');
                } else {
                    throw new Error(response.message || 'Failed to update avatar');
                }
            } catch (error) {
                console.error('Avatar update error:', error);
                this.showMessage('Failed to update profile photo. Please try again.', 'error');
            }
        };
        reader.readAsDataURL(file);
    }

    loadBookings() {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const userBookings = bookings.filter(booking => 
            booking.email === this.currentUser.email
        );

        const container = document.getElementById('bookingsContainer');

        if (userBookings.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No Bookings Yet</h3>
                    <p>You haven't booked any tickets yet. Explore our upcoming events!</p>
                    <a href="events.html" class="cta-button primary">
                        <span>Browse Events</span>
                        <div class="button-glow"></div>
                    </a>
                </div>
            `;
            return;
        }

        container.innerHTML = userBookings.map(booking => `
            <div class="booking-card">
                <div class="booking-header">
                    <h3>${booking.eventName}</h3>
                    <span class="booking-status ${booking.status}">${booking.status}</span>
                </div>
                <div class="booking-details">
                    <div class="booking-detail">
                        <label>Date</label>
                        <span>${new Date(booking.eventDate).toLocaleDateString()}</span>
                    </div>
                    <div class="booking-detail">
                        <label>Venue</label>
                        <span>${booking.eventVenue}</span>
                    </div>
                    <div class="booking-detail">
                        <label>Ticket Type</label>
                        <span>${booking.ticketType.toUpperCase()}</span>
                    </div>
                    <div class="booking-detail">
                        <label>Quantity</label>
                        <span>${booking.quantity}</span>
                    </div>
                    <div class="booking-detail">
                        <label>Total</label>
                        <span>$${booking.totalPrice}</span>
                    </div>
                    <div class="booking-detail">
                        <label>Booking Date</label>
                        <span>${new Date(booking.bookingDate).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async deleteAccount() {
        const confirmed = confirm(
            'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.'
        );

        if (!confirmed) return;

        const doubleConfirmed = confirm(
            'This is your final warning. Are you absolutely sure you want to delete your account?'
        );

        if (!doubleConfirmed) return;

        try {
            // Use API service to delete account
            const response = await window.apiService.deleteUserAccount();
            
            if (response.success) {
                // Remove local data for backward compatibility
                localStorage.removeItem(`userData_${this.currentUser.email}`);
                localStorage.removeItem('currentUser');

                // Remove user from users list
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const updatedUsers = users.filter(u => u.email !== this.currentUser.email);
                localStorage.setItem('users', JSON.stringify(updatedUsers));

                // Remove user bookings
                const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
                const updatedBookings = bookings.filter(b => b.email !== this.currentUser.email);
                localStorage.setItem('bookings', JSON.stringify(updatedBookings));

                this.showMessage('Account deleted successfully. Redirecting...', 'success');

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                throw new Error(response.message || 'Failed to delete account');
            }
        } catch (error) {
            console.error('Account deletion error:', error);
            this.showMessage('Failed to delete account. Please try again.', 'error');
        }
    }

    logout() {
        const confirmed = confirm('Are you sure you want to logout?');
        if (!confirmed) return;

        localStorage.removeItem('currentUser');
        this.showMessage('Logged out successfully. Redirecting...', 'success');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    showMessage(message, type = 'success') {
        const container = document.getElementById('messageContainer');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;

        container.appendChild(messageElement);

        // Auto-remove message after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }
}

// Password toggle functionality
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.parentElement.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.classList.remove('fa-eye');
        toggle.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        toggle.classList.remove('fa-eye-slash');
        toggle.classList.add('fa-eye');
    }
}

// Initialize profile manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProfileManager();
});
