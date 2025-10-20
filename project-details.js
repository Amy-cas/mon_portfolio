// Gestion du carrousel multimédia (images + vidéos)
document.addEventListener('DOMContentLoaded', function() {
  const mainMedia = document.querySelector('.main-media');
  const thumbnails = document.querySelectorAll('.thumbnail');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  let currentIndex = 0;
  let currentVideo = null;
  
  // Préparer les données des médias
  const mediaItems = Array.from(thumbnails).map(thumb => ({
    type: thumb.dataset.type,
    src: thumb.dataset.src,
    alt: thumb.querySelector('img').alt
  }));
  
  // Changer le média principal au clic sur une miniature
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
      changeMedia(index);
    });
  });
  
  // Navigation précédente/suivante
  prevBtn.addEventListener('click', () => {
    stopCurrentVideo();
    currentIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
    changeMedia(currentIndex);
  });
  
  nextBtn.addEventListener('click', () => {
    stopCurrentVideo();
    currentIndex = (currentIndex + 1) % mediaItems.length;
    changeMedia(currentIndex);
  });
  
  // Fonction pour changer le média
  function changeMedia(index) {
    stopCurrentVideo();
    currentIndex = index;
    const mediaItem = mediaItems[index];
    
    // Vider le conteneur principal
    mainMedia.innerHTML = '';
    
    // Créer l'élément média approprié
    if (mediaItem.type === 'video') {
      createVideoElement(mediaItem.src);
    } else {
      createImageElement(mediaItem.src, mediaItem.alt);
    }
    
    // Mettre à jour les miniatures actives
    updateActiveThumbnails(index);
  }
  
  // Créer un élément image
  function createImageElement(src, alt) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.loading = 'eager';
    mainMedia.appendChild(img);
  }
  
  // Créer un élément vidéo avec contrôles
  function createVideoElement(src) {
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';
    videoContainer.style.position = 'relative';
    videoContainer.style.width = '100%';
    videoContainer.style.height = '100%';
    videoContainer.style.display = 'flex';
    videoContainer.style.alignItems = 'center';
    videoContainer.style.justifyContent = 'center';
    
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.style.width = '100%';
    video.style.maxHeight = '70vh';
    video.style.objectFit = 'contain';
    
    // Contrôles personnalisés supplémentaires
    const controls = document.createElement('div');
    controls.className = 'video-controls';
    controls.innerHTML = `
      <button class="play-pause" title="Lecture/Pause">
        <i class="fas fa-play"></i>
      </button>
      <button class="mute" title="Son">
        <i class="fas fa-volume-up"></i>
      </button>
      <button class="fullscreen" title="Plein écran">
        <i class="fas fa-expand"></i>
      </button>
    `;
    
    // Événements pour les contrôles personnalisés
    const playPauseBtn = controls.querySelector('.play-pause');
    const muteBtn = controls.querySelector('.mute');
    const fullscreenBtn = controls.querySelector('.fullscreen');
    
    playPauseBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      } else {
        video.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      }
    });
    
    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      muteBtn.innerHTML = video.muted ? 
        '<i class="fas fa-volume-mute"></i>' : 
        '<i class="fas fa-volume-up"></i>';
    });
    
    fullscreenBtn.addEventListener('click', () => {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    });
    
    // Mettre à jour l'icône play/pause automatiquement
    video.addEventListener('play', () => {
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    });
    
    video.addEventListener('pause', () => {
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
    
    // Sortie du mode plein écran
    video.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        // Réinitialiser les styles si nécessaire
      }
    });
    
    videoContainer.appendChild(video);
    videoContainer.appendChild(controls);
    mainMedia.appendChild(videoContainer);
    
    currentVideo = video;
  }
  
  // Arrêter la vidéo en cours
  function stopCurrentVideo() {
    if (currentVideo) {
      currentVideo.pause();
      currentVideo.currentTime = 0;
      currentVideo = null;
    }
  }
  
  // Mettre à jour les miniatures actives
  function updateActiveThumbnails(index) {
    thumbnails.forEach((thumb, i) => {
      if (i === index) {
        thumb.classList.add('active');
      } else {
        thumb.classList.remove('active');
      }
    });
  }
  
  // Navigation au clavier
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      stopCurrentVideo();
      currentIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
      changeMedia(currentIndex);
    } else if (e.key === 'ArrowRight') {
      stopCurrentVideo();
      currentIndex = (currentIndex + 1) % mediaItems.length;
      changeMedia(currentIndex);
    } else if (e.key === 'Escape') {
      stopCurrentVideo();
    }
  });
  
  // Mode sombre/clair
  const toggleThemeBtn = document.querySelector('.toggle-theme');
  const body = document.body;
  
  if (toggleThemeBtn) {
    toggleThemeBtn.addEventListener('click', () => {
      body.classList.toggle('light-mode');
      toggleThemeBtn.textContent = body.classList.contains('light-mode') ? '🌞' : '🌙';
    });
  }
  
  // Initialisation - charger le premier média
  changeMedia(0);
});