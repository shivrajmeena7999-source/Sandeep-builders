// State Management
let isAdmin = false;
let editedContent = {};
let editedImages = {};

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// DOM Elements
const adminModal = document.getElementById('admin-modal');
const adminPanel = document.getElementById('admin-panel');
const adminLoginForm = document.getElementById('admin-login-form');
const logoutButton = document.getElementById('logout-button');
const saveAllButton = document.getElementById('save-all-button');
const resetButton = document.getElementById('reset-button');
const contactForm = document.getElementById('contact-form');

// Forgot password elements
const forgotPasswordModal = document.getElementById('forgot-password-modal');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const backToLoginLink = document.getElementById('back-to-login');
const closeModalForgot = document.querySelector('.close-modal-forgot');

// Admin Panel Elements
const applyColorsButton = document.getElementById('apply-colors');
const uploadLogoBtn = document.getElementById('upload-logo-btn');
const logoUpload = document.getElementById('logo-upload');
const applyTextButton = document.getElementById('apply-text');
const applyImagesButton = document.getElementById('apply-images');
const applyFontsButton = document.getElementById('apply-fonts');

// Tab functionality
const adminTabs = document.querySelectorAll('.admin-tab');
const tabContents = document.querySelectorAll('.admin-tab-content');

// Color inputs
const colorNavyPrimary = document.getElementById('color-navy-primary');
const colorNavySecondary = document.getElementById('color-navy-secondary');
const colorNavyTertiary = document.getElementById('color-navy-tertiary');
const colorGoldPrimary = document.getElementById('color-gold-primary');
const colorGoldSecondary = document.getElementById('color-gold-secondary');
const colorGoldHover = document.getElementById('color-gold-hover');
const colorTextPrimary = document.getElementById('color-text-primary');
const colorTextSecondary = document.getElementById('color-text-secondary');
const colorTextMuted = document.getElementById('color-text-muted');

// Text inputs - Header
const editCompanyName = document.getElementById('edit-company-name');
const editPhone = document.getElementById('edit-phone');
const editEmail = document.getElementById('edit-email');
const editLocation = document.getElementById('edit-location');

// Text inputs - Hero
const editHeroTitleBefore = document.getElementById('edit-hero-title-before');
const editHeroTitleAccent = document.getElementById('edit-hero-title-accent');
const editHeroSubtitle = document.getElementById('edit-hero-subtitle');
const editCta1 = document.getElementById('edit-cta-1');
const editCta2 = document.getElementById('edit-cta-2');

// Text inputs - Services
const editServicesTitle = document.getElementById('edit-services-title');
const editServicesSubtitle = document.getElementById('edit-services-subtitle');

// Text inputs - About
const editAboutTitle = document.getElementById('edit-about-title');
const editAboutDesc1 = document.getElementById('edit-about-desc-1');
const editAboutDesc2 = document.getElementById('edit-about-desc-2');
const editStat1 = document.getElementById('edit-stat-1');
const editStat2 = document.getElementById('edit-stat-2');
const editStat3 = document.getElementById('edit-stat-3');
const editStat4 = document.getElementById('edit-stat-4');

// Text inputs - Gallery
const editGalleryTitle = document.getElementById('edit-gallery-title');
const editGallerySubtitle = document.getElementById('edit-gallery-subtitle');

// Text inputs - Projects
const editProjectsTitle = document.getElementById('edit-projects-title');
const editProjectsSubtitle = document.getElementById('edit-projects-subtitle');

// Text inputs - Contact
const editContactHindi = document.getElementById('edit-contact-hindi');
const editContactSubtitle = document.getElementById('edit-contact-subtitle');

// Text inputs - Footer
const editFooterTagline = document.getElementById('edit-footer-tagline');
const editCopyright = document.getElementById('edit-copyright');

// Image inputs
const heroBgUpload = document.getElementById('hero-bg-upload');
const aboutImageUpload = document.getElementById('about-image-upload');

// Gallery image inputs
const galleryUploads = [
    document.getElementById('gallery-1-upload'),
    document.getElementById('gallery-2-upload'),
    document.getElementById('gallery-3-upload'),
    document.getElementById('gallery-4-upload'),
    document.getElementById('gallery-5-upload'),
    document.getElementById('gallery-6-upload'),
    document.getElementById('gallery-7-upload'),
    document.getElementById('gallery-8-upload')
];

// Project image inputs
const projectUploads = [
    document.getElementById('project-1-upload'),
    document.getElementById('project-2-upload'),
    document.getElementById('project-3-upload'),
    document.getElementById('project-4-upload'),
    document.getElementById('project-5-upload'),
    document.getElementById('project-6-upload')
];

// Service icon inputs
const serviceUploads = [
    document.getElementById('service-1-upload'),
    document.getElementById('service-2-upload'),
    document.getElementById('service-3-upload'),
    document.getElementById('service-4-upload'),
    document.getElementById('service-5-upload'),
    document.getElementById('service-6-upload')
];

// Font size inputs
const fontHeroTitle = document.getElementById('font-hero-title');
const fontHeroSubtitle = document.getElementById('font-hero-subtitle');
const fontSectionTitle = document.getElementById('font-section-title');
const fontBody = document.getElementById('font-body');
const fontNav = document.getElementById('font-nav');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadContent();
    setupEventListeners();
    checkAdminSession();
    loadSavedColors();
    loadSavedLogo();
    loadSavedFonts();
});

// Load Content from Backend or Local Storage
async function loadContent() {
    try {
        const response = await fetch(`${API_BASE_URL}/content`);
        if (response.ok) {
            const data = await response.json();
            applyContent(data);
        } else {
            // Fallback to local storage
            const localContent = localStorage.getItem('sandeepBuildersContent');
            if (localContent) {
                applyContent(JSON.parse(localContent));
            }
        }
    } catch (error) {
        console.log('Using local storage for content');
        const localContent = localStorage.getItem('sandeepBuildersContent');
        if (localContent) {
            applyContent(JSON.parse(localContent));
        }
    }
}

// Apply Content to DOM
function applyContent(content) {
    if (!content) return;

    // Text content
    Object.keys(content.text || {}).forEach(key => {
        const element = document.getElementById(key);
        if (element && content.text[key]) {
            // Special handling for hero title
            if (key === 'hero-title') {
                const heroTitle = document.getElementById('hero-title');
                if (heroTitle) {
                    const accentText = content.text['hero-accent'] || 'Your Dreams';
                    const beforeText = content.text['hero-title-before'] || 'We Build ';
                    heroTitle.innerHTML = `${beforeText}<span class="gold-accent" id="hero-accent">${accentText}</span>`;
                }
            } else if (key === 'hero-title-before') {
                // Skip, handled in hero-title
            } else {
                element.textContent = content.text[key];
            }
        }
    });

    // Images
    Object.keys(content.images || {}).forEach(key => {
        const element = document.getElementById(key);
        if (element && content.images[key]) {
            const isImageContainer = element.classList && (
                element.classList.contains('gallery-image') || 
                element.classList.contains('project-image') || 
                element.classList.contains('image-placeholder') ||
                element.classList.contains('hero-background')
            );
                
            const isServiceIcon = key.startsWith('service-icon');
                
            if (element.tagName === 'DIV' && isImageContainer) {
                element.style.backgroundImage = `url(${content.images[key]})`;
                element.style.backgroundSize = 'cover';
                element.style.backgroundPosition = 'center';
                // Hide placeholder icon/text
                const icon = element.querySelector('.placeholder-icon');
                const text = element.querySelector('.placeholder-text');
                if (icon) icon.style.display = 'none';
                if (text) text.style.display = 'none';
            } else if (element.tagName === 'SPAN' && isServiceIcon) {
                element.style.backgroundImage = `url(${content.images[key]})`;
                element.style.backgroundSize = 'contain';
                element.style.backgroundRepeat = 'no-repeat';
                element.style.backgroundPosition = 'center';
                element.style.width = '48px';
                element.style.height = '48px';
                element.style.display = 'inline-block';
                element.textContent = '';
            } else if (element.tagName === 'IMG') {
                element.src = content.images[key];
            }
        }
    });

    // Colors
    if (content.colors) {
        if (content.colors.navyPrimary) {
            document.documentElement.style.setProperty('--navy-primary', content.colors.navyPrimary);
            if (colorNavyPrimary) colorNavyPrimary.value = content.colors.navyPrimary;
        }
        if (content.colors.navySecondary) {
            document.documentElement.style.setProperty('--navy-secondary', content.colors.navySecondary);
            if (colorNavySecondary) colorNavySecondary.value = content.colors.navySecondary;
        }
        if (content.colors.navyTertiary) {
            document.documentElement.style.setProperty('--navy-tertiary', content.colors.navyTertiary);
            if (colorNavyTertiary) colorNavyTertiary.value = content.colors.navyTertiary;
        }
        if (content.colors.goldPrimary) {
            document.documentElement.style.setProperty('--gold-primary', content.colors.goldPrimary);
            if (colorGoldPrimary) colorGoldPrimary.value = content.colors.goldPrimary;
        }
        if (content.colors.goldSecondary) {
            document.documentElement.style.setProperty('--gold-secondary', content.colors.goldSecondary);
            if (colorGoldSecondary) colorGoldSecondary.value = content.colors.goldSecondary;
        }
        if (content.colors.goldHover) {
            document.documentElement.style.setProperty('--gold-hover', content.colors.goldHover);
            if (colorGoldHover) colorGoldHover.value = content.colors.goldHover;
        }
        if (content.colors.textPrimary) {
            document.documentElement.style.setProperty('--text-primary', content.colors.textPrimary);
            if (colorTextPrimary) colorTextPrimary.value = content.colors.textPrimary;
        }
        if (content.colors.textSecondary) {
            document.documentElement.style.setProperty('--text-secondary', content.colors.textSecondary);
            if (colorTextSecondary) colorTextSecondary.value = content.colors.textSecondary;
        }
        if (content.colors.textMuted) {
            document.documentElement.style.setProperty('--text-muted', content.colors.textMuted);
            if (colorTextMuted) colorTextMuted.value = content.colors.textMuted;
        }
    }

    // Fonts
    if (content.fonts) {
        if (content.fonts.heroTitle) {
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle) heroTitle.style.fontSize = `${content.fonts.heroTitle}px`;
            if (fontHeroTitle) fontHeroTitle.value = content.fonts.heroTitle;
        }
        if (content.fonts.heroSubtitle) {
            const heroSubtitle = document.querySelector('.hero-subtitle');
            if (heroSubtitle) heroSubtitle.style.fontSize = `${content.fonts.heroSubtitle}px`;
            if (fontHeroSubtitle) fontHeroSubtitle.value = content.fonts.heroSubtitle;
        }
        if (content.fonts.sectionTitle) {
            const sectionTitles = document.querySelectorAll('.section-title');
            sectionTitles.forEach(title => title.style.fontSize = `${content.fonts.sectionTitle}px`);
            if (fontSectionTitle) fontSectionTitle.value = content.fonts.sectionTitle;
        }
        if (content.fonts.body) {
            const bodyElements = document.querySelectorAll('p, .service-description, .about-description');
            bodyElements.forEach(element => element.style.fontSize = `${content.fonts.body}px`);
            if (fontBody) fontBody.value = content.fonts.body;
        }
        if (content.fonts.nav) {
            const navElements = document.querySelectorAll('.nav-link');
            navElements.forEach(element => element.style.fontSize = `${content.fonts.nav}px`);
            if (fontNav) fontNav.value = content.fonts.nav;
        }
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Show admin button (always visible for easy access)
    const adminLoginBtn = document.getElementById('admin-login-btn');
    if (adminLoginBtn) {
        adminLoginBtn.style.display = 'block';
        adminLoginBtn.addEventListener('click', () => {
            if (!isAdmin) {
                adminModal.style.display = 'flex';
            } else {
                // If already logged in, logout
                handleLogout();
            }
        });
    }

    // Admin modal trigger (double-click on logo - alternative method)
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('dblclick', () => {
            if (!isAdmin) {
                adminModal.style.display = 'flex';
            }
        });
    }

    // Close modal
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            adminModal.style.display = 'none';
        });
    }

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === adminModal) {
            adminModal.style.display = 'none';
        }
        if (e.target === forgotPasswordModal) {
            forgotPasswordModal.style.display = 'none';
        }
    });

    // Forgot password link
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            adminModal.style.display = 'none';
            forgotPasswordModal.style.display = 'flex';
        });
    }

    // Back to login link
    if (backToLoginLink) {
        backToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            forgotPasswordModal.style.display = 'none';
            adminModal.style.display = 'flex';
        });
    }

    // Close forgot password modal
    if (closeModalForgot) {
        closeModalForgot.addEventListener('click', () => {
            forgotPasswordModal.style.display = 'none';
        });
    }

    // Forgot password form
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }

    // Admin login form
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }

    // Logout
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    // Save all changes
    if (saveAllButton) {
        saveAllButton.addEventListener('click', saveAllChanges);
    }

    // Reset to default
    if (resetButton) {
        resetButton.addEventListener('click', resetToDefault);
    }

    // Tab switching
    adminTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Remove active class from all tabs and contents
            adminTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });

    // Admin panel color changes
    if (applyColorsButton) {
        applyColorsButton.addEventListener('click', applyColorChanges);
    }

    // Logo upload
    if (uploadLogoBtn && logoUpload) {
        uploadLogoBtn.addEventListener('click', () => logoUpload.click());
        logoUpload.addEventListener('change', handleLogoUpload);
    }

    // Text changes
    if (applyTextButton) {
        applyTextButton.addEventListener('click', applyTextChanges);
    }

    // Image uploads
    if (applyImagesButton) {
        applyImagesButton.addEventListener('click', handleImageUploads);
    }

    // Font size changes
    if (applyFontsButton) {
        applyFontsButton.addEventListener('click', applyFontChanges);
    }

    // Font size range input value displays
    const fontInputs = [fontHeroTitle, fontHeroSubtitle, fontSectionTitle, fontBody, fontNav];
    fontInputs.forEach(input => {
        if (input) {
            const valueDisplay = document.getElementById(`${input.id}-value`);
            if (valueDisplay) {
                input.addEventListener('input', () => {
                    valueDisplay.textContent = `${input.value}px`;
                });
            }
        }
    });

    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Setup editable elements
    setupEditableElements();
}

// Check Admin Session
function checkAdminSession() {
    const token = localStorage.getItem('adminToken');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    
    if (token) {
        isAdmin = true;
        adminPanel.style.display = 'block';
        enableEditMode();
        if (adminLoginBtn) {
            adminLoginBtn.textContent = 'Logout';
        }
    } else {
        if (adminLoginBtn) {
            adminLoginBtn.textContent = 'Admin';
        }
    }
}

// Handle Admin Login
async function handleAdminLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('adminToken', data.token);
            isAdmin = true;
            adminModal.style.display = 'none';
            adminPanel.style.display = 'block';
            enableEditMode();
            
            const adminLoginBtn = document.getElementById('admin-login-btn');
            if (adminLoginBtn) {
                adminLoginBtn.textContent = 'Logout';
            }
            
            alert('Login successful! You can now edit the content.');
        } else {
            alert('Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Login error:', error);
        // Fallback for demo purposes
        if (email === 'sandeepbuilders000@gmail.com' && password === '@deep8079') {
            localStorage.setItem('adminToken', 'demo-token');
            isAdmin = true;
            adminModal.style.display = 'none';
            adminPanel.style.display = 'block';
            enableEditMode();
            
            const adminLoginBtn = document.getElementById('admin-login-btn');
            if (adminLoginBtn) {
                adminLoginBtn.textContent = 'Logout';
            }
            
            alert('Demo login successful! You can now edit the content.');
        } else {
            alert('Login failed. For demo, use sandeepbuilders000@gmail.com / @deep8079');
        }
    }

    adminLoginForm.reset();
}

// Handle Forgot Password
function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('reset-email').value;
    
    // For demo purposes, show the current password
    if (email === 'sandeepbuilders000@gmail.com') {
        alert('Password reset link sent! Your current password is: @deep8079\n\nIn production, this would send an email with a reset link.');
        forgotPasswordModal.style.display = 'none';
        adminModal.style.display = 'flex';
    } else {
        alert('Email not found. Please use sandeepbuilders000@gmail.com');
    }
    
    forgotPasswordForm.reset();
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('adminToken');
    isAdmin = false;
    adminPanel.style.display = 'none';
    disableEditMode();
    
    const adminLoginBtn = document.getElementById('admin-login-btn');
    if (adminLoginBtn) {
        adminLoginBtn.textContent = 'Admin';
    }
    
    alert('Logged out successfully.');
}

// Enable Edit Mode
function enableEditMode() {
    // Make text elements editable
    const editableTextElements = [
        'utility-phone', 'utility-email', 'utility-location',
        'logo-text', 'hero-accent', 'hero-subtitle',
        'about-description', 'about-description-2',
        'stat-projects', 'stat-clients', 'stat-years', 'stat-satisfaction',
        'contact-phone', 'contact-email', 'contact-location'
    ];

    editableTextElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.contentEditable = 'true';
            element.classList.add('editable');
            element.addEventListener('blur', handleTextEdit);
        }
    });

    // Make image elements editable
    const editableImageElements = [
        'hero-background', 'about-image',
        'gallery-1', 'gallery-2', 'gallery-3', 'gallery-4', 
        'gallery-5', 'gallery-6', 'gallery-7', 'gallery-8',
        'project-1', 'project-2', 'project-3', 'project-4',
        'project-5', 'project-6'
    ];

    editableImageElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add('editable-image');
            element.addEventListener('click', handleImageEdit);
        }
    });
}

// Disable Edit Mode
function disableEditMode() {
    const editableElements = document.querySelectorAll('.editable, .editable-image');
    editableElements.forEach(element => {
        element.contentEditable = 'false';
        element.classList.remove('editable', 'editable-image');
        element.removeEventListener('blur', handleTextEdit);
        element.removeEventListener('click', handleImageEdit);
    });
}

// Handle Text Edit
function handleTextEdit(e) {
    const element = e.target;
    const id = element.id;
    editedContent[id] = element.textContent;
}

// Handle Image Edit
function handleImageEdit(e) {
    if (!isAdmin) return;

    const element = e.target;
    const id = element.id;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    input.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const imageUrl = await uploadImage(file);
                editedImages[id] = imageUrl;

                // Update the element immediately
                if (element.tagName === 'DIV' && (element.classList.contains('gallery-image') || 
                    element.classList.contains('project-image') || 
                    element.classList.contains('image-placeholder'))) {
                    element.style.backgroundImage = `url(${imageUrl})`;
                    element.style.backgroundSize = 'cover';
                    element.style.backgroundPosition = 'center';
                    
                    // Hide placeholder icon/text
                    const icon = element.querySelector('.placeholder-icon');
                    const text = element.querySelector('.placeholder-text');
                    if (icon) icon.style.display = 'none';
                    if (text) text.style.display = 'none';
                } else if (element.tagName === 'IMG') {
                    element.src = imageUrl;
                }
            } catch (error) {
                console.error('Image upload error:', error);
                alert('Failed to upload image. Please try again.');
            }
        }
    });

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
}

// Upload Image
async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            return data.imageUrl;
        } else {
            throw new Error('Upload failed');
        }
    } catch (error) {
        console.error('Upload error:', error);
        // Fallback: convert to base64
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}

// Save All Changes
async function saveAllChanges() {
    const contentToSave = {
        text: editedContent,
        images: editedImages,
        colors: {
            navyPrimary: colorNavyPrimary?.value || '#0B1524',
            navySecondary: colorNavySecondary?.value || '#122035',
            navyTertiary: colorNavyTertiary?.value || '#1A2B42',
            goldPrimary: colorGoldPrimary?.value || '#D6A94B',
            goldSecondary: colorGoldSecondary?.value || '#B8923D',
            goldHover: colorGoldHover?.value || '#E5B85A',
            textPrimary: colorTextPrimary?.value || '#FFFFFF',
            textSecondary: colorTextSecondary?.value || '#B8C5D6',
            textMuted: colorTextMuted?.value || '#8B9BB0'
        },
        fonts: {
            heroTitle: fontHeroTitle?.value || '48',
            heroSubtitle: fontHeroSubtitle?.value || '20',
            sectionTitle: fontSectionTitle?.value || '42',
            body: fontBody?.value || '16',
            nav: fontNav?.value || '14'
        }
    };

    try {
        const response = await fetch(`${API_BASE_URL}/content`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify(contentToSave)
        });

        if (response.ok) {
            alert('All changes saved successfully!');
            editedContent = {};
            editedImages = {};
        } else {
            throw new Error('Save failed');
        }
    } catch (error) {
        console.error('Save error:', error);
        // Fallback to local storage
        localStorage.setItem('sandeepBuildersContent', JSON.stringify({
            text: editedContent,
            images: editedImages,
            colors: contentToSave.colors,
            fonts: contentToSave.fonts
        }));
        alert('Changes saved to local storage (backend unavailable).');
        editedContent = {};
        editedImages = {};
    }
}

// Reset to Default
function resetToDefault() {
    if (confirm('Are you sure you want to reset all content to default? This cannot be undone.')) {
        localStorage.removeItem('sandeepBuildersContent');
        localStorage.removeItem('sandeepBuildersColors');
        localStorage.removeItem('sandeepBuildersLogo');
        editedContent = {};
        editedImages = {};
        location.reload();
    }
}

// Apply Color Changes
function applyColorChanges() {
    const colors = {
        navyPrimary: colorNavyPrimary?.value || '#0B1524',
        navySecondary: colorNavySecondary?.value || '#122035',
        navyTertiary: colorNavyTertiary?.value || '#1A2B42',
        goldPrimary: colorGoldPrimary?.value || '#D6A94B',
        goldSecondary: colorGoldSecondary?.value || '#B8923D',
        goldHover: colorGoldHover?.value || '#E5B85A',
        textPrimary: colorTextPrimary?.value || '#FFFFFF',
        textSecondary: colorTextSecondary?.value || '#B8C5D6',
        textMuted: colorTextMuted?.value || '#8B9BB0'
    };

    // Apply colors to CSS variables
    document.documentElement.style.setProperty('--navy-primary', colors.navyPrimary);
    document.documentElement.style.setProperty('--navy-secondary', colors.navySecondary);
    document.documentElement.style.setProperty('--navy-tertiary', colors.navyTertiary);
    document.documentElement.style.setProperty('--gold-primary', colors.goldPrimary);
    document.documentElement.style.setProperty('--gold-secondary', colors.goldSecondary);
    document.documentElement.style.setProperty('--gold-hover', colors.goldHover);
    document.documentElement.style.setProperty('--text-primary', colors.textPrimary);
    document.documentElement.style.setProperty('--text-secondary', colors.textSecondary);
    document.documentElement.style.setProperty('--text-muted', colors.textMuted);

    // Save to localStorage
    localStorage.setItem('sandeepBuildersColors', JSON.stringify(colors));
    
    alert('All colors applied successfully!');
}

// Load saved colors
function loadSavedColors() {
    const savedColors = localStorage.getItem('sandeepBuildersColors');
    if (savedColors) {
        const colors = JSON.parse(savedColors);
        
        if (colorNavyPrimary && colors.navyPrimary) colorNavyPrimary.value = colors.navyPrimary;
        if (colorNavySecondary && colors.navySecondary) colorNavySecondary.value = colors.navySecondary;
        if (colorNavyTertiary && colors.navyTertiary) colorNavyTertiary.value = colors.navyTertiary;
        if (colorGoldPrimary && colors.goldPrimary) colorGoldPrimary.value = colors.goldPrimary;
        if (colorGoldSecondary && colors.goldSecondary) colorGoldSecondary.value = colors.goldSecondary;
        if (colorGoldHover && colors.goldHover) colorGoldHover.value = colors.goldHover;
        if (colorTextPrimary && colors.textPrimary) colorTextPrimary.value = colors.textPrimary;
        if (colorTextSecondary && colors.textSecondary) colorTextSecondary.value = colors.textSecondary;
        if (colorTextMuted && colors.textMuted) colorTextMuted.value = colors.textMuted;

        if (colors.navyPrimary) document.documentElement.style.setProperty('--navy-primary', colors.navyPrimary);
        if (colors.navySecondary) document.documentElement.style.setProperty('--navy-secondary', colors.navySecondary);
        if (colors.navyTertiary) document.documentElement.style.setProperty('--navy-tertiary', colors.navyTertiary);
        if (colors.goldPrimary) document.documentElement.style.setProperty('--gold-primary', colors.goldPrimary);
        if (colors.goldSecondary) document.documentElement.style.setProperty('--gold-secondary', colors.goldSecondary);
        if (colors.goldHover) document.documentElement.style.setProperty('--gold-hover', colors.goldHover);
        if (colors.textPrimary) document.documentElement.style.setProperty('--text-primary', colors.textPrimary);
        if (colors.textSecondary) document.documentElement.style.setProperty('--text-secondary', colors.textSecondary);
        if (colors.textMuted) document.documentElement.style.setProperty('--text-muted', colors.textMuted);
    }
}

// Handle Logo Upload
function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const logoData = event.target.result;
            
            // Update logo icon
            const logoIcon = document.querySelector('.logo-icon');
            if (logoIcon) {
                logoIcon.innerHTML = `<img src="${logoData}" alt="Logo" style="width: 32px; height: 32px; object-fit: contain;">`;
            }
            
            // Save to localStorage
            localStorage.setItem('sandeepBuildersLogo', logoData);
            
            alert('Logo uploaded successfully!');
        };
        reader.readAsDataURL(file);
    }
}

// Load saved logo
function loadSavedLogo() {
    const savedLogo = localStorage.getItem('sandeepBuildersLogo');
    if (savedLogo) {
        const logoIcon = document.querySelector('.logo-icon');
        if (logoIcon) {
            logoIcon.innerHTML = `<img src="${savedLogo}" alt="Logo" style="width: 32px; height: 32px; object-fit: contain;">`;
        }
    }
}

// Apply Text Changes
function applyTextChanges() {
    const textChanges = {
        // Header & Utility
        'logo-text': editCompanyName?.value || 'SANDEEP BUILDERS',
        'utility-phone': editPhone?.value || '+91 98765 43210',
        'utility-email': editEmail?.value || 'info@sandeepbuilders.com',
        'utility-location': editLocation?.value || 'Sehore & Bhopal, MP',
        
        // Hero
        'hero-accent': editHeroTitleAccent?.value || 'Your Dreams',
        'hero-subtitle': editHeroSubtitle?.value || 'Transforming visions into reality',
        
        // Services
        'services-title': editServicesTitle?.value || 'Our Services',
        'services-subtitle': editServicesSubtitle?.value || 'Comprehensive construction solutions',
        
        // About
        'about-title': editAboutTitle?.value || 'About Sandeep Builders',
        'about-description': editAboutDesc1?.value || 'With over 5 years of experience',
        'about-description-2': editAboutDesc2?.value || 'From custom homes to large-scale commercial',
        'stat-projects': editStat1?.value || '100+',
        'stat-clients': editStat2?.value || '50+',
        'stat-years': editStat3?.value || '5+',
        'stat-satisfaction': editStat4?.value || '100%',
        
        // Gallery
        'gallery-title': editGalleryTitle?.value || 'Our Gallery',
        'gallery-subtitle': editGallerySubtitle?.value || 'Explore our construction work',
        
        // Projects
        'projects-title': editProjectsTitle?.value || 'Our Projects',
        'projects-subtitle': editProjectsSubtitle?.value || 'Featured construction projects',
        
        // Contact
        'contact-hindi': editContactHindi?.value || 'संपर्क करें',
        'contact-subtitle': editContactSubtitle?.value || 'Get in touch with us',
        
        // Footer
        'footer-tagline': editFooterTagline?.value || 'Building dreams, constructing futures',
        'copyright': editCopyright?.value || '© 2024 Sandeep Builders. All rights reserved.'
    };

    // Apply changes to DOM
    Object.keys(textChanges).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = textChanges[id];
            editedContent[id] = textChanges[id];
        }
    });

    // Update hero title structure
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle && editHeroTitleBefore) {
        heroTitle.innerHTML = `We Build <span class="gold-accent" id="hero-accent">${editHeroTitleAccent.value}</span>`;
        editedContent['hero-title'] = `We Build ${editHeroTitleAccent.value}`;
    }

    // Update CTA buttons
    const cta1 = document.getElementById('hero-cta-primary');
    const cta2 = document.getElementById('hero-cta-secondary');
    if (cta1 && editCta1) {
        cta1.textContent = editCta1.value;
        editedContent['hero-cta-primary'] = editCta1.value;
    }
    if (cta2 && editCta2) {
        cta2.textContent = editCta2.value;
        editedContent['hero-cta-secondary'] = editCta2.value;
    }

    // Update contact section
    const contactPhone = document.getElementById('contact-phone');
    const contactEmail = document.getElementById('contact-email');
    const contactLocation = document.getElementById('contact-location');
    if (contactPhone && editPhone) {
        contactPhone.textContent = editPhone.value;
        editedContent['contact-phone'] = editPhone.value;
    }
    if (contactEmail && editEmail) {
        contactEmail.textContent = editEmail.value;
        editedContent['contact-email'] = editEmail.value;
    }
    if (contactLocation && editLocation) {
        contactLocation.textContent = editLocation.value;
        editedContent['contact-location'] = editLocation.value;
    }

    alert('All text changes applied successfully!');
}

// Handle Image Uploads
async function handleImageUploads() {
    let hasChanges = false;

    // Hero background
    if (heroBgUpload?.files[0]) {
        const heroBgData = await fileToBase64(heroBgUpload.files[0]);
        const heroBackground = document.getElementById('hero-background');
        if (heroBackground) {
            heroBackground.style.backgroundImage = `url(${heroBgData})`;
            heroBackground.style.backgroundSize = 'cover';
            heroBackground.style.backgroundPosition = 'center';
            editedImages['hero-background'] = heroBgData;
            hasChanges = true;
        }
    }

    // About image
    if (aboutImageUpload?.files[0]) {
        const aboutImageData = await fileToBase64(aboutImageUpload.files[0]);
        const aboutImage = document.getElementById('about-image');
        if (aboutImage) {
            aboutImage.style.backgroundImage = `url(${aboutImageData})`;
            aboutImage.style.backgroundSize = 'cover';
            aboutImage.style.backgroundPosition = 'center';
            editedImages['about-image'] = aboutImageData;
            hasChanges = true;
        }
    }

    // Service icons
    for (let i = 0; i < serviceUploads.length; i++) {
        if (serviceUploads[i]?.files[0]) {
            const serviceData = await fileToBase64(serviceUploads[i].files[0]);
            const serviceIcon = document.getElementById(`service-icon-${i + 1}`);
            if (serviceIcon) {
                // Replace emoji with image
                serviceIcon.style.backgroundImage = `url(${serviceData})`;
                serviceIcon.style.backgroundSize = 'contain';
                serviceIcon.style.backgroundRepeat = 'no-repeat';
                serviceIcon.style.backgroundPosition = 'center';
                serviceIcon.style.width = '48px';
                serviceIcon.style.height = '48px';
                serviceIcon.style.display = 'inline-block';
                serviceIcon.textContent = ''; // Remove emoji
                editedImages[`service-icon-${i + 1}`] = serviceData;
                hasChanges = true;
            }
        }
    }

    // Gallery images
    for (let i = 0; i < galleryUploads.length; i++) {
        if (galleryUploads[i]?.files[0]) {
            const galleryData = await fileToBase64(galleryUploads[i].files[0]);
            const galleryImage = document.getElementById(`gallery-${i + 1}`);
            if (galleryImage) {
                galleryImage.style.backgroundImage = `url(${galleryData})`;
                galleryImage.style.backgroundSize = 'cover';
                galleryImage.style.backgroundPosition = 'center';
                editedImages[`gallery-${i + 1}`] = galleryData;
                hasChanges = true;
            }
        }
    }

    // Project images
    for (let i = 0; i < projectUploads.length; i++) {
        if (projectUploads[i]?.files[0]) {
            const projectData = await fileToBase64(projectUploads[i].files[0]);
            const projectImage = document.getElementById(`project-${i + 1}`);
            if (projectImage) {
                projectImage.style.backgroundImage = `url(${projectData})`;
                projectImage.style.backgroundSize = 'cover';
                projectImage.style.backgroundPosition = 'center';
                editedImages[`project-${i + 1}`] = projectData;
                hasChanges = true;
            }
        }
    }

    if (hasChanges) {
        alert('All images uploaded successfully!');
    } else {
        alert('Please select images to upload.');
    }
}

// Helper function to convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Apply Font Changes
function applyFontChanges() {
    const fontSizes = {
        heroTitle: fontHeroTitle?.value || '48',
        heroSubtitle: fontHeroSubtitle?.value || '20',
        sectionTitle: fontSectionTitle?.value || '42',
        body: fontBody?.value || '16',
        nav: fontNav?.value || '14'
    };

    // Apply font sizes
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.fontSize = `${fontSizes.heroTitle}px`;
    }

    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        heroSubtitle.style.fontSize = `${fontSizes.heroSubtitle}px`;
    }

    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.style.fontSize = `${fontSizes.sectionTitle}px`;
    });

    const bodyElements = document.querySelectorAll('p, .service-description, .about-description');
    bodyElements.forEach(element => {
        element.style.fontSize = `${fontSizes.body}px`;
    });

    const navElements = document.querySelectorAll('.nav-link');
    navElements.forEach(element => {
        element.style.fontSize = `${fontSizes.nav}px`;
    });

    // Save to localStorage
    localStorage.setItem('sandeepBuildersFonts', JSON.stringify(fontSizes));
    
    alert('Font sizes applied successfully!');
}

// Load saved fonts
function loadSavedFonts() {
    const savedFonts = localStorage.getItem('sandeepBuildersFonts');
    if (savedFonts) {
        const fonts = JSON.parse(savedFonts);
        
        if (fontHeroTitle && fonts.heroTitle) {
            fontHeroTitle.value = fonts.heroTitle;
            const valueDisplay = document.getElementById('font-hero-title-value');
            if (valueDisplay) valueDisplay.textContent = `${fonts.heroTitle}px`;
        }
        if (fontHeroSubtitle && fonts.heroSubtitle) {
            fontHeroSubtitle.value = fonts.heroSubtitle;
            const valueDisplay = document.getElementById('font-hero-subtitle-value');
            if (valueDisplay) valueDisplay.textContent = `${fonts.heroSubtitle}px`;
        }
        if (fontSectionTitle && fonts.sectionTitle) {
            fontSectionTitle.value = fonts.sectionTitle;
            const valueDisplay = document.getElementById('font-section-title-value');
            if (valueDisplay) valueDisplay.textContent = `${fonts.sectionTitle}px`;
        }
        if (fontBody && fonts.body) {
            fontBody.value = fonts.body;
            const valueDisplay = document.getElementById('font-body-value');
            if (valueDisplay) valueDisplay.textContent = `${fonts.body}px`;
        }
        if (fontNav && fonts.nav) {
            fontNav.value = fonts.nav;
            const valueDisplay = document.getElementById('font-nav-value');
            if (valueDisplay) valueDisplay.textContent = `${fonts.nav}px`;
        }

        // Apply saved font sizes
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && fonts.heroTitle) heroTitle.style.fontSize = `${fonts.heroTitle}px`;

        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle && fonts.heroSubtitle) heroSubtitle.style.fontSize = `${fonts.heroSubtitle}px`;

        const sectionTitles = document.querySelectorAll('.section-title');
        sectionTitles.forEach(title => {
            if (fonts.sectionTitle) title.style.fontSize = `${fonts.sectionTitle}px`;
        });

        const bodyElements = document.querySelectorAll('p, .service-description, .about-description');
        bodyElements.forEach(element => {
            if (fonts.body) element.style.fontSize = `${fonts.body}px`;
        });

        const navElements = document.querySelectorAll('.nav-link');
        navElements.forEach(element => {
            if (fonts.nav) element.style.fontSize = `${fonts.nav}px`;
        });
    }
}

// Handle Contact Form Submit
async function handleContactSubmit(e) {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Message sent successfully! We will get back to you soon.');
            contactForm.reset();
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        console.error('Contact form error:', error);
        // Fallback: log to console
        console.log('Contact form submission:', data);
        alert('Message submitted! (Backend unavailable, data logged to console)');
        contactForm.reset();
    }
}

// Setup Editable Elements
function setupEditableElements() {
    // This is called from enableEditMode, but we can add additional setup here
}

// Utility Functions
function getElementById(id) {
    return document.getElementById(id);
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(11, 21, 36, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = 'var(--navy-primary)';
            header.style.backdropFilter = 'none';
        }
    }
});

// Mobile menu toggle (if needed in future)
function toggleMobileMenu() {
    const nav = document.getElementById('nav');
    if (nav) {
        nav.classList.toggle('active');
    }
}

// Initialize smooth scroll behavior for better UX
document.documentElement.style.scrollBehavior = 'smooth';