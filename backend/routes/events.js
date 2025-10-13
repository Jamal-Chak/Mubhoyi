const express = require('express');
const router = express.Router();

// Service packages data
const servicePackages = [
    {
        id: 1,
        name: "Full Service Event Management",
        slug: "full-service",
        price: 5000,
        startingPrice: 5000,
        description: "Complete end-to-end event planning and management",
        features: [
            "Event conceptualization and design",
            "Budget planning and management",
            "Vendor coordination and management",
            "Timeline creation and execution",
            "Day-of event coordination",
            "Venue selection and booking",
            "Guest list management"
        ],
        category: "planning"
    },
    {
        id: 2,
        name: "Catering & Bar Services",
        slug: "catering",
        price: 1500,
        startingPrice: 1500,
        description: "Exceptional culinary experiences with professional bar services",
        features: [
            "Custom menu planning",
            "Professional catering staff",
            "Bar setup and management",
            "Beverage package options",
            "Special dietary accommodations",
            "Food tasting session",
            "Equipment rental coordination"
        ],
        category: "catering"
    },
    {
        id: 3,
        name: "Floral Design & Decor",
        slug: "floral",
        price: 2000,
        startingPrice: 2000,
        description: "Beautiful floral arrangements and decor to transform your venue",
        features: [
            "Custom floral arrangements",
            "Venue decoration and styling",
            "Theme-based design concepts",
            "Setup and teardown services",
            "Seasonal flower selection",
            "Centerpieces and bouquets",
            "Lighting design"
        ],
        category: "design"
    },
    {
        id: 4,
        name: "Specialty Rental Decor",
        slug: "rentals",
        price: 1000,
        startingPrice: 1000,
        description: "Premium rental items to enhance your event experience",
        features: [
            "Furniture and linen rentals",
            "Lighting and audio equipment",
            "Specialty decor items",
            "Delivery and setup included",
            "Table settings and centerpieces",
            "Dance floor and staging",
            "Tent and marquee rentals"
        ],
        category: "rentals"
    }
];

// Get all service packages
router.get('/packages', (req, res) => {
    try {
        res.json({
            success: true,
            data: servicePackages,
            count: servicePackages.length
        });
    } catch (error) {
        console.error('Error fetching packages:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch service packages'
        });
    }
});

// Get package by slug
router.get('/packages/:slug', (req, res) => {
    try {
        const { slug } = req.params;
        const package = servicePackages.find(pkg => pkg.slug === slug);
        
        if (!package) {
            return res.status(404).json({
                success: false,
                error: 'Service package not found'
            });
        }

        res.json({
            success: true,
            data: package
        });
    } catch (error) {
        console.error('Error fetching package:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch service package'
        });
    }
});

// Handle inquiry form submission
router.post('/inquiry', async (req, res) => {
    try {
        const { 
            name, 
            email, 
            phone, 
            service, 
            eventType, 
            guests, 
            date, 
            message 
        } = req.body;

        // Validate required fields
        if (!name || !email || !service) {
            return res.status(400).json({
                success: false,
                error: 'Name, email, and service are required fields'
            });
        }

        // Create inquiry object
        const inquiry = {
            id: Date.now(),
            name,
            email,
            phone: phone || 'Not provided',
            service,
            eventType: eventType || 'Not specified',
            guests: guests || 'Not specified',
            date: date || 'Not specified',
            message: message || 'No additional message',
            submittedAt: new Date().toISOString(),
            status: 'new'
        };

        console.log('📧 New inquiry received:', inquiry);

        res.json({
            success: true,
            message: 'Thank you for your inquiry! We will get back to you within 24 hours.',
            inquiryId: inquiry.id
        });

    } catch (error) {
        console.error('❌ Inquiry error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process inquiry. Please try again.'
        });
    }
});

// Get price estimate
router.post('/estimate', (req, res) => {
    try {
        const { service, guests, duration } = req.body;

        if (!service) {
            return res.status(400).json({
                success: false,
                error: 'Service type is required'
            });
        }

        const selectedPackage = servicePackages.find(pkg => pkg.slug === service);
        if (!selectedPackage) {
            return res.status(404).json({
                success: false,
                error: 'Service package not found'
            });
        }

        const basePrice = selectedPackage.startingPrice;
        const guestCount = parseInt(guests) || 50;
        const eventDuration = parseInt(duration) || 4;

        // Simple pricing calculation
        const guestMultiplier = Math.max(1, guestCount / 50);
        const durationMultiplier = Math.max(1, eventDuration / 4);
        
        const estimatedPrice = Math.round(basePrice * guestMultiplier * durationMultiplier);

        res.json({
            success: true,
            data: {
                service: selectedPackage.name,
                basePrice,
                guests: guestCount,
                duration: eventDuration,
                estimatedPrice,
                currency: 'ZAR'
            }
        });

    } catch (error) {
        console.error('Estimation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to calculate estimate'
        });
    }
});

module.exports = router;