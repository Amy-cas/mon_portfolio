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
    initProjectsCarousel();
});


// Carrousel des projets
const initProjectsCarousel = () => {
    const carouselTrack = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.carousel-track .card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    
    if (!carouselTrack || cards.length === 0) return;
    
    let currentIndex = 0;
    let cardsPerView = 3; // Par défaut pour desktop
    
    // Créer les indicateurs
    cards.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
        indicator.setAttribute('aria-label', `Aller au projet ${index + 1}`);
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });
    
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    // Mettre à jour le nombre de cartes visibles selon la largeur d'écran
    const updateCardsPerView = () => {
        if (window.innerWidth <= 768) {
            cardsPerView = 1;
        } else if (window.innerWidth <= 1024) {
            cardsPerView = 2;
        } else {
            cardsPerView = 3;
        }
        updateCarousel();
    };
    
    // Mettre à jour le carrousel
    const updateCarousel = () => {
        const cardWidth = cards[0].offsetWidth + 30; // width + gap
        const translateX = -currentIndex * cardWidth;
        carouselTrack.style.transform = `translateX(${translateX}px)`;
        
        // Mettre à jour les indicateurs
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
        
        // Gérer la visibilité des boutons
        prevBtn.style.visibility = currentIndex === 0 ? 'hidden' : 'visible';
        nextBtn.style.visibility = currentIndex >= cards.length - cardsPerView ? 'hidden' : 'visible';
    };
    
    // Aller à un slide spécifique
    const goToSlide = (index) => {
        currentIndex = Math.max(0, Math.min(index, cards.length - cardsPerView));
        updateCarousel();
    };
    
    // Slide suivant
    const nextSlide = () => {
        if (currentIndex < cards.length - cardsPerView) {
            currentIndex++;
            updateCarousel();
        }
    };
    
    // Slide précédent
    const prevSlide = () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    };
    
    // Événements
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Redimensionnement
    window.addEventListener('resize', () => {
        updateCardsPerView();
    });
    
    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    
    // Initialisation
    updateCardsPerView();
    
    // Swipe sur mobile
    let startX = 0;
    let endX = 0;
    
    carouselTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    carouselTrack.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    const handleSwipe = () => {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    };
};
