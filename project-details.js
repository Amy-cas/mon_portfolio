// Gestion du carrousel d'images
document.addEventListener('DOMContentLoaded', function() {
  const mainImg = document.getElementById('main-img');
  const thumbnails = document.querySelectorAll('.thumbnail');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  let currentIndex = 0;
  const images = Array.from(thumbnails).map(thumb => thumb.dataset.image);
  
  // Changer l'image principale au clic sur une miniature
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
      changeImage(index);
    });
  });
  
  // Navigation précédente/suivante
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    changeImage(currentIndex);
  });
  
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    changeImage(currentIndex);
  });
  
  // Fonction pour changer l'image
  function changeImage(index) {
    currentIndex = index;
    mainImg.src = images[index];
    
    // Mettre à jour les miniatures actives
    thumbnails.forEach((thumb, i) => {
      if (i === index) {
        thumb.classList.add('active');
      } else {
        thumb.classList.remove('active');
      }
    });
  }
  
  // Mode sombre/clair (reprise du code principal)
  const toggleThemeBtn = document.querySelector('.toggle-theme');
  const body = document.body;
  
  if (toggleThemeBtn) {
    toggleThemeBtn.addEventListener('click', () => {
      body.classList.toggle('light-mode');
      toggleThemeBtn.textContent = body.classList.contains('light-mode') ? '🌞' : '🌙';
    });
  }
});