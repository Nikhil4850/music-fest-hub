// Ticketmaster Events API Service

class TicketmasterEventsService {
    constructor() {
        // Ticketmaster API configuration
        this.baseUrl = 'https://app.ticketmaster.com/discovery/v2';
        // IMPORTANT: In a real application, you should use environment variables or server-side proxy
        // to protect your API key. For demo purposes, we're using a placeholder.
        this.apiKey = 'YOUR_API_KEY'; // Replace with your actual Ticketmaster API key
        this.useMockData = true; // Set to false when you have a real API key
    }

    // Fetch events from Ticketmaster
    async getEvents(filters = {}, page = 0, size = 20) {
        try {
            if (this.useMockData) {
                // Simulate API delay
                await this.delay(800);
                return this.getMockEvents(filters, page, size);
            } else {
                // Build query parameters
                const params = new URLSearchParams({
                    apikey: this.apiKey,
                    size: size,
                    page: page
                });
                
                // Add optional filters
                if (filters.keyword) params.append('keyword', filters.keyword);
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
                return this.transformTicketmasterEvents(data);
            }
        } catch (error) {
            console.error('Error fetching events from Ticketmaster:', error);
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
                return this.transformTicketmasterEvents(data);
            }
        } catch (error) {
            console.error('Error searching events from Ticketmaster:', error);
            return { events: [], total: 0 };
        }
    }

    // Transform Ticketmaster events data to our format
    transformTicketmasterEvents(data) {
        if (!data || !data._embedded || !data._embedded.events) {
            return { events: [], total: 0 };
        }
        
        const tmEvents = data._embedded.events;
        const total = data.page ? data.page.totalElements : tmEvents.length;
        const page = data.page ? data.page.number : 0;
        const totalPages = data.page ? data.page.totalPages : 0;
        
        const events = tmEvents.map(tmEvent => {
            // Extract images
            const images = tmEvent.images ? tmEvent.images.map(img => img.url) : [];
            
            // Extract dates
            const date = tmEvent.dates ? tmEvent.dates.start : {};
            const startDate = date.dateTime || date.localDate;
            
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
                name: tmEvent.name,
                date: startDate,
                venue: venue.name ? `${venue.name}, ${venue.city ? venue.city.name : ''}` : '',
                image: images.length > 0 ? images[0] : '',
                lineup: artists.slice(0, 5), // Limit to 5 artists
                description: tmEvent.info || tmEvent.description || '',
                stages: [],
                tickets: {
                    regular: { 
                        price: minPrice || 0, 
                        name: 'Regular', 
                        features: ['General Admission', 'Access to All Stages'] 
                    }
                },
                genre: genre,
                subGenre: subGenre,
                url: tmEvent.url || ''
            };
        });
        
        return {
            events: events,
            total: total,
            page: page,
            totalPages: totalPages
        };
    }

    // Helper methods for mock data
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getMockEvents(filters = {}, page = 0, size = 20) {
        // Mock event data
        const mockEvents = [
            {
                id: '1',
                name: 'Electric Dreams Festival',
                date: '2024-07-15',
                venue: 'Central Park, NYC',
                image: 'https://picsum.photos/600/400?random=1',
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
                image: 'https://picsum.photos/600/400?random=2',
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
                image: 'https://picsum.photos/600/400?random=3',
                lineup: ['Herbie Hancock', 'Kamasi Washington', 'Robert Glasper', 'Esperanza Spalding'],
                description: 'An intimate evening of world-class jazz and blues performances.',
                stages: ['Main Hall', 'Intimate Lounge'],
                tickets: {
                    regular: { price: 79, name: 'Regular', features: ['General Admission', 'Access to All Stages', 'Welcome Drink'] },
                    vip: { price: 149, name: 'VIP', features: ['VIP Seating', 'Premium Viewing', 'Complimentary Drinks', 'Artist Meet & Greet'] },
                    backstage: { price: 229, name: 'Backstage', features: ['Backstage Access', 'Artist Meet & Greet', 'Premium Bar', 'VIP Lounge', 'Signed Merchandise'] }
                }
            },
            {
                id: '4',
                name: 'Country Roads Festival',
                date: '2024-10-05',
                venue: 'Nashville Fairgrounds, TN',
                image: 'https://picsum.photos/600/400?random=4',
                lineup: ['Luke Bryan', 'Carrie Underwood', 'Blake Shelton', 'Miranda Lambert'],
                description: 'Experience the best of country music under the open sky.',
                stages: ['Grand Ole Stage', 'Honky Tonk Stage', 'Bluegrass Corner'],
                tickets: {
                    regular: { price: 89, name: 'Regular', features: ['General Admission', 'Access to All Stages', 'Food Trucks'] },
                    vip: { price: 179, name: 'VIP', features: ['VIP Seating', 'Premium Viewing', 'Complimentary Food & Drinks', 'Meet & Greet'] },
                    backstage: { price: 269, name: 'Backstage', features: ['Backstage Access', 'Artist Meet & Greet', 'Premium Bar', 'VIP Lounge', 'Exclusive Merchandise'] }
                }
            },
            {
                id: '5',
                name: 'Hip Hop Summit',
                date: '2024-11-12',
                venue: 'Staples Center, LA',
                image: 'https://picsum.photos/600/400?random=5',
                lineup: ['Kendrick Lamar', 'Drake', 'Cardi B', 'Travis Scott'],
                description: 'The biggest names in hip hop come together for one unforgettable night.',
                stages: ['Main Stage', 'Underground Stage', 'Freestyle Zone'],
                tickets: {
                    regular: { price: 119, name: 'Regular', features: ['General Admission', 'Access to All Stages', 'Food Courts'] },
                    vip: { price: 229, name: 'VIP', features: ['VIP Area Access', 'Premium Viewing', 'Complimentary Drinks', 'Meet & Greet'] },
                    backstage: { price: 339, name: 'Backstage', features: ['Backstage Access', 'Artist Meet & Greet', 'Premium Bar', 'VIP Lounge', 'Exclusive Merchandise'] }
                }
            },
            {
                id: '6',
                name: 'Classical Symphony Night',
                date: '2024-12-01',
                venue: 'Carnegie Hall, NYC',
                image: 'https://picsum.photos/600/400?random=6',
                lineup: ['New York Philharmonic', 'Berlin Philharmonic', 'London Symphony Orchestra'],
                description: 'An evening of timeless classical masterpieces performed by world-renowned orchestras.',
                stages: ['Main Hall', 'Chamber Music Room'],
                tickets: {
                    regular: { price: 69, name: 'Regular', features: ['General Admission', 'Program Booklet'] },
                    vip: { price: 129, name: 'VIP', features: ['VIP Seating', 'Premium Viewing', 'Complimentary Drinks', 'Meet the Conductor'] },
                    backstage: { price: 199, name: 'Backstage', features: ['Backstage Access', 'Meet the Musicians', 'Premium Bar', 'VIP Lounge'] }
                }
            }
        ];

        // Apply filters
        let filteredEvents = [...mockEvents];
        
        if (filters.keyword) {
            const keyword = filters.keyword.toLowerCase();
            filteredEvents = filteredEvents.filter(event => 
                event.name.toLowerCase().includes(keyword) ||
                event.description.toLowerCase().includes(keyword) ||
                event.lineup.some(artist => artist.toLowerCase().includes(keyword))
            );
        }
        
        if (filters.city) {
            const city = filters.city.toLowerCase();
            filteredEvents = filteredEvents.filter(event => 
                event.venue.toLowerCase().includes(city)
            );
        }
        
        // Pagination
        const total = filteredEvents.length;
        const startIndex = page * size;
        const paginatedEvents = filteredEvents.slice(startIndex, startIndex + size);
        
        return {
            events: paginatedEvents,
            total: total,
            page: page,
            totalPages: Math.ceil(total / size)
        };
    }

    getMockSearchResults(query, filters) {
        return this.getMockEvents({ ...filters, keyword: query }, filters.page || 0, filters.size || 20);
    }
}

// Initialize the Ticketmaster Events service
const ticketmasterEventsService = new TicketmasterEventsService();

// Make it globally available
window.ticketmasterEventsService = ticketmasterEventsService;