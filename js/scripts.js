
// JavaScript for the website

// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburgerMenu.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburgerMenu.classList.toggle('active');
    });
    
    // Close menu when clicking a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburgerMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 100, // Account for fixed navbar
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Language change functionality
function changeLanguage(lang) {
    currentLanguage = lang;

    // Actualiza el contenido traducido
    document.querySelectorAll('.translate').forEach(element => {
        const translation = element.getAttribute(`data-${currentLanguage}`);
        if (translation) {
            element.textContent = translation;
        }
    });

    // Actualiza el atributo `lang` del HTML
    document.documentElement.lang = currentLanguage;

    // Actualiza el estado activo del selector
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector(`.language-option[data-lang="${currentLanguage}"]`).classList.add('active');
}

