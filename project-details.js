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
    
    const video = document.createElement('video');
    video.src = src;
    video.controls = false; // Désactiver les contrôles natifs
    video.style.width = '100%';
    video.style.maxWidth = '100%';
    video.style.height = 'auto';
    video.style.maxHeight = '70vh';
    video.style.objectFit = 'contain';
    
    // Contrôles personnalisés
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
    
    // Lecture/Pause
    playPauseBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      } else {
        video.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      }
    });
    
    // Muet
    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      muteBtn.innerHTML = video.muted ? 
        '<i class="fas fa-volume-mute"></i>' : 
        '<i class="fas fa-volume-up"></i>';
    });
    
    // Plein écran
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        if (videoContainer.requestFullscreen) {
          videoContainer.requestFullscreen();
        } else if (videoContainer.webkitRequestFullscreen) {
          videoContainer.webkitRequestFullscreen();
        } else if (videoContainer.msRequestFullscreen) {
          videoContainer.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    });
    
    // Mettre à jour l'icône play/pause automatiquement
    video.addEventListener('play', () => {
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    });
    
    video.addEventListener('pause', () => {
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
    
    // Gérer la fin de la vidéo
    video.addEventListener('ended', () => {
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
    
    // Gérer le changement de mode plein écran
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    
    function handleFullscreenChange() {
      if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
      } else {
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
      }
    }
    
    // Cacher les contrôles quand la souris n'est pas sur la vidéo
    let controlsTimeout;
    videoContainer.addEventListener('mousemove', () => {
      controls.style.opacity = '1';
      clearTimeout(controlsTimeout);
      controlsTimeout = setTimeout(() => {
        if (!video.paused) {
          controls.style.opacity = '0';
        }
      }, 3000);
    });
    
    videoContainer.addEventListener('mouseleave', () => {
      if (!video.paused) {
        controlsTimeout = setTimeout(() => {
          controls.style.opacity = '0';
        }, 1000);
      }
    });
    
    // Toujours montrer les contrôles quand la vidéo est en pause
    video.addEventListener('play', () => {
      controlsTimeout = setTimeout(() => {
        controls.style.opacity = '0';
      }, 3000);
    });
    
    video.addEventListener('pause', () => {
      controls.style.opacity = '1';
      clearTimeout(controlsTimeout);
    });
    
    videoContainer.appendChild(video);
    videoContainer.appendChild(controls);
    mainMedia.appendChild(videoContainer);
    
    currentVideo = video;
    
    // Ajuster la hauteur de la vidéo après le chargement
    video.addEventListener('loadedmetadata', function() {
      adjustVideoSize(video);
    });
    
    video.addEventListener('resize', function() {
      adjustVideoSize(video);
    });
  }
  
  // Ajuster la taille de la vidéo pour qu'elle s'adapte correctement
  function adjustVideoSize(video) {
    const container = mainMedia;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    
    const widthRatio = containerWidth / videoWidth;
    const heightRatio = containerHeight / videoHeight;
    
    // Utiliser le ratio le plus petit pour que la vidéo tienne entièrement
    const scale = Math.min(widthRatio, heightRatio);
    
    video.style.width = (videoWidth * scale) + 'px';
    video.style.height = (videoHeight * scale) + 'px';
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
    } else if (e.key === ' ' && currentVideo) {
      // Espace pour play/pause la vidéo
      e.preventDefault();
      if (currentVideo.paused) {
        currentVideo.play();
      } else {
        currentVideo.pause();
      }
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
  
  // Redimensionnement de la fenêtre
  window.addEventListener('resize', () => {
    if (currentVideo) {
      adjustVideoSize(currentVideo);
    }
  });
  
  // Initialisation - charger le premier média
  changeMedia(0);
});