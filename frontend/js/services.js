// Services Quote Builder
class QuoteBuilder {
    constructor() {
        this.selectedServices = new Map();
        this.basePrices = {
            'full-service': 5000,
            'catering': 1500,
            'floral': 2000,
            'rentals': 1000
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateTotal();
    }

    bindEvents() {
        // Checkbox changes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.handleServiceSelection(e));
        });

        // Get Quote button
        document.getElementById('getQuoteBtn').addEventListener('click', () => this.showQuoteModal());

        // Reset button
        document.getElementById('resetSelection').addEventListener('click', () => this.resetSelection());

        // Modal events
        document.querySelector('.close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('printQuote').addEventListener('click', () => this.printQuote());
        document.getElementById('contactUs').addEventListener('click', () => this.contactUs());

        // Close modal when clicking outside
        document.getElementById('quoteModal').addEventListener('click', (e) => {
            if (e.target.id === 'quoteModal') this.closeModal();
        });
    }

    handleServiceSelection(event) {
        const checkbox = event.target;
        const service = checkbox.dataset.service;
        const price = parseInt(checkbox.dataset.price);

        if (checkbox.checked) {
            this.selectedServices.set(service, price);
        } else {
            this.selectedServices.delete(service);
        }

        this.updateTotal();
        this.updateSelectedServicesList();
        this.updateGetQuoteButton();
    }

    updateTotal() {
        let total = 0;

        // Add base prices for categories that have selected services
        const categories = ['full-service', 'catering', 'floral', 'rentals'];
        categories.forEach(category => {
            const hasServicesInCategory = Array.from(this.selectedServices.keys()).some(service => {
                return this.getServiceCategory(service) === category;
            });
            if (hasServicesInCategory) {
                total += this.basePrices[category];
            }
        });

        // Add individual service prices
        this.selectedServices.forEach(price => {
            total += price;
        });

        document.getElementById('totalAmount').textContent = `R${total.toLocaleString()}`;
    }

    getServiceCategory(service) {
        const categoryMap = {
            'event-conceptualization': 'full-service',
            'budget-planning': 'full-service',
            'vendor-coordination': 'full-service',
            'timeline-creation': 'full-service',
            'day-coordination': 'full-service',
            'menu-planning': 'catering',
            'catering-staff': 'catering',
            'bar-setup': 'catering',
            'beverage-packages': 'catering',
            'dietary-accommodations': 'catering',
            'floral-arrangements': 'floral',
            'venue-decoration': 'floral',
            'theme-design': 'floral',
            'setup-teardown': 'floral',
            'furniture-rentals': 'rentals',
            'lighting-audio': 'rentals',
            'specialty-decor': 'rentals',
            'delivery-setup': 'rentals'
        };
        return categoryMap[service];
    }

    updateSelectedServicesList() {
        const container = document.getElementById('selectedServices');
        
        if (this.selectedServices.size === 0) {
            container.innerHTML = '<p class="empty-message">No services selected yet</p>';
            return;
        }

        let html = '';
        this.selectedServices.forEach((price, service) => {
            const serviceName = this.getServiceDisplayName(service);
            html += `
                <div class="selected-service-item">
                    <span class="service-name">${serviceName}</span>
                    <span class="service-price">R${price}</span>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    getServiceDisplayName(serviceKey) {
        const names = {
            'event-conceptualization': 'Event Conceptualization',
            'budget-planning': 'Budget Planning',
            'vendor-coordination': 'Vendor Coordination',
            'timeline-creation': 'Timeline Creation',
            'day-coordination': 'Day-of Coordination',
            'menu-planning': 'Menu Planning',
            'catering-staff': 'Catering Staff',
            'bar-setup': 'Bar Setup',
            'beverage-packages': 'Beverage Packages',
            'dietary-accommodations': 'Dietary Accommodations',
            'floral-arrangements': 'Floral Arrangements',
            'venue-decoration': 'Venue Decoration',
            'theme-design': 'Theme Design',
            'setup-teardown': 'Setup & Teardown',
            'furniture-rentals': 'Furniture Rentals',
            'lighting-audio': 'Lighting & Audio',
            'specialty-decor': 'Specialty Decor',
            'delivery-setup': 'Delivery & Setup'
        };
        return names[serviceKey] || serviceKey;
    }

    updateGetQuoteButton() {
        const button = document.getElementById('getQuoteBtn');
        button.disabled = this.selectedServices.size === 0;
    }

    showQuoteModal() {
        this.populateInvoice();
        document.getElementById('quoteModal').style.display = 'block';
    }

    closeModal() {
        document.getElementById('quoteModal').style.display = 'none';
    }

    populateInvoice() {
        // Set invoice date
        const now = new Date();
        document.getElementById('invoiceDate').textContent = `Generated: ${now.toLocaleDateString()}`;

        // Populate invoice items
        const tbody = document.getElementById('invoiceItems');
        let html = '';
        let subtotal = 0;

        // Add base prices for categories with selected services
        const categories = ['full-service', 'catering', 'floral', 'rentals'];
        categories.forEach(category => {
            const hasServices = Array.from(this.selectedServices.keys()).some(service => 
                this.getServiceCategory(service) === category
            );
            if (hasServices) {
                const basePrice = this.basePrices[category];
                subtotal += basePrice;
                html += `
                    <tr>
                        <td>${this.getCategoryDisplayName(category)} (Base)</td>
                        <td>R${basePrice}</td>
                    </tr>
                `;
            }
        });

        // Add individual services
        this.selectedServices.forEach((price, service) => {
            subtotal += price;
            html += `
                <tr>
                    <td>${this.getServiceDisplayName(service)}</td>
                    <td>R${price}</td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
        document.getElementById('invoiceTotal').textContent = `R${subtotal.toLocaleString()}`;
    }

    getCategoryDisplayName(category) {
        const names = {
            'full-service': 'Full Service Event Management',
            'catering': 'Catering & Bar Services',
            'floral': 'Floral Design & Decor',
            'rentals': 'Specialty Rental Decor'
        };
        return names[category];
    }

    printQuote() {
        window.print();
    }

    contactUs() {
        // Collect selected services for the contact form
        const services = Array.from(this.selectedServices.keys())
            .map(service => this.getServiceDisplayName(service))
            .join(', ');

        // Store in localStorage for the contact page
        localStorage.setItem('selectedServices', services);
        localStorage.setItem('quoteTotal', document.getElementById('totalAmount').textContent);

        // Redirect to contact page
        window.location.href = 'contact.html';
    }

    resetSelection() {
        // Uncheck all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Clear selected services
        this.selectedServices.clear();

        // Update UI
        this.updateTotal();
        this.updateSelectedServicesList();
        this.updateGetQuoteButton();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuoteBuilder();
});