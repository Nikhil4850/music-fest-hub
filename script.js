// Music Festival Hub - Complete Ticket Booking Platform

// Application State
class AppState {
    constructor() {
        this.currentPage = 'home';
        this.currentEvent = null;
        this.user = null;
        this.bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        this.events = [];
        this.useTicketmasterApi = false; // Set to true to use Ticketmaster API
        this.isLoading = false;
    }
    
    async loadEvents() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        try {
            if (this.useTicketmasterApi && window.ticketmasterEventsService) {
                const response = await ticketmasterEventsService.getEvents();
                this.events = response.events;
            } else {
                this.events = this.loadMockEvents();
            }
        } catch (error) {
            console.error('Error loading events:', error);
            this.events = this.loadMockEvents();
        } finally {
            this.isLoading = false;
        }
    }
    
    loadMockEvents() {
        return [
            {
                id: '1',
                name: 'Electric Dreams Festival',
                date: '2024-07-15',
                venue: 'Central Park, NYC',
                image: 'electric-dreams.jpg',
                lineup: ['Deadmau5', 'Porter Robinson', 'Madeon', 'ODESZA'],
                description: 'An immersive electronic music experience featuring the world\'s top DJs and producers.',
                stages: ['Main Stage', 'Underground Stage', 'Chill Zone'],
                tickets: {
                    regular: { price: 99, name: 'Regular', features: ['General Admission', 'Access to All Stages', 'Food Courts'] },
                    vip: { price: 199, name: 'VIP', features: ['VIP Area Access', 'Premium Viewing', 'Complimentary Drinks', 'Meet & Greet'] },
                    backstage: { price: 299, name: 'Backstage', features: ['Backstage Access', 'Artist Meet & Greet', 'Premium Bar', 'VIP Lounge', 'Exclusive Merchandise'] }
                }
            },
            {
                id: '2',
                name: 'Rock Revolution',
                date: '2024-08-20',
                venue: 'Madison Square Garden, NYC',
                image: 'rock-revolution.jpg',
                lineup: ['Foo Fighters', 'Arctic Monkeys', 'The Strokes', 'Queens of the Stone Age'],
                description: 'The ultimate rock experience with legendary bands and emerging artists.',
                stages: ['Main Arena', 'Side Stage', 'Acoustic Corner'],
                tickets: {
                    regular: { price: 129, name: 'Regular', features: ['General Admission', 'Access to All Stages', 'Food Courts'] },
                    vip: { price: 249, name: 'VIP', features: ['VIP Area Access', 'Premium Viewing', 'Complimentary Drinks', 'Meet & Greet'] },
                    backstage: { price: 349, name: 'Backstage', features: ['Backstage Access', 'Artist Meet & Greet', 'Premium Bar', 'VIP Lounge', 'Exclusive Merchandise'] }
                }
            },
            {
                id: '3',
                name: 'Jazz & Blues Night',
                date: '2024-09-10',
                venue: 'Blue Note, NYC',
                image: 'jazz-blues.jpg',
                lineup: ['Herbie Hancock', 'Kamasi Washington', 'Robert Glasper', 'Esperanza Spalding'],
                description: 'An intimate evening of world-class jazz and blues performances.',
                stages: ['Main Hall', 'Intimate Lounge'],
                tickets: {
                    regular: { price: 79, name: 'Regular', features: ['General Admission', 'Access to All Stages', 'Welcome Drink'] },
                    vip: { price: 149, name: 'VIP', features: ['VIP Seating', 'Premium Viewing', 'Complimentary Drinks', 'Artist Meet & Greet'] },
                    backstage: { price: 229, name: 'Backstage', features: ['Backstage Access', 'Artist Meet & Greet', 'Premium Bar', 'VIP Lounge', 'Signed Merchandise'] }
                }
            }
        ];
    }
    
    saveBookings() {
        localStorage.setItem('bookings', JSON.stringify(this.bookings));
    }
    
    addBooking(booking) {
        booking.id = Date.now().toString();
        booking.status = 'confirmed';
        booking.bookingDate = new Date().toISOString();
        this.bookings.push(booking);
        this.saveBookings();
    }
    
    getEvent(id) {
        return this.events.find(event => event.id === id);
    }
}

// Navigation System
class NavigationManager {
    constructor(appState) {
        this.appState = appState;
        this.initializeNavigation();
        this.initializeRouting();
    }
    
    initializeNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Allow external navigation for links that don't start with # or are absolute URLs
                if (!href.startsWith('#') || href.startsWith('http') || href.startsWith('www')) {
                    // Allow normal navigation to proceed
                    return;
                }
                
                // For internal hash links, prevent default and handle with our navigation
                e.preventDefault();
                const page = href.substring(1);
                this.navigateTo(page);
            });
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
    
    initializeRouting() {
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || 'home';
            this.showPage(page);
        });
        
        // Handle initial page load
        const hash = window.location.hash.substring(1);
        if (hash) {
            this.navigateTo(hash);
        } else {
            // Show home page by default
            this.showPage('home');
        }
    }
    
    navigateTo(page, data = null) {
        this.appState.currentPage = page;
        
        // Update URL
        if (page === 'home') {
            history.pushState({ page }, '', 'index.html');
        } else {
            history.pushState({ page }, '', `#${page}`);
        }
        
        // Update navigation
        this.updateActiveNavLink(page);
        
        // Show page
        this.showPage(page, data);
    }
    
    updateActiveNavLink(page) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (page === 'home' && link.getAttribute('href') === '#home') {
                link.classList.add('active');
            } else if (link.getAttribute('href') === `#${page}`) {
                link.classList.add('active');
            }
            // For login link, it's external so we don't need to handle it here
        });
    }
    
    showPage(page, data = null) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(p => p.style.display = 'none');
        
        // Hide hero if not on home page
        const hero = document.querySelector('.hero');
        const previewSection = document.querySelector('.preview-section');
        if (page === 'home') {
            if (hero) hero.style.display = 'flex';
            if (previewSection) previewSection.style.display = 'block';
        } else {
            if (hero) hero.style.display = 'none';
            if (previewSection) previewSection.style.display = 'none';
        }
        
        // Show target page
        const targetPage = document.getElementById(page);
        if (targetPage) {
            targetPage.style.display = 'block';
            targetPage.classList.add('fade-in');
            
            // Load page-specific content
            this.loadPageContent(page, data);
        }
    }
    
    async loadPageContent(page, data) {
        switch (page) {
            case 'events':
                await this.loadEventsPage();
                break;
            case 'event-details':
                this.loadEventDetailsPage(data);
                break;
            case 'booking':
                this.loadBookingPage(data);
                break;
            case 'my-bookings':
                this.loadBookingsPage();
                break;
            // Payment page is now external, so we don't need to handle it here
        }
    }
    
    async loadEventsPage() {
        // Show loading state
        const eventsGrid = document.getElementById('eventsGrid');
        eventsGrid.innerHTML = '<div class="loading">Loading events...</div>';
        
        // Load events
        await this.appState.loadEvents();
        
        // Render events
        eventsGrid.innerHTML = '';
        
        this.appState.events.forEach(event => {
            const eventCard = this.createEventCard(event);
            eventsGrid.appendChild(eventCard);
        });
    }
    
    createEventCard(event) {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <div class="event-image" style="background-image: url('${event.image || 'https://placehold.co/600x400?text=No+Image'}');"></div>
            <div class="event-content">
                <div class="event-date">${new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <h3 class="event-title">${event.name}</h3>
                <div class="event-venue">${event.venue}</div>
                <div class="event-lineup">Featuring: ${event.lineup.slice(0, 3).join(', ')}${event.lineup.length > 3 ? '...' : ''}</div>
                <button class="book-now-btn" onclick="navigateTo('event-details', '${event.id}')">View Details</button>
            </div>
        `;
        
        return card;
    }
    
    loadEventDetailsPage(eventId) {
        const event = this.appState.getEvent(eventId);
        if (!event) return;
        
        this.appState.currentEvent = event;
        
        // Update banner
        const banner = document.getElementById('eventBanner');
        banner.innerHTML = `
            <div class="container">
                <div class="banner-content">
                    <h1 class="banner-title">${event.name}</h1>
                    <div class="banner-info">${new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • ${event.venue}</div>
                </div>
            </div>
        `;
        banner.style.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('${event.image || 'https://placehold.co/1200x400?text=No+Image'}')`;
        banner.style.backgroundSize = 'cover';
        banner.style.backgroundPosition = 'center';
        
        // Initialize tabs
        this.initializeEventTabs(event);
    }
    
    initializeEventTabs(event) {
        setTimeout(() => {
            const tabBtns = document.querySelectorAll('.tab-btn');
            const tabContent = document.getElementById('tabContent');
            
            // Remove existing event listeners
            tabBtns.forEach(btn => {
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
            });
            
            // Re-query after replacement
            const newTabBtns = document.querySelectorAll('.tab-btn');
            
            newTabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const tab = btn.dataset.tab;
                    
                    // Update active tab
                    newTabBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Load tab content
                    this.loadTabContent(tab, event, tabContent);
                });
            });
            
            // Load default tab
            this.loadTabContent('lineup', event, tabContent);
        }, 100);
    }
    
    loadTabContent(tab, event, container) {
        switch (tab) {
            case 'lineup':
                container.innerHTML = `
                    <div class="lineup-grid">
                        ${event.lineup.map(artist => `
                            <div class="artist-card">
                                <div class="artist-name">${artist}</div>
                                <div class="artist-genre">Electronic</div>
                            </div>
                        `).join('')}
                    </div>
                `;
                break;
                
            case 'stages':
                container.innerHTML = `
                    <div class="stages-info">
                        <h3>Performance Stages</h3>
                        <div class="lineup-grid">
                            ${event.stages.map(stage => `
                                <div class="artist-card">
                                    <div class="artist-name">${stage}</div>
                                    <div class="artist-genre">Live Performances</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
                break;
                
            case 'about':
                container.innerHTML = `
                    <div class="event-about">
                        <h3>About ${event.name}</h3>
                        <p>${event.description}</p>
                        <h4>Event Details</h4>
                        <ul>
                            <li><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</li>
                            <li><strong>Venue:</strong> ${event.venue}</li>
                            <li><strong>Duration:</strong> 8 hours</li>
                            <li><strong>Age Limit:</strong> 18+</li>
                        </ul>
                    </div>
                `;
                break;
                
            case 'tickets':
                container.innerHTML = `
                    <div class="tickets-section">
                        ${Object.entries(event.tickets).map(([type, ticket]) => `
                            <div class="ticket-option" data-event-id="${event.id}" data-ticket-type="${type}">
                                <div class="ticket-type">${ticket.name}</div>
                                <div class="ticket-price">$${ticket.price}</div>
                                <ul class="ticket-features">
                                    ${ticket.features.map(feature => `<li>${feature}</li>`).join('')}
                                </ul>
                                <button class="book-now-btn">Select This Ticket</button>
                            </div>
                        `).join('')}
                    </div>
                `;
                
                // Add click handlers to ticket options
                setTimeout(() => {
                    const ticketOptions = container.querySelectorAll('.ticket-option');
                    ticketOptions.forEach(option => {
                        option.addEventListener('click', () => {
                            const eventId = option.dataset.eventId;
                            const ticketType = option.dataset.ticketType;
                            // Navigate to the separate payment page
                            window.location.href = `payment.html?eventId=${eventId}&ticketType=${ticketType}`;
                        });
                    });
                }, 100);
                break;
        }
    }
    
    loadBookingPage(data) {
        if (!data) return;
        
        const [eventId, ticketType] = data.split('|');
        const event = this.appState.getEvent(eventId);
        if (!event || !event.tickets[ticketType]) return;
        
        const ticket = event.tickets[ticketType];
        
        // Update booking summary
        const summary = document.getElementById('bookingSummary');
        summary.innerHTML = `
            <div class="summary-title">Booking Summary</div>
            <div class="summary-item">
                <span>Event:</span>
                <span>${event.name}</span>
            </div>
            <div class="summary-item">
                <span>Date:</span>
                <span>${new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div class="summary-item">
                <span>Venue:</span>
                <span>${event.venue}</span>
            </div>
            <div class="summary-item">
                <span>Ticket Type:</span>
                <span>${ticket.name}</span>
            </div>
            <div class="summary-item">
                <span>Price:</span>
                <span>$${ticket.price}</span>
            </div>
        `;
        
        // Set default values and initialize form
        setTimeout(() => {
            const ticketSelect = document.getElementById('ticketType');
            const quantityInput = document.getElementById('quantity');
            
            if (ticketSelect && quantityInput) {
                ticketSelect.value = ticketType;
                quantityInput.value = 1;
                this.initializeBookingForm(event, ticket);
            }
        }, 50);
    }
    
    initializeBookingForm(event, defaultTicket) {
        const form = document.getElementById('bookingForm');
        const ticketType = document.getElementById('ticketType');
        const quantity = document.getElementById('quantity');
        
        // Remove existing event listeners to prevent duplicates
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        const newTicketType = document.getElementById('ticketType');
        const newQuantity = document.getElementById('quantity');
        
        // Price calculation
        const updatePrice = () => {
            const selectedOption = newTicketType.options[newTicketType.selectedIndex];
            const price = selectedOption ? parseInt(selectedOption.dataset.price) : 0;
            const qty = parseInt(newQuantity.value) || 1;
            const total = price * qty;
            
            document.getElementById('ticketPrice').textContent = `$${price}`;
            document.getElementById('ticketQuantity').textContent = qty;
            document.getElementById('totalPrice').textContent = `$${total}`;
        };
        
        newTicketType.addEventListener('change', updatePrice);
        newQuantity.addEventListener('input', updatePrice);
        
        // Form submission
        document.getElementById('bookingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processBooking(event, e.target);
        });
        
        // Initial price calculation
        setTimeout(updatePrice, 100);
    }
    
    processBooking(event, form) {
        const formData = new FormData(form);
        const ticketTypeSelect = document.getElementById('ticketType');
        const selectedOption = ticketTypeSelect.options[ticketTypeSelect.selectedIndex];
        
        if (!selectedOption || !selectedOption.dataset.price) {
            alert('Please select a valid ticket type.');
            return;
        }
        
        const price = parseInt(selectedOption.dataset.price);
        const quantity = parseInt(formData.get('quantity')) || 1;
        const fullName = formData.get('fullName');
        const email = formData.get('email');
        
        if (!fullName || !email) {
            alert('Please fill in all required fields.');
            return;
        }
        
        const booking = {
            eventId: event.id,
            eventName: event.name,
            eventDate: event.date,
            eventVenue: event.venue,
            fullName: fullName,
            email: email,
            ticketType: formData.get('ticketType'),
            quantity: quantity,
            totalPrice: price * quantity
        };
        
        // Show loading state
        const submitBtn = form.querySelector('.book-btn');
        const originalText = submitBtn.querySelector('span').textContent;
        submitBtn.querySelector('span').textContent = 'Processing...';
        submitBtn.disabled = true;
        
        // Simulate payment processing
        setTimeout(() => {
            this.appState.addBooking(booking);
            this.navigateTo('confirmation');
        }, 1500);
    }
    
    loadPaymentPage(data) {
        if (!data) return;
        
        const [eventId, ticketType] = data.split('|');
        const event = this.appState.getEvent(eventId);
        if (!event || !event.tickets[ticketType]) return;
        
        const ticket = event.tickets[ticketType];
        
        // Update payment summary
        const summary = document.getElementById('paymentSummary');
        summary.innerHTML = `
            <div class="summary-title">Order Summary</div>
            <div class="summary-item">
                <span>Event:</span>
                <span>${event.name}</span>
            </div>
            <div class="summary-item">
                <span>Date:</span>
                <span>${new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div class="summary-item">
                <span>Venue:</span>
                <span>${event.venue}</span>
            </div>
            <div class="summary-item">
                <span>Ticket Type:</span>
                <span>${ticket.name}</span>
            </div>
            <div class="summary-item">
                <span>Price:</span>
                <span>$${ticket.price}</span>
            </div>
            <div class="summary-item">
                <span>Quantity:</span>
                <span>1</span>
            </div>
            <div class="summary-item total">
                <span>Total:</span>
                <span>$${ticket.price}</span>
            </div>
        `;
        
        // Set up payment form
        setTimeout(() => {
            const paymentForm = document.getElementById('paymentForm');
            
            // Remove existing event listeners to prevent duplicates
            const newForm = paymentForm.cloneNode(true);
            paymentForm.parentNode.replaceChild(newForm, paymentForm);
            
            // Form submission
            document.getElementById('paymentForm').addEventListener('submit', (e) => {
                e.preventDefault();
                this.processPayment(event, ticket, e.target);
            });
        }, 50);
    }
    
    processPayment(event, ticket, form) {
        const formData = new FormData(form);
        const cardName = formData.get('cardName');
        const cardNumber = formData.get('cardNumber');
        
        if (!cardName || !cardNumber) {
            alert('Please fill in all required payment fields.');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('.pay-btn');
        const originalText = submitBtn.querySelector('span').textContent;
        submitBtn.querySelector('span').textContent = 'Processing Payment...';
        submitBtn.disabled = true;
        
        // Simulate payment processing
        setTimeout(() => {
            // Create booking after successful payment
            const booking = {
                eventId: event.id,
                eventName: event.name,
                eventDate: event.date,
                eventVenue: event.venue,
                fullName: cardName,
                email: 'user@example.com', // In a real app, this would come from user account
                ticketType: ticket.name,
                quantity: 1,
                totalPrice: ticket.price
            };
            
            this.appState.addBooking(booking);
            this.navigateTo('confirmation');
        }, 2000);
    }
    
    loadBookingsPage() {
        const bookingsList = document.getElementById('bookingsList');
        
        if (this.appState.bookings.length === 0) {
            bookingsList.innerHTML = `
                <div class="empty-state">
                    <h3>No Bookings Yet</h3>
                    <p>You haven't booked any tickets yet. Explore our upcoming events!</p>
                    <button class="cta-button primary" onclick="navigateTo('events')">
                        <span>Browse Events</span>
                        <div class="button-glow"></div>
                    </button>
                </div>
            `;
            return;
        }
        
        bookingsList.innerHTML = this.appState.bookings.map(booking => `
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
    
    loadAuthPage() {
        const authTabs = document.querySelectorAll('.auth-tab');
        const authForms = document.querySelectorAll('.auth-form');
        
        // Remove existing event listeners
        authTabs.forEach(tab => {
            const newTab = tab.cloneNode(true);
            tab.parentNode.replaceChild(newTab, tab);
        });
        
        // Re-query after replacement
        const newAuthTabs = document.querySelectorAll('.auth-tab');
        
        newAuthTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Update active tab
                newAuthTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding form
                authForms.forEach(form => {
                    form.classList.remove('active');
                    if (form.classList.contains(`${targetTab}-form`)) {
                        form.classList.add('active');
                    }
                });
            });
        });
        
        // Handle form submissions
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        // Remove existing listeners by cloning
        const newLoginForm = loginForm.cloneNode(true);
        const newRegisterForm = registerForm.cloneNode(true);
        loginForm.parentNode.replaceChild(newLoginForm, loginForm);
        registerForm.parentNode.replaceChild(newRegisterForm, registerForm);
        
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e.target);
        });
        
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e.target);
        });
    }
    
    handleLogin(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.querySelector('span').textContent;
        submitBtn.querySelector('span').textContent = 'Signing in...';
        submitBtn.disabled = true;
        
        // Basic validation
        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            this.resetButton(submitBtn, originalText);
            return;
        }
        
        // Simulate login process
        setTimeout(() => {
            // Check if user exists (simple simulation)
            const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
            const user = existingUsers.find(u => u.email === email);
            
            if (user && user.password === password) {
                // Successful login
                this.appState.user = {
                    email: user.email,
                    name: user.name,
                    isLoggedIn: true
                };
                
                // Save session
                localStorage.setItem('currentUser', JSON.stringify(this.appState.user));
                
                // Update UI
                this.updateLoginStatus();
                this.showNotification('Welcome back! Login successful.', 'success');
                
                // Redirect to events or previous page
                setTimeout(() => {
                    this.navigateTo('events');
                }, 1000);
            } else {
                // Failed login
                this.showNotification('Invalid email or password', 'error');
                this.resetButton(submitBtn, originalText);
            }
        }, 1500);
    }
    
    handleRegister(form) {
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.querySelector('span').textContent;
        submitBtn.querySelector('span').textContent = 'Creating account...';
        submitBtn.disabled = true;
        
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            this.showNotification('Please fill in all fields', 'error');
            this.resetButton(submitBtn, originalText);
            return;
        }
        
        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match!', 'error');
            this.resetButton(submitBtn, originalText);
            return;
        }
        
        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters long', 'error');
            this.resetButton(submitBtn, originalText);
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            this.resetButton(submitBtn, originalText);
            return;
        }
        
        // Simulate registration
        setTimeout(() => {
            // Check if user already exists
            const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
            const userExists = existingUsers.find(u => u.email === email);
            
            if (userExists) {
                this.showNotification('An account with this email already exists', 'error');
                this.resetButton(submitBtn, originalText);
                return;
            }
            
            // Create new user
            const newUser = {
                id: Date.now().toString(),
                name: name,
                email: email,
                password: password, // In real app, this should be hashed
                registrationDate: new Date().toISOString()
            };
            
            existingUsers.push(newUser);
            localStorage.setItem('users', JSON.stringify(existingUsers));
            
            // Log in the new user
            this.appState.user = {
                email: newUser.email,
                name: newUser.name,
                isLoggedIn: true
            };
            
            localStorage.setItem('currentUser', JSON.stringify(this.appState.user));
            
            // Update UI
            this.updateLoginStatus();
            this.showNotification('Account created successfully! Welcome to Music Festival Hub.', 'success');
            
            // Redirect to events
            setTimeout(() => {
                this.navigateTo('events');
            }, 1000);
        }, 1500);
    }
    
    updateBookingPrice() {
        const ticketType = document.getElementById('ticketType');
        const quantity = document.getElementById('quantity');
        
        if (ticketType && quantity) {
            const selectedOption = ticketType.options[ticketType.selectedIndex];
            const price = selectedOption ? parseInt(selectedOption.dataset.price) : 0;
            const qty = parseInt(quantity.value) || 0;
            const total = price * qty;
            
            document.getElementById('ticketPrice').textContent = `$${price}`;
            document.getElementById('ticketQuantity').textContent = qty;
            document.getElementById('totalPrice').textContent = `$${total}`;
        }
    }
    
    showNotification(message, type) {
        // Notification implementation
    }
    
    resetButton(button, originalText) {
        // Reset button implementation
    }
    
    updateLoginStatus() {
        // Update login status implementation
    }
}

// Global navigation function
function navigateTo(page, data = null) {
    if (window.navigationManager) {
        window.navigationManager.navigateTo(page, data);
    }
}

// Particle System
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = document.getElementById('particles');
        if (this.container) {
            this.createParticles();
            this.animate();
        }
    }

    createParticles() {
        // Clear existing particles
        this.container.innerHTML = '';
        this.particles = [];
        
        const particleCount = window.innerWidth < 768 ? 15 : 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 2;
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const duration = Math.random() * 10 + 5;
            const delay = Math.random() * 5;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            
            this.container.appendChild(particle);
            this.particles.push({
                element: particle,
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }
    }

    animate() {
        if (!this.container) return;
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x <= 0 || particle.x >= window.innerWidth) {
                particle.vx *= -1;
            }
            if (particle.y <= 0 || particle.y >= window.innerHeight) {
                particle.vy *= -1;
            }
            
            particle.element.style.left = `${particle.x}px`;
            particle.element.style.top = `${particle.y}px`;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Intersection Observer for animations
class AnimationObserver {
    constructor() {
        try {
            this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            this.observeElements();
        } catch (e) {
            console.warn('Intersection Observer not supported, animations will be disabled', e);
        }
    }
    
    observeElements() {
        if (!this.observer) return;
        
        const elements = document.querySelectorAll('.feature-card, .event-card, .booking-card');
        elements.forEach(el => this.observer.observe(el));
    }
    
    handleIntersection(entries) {
        if (!this.observer) return;
        
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// Enhanced button interactions
class ButtonEffects {
    constructor() {
        try {
            this.initializeButtons();
        } catch (e) {
            console.warn('Error initializing button effects', e);
        }
    }
    
    initializeButtons() {
        const buttons = document.querySelectorAll('.cta-button');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', this.createRipple.bind(this));
            button.addEventListener('click', this.handleClick.bind(this));
        });
    }
    
    createRipple(e) {
        try {
            const button = e.currentTarget;
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode === button) {
                    ripple.remove();
                }
            }, 600);
        } catch (e) {
            console.warn('Error creating ripple effect', e);
        }
    }
    
    handleClick(e) {
        try {
            const button = e.currentTarget;
            
            // Add click animation
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        } catch (e) {
            console.warn('Error handling button click', e);
        }
    }
}

// Feature card interactions
class FeatureCardEffects {
    constructor() {
        try {
            this.initializeCards();
        } catch (e) {
            console.warn('Error initializing feature card effects', e);
        }
    }
    
    initializeCards() {
        const cards = document.querySelectorAll('.feature-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
            card.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
            card.addEventListener('mousemove', this.handleMouseMove.bind(this));
        });
    }
    
    handleMouseEnter(e) {
        try {
            const card = e.currentTarget;
            card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        } catch (e) {
            console.warn('Error handling mouse enter', e);
        }
    }
    
    handleMouseLeave(e) {
        try {
            const card = e.currentTarget;
            card.style.transform = '';
        } catch (e) {
            console.warn('Error handling mouse leave', e);
        }
    }
    
    handleMouseMove(e) {
        try {
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        } catch (e) {
            console.warn('Error handling mouse move', e);
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize app state and navigation
        const appState = new AppState();
        
        // Check for existing user session
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                appState.user = JSON.parse(savedUser);
            } catch (e) {
                localStorage.removeItem('currentUser');
            }
        }
        
        const navigationManager = new NavigationManager(appState);
        window.navigationManager = navigationManager;
        
        // Update login status on page load
        navigationManager.updateLoginStatus();
        
        // Initialize video background
        initializeVideoBackground();
        
        // Initialize all components
        new ParticleSystem();
        new AnimationObserver();
        new ButtonEffects();
        new FeatureCardEffects();
        
        // View toggle functionality
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                
                // Update active button
                viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update grid layout
                const eventsGrid = document.getElementById('eventsGrid');
                if (view === 'list') {
                    eventsGrid.style.gridTemplateColumns = '1fr';
                } else {
                    eventsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(350px, 1fr))';
                }
            });
        });
        
        // Performance optimization
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01s');
        }
        
        // Add CSS for dynamic elements
        const style = document.createElement('style');
        style.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: rippleEffect 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes rippleEffect {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            
            .fade-in {
                animation: fadeIn 0.6s ease-out;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @media (max-width: 768px) {
                .nav-menu {
                    position: fixed;
                    top: 70px;
                    left: -100%;
                    width: 100%;
                    height: calc(100vh - 70px);
                    background: rgba(0, 0, 0, 0.95);
                    flex-direction: column;
                    justify-content: start;
                    align-items: center;
                    transition: left 0.3s ease;
                    padding-top: 50px;
                }
                
                .nav-menu.active {
                    left: 0;
                }
                
                .nav-menu li {
                    margin: 20px 0;
                }
            }
            
            .loading {
                text-align: center;
                padding: 40px;
                font-size: 1.2rem;
                color: #cbd5e1;
            }
        `;
        document.head.appendChild(style);
        
        // Show home page by default
        if (window.navigationManager) {
            const hash = window.location.hash.substring(1);
            if (!hash) {
                window.navigationManager.showPage('home');
            }
        }
    } catch (error) {
        console.error('Error initializing application:', error);
    }
});

// Function to initialize video background
function initializeVideoBackground() {
    try {
        const video = document.querySelector('.video-background video');
        if (video) {
            // Ensure video plays
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn('Video autoplay failed:', error);
                    // Try to play again after user interaction
                    const playVideo = () => {
                        video.play().catch(e => {
                            console.warn('Video play failed:', e);
                            // Show a fallback message
                            const videoBackground = document.querySelector('.video-background');
                            if (videoBackground) {
                                const fallback = document.createElement('div');
                                fallback.className = 'video-fallback';
                                fallback.innerHTML = '<div class="fallback-message">Video background not available</div>';
                                videoBackground.appendChild(fallback);
                            }
                        });
                        document.removeEventListener('click', playVideo);
                    };
                    document.addEventListener('click', playVideo);
                });
            }
            
            // Handle video errors
            video.addEventListener('error', (e) => {
                console.warn('Video error:', e);
                // Hide video background and show fallback
                const videoBackground = document.querySelector('.video-background');
                if (videoBackground) {
                    videoBackground.style.display = 'none';
                }
            });
            
            // Add loading event to ensure video is properly loaded
            video.addEventListener('loadstart', () => {
                console.log('Video loading started');
            });
            
            video.addEventListener('canplay', () => {
                console.log('Video can play');
            });
            
            // Add playsinline attribute for mobile devices
            video.setAttribute('playsinline', '');
        }
    } catch (e) {
        console.warn('Error initializing video background:', e);
    }
}

// Handle window resize for responsive particles
window.addEventListener('resize', () => {
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => particle.remove());
    
    // Reinitialize particles with new dimensions
    setTimeout(() => {
        try {
            new ParticleSystem();
        } catch (e) {
            console.error('Error reinitializing particles:', e);
        }
    }, 100);
});