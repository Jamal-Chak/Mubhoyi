// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar && window.scrollY > 100) {
        navbar.style.background = 'rgba(248, 194, 183, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else if (navbar) {
        navbar.style.background = 'rgba(248, 194, 183, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const btnText = submitButton.querySelector('.btn-text');
    const btnLoading = submitButton.querySelector('.btn-loading');
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    submitButton.disabled = true;
    
    try {
        const data = Object.fromEntries(formData);
        
        // Simulate form submission (replace with actual API call)
        await simulateFormSubmission(data);
        
        showNotification('Thank you for your inquiry! We will get back to you within 24 hours.', 'success');
        form.reset();
        
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Failed to send inquiry. Please try again.', 'error');
    } finally {
        // Reset button state
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitButton.disabled = false;
    }
}

// Simulate form submission (replace with actual API call)
async function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form data submitted:', data);
            resolve({ success: true });
        }, 2000);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification container if it doesn't exist
    let notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notificationContainer';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
        `;
        document.body.appendChild(notificationContainer);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles for notification
    notification.style.cssText = `
        position: relative;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        margin-bottom: 10px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        color: white;
        font-weight: 500;
        max-width: 300px;
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = '#4CAF50';
            break;
        case 'error':
            notification.style.background = '#f44336';
            break;
        case 'info':
            notification.style.background = '#E46F6F'; // Using our coral color
            break;
        default:
            notification.style.background = '#2196F3';
    }
    
    notificationContainer.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Set current page as active in navigation
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setActiveNavLink();
    
    // Add loading animation to page
    document.body.classList.add('loaded');
});

// Service package selection
function selectService(serviceName) {
    // Scroll to contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Set the selected service in the form
        const serviceSelect = document.querySelector('select[name="service"]');
        if (serviceSelect) {
            const options = Array.from(serviceSelect.options);
            const selectedOption = options.find(option => 
                option.text.toLowerCase().includes(serviceName.toLowerCase())
            );
            
            if (selectedOption) {
                serviceSelect.value = selectedOption.value;
            }
        }
        
        // Show confirmation message
        showNotification(`You've selected ${serviceName} service!`, 'info');
    }
}

// Event type selection
function selectEventType(eventType) {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Set the selected event type in the form
        const eventSelect = document.querySelector('select[name="event-type"]');
        if (eventSelect) {
            eventSelect.value = eventType;
        }
        
        // Show confirmation message
        showNotification(`You've selected ${eventType} event!`, 'info');
    }
}

// Price calculator (optional feature)
function calculatePrice(service, guests, duration) {
    const basePrices = {
        'full-service': 5000,
        'catering': 1500,
        'floral': 2000,
        'rentals': 1000
    };
    
    const basePrice = basePrices[service] || 0;
    const guestMultiplier = Math.max(1, guests / 50);
    const durationMultiplier = Math.max(1, duration / 4);
    
    return Math.round(basePrice * guestMultiplier * durationMultiplier);
}

// Initialize any service calculators on the page
document.addEventListener('DOMContentLoaded', function() {
    const priceCalculator = document.getElementById('priceCalculator');
    if (priceCalculator) {
        priceCalculator.addEventListener('submit', function(e) {
            e.preventDefault();
            const service = this.querySelector('[name="service"]').value;
            const guests = parseInt(this.querySelector('[name="guests"]').value) || 0;
            const duration = parseInt(this.querySelector('[name="duration"]').value) || 0;
            
            const estimatedPrice = calculatePrice(service, guests, duration);
            showNotification(`Estimated price: R${estimatedPrice}`, 'info');
        });
    }
});