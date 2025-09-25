// Modern Events Page JavaScript

// Ticketmaster API Configuration
const API_KEY = "0aCyvPIlOsSCksZLGFiTo8DGYIM1h2PC"; // Your Ticketmaster API key
const BASE_API_URL = "https://app.ticketmaster.com/discovery/v2/events.json";

// Import BookMyShow scraper
// Note: This would need to be included in the HTML file as well

class EventsApp {
    constructor() {
        console.log('Initializing simplified EventsApp');
        this.events = [
            {
                id: 1,
                title: 'Sunburn Festival 2023',
                category: 'music-festival',
                location: 'goa',
                venue: 'Vasco da Gama Park, Goa',
                date: '2023-12-16',
                language: 'english',
                price: 4500,
                interested: 12500,
                image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 2,
                title: 'EDM Night with DJ Snake',
                category: 'concerts',
                location: 'mumbai',
                venue: 'Jio Garden, Mumbai',
                date: '2023-12-16',
                language: 'english',
                price: 2500,
                interested: 8200,
                image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 3,
                title: 'Rock Fest India',
                category: 'music-festival',
                location: 'bangalore',
                venue: 'Palace Grounds, Bangalore',
                date: '2023-12-16',
                language: 'english',
                price: 3200,
                interested: 9700,
                image: 'https://images.unsplash.com/photo-1514329530649-768109189420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 4,
                title: 'Jazz Evening with Louis Cole',
                category: 'concerts',
                location: 'delhi',
                venue: 'The Jazz Gallery, Delhi',
                date: '2023-12-23',
                language: 'english',
                price: 1800,
                interested: 3400,
                image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 5,
                title: 'Indie Music Fest',
                category: 'music-festival',
                location: 'pune',
                venue: 'Rock Garden, Pune',
                date: '2023-12-23',
                language: 'english',
                price: 2000,
                interested: 6100,
                image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 6,
                title: 'Classical Symphony Night',
                category: 'concerts',
                location: 'chennai',
                venue: 'Music Academy, Chennai',
                date: '2023-12-23',
                language: 'english',
                price: 1500,
                interested: 2800,
                image: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 7,
                title: 'Hip Hop Festival',
                category: 'music-festival',
                location: 'hyderabad',
                venue: 'Hitech City Grounds, Hyderabad',
                date: '2023-12-30',
                language: 'english',
                price: 3800,
                interested: 11200,
                image: 'https://images.unsplash.com/photo-1511671681180-f1d8b330bde4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 8,
                title: 'Blues & BBQ Festival',
                category: 'music-festival',
                location: 'kolkata',
                venue: 'Victoria Memorial, Kolkata',
                date: '2023-12-30',
                language: 'english',
                price: 2200,
                interested: 5400,
                image: 'https://images.unsplash.com/photo-1514525620448-910c5c7ca650?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 9,
                title: 'Electronic Music Summit',
                category: 'concerts',
                location: 'ahmedabad',
                venue: 'Science City, Ahmedabad',
                date: '2023-12-30',
                language: 'english',
                price: 2900,
                interested: 7600,
                image: 'https://images.unsplash.com/photo-1511795411100-9d8c6e3d8a6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 10,
                title: 'Folk Music Heritage',
                category: 'concerts',
                location: 'mumbai',
                venue: 'NCPA, Mumbai',
                date: '2024-01-06',
                language: 'hindi',
                price: 1200,
                interested: 4200,
                image: 'https://images.unsplash.com/photo-1511795411400-9d8c6e3d8a6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 11,
                title: 'Pop Icons Live',
                category: 'concerts',
                location: 'delhi',
                venue: 'Dilli Haat, Delhi',
                date: '2024-01-06',
                language: 'english',
                price: 5500,
                interested: 15600,
                image: 'https://images.unsplash.com/photo-1511795411500-9d8c6e3d8a6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 12,
                title: 'Reggae Sunsplash',
                category: 'music-festival',
                location: 'goa',
                venue: 'Anjuna Beach, Goa',
                date: '2024-01-06',
                language: 'english',
                price: 4100,
                interested: 9800,
                image: 'https://images.unsplash.com/photo-1511795411600-9d8c6e3d8a6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 13,
                title: 'Country Roads Festival',
                category: 'music-festival',
                location: 'bangalore',
                venue: 'Cubbon Park, Bangalore',
                date: '2024-01-13',
                language: 'english',
                price: 2700,
                interested: 6900,
                image: 'https://images.unsplash.com/photo-1511795411700-9d8c6e3d8a6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 14,
                title: 'Heavy Metal Thunder',
                category: 'concerts',
                location: 'pune',
                venue: 'Pune Race Course, Pune',
                date: '2024-01-13',
                language: 'english',
                price: 3300,
                interested: 8400,
                image: 'https://images.unsplash.com/photo-1511795411800-9d8c6e3d8a6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 15,
                title: 'World Music Festival',
                category: 'music-festival',
                location: 'chennai',
                venue: 'Marina Beach, Chennai',
                date: '2024-01-13',
                language: 'multi',
                price: 2600,
                interested: 11500,
                image: 'https://images.unsplash.com/photo-1511795411900-9d8c6e3d8a6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 16,
                title: 'Bollywood Night',
                category: 'concerts',
                location: 'mumbai',
                venue: 'Film City, Mumbai',
                date: '2024-01-20',
                language: 'hindi',
                price: 2800,
                interested: 13200,
                image: 'https://images.unsplash.com/photo-1511795410180-8b6d9d2e4a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 17,
                title: 'Tamil Music Festival',
                category: 'music-festival',
                location: 'chennai',
                venue: 'Phoenix Market City, Chennai',
                date: '2024-01-20',
                language: 'tamil',
                price: 3500,
                interested: 9800,
                image: 'https://images.unsplash.com/photo-1511795410100-9d8c6e3d8a6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 18,
                title: 'Punjabi Dhol Festival',
                category: 'music-festival',
                location: 'delhi',
                venue: 'Kingdom of Dreams, Delhi',
                date: '2024-01-20',
                language: 'punjabi',
                price: 2200,
                interested: 7500,
                image: 'https://images.unsplash.com/photo-1511795410200-9d8c6e3d8a6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 19,
                title: 'Classical Dance Performance',
                category: 'dance',
                location: 'bangalore',
                venue: 'Ravindra Kalakshetra, Bangalore',
                date: '2024-01-27',
                language: 'kannada',
                price: 1600,
                interested: 4300,
                image: 'https://images.unsplash.com/photo-1511795410300-9d8c6e3d8a6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 20,
                title: 'Comedy Night Live',
                category: 'comedy-shows',
                location: 'pune',
                venue: 'The Comedy Store, Pune',
                date: '2024-01-27',
                language: 'english',
                price: 1200,
                interested: 5600,
                image: 'https://images.unsplash.com/photo-1511795410400-9d8c6e3d8a6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 21,
                title: 'Telugu Cinema Songs',
                category: 'concerts',
                location: 'hyderabad',
                venue: 'Gachibowli Stadium, Hyderabad',
                date: '2024-01-27',
                language: 'telugu',
                price: 3100,
                interested: 12400,
                image: 'https://images.unsplash.com/photo-1511795410500-9d8c6e3d8a6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 22,
                title: 'Kolkata Theatre Festival',
                category: 'theatre',
                location: 'kolkata',
                venue: 'Academy of Fine Arts, Kolkata',
                date: '2024-02-03',
                language: 'bengali',
                price: 1800,
                interested: 3900,
                image: 'https://images.unsplash.com/photo-1511795410600-9d8c6e3d8a6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 23,
                title: 'Gujarati Folk Music',
                category: 'concerts',
                location: 'ahmedabad',
                venue: 'Kite Festival Ground, Ahmedabad',
                date: '2024-02-03',
                language: 'gujarati',
                price: 1300,
                interested: 4700,
                image: 'https://images.unsplash.com/photo-1511795410700-9d8c6e3d8a6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 24,
                title: 'Electronic Trance Night',
                category: 'music-festival',
                location: 'goa',
                venue: 'Tito\'s Lane, Goa',
                date: '2024-02-03',
                language: 'english',
                price: 4200,
                interested: 8900,
                image: 'https://images.unsplash.com/photo-1511795410800-9d8c6e3d8a6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 25,
                title: 'Marathi Drama Performance',
                category: 'theatre',
                location: 'mumbai',
                venue: 'Prithvi Theatre, Mumbai',
                date: '2024-02-10',
                language: 'marathi',
                price: 900,
                interested: 3200,
                image: 'https://images.unsplash.com/photo-1511795410900-9d8c6e3d8a6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            }
        ];
        this.filteredEvents = [...this.events];
        this.filters = {
            date: null,
            location: [],
            category: [],
            price: [],
            language: []
        };
        this.sortBy = 'relevance';
        this.searchQuery = '';
        this.currentCity = 'mumbai';
        
        this.init();
    }

    init() {
        console.log('EventsApp.init() called');
        try {
            this.setupEventListeners();
            this.updateResultsCount();
            console.log('Simplified EventsApp initialized successfully');
        } catch (error) {
            console.error('Error initializing EventsApp:', error);
        }
    }

    setupEventListeners() {
        // Search functionality with debounce
        let searchTimeout;
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                this.searchQuery = e.target.value.toLowerCase();
                searchTimeout = setTimeout(() => {
                    this.applyFilters();
                }, 300);
            });
        }

        // City selector
        const citySelector = document.getElementById('citySelector');
        if (citySelector) {
            citySelector.addEventListener('change', (e) => {
                this.currentCity = e.target.value;
                const selectedCityElement = document.getElementById('selectedCity');
                if (selectedCityElement) {
                    selectedCityElement.textContent = 
                        e.target.options[e.target.selectedIndex].text;
                }
                this.applyFilters();
            });
        }

        // Sort functionality
        const sortBy = document.getElementById('sortBy');
        if (sortBy) {
            sortBy.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.applyFilters();
            });
        }

        // Filter listeners
        this.setupFilterListeners();

        // Mobile filter toggle
        const mobileFilterBtn = document.getElementById('mobileFilterBtn');
        if (mobileFilterBtn) {
            mobileFilterBtn.addEventListener('click', () => {
                this.showMobileFilters();
            });
        }

        const closeMobileFilter = document.getElementById('closeMobileFilter');
        if (closeMobileFilter) {
            closeMobileFilter.addEventListener('click', () => {
                this.hideMobileFilters();
            });
        }

        const mobileFilterOverlay = document.getElementById('mobileFilterOverlay');
        if (mobileFilterOverlay) {
            mobileFilterOverlay.addEventListener('click', (e) => {
                if (e.target === mobileFilterOverlay) {
                    this.hideMobileFilters();
                }
            });
        }

        // Clear filters
        const clearFilters = document.getElementById('clearFilters');
        if (clearFilters) {
            clearFilters.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

        // Load more
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreEvents();
            });
        }

        // Event card click handlers - using event delegation
        const eventsGrid = document.getElementById('eventsGrid');
        if (eventsGrid) {
            eventsGrid.addEventListener('click', (e) => {
                const eventCard = e.target.closest('.event-card');
                if (eventCard) {
                    const eventId = eventCard.dataset.eventId;
                    if (eventId) {
                        this.viewEventDetails(eventId);
                    }
                }
            });
        }
    }

    setupFilterListeners() {
        // Date filters (radio)
        document.querySelectorAll('input[name="date"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.filters.date = e.target.checked ? e.target.value : null;
                this.applyFilters();
            });
        });

        // Other filters (checkboxes)
        ['location', 'category', 'price', 'language'].forEach(filterType => {
            document.querySelectorAll(`input[name="${filterType}"]`).forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        if (!this.filters[filterType].includes(e.target.value)) {
                            this.filters[filterType].push(e.target.value);
                        }
                    } else {
                        this.filters[filterType] = this.filters[filterType].filter(
                            item => item !== e.target.value
                        );
                    }
                    this.applyFilters();
                });
            });
        });
    }

    applyFilters() {
        console.log('Applying filters:', this.filters);
        // Filter events based on current filters
        this.filteredEvents = this.events.filter(event => {
            // Search filter
            if (this.searchQuery && 
                !event.title.toLowerCase().includes(this.searchQuery) &&
                !event.venue.toLowerCase().includes(this.searchQuery)) {
                return false;
            }

            // Location filter
            if (this.filters.location.length > 0 && 
                !this.filters.location.includes(event.location)) {
                return false;
            }

            // Category filter
            if (this.filters.category.length > 0 && 
                !this.filters.category.includes(event.category)) {
                return false;
            }

            // Price filter
            if (this.filters.price.length > 0) {
                const priceMatch = this.filters.price.some(range => {
                    if (range === 'free') return event.price === 0;
                    if (range === '0-500') return event.price >= 0 && event.price <= 500;
                    if (range === '500-1500') return event.price > 500 && event.price <= 1500;
                    if (range === '1500-3000') return event.price > 1500 && event.price <= 3000;
                    if (range === '3000+') return event.price > 3000;
                    return false;
                });
                if (!priceMatch) return false;
            }

            // Language filter
            if (this.filters.language.length > 0 && 
                !this.filters.language.includes(event.language)) {
                return false;
            }

            return true;
        });

        // Sort events
        this.sortEvents();

        // Render filtered events
        this.renderEvents();
        this.updateResultsCount();
    }

    sortEvents() {
        switch (this.sortBy) {
            case 'date':
                this.filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'price-low':
                this.filteredEvents.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredEvents.sort((a, b) => b.price - a.price);
                break;
            case 'popularity':
                this.filteredEvents.sort((a, b) => b.interested - a.interested);
                break;
            case 'relevance':
            default:
                // Keep original order
                break;
        }
    }

    loadMoreEvents() {
        // In this simplified version, we don't have pagination
        // but we could implement it if needed
        console.log('Load more events clicked');
    }

    renderEvents() {
        const grid = document.getElementById('eventsGrid');
        
        if (!grid) {
            console.error('Events grid element not found');
            return;
        }
        
        if (this.filteredEvents.length === 0) {
            grid.innerHTML = this.getEmptyState();
            return;
        }

        grid.innerHTML = this.filteredEvents.map(event => this.createEventCard(event)).join('');
    }

    createEventCard(event) {
        // Parse date if it's a string
        const eventDate = typeof event.date === 'string' ? new Date(event.date) : event.date;
        const formattedDate = this.formatDate(eventDate);
        const categoryName = this.formatCategoryName(event.category);
        
        return `
            <div class="event-card" data-event-id="${event.id}">
                <div class="event-poster">
                    <img src="${event.image}" alt="${event.title}" loading="lazy">
                    <div class="event-category">${categoryName}</div>
                </div>
                <div class="event-details">
                    <h3 class="event-title">${event.title}</h3>
                    <div class="event-date-venue">
                        <div class="event-date">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${formattedDate}</span>
                        </div>
                        <div class="event-venue">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.venue}</span>
                        </div>
                    </div>
                    <div class="event-footer">
                        <div class="event-price">
                            <span class="price-from">From</span>
                            <strong>₹${event.price ? event.price.toLocaleString('en-IN') : '0'}</strong>
                        </div>
                        <div class="event-interested">
                            <i class="fas fa-heart"></i>
                            <span class="interested-count">${this.formatNumber(event.interested || 0)}</span>
                            <span>interested</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    formatCategoryName(category) {
        return category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatDate(date) {
        const options = { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric'
        };
        return date.toLocaleDateString('en-US', options);
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    updateResultsCount() {
        const resultsCountElement = document.getElementById('resultsCount');
        if (resultsCountElement) {
            resultsCountElement.textContent = 
                `${this.filteredEvents.length} events found`;
        }
    }

    clearAllFilters() {
        // Reset all filters
        this.filters = {
            date: null,
            location: [],
            category: [],
            price: [],
            language: []
        };
        
        // Clear all checkboxes and radios
        document.querySelectorAll('.filter-option input').forEach(input => {
            input.checked = false;
        });
        
        // Clear search
        this.searchQuery = '';
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        
        this.applyFilters();
    }

    showMobileFilters() {
        const overlay = document.getElementById('mobileFilterOverlay');
        if (!overlay) return;
        
        const content = overlay.querySelector('.mobile-filter-content');
        if (!content) return;
        
        // Clone filters content for mobile
        const sidebar = document.querySelector('.filters-sidebar');
        if (!sidebar) return;
        
        const clonedFilters = sidebar.cloneNode(true);
        clonedFilters.style.position = 'static';
        clonedFilters.style.width = '100%';
        clonedFilters.style.boxShadow = 'none';
        clonedFilters.style.border = 'none';
        
        // Replace existing content
        const existingFilters = content.querySelector('.filters-sidebar');
        if (existingFilters) {
            existingFilters.remove();
        }
        content.appendChild(clonedFilters);
        
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Re-setup event listeners for cloned elements
        this.setupFilterListeners();
    }

    hideMobileFilters() {
        const overlay = document.getElementById('mobileFilterOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
        document.body.style.overflow = 'auto';
    }

    viewEventDetails(eventId) {
        // Redirect to event details page with event ID as URL parameter
        window.location.href = `event-details.html?id=${eventId}`;
    }

    getEmptyState() {
        return `
            <div class="empty-state">
                <h3>No events found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button onclick="eventsApp.clearAllFilters()">Clear All Filters</button>
            </div>
        `;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded, initializing EventsApp');
    try {
        window.eventsApp = new EventsApp();
        console.log('EventsApp initialized:', window.eventsApp);
    } catch (error) {
        console.error('Error initializing EventsApp:', error);
        // Show error on page
        const grid = document.getElementById('eventsGrid');
        if (grid) {
            grid.innerHTML = `
                <div style="text-align: center; padding: 40px; color: red;">
                    <h2>Error Initializing Events</h2>
                    <p>${error.message}</p>
                    <p>Please check the browser console for more details.</p>
                </div>
            `;
        }
    }
});

// Global function for template compatibility
function viewEventDetails(eventId) {
    console.log('viewEventDetails called with:', eventId);
    if (window.eventsApp) {
        window.eventsApp.viewEventDetails(eventId);
    } else {
        console.error('EventsApp not initialized');
    }
}