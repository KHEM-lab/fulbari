/**
 * Fulbari Educational Academy - Script
 * Handles modal interactions, keyboard navigation, form submission, and accessibility
 */

// Get modal elements
const modal = document.getElementById('imgModal');
const expandedImg = document.getElementById('expandedImg');
const closeBtn = document.querySelector('.close-btn');

/**
 * Opens the image modal with the clicked image
 * @param {HTMLElement} element - The clicked image element
 */
function openModal(element) {
    if (!element || !element.src) return;
    
    expandedImg.src = element.src;
    expandedImg.alt = element.alt || 'Gallery image';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    
    // Set focus to close button for keyboard accessibility
    closeBtn.focus();
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

/**
 * Closes the image modal
 * @param {Event} event - The event that triggered the close
 */
function closeModal(event) {
    // If clicking on the modal background (not the image or content)
    if (event && event.target === modal) {
        performClose();
    } else if (event && event.target === closeBtn) {
        performClose();
    } else if (!event) {
        // Called programmatically (e.g., from keyboard handler)
        performClose();
    } else {
        return;
    }
}

/**
 * Performs the actual modal close operation
 */
function performClose() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Return focus to the last clicked gallery item
    const focusTarget = document.querySelector('.gallery-item:focus-visible') || 
                       document.querySelector('.gallery-item');
    if (focusTarget) {
        focusTarget.focus();
    }
}

/**
 * Handles keyboard events in the modal
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleModalKeyboard(event) {
    if (!modal.classList.contains('open')) return;
    
    // Close on Escape key
    if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
    }
}

/**
 * Handles keyboard events for gallery items
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleGalleryKeyboard(event) {
    // Open modal on Enter or Space
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(event.target);
    }
}

/**
 * Initialize event listeners
 */
function init() {
    // Modal click handlers
    if (modal && closeBtn) {
        modal.addEventListener('click', closeModal);
        closeBtn.addEventListener('click', closeModal);
        document.addEventListener('keydown', handleModalKeyboard);
    }
    
    // Gallery items keyboard support
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('keydown', handleGalleryKeyboard);
    });
    
    // Form validation and submission
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation feedback
        form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('blur', validateField);
            field.addEventListener('input', () => {
                if (field.value.trim()) {
                    field.setAttribute('aria-invalid', 'false');
                }
            });
        });
    }
    
    // Initialize smooth scroll
    initSmoothScroll();
}

/**
 * Validates a form field
 * @param {Event} event - The blur event
 */
function validateField(event) {
    const field = event.target;
    
    if (!field.value.trim() && field.hasAttribute('required')) {
        field.setAttribute('aria-invalid', 'true');
    } else if (field.type === 'email' && field.value.trim() && !isValidEmail(field.value)) {
        field.setAttribute('aria-invalid', 'true');
    } else {
        field.setAttribute('aria-invalid', 'false');
    }
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Shows feedback message to user
 * @param {string} message - The message to display
 * @param {string} type - 'success' or 'error'
 */
function showFeedback(message, type) {
    const feedbackEl = document.getElementById('formFeedback');
    if (!feedbackEl) return;
    
    feedbackEl.textContent = message;
    feedbackEl.className = `form-feedback ${type}`;
    
    // Auto-hide success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            feedbackEl.className = 'form-feedback';
        }, 5000);
    }
}

/**
 * Handles form submission
 * @param {Event} event - The submit event
 */
function handleFormSubmit(event) {
    const form = event.target;
    let isValid = true;
    
    // Reset feedback
    const feedbackEl = document.getElementById('formFeedback');
    if (feedbackEl) {
        feedbackEl.className = 'form-feedback';
    }
    
    // Validate all fields
    form.querySelectorAll('input[required], textarea[required]').forEach(field => {
        if (!field.value.trim()) {
            field.setAttribute('aria-invalid', 'true');
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
            field.setAttribute('aria-invalid', 'true');
            isValid = false;
        } else {
            field.setAttribute('aria-invalid', 'false');
        }
    });
    
    if (!isValid) {
        event.preventDefault();
        showFeedback('Please fill in all required fields correctly.', 'error');
    }
    // If valid, form will submit to Formspree
    // You can optionally add additional handling here
}

/**
 * Smooth scroll to sections
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target && this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
