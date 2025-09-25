// Ticketmaster API Service for Event Details Page

class TicketmasterApiService {
    constructor() {
        // Ticketmaster API configuration
        this.baseUrl = 'https://app.ticketmaster.com/discovery/v2';
        // IMPORTANT: In a real application, you should use environment variables or server-side proxy
        // to protect your API key. For demo purposes, we're using a placeholder.
        this.apiKey = 'YOUR_API_KEY'; // Replace with your actual Ticketmaster API key
        this.useMockData = true; // Set to false when you have a real API key
    }

    // Fetch event details by ID from Ticketmaster
    async getEventDetails(eventId) {
        try {
            if (this.useMockData) {
                // Simulate API delay
                await this.delay(800);
                return this.getMockEventDetails(eventId);
            } else {
                // For Ticketmaster, we need to use their API endpoint
                const response = await fetch(`${this.baseUrl}/events.json?apikey=${this.apiKey}&id=${eventId}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                return this.transformTicketmasterEvent(data);
            }
        } catch (error) {
            console.error('Error fetching event details from Ticketmaster:', error);
            throw error;
        }
    }

    // Search events using Ticketmaster API
    async searchEvents(query, filters = {}) {
        try {
            if (this.useMockData) {
                await this.delay(500);
                return this.getMockSearchResults(query, filters);
            } else {
                // Build query parameters
                const params = new URLSearchParams({
                    apikey: this.apiKey,
                    keyword: query,
                    size: filters.size || 20,
                    page: filters.page || 0
                });
                
                // Add optional filters
                if (filters.city) params.append('city', filters.city);
                if (filters.state) params.append('state', filters.state);
                if (filters.country) params.append('country', filters.country);
                if (filters.startDateTime) params.append('startDateTime', filters.startDateTime);
                if (filters.endDateTime) params.append('endDateTime', filters.endDateTime);
                if (filters.classificationName) params.append('classificationName', filters.classificationName);
                
                const response = await fetch(`${this.baseUrl}/events.json?${params}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                return this.transformTicketmasterSearchResults(data);
            }
        } catch (error) {
            console.error('Error searching events from Ticketmaster:', error);
            return { events: [], total: 0 };
        }
    }

    // Transform Ticketmaster event data to our format
    transformTicketmasterEvent(data) {
        if (!data || !data._embedded || !data._embedded.events || data._embedded.events.length === 0) {
            throw new Error('No event data found');
        }
        
        const tmEvent = data._embedded.events[0];
        
        // Extract images
        const images = tmEvent.images ? tmEvent.images.map(img => img.url) : [];
        
        // Extract dates
        const date = tmEvent.dates ? tmEvent.dates.start : {};
        const startDate = date.dateTime || date.localDate;
        const endDate = tmEvent.dates ? tmEvent.dates.end : {};
        const endDateTime = endDate.dateTime || endDate.localDate;
        
        // Extract venue information
        const venue = tmEvent._embedded && tmEvent._embedded.venues && tmEvent._embedded.venues[0] ? 
            tmEvent._embedded.venues[0] : {};
        
        // Extract classifications (genre, subgenre, etc.)
        const classifications = tmEvent.classifications || [];
        const primaryClassification = classifications[0] || {};
        const genre = primaryClassification.genre ? primaryClassification.genre.name : '';
        const subGenre = primaryClassification.subGenre ? primaryClassification.subGenre.name : '';
        
        // Extract price ranges
        const priceRanges = tmEvent.priceRanges || [];
        const minPrice = priceRanges.length > 0 ? priceRanges[0].min : 0;
        const maxPrice = priceRanges.length > 0 ? priceRanges[0].max : 0;
        
        // Extract attractions (artists/bands)
        const attractions = tmEvent._embedded && tmEvent._embedded.attractions ? 
            tmEvent._embedded.attractions : [];
        const artists = attractions.map(attraction => attraction.name);
        
        return {
            id: tmEvent.id,
            title: tmEvent.name,
            date: startDate,
            endDate: endDateTime,
            venue: venue.name ? `${venue.name}, ${venue.city ? venue.city.name : ''}` : '',
            location: venue.city ? venue.city.name : '',
            category: genre,
            subcategory: subGenre,
            description: tmEvent.info || tmEvent.description || '',
            highlights: [],
            importantInfo: [],
            facilities: [],
            images: images.slice(0, 5), // Limit to 5 images
            gallery: images.slice(0, 10), // Limit to 10 gallery images
            offers: [],
            venueLayout: {
                description: '',
                features: [],
                mapImage: ''
            },
            faqs: [],
            terms: [],
            price: minPrice || 0,
            duration: '',
            ageLimit: '',
            language: '',
            genre: genre,
            city: venue.city ? venue.city.name : '',
            interestedCount: 0
        };
    }

    // Transform Ticketmaster search results to our format
    transformTicketmasterSearchResults(data) {
        if (!data || !data._embedded || !data._embedded.events) {
            return { events: [], total: 0 };
        }
        
        const tmEvents = data._embedded.events;
        const total = data.page ? data.page.totalElements : tmEvents.length;
        
        const events = tmEvents.map(tmEvent => {
            // Extract images
            const images = tmEvent.images ? tmEvent.images.map(img => img.url) : [];
            
            // Extract dates
            const date = tmEvent.dates ? tmEvent.dates.start : {};
            const startDate = date.dateTime || date.localDate;
            
            // Extract venue information
            const venue = tmEvent._embedded && tmEvent._embedded.venues && tmEvent._embedded.venues[0] ? 
                tmEvent._embedded.venues[0] : {};
            
            // Extract price ranges
            const priceRanges = tmEvent.priceRanges || [];
            const minPrice = priceRanges.length > 0 ? priceRanges[0].min : 0;
            
            return {
                id: tmEvent.id,
                title: tmEvent.name,
                date: startDate,
                venue: venue.name ? `${venue.name}, ${venue.city ? venue.city.name : ''}` : '',
                price: minPrice || 0,
                image: images.length > 0 ? images[0] : '',
                category: tmEvent.type || ''
            };
        });
        
        return {
            events: events,
            total: total
        };
    }

    // Helper methods for mock data
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
        return {
            events: allEvents.filter(event => 
                event.title.toLowerCase().includes(query.toLowerCase()) ||
                event.venue.toLowerCase().includes(query.toLowerCase()) ||
                event.category.toLowerCase().includes(query.toLowerCase())
            ),
            total: allEvents.length
        };
    }
}

// Initialize the Ticketmaster API service
const ticketmasterApiService = new TicketmasterApiService();

// Make it globally available
window.ticketmasterApiService = ticketmasterApiService;