// API Service for Music Festival Hub - MongoDB Backend Integration

class ApiService {
    constructor() {
        // Detect if we're in production or development
        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        
        if (isProduction) {
            // For production, use relative URLs or your deployed backend URL
            this.baseUrl = '/api'; // This will use the same domain as your frontend
            this.useMockData = true; // Use mock data until backend is deployed
        } else {
            // For local development
            this.baseUrl = 'http://localhost:5000/api';
            this.useMockData = false;
        }
        
        this.token = this.getToken();
    }

    // Token management
    getToken() {
        return localStorage.getItem('authToken');
    }

    setToken(token) {
        localStorage.setItem('authToken', token);
        this.token = token;
    }

    removeToken() {
        localStorage.removeItem('authToken');
        this.token = null;
    }

    // HTTP request helper
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Authentication endpoints
    async register(userData) {
        if (this.useMockData) {
            // Mock registration for production deployment
            await this.delay(1500);
            const mockToken = 'mock_token_' + Date.now();
            this.setToken(mockToken);
            return {
                success: true,
                message: 'Registration successful',
                data: {
                    token: mockToken,
                    user: {
                        id: Date.now(),
                        name: userData.name,
                        email: userData.email,
                        userType: userData.userType
                    }
                }
            };
        }

        const response = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        
        if (response.success && response.data.token) {
            this.setToken(response.data.token);
        }
        
        return response;
    }

    async login(credentials) {
        if (this.useMockData) {
            // Mock login for production deployment
            await this.delay(1200);
            const mockToken = 'mock_token_' + Date.now();
            this.setToken(mockToken);
            return {
                success: true,
                message: 'Login successful',
                data: {
                    token: mockToken,
                    user: {
                        id: Date.now(),
                        name: 'Demo User',
                        email: credentials.email,
                        userType: 'normal'
                    }
                }
            };
        }

        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        if (response.success && response.data.token) {
            this.setToken(response.data.token);
        }
        
        return response;
    }

    async logout() {
        try {
            await this.request('/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.removeToken();
        }
    }

    async getCurrentUser() {
        return await this.request('/auth/me');
    }

    // User endpoints
    async getUserProfile() {
        if (this.useMockData) {
            await this.delay(800);
            return {
                success: true,
                data: {
                    user: {
                        id: 'user123',
                        name: 'Demo User',
                        email: 'demo@example.com',
                        firstName: 'Demo',
                        lastName: 'User',
                        phone: '+91 9876543210',
                        dateOfBirth: '1990-01-01',
                        bio: 'Music enthusiast and festival lover',
                        location: 'mumbai',
                        avatar: null,
                        preferences: {
                            notifications: {
                                emailNotifications: true,
                                smsNotifications: false,
                                eventRecommendations: true
                            },
                            genres: ['edm', 'rock', 'indie']
                        }
                    }
                }
            };
        }
        return await this.request('/users/profile');
    }

    async updateUserProfile(profileData) {
        if (this.useMockData) {
            await this.delay(1000);
            return {
                success: true,
                message: 'Profile updated successfully',
                data: {
                    user: { ...profileData, id: 'user123' }
                }
            };
        }
        return await this.request('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    async updateUserAvatar(avatar) {
        if (this.useMockData) {
            await this.delay(800);
            return {
                success: true,
                message: 'Avatar updated successfully',
                data: { avatar }
            };
        }
        return await this.request('/users/avatar', {
            method: 'PUT',
            body: JSON.stringify({ avatar })
        });
    }

    async updateUserPassword(passwordData) {
        if (this.useMockData) {
            await this.delay(1200);
            return {
                success: true,
                message: 'Password updated successfully'
            };
        }
        return await this.request('/users/password', {
            method: 'PUT',
            body: JSON.stringify(passwordData)
        });
    }

    async deleteUserAccount() {
        if (this.useMockData) {
            await this.delay(1500);
            return {
                success: true,
                message: 'Account deleted successfully'
            };
        }
        return await this.request('/users/account', {
            method: 'DELETE'
        });
    }

    async getCreators() {
        return await this.request('/users/creators');
    }

    // Event endpoints
    async getEvents(filters = {}) {
        const params = new URLSearchParams(filters);
        return await this.request(`/events?${params}`);
    }

    async getUpcomingEvents() {
        return await this.request('/events/upcoming');
    }

    async getEventDetails(eventId) {
        return await this.request(`/events/${eventId}`);
    }

    async createEvent(eventData) {
        return await this.request('/events', {
            method: 'POST',
            body: JSON.stringify(eventData)
        });
    }

    async updateEvent(eventId, eventData) {
        return await this.request(`/events/${eventId}`, {
            method: 'PUT',
            body: JSON.stringify(eventData)
        });
    }

    async deleteEvent(eventId) {
        return await this.request(`/events/${eventId}`, {
            method: 'DELETE'
        });
    }

    async searchEvents(query, filters = {}) {
        const params = new URLSearchParams({ search: query, ...filters });
        return await this.request(`/events?${params}`);
    }

    // Booking endpoints
    async createBooking(bookingData) {
        if (this.useMockData) {
            // Mock booking for production deployment
            await this.delay(2000);
            return {
                success: true,
                message: 'Booking created successfully',
                data: {
                    booking: {
                        id: 'BKG' + Date.now(),
                        event: bookingData.event,
                        quantity: bookingData.quantity,
                        totalPrice: bookingData.totalPrice || 2499,
                        paymentMethod: bookingData.paymentMethod,
                        bookingStatus: 'confirmed',
                        ticketIds: ['TKT' + Date.now()],
                        createdAt: new Date().toISOString()
                    }
                }
            };
        }

        return await this.request('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
    }

    async getUserBookings(filters = {}) {
        const params = new URLSearchParams(filters);
        return await this.request(`/bookings?${params}`);
    }

    async getBookingDetails(bookingId) {
        return await this.request(`/bookings/${bookingId}`);
    }

    async cancelBooking(bookingId, reason) {
        return await this.request(`/bookings/${bookingId}/cancel`, {
            method: 'PUT',
            body: JSON.stringify({ reason })
        });
    }

    async getEventBookings(eventId) {
        return await this.request(`/bookings/event/${eventId}`);
    }

    // Legacy methods for backward compatibility (will use mock data for now)
    async getRelatedEvents(eventId, limit = 4) {
        try {
            // For now, use mock data until we implement related events endpoint
            await this.delay(600);
            return this.getMockRelatedEvents(eventId, limit);
        } catch (error) {
            console.error('Error fetching related events:', error);
            return [];
        }
    }

    async bookTickets(bookingData) {
        // Map legacy booking data to new format
        const newBookingData = {
            event: bookingData.eventId,
            ticketType: bookingData.ticketType || 'general',
            quantity: bookingData.tickets || bookingData.quantity || 1,
            paymentMethod: bookingData.paymentMethod || 'card',
            customerInfo: {
                name: bookingData.customerName || 'Guest',
                email: bookingData.customerEmail || 'guest@example.com'
            },
            specialRequests: bookingData.specialRequests || ''
        };

        return await this.createBooking(newBookingData);
    }

    // Utility methods
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token;
    }

    // Error handling helper
    handleApiError(error) {
        if (error.message.includes('401')) {
            this.removeToken();
            window.location.href = '/login.html';
        }
        throw error;
    }

    // Mock data methods for backward compatibility
    getAuthToken() {
        return localStorage.getItem('authToken') || '';
    }

    getMockEventDetails(eventId) {
        // Mock event data based on eventId
        const events = {
            '1': {
                id: 1,
                title: 'Sunburn Festival 2024',
                date: '2024-12-21T18:00:00',
                endDate: '2024-12-22T00:00:00',
                venue: 'NSCI Dome, Mumbai',
                location: 'Andheri, Mumbai',
                category: 'Music Festival',
                subcategory: 'EDM',
                description: 'Sunburn Festival is India\'s largest electronic dance music festival and one of the biggest in Asia. This year\'s edition promises to be the most spectacular yet, featuring world-renowned DJs and artists from across the globe. The festival will span over 8 hours of non-stop music with multiple stages, interactive installations, food trucks, and merchandise stalls. Experience the pulsating beats of electronic music in a vibrant atmosphere with thousands of music lovers.',
                highlights: [
                    'Global Event',
                    'First Time in Your City',
                    'Diverse Artist Line-Up'
                ],
                importantInfo: [
                    'Age limit: 18+ years',
                    'ID proof mandatory for entry',
                    'Outside food and beverages not allowed',
                    'No photography or recording allowed',
                    'Strict dress code: No offensive clothing',
                    'Security checks at entry points'
                ],
                facilities: [
                    { name: 'Alcohol Served', icon: 'fas fa-wine-bottle' },
                    { name: 'Couple Friendly', icon: 'fas fa-heart' },
                    { name: 'Wheelchair Accessible', icon: 'fas fa-wheelchair' },
                    { name: 'Food Court', icon: 'fas fa-utensils' },
                    { name: 'Parking Available', icon: 'fas fa-parking' },
                    { name: 'Medical Support', icon: 'fas fa-first-aid' }
                ],
                images: [
                    'https://picsum.photos/1200/500?random=1',
                    'https://picsum.photos/1200/500?random=2',
                    'https://picsum.photos/1200/500?random=3'
                ],
                gallery: [
                    'https://picsum.photos/300/200?random=4',
                    'https://picsum.photos/300/200?random=5',
                    'https://picsum.photos/300/200?random=6',
                    'https://picsum.photos/300/200?random=7',
                    'https://picsum.photos/300/200?random=8',
                    'https://picsum.photos/300/200?random=9'
                ],
                offers: [
                    {
                        title: 'Travel Offer',
                        description: 'Get 20% off on flights to Mumbai with our travel partner',
                        image: 'https://picsum.photos/400/200?random=10'
                    },
                    {
                        title: 'Hotel Deal',
                        description: 'Special rates at hotels near NSCI Dome',
                        image: 'https://picsum.photos/400/200?random=11'
                    }
                ],
                venueLayout: {
                    description: 'The NSCI Dome is a multi-purpose indoor stadium with a capacity of 15,000 people. The venue features:',
                    features: [
                        'Main Stage with 360-degree setup',
                        'Two secondary stages',
                        'Food court area with 20+ vendors',
                        'Merchandise stalls',
                        'Restrooms and changing areas',
                        'First aid stations'
                    ],
                    mapImage: 'https://picsum.photos/800/400?random=12'
                },
                faqs: [
                    {
                        question: 'What are the entry timings?',
                        answer: 'Gates open at 5:00 PM. First entry is at 6:00 PM.'
                    },
                    {
                        question: 'Can I bring my own food?',
                        answer: 'Outside food and beverages are not allowed. Food court available inside.'
                    },
                    {
                        question: 'Is parking available?',
                        answer: 'Yes, limited parking is available. We recommend using public transport.'
                    },
                    {
                        question: 'What is the refund policy?',
                        answer: 'All sales are final. No refunds or exchanges.'
                    }
                ],
                terms: [
                    'Tickets are non-transferable and non-refundable.',
                    'Entry is subject to security checks and ID verification.',
                    'Organizers reserve the right to refuse entry without cause.',
                    'No photography or recording allowed during the event.',
                    'Alcohol consumption is restricted to designated areas.',
                    'Smoking is prohibited inside the venue.',
                    'Organizers are not responsible for personal belongings.',
                    'Event timings and lineup are subject to change.'
                ],
                price: 2499,
                duration: '8 Hours',
                ageLimit: '18+ Years',
                language: 'English, Hindi',
                genre: 'EDM, Electronic',
                city: 'Mumbai',
                interestedCount: 15420
            },
            '2': {
                id: 2,
                title: 'NH7 Weekender',
                date: '2024-11-15T16:00:00',
                endDate: '2024-11-16T00:00:00',
                venue: 'Phoenix Marketcity, Pune',
                location: 'Viman Nagar, Pune',
                category: 'Music Festival',
                subcategory: 'Indie Rock',
                description: 'NH7 Weekender is India\'s premier multi-genre music festival, bringing together the best of indie, rock, electronic, and alternative music. Experience performances from top Indian and international artists across multiple stages.',
                highlights: [
                    'Multi-Genre Festival',
                    'International Artists',
                    'Food & Craft Beer'
                ],
                importantInfo: [
                    'Age limit: 15+ years',
                    'ID proof mandatory',
                    'Outside food not allowed',
                    'Cameras permitted (no professional gear)',
                    'Re-entry not allowed'
                ],
                facilities: [
                    { name: 'Craft Beer', icon: 'fas fa-beer' },
                    { name: 'Food Trucks', icon: 'fas fa-truck' },
                    { name: 'Charging Stations', icon: 'fas fa-bolt' },
                    { name: 'ATM', icon: 'fas fa-money-bill' },
                    { name: 'Parking', icon: 'fas fa-parking' },
                    { name: 'Medical', icon: 'fas fa-first-aid' }
                ],
                images: [
                    'https://picsum.photos/1200/500?random=13',
                    'https://picsum.photos/1200/500?random=14',
                    'https://picsum.photos/1200/500?random=15'
                ],
                gallery: [
                    'https://picsum.photos/300/200?random=16',
                    'https://picsum.photos/300/200?random=17',
                    'https://picsum.photos/300/200?random=18',
                    'https://picsum.photos/300/200?random=19'
                ],
                offers: [
                    {
                        title: 'Travel Package',
                        description: 'Special travel packages from major cities',
                        image: 'https://picsum.photos/400/200?random=20'
                    }
                ],
                venueLayout: {
                    description: 'Phoenix Marketcity is a premium shopping and entertainment destination with multiple event spaces:',
                    features: [
                        'Main Stage in Central Atrium',
                        'Acoustic Stage in Food Court',
                        'Art Installations throughout',
                        'Multiple Food & Beverage Outlets',
                        'Rest Areas and Seating',
                        'Information Desks'
                    ],
                    mapImage: 'https://picsum.photos/800/400?random=21'
                },
                faqs: [
                    {
                        question: 'What time does the festival start?',
                        answer: 'Doors open at 4:00 PM, first performances at 5:00 PM.'
                    },
                    {
                        question: 'Can I bring a backpack?',
                        answer: 'Small bags are allowed, subject to security check.'
                    }
                ],
                terms: [
                    'No professional recording equipment allowed.',
                    'Pets are not permitted on the premises.',
                    'Management reserves the right to refuse entry.',
                    'Weather policy: Event will proceed rain or shine.'
                ],
                price: 1899,
                duration: '8 Hours',
                ageLimit: '15+ Years',
                language: 'English, Hindi, Marathi',
                genre: 'Indie Rock, Alternative',
                city: 'Pune',
                interestedCount: 8760
            }
        };

        return events[eventId] || events['1']; // Default to event 1 if not found
    }

    getMockRelatedEvents(eventId, limit) {
        const relatedEvents = [
            {
                id: 2,
                title: 'NH7 Weekender',
                date: '2024-11-15',
                venue: 'Phoenix Marketcity, Pune',
                price: 1899,
                image: 'https://picsum.photos/300/200?random=22',
                category: 'Music Festival'
            },
            {
                id: 3,
                title: 'VH1 Supersonic',
                date: '2024-12-05',
                venue: 'Jio Garden, Delhi',
                price: 2999,
                image: 'https://picsum.photos/300/200?random=23',
                category: 'EDM Festival'
            },
            {
                id: 4,
                title: 'Bollywood Music Project',
                date: '2024-11-30',
                venue: 'DLF CyberHub, Gurgaon',
                price: 1599,
                image: 'https://picsum.photos/300/200?random=24',
                category: 'Bollywood Night'
            },
            {
                id: 5,
                title: 'Enchanted Valley Carnival',
                date: '2024-12-10',
                venue: 'Palace Grounds, Bangalore',
                price: 2299,
                image: 'https://picsum.photos/300/200?random=25',
                category: 'Music Festival'
            }
        ];

        return relatedEvents.slice(0, limit);
    }

    getMockBookingResponse(bookingData) {
        return {
            bookingId: 'BKG' + Date.now(),
            eventId: bookingData.eventId,
            userId: bookingData.userId || 'USR001',
            tickets: bookingData.tickets,
            totalPrice: bookingData.totalPrice,
            status: 'confirmed',
            bookingDate: new Date().toISOString(),
            qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BOOKING123',
            confirmationMessage: 'Your tickets have been successfully booked!'
        };
    }

    getMockUserBookings(userId) {
        return [
            {
                id: 'BKG001',
                eventId: 1,
                eventName: 'Sunburn Festival 2024',
                eventDate: '2024-12-21',
                venue: 'NSCI Dome, Mumbai',
                tickets: 2,
                totalPrice: 4998,
                status: 'confirmed',
                bookingDate: '2024-10-15'
            },
            {
                id: 'BKG002',
                eventId: 2,
                eventName: 'NH7 Weekender',
                eventDate: '2024-11-15',
                venue: 'Phoenix Marketcity, Pune',
                tickets: 1,
                totalPrice: 1899,
                status: 'confirmed',
                bookingDate: '2024-10-20'
            }
        ];
    }

    getMockSearchResults(query, filters) {
        const allEvents = [
            {
                id: 1,
                title: 'Sunburn Festival 2024',
                date: '2024-12-21',
                venue: 'NSCI Dome, Mumbai',
                price: 2499,
                image: 'https://picsum.photos/300/200?random=1',
                category: 'Music Festival'
            },
            {
                id: 2,
                title: 'NH7 Weekender',
                date: '2024-11-15',
                venue: 'Phoenix Marketcity, Pune',
                price: 1899,
                image: 'https://picsum.photos/300/200?random=22',
                category: 'Music Festival'
            },
            {
                id: 3,
                title: 'VH1 Supersonic',
                date: '2024-12-05',
                venue: 'Jio Garden, Delhi',
                price: 2999,
                image: 'https://picsum.photos/300/200?random=23',
                category: 'EDM Festival'
            }
        ];

        // Simple filtering based on query
        return allEvents.filter(event => 
            event.title.toLowerCase().includes(query.toLowerCase()) ||
            event.venue.toLowerCase().includes(query.toLowerCase()) ||
            event.category.toLowerCase().includes(query.toLowerCase())
        );
    }
}

// Initialize the API service
const apiService = new ApiService();

// Make it globally available for backward compatibility
window.apiService = apiService;
window.eventApiService = apiService; // For backward compatibility