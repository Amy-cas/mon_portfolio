// Gestion du mode sombre/clair
const toggleThemeBtn = document.querySelector('.toggle-theme');
const body = document.body;

toggleThemeBtn.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    toggleThemeBtn.textContent = body.classList.contains('light-mode') ? '🌞' : '🌙';
});

// Menu hamburger pour mobile
const createMobileMenu = () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    
    // Créer le bouton hamburger
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '☰';
    hamburger.style.display = 'none';
    
    // Insérer le bouton avant les liens de navigation
    navbar.insertBefore(hamburger, navLinks);
    
    // Gérer le clic sur le hamburger
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('show-mobile');
    });
    
    // Fonction pour gérer l'affichage responsive
    const handleResize = () => {
        if (window.innerWidth <= 768) {
            hamburger.style.display = 'block';
            navLinks.classList.add('mobile');
        } else {
            hamburger.style.display = 'none';
            navLinks.classList.remove('mobile', 'show-mobile');
        }
    };
    
    // Écouter les changements de taille d'écran
    window.addEventListener('resize', handleResize);
    handleResize();
};

// Animation de machine à écrire
const typewriterAnimation = () => {
    const designerTitle = document.getElementById('designer-title');
    const titles = ['Designer Web', 'Designer Graphique', 'Développeuse Web'];
    let currentTitleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    let deletingSpeed = 50;
    let pauseBeforeDelete = 1000;
    let pauseBeforeType = 400;

    function type() {
        const currentTitle = titles[currentTitleIndex];

        if (isDeleting) {
            // Effacement du texte
            designerTitle.textContent = currentTitle.substring(0, currentCharIndex - 1) + '|';
            currentCharIndex--;

            if (currentCharIndex === 0) {
                isDeleting = false;
                currentTitleIndex = (currentTitleIndex + 1) % titles.length;
                setTimeout(type, pauseBeforeType);
                return;
            }

            setTimeout(type, deletingSpeed);
        } else {
            // Écriture du texte
            designerTitle.textContent = currentTitle.substring(0, currentCharIndex + 1) + '|';
            currentCharIndex++;

            if (currentCharIndex === currentTitle.length) {
                isDeleting = true;
                setTimeout(type, pauseBeforeDelete);
                return;
            }

            setTimeout(type, typingSpeed);
        }
    }

    // Démarrer l'animation
    type();
};

// Animation au défilement
const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.8;
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < triggerBottom) {
            section.classList.add('show');
        }
    });
};

// Gestion des images responsive
const handleResponsiveImages = () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.loading = 'lazy';
        
        img.onerror = function() {
            this.style.display = 'none';
        };
    });
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    createMobileMenu();
    handleResponsiveImages();
    revealOnScroll(); // Animation initiale
    window.addEventListener('scroll', revealOnScroll);
    typewriterAnimation(); // Démarrer l'animation de machine à écrire
});
