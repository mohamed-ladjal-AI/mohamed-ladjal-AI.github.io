/**
 * Loading Animation
 * Controls the loading sequence for the portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoading();
});

/**
 * Initialize the loading sequence
 */
function initLoading() {
  // Check if page is already loaded (for browser back/forward navigation)
  if (document.readyState === 'complete') {
    setTimeout(() => {
      completeLoading();
    }, 500);
    return;
  }

  // Track loading progress
  const progressBar = document.querySelector('.loading-progress-bar');
  let loadedAssets = 0;
  const totalAssets = document.images.length + document.querySelectorAll('script').length + document.querySelectorAll('link[rel="stylesheet"]').length;
  
  // Function to update progress
  const updateProgress = () => {
    loadedAssets++;
    const percentLoaded = Math.min(Math.round((loadedAssets / totalAssets) * 100), 100);
    if (progressBar) {
      progressBar.style.width = `${percentLoaded}%`;
    }
  };

  // Track image loading
  for (let i = 0; i < document.images.length; i++) {
    const img = new Image();
    img.onload = updateProgress;
    img.onerror = updateProgress;
    img.src = document.images[i].src;
  }

  // Simulate additional resources loading time
  const milestones = [20, 40, 60, 80, 100];
  milestones.forEach((milestone, index) => {
    setTimeout(() => {
      updateProgress();
    }, 300 * (index + 1));
  });

  // Complete loading after all resources or timeout
  window.addEventListener('load', () => {
    setTimeout(() => {
      completeLoading();
    }, 500); // Min 500ms display time for the loader
  });

  // Fallback for slow connections
  setTimeout(() => {
    completeLoading();
  }, 5000); // Max 5s for loader
}

/**
 * Complete the loading sequence
 */
function completeLoading() {
  document.body.classList.add('loaded');
  
  // Initialize scroll animations after loading
  setTimeout(() => {
    if (typeof initScrollReveal === 'function') {
      initScrollReveal();
    }
  }, 300);
}

/**
 * Initialize scroll reveal animations
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  if (!revealElements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(element => {
    observer.observe(element);
  });
}
