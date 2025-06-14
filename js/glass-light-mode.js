/**
 * Light Mode Glass Enhancements
 * Special effects to make glassmorphism more visible in light mode
 */

document.addEventListener('DOMContentLoaded', () => {
  enhanceLightModeGlass();
});

/**
 * Enhance glass effects specifically for light mode
 */
function enhanceLightModeGlass() {
  // Check if in light mode
  const isLightMode = !document.documentElement.getAttribute('data-theme') || 
                      document.documentElement.getAttribute('data-theme') !== 'dark';
  
  if (isLightMode) {
    // Add enhanced light reflection effects to glass cards
    const glassCards = document.querySelectorAll('.glass-card');
    
    glassCards.forEach(card => {
      // Create light refraction overlay
      const refraction = document.createElement('div');
      refraction.classList.add('glass-light-refraction');
      card.appendChild(refraction);
      
      // Add mouse-following highlight
      card.addEventListener('mousemove', e => {
        const cardRect = card.getBoundingClientRect();
        const x = e.clientX - cardRect.left;
        const y = e.clientY - cardRect.top;
        
        refraction.style.background = `radial-gradient(
          circle at ${x}px ${y}px,
          rgba(255, 255, 255, 0.3) 0%,
          rgba(255, 255, 255, 0.1) 30%,
          transparent 70%
        )`;
      });
      
      // Reset on mouse leave
      card.addEventListener('mouseleave', () => {
        refraction.style.background = '';
      });
    });
    
    // Add CSS for the light refraction effect
    const style = document.createElement('style');
    style.textContent = `
      .glass-light-refraction {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 2;
        border-radius: inherit;
      }
      
      .glass-card {
        position: relative;
        isolation: isolate;
      }
    `;
    document.head.appendChild(style);
    
    // Add subtle shadow animation to glass elements
    const glassElements = document.querySelectorAll('.glass-card, .glass-container, .glass-nav');
    
    glassElements.forEach(element => {
      // Add pulsing shadow animation
      element.classList.add('light-mode-glass-pulse');
    });
    
    // Add CSS for the pulsing shadow animation
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
      @keyframes lightModeShadowPulse {
        0% {
          box-shadow: 0 8px 32px 0 rgba(99, 102, 241, 0.1);
        }
        50% {
          box-shadow: 0 12px 40px 0 rgba(99, 102, 241, 0.15);
        }
        100% {
          box-shadow: 0 8px 32px 0 rgba(99, 102, 241, 0.1);
        }
      }
      
      .light-mode-glass-pulse {
        animation: lightModeShadowPulse 4s infinite ease-in-out;
      }
    `;
    document.head.appendChild(pulseStyle);
    
    // Add enhanced contrast backgrounds behind glass elements
    const contrastBackgrounds = document.createElement('style');
    contrastBackgrounds.textContent = `      body:not([data-theme="dark"]) .about-content,
      body:not([data-theme="dark"]) .expertise-grid,
      body:not([data-theme="dark"]) .projects-grid,
      body:not([data-theme="dark"]) .projects-gallery,
      body:not([data-theme="dark"]) .contact-container,
      body:not([data-theme="dark"]) .dashboard-container {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(14, 165, 233, 0.03) 100%);
        border-radius: var(--border-radius-lg);
        padding: 1px;
      }
      
      /* Enhanced light effects for gallery cards */
      body:not([data-theme="dark"]) .gallery-card::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, 
          rgba(255, 255, 255, 0.2) 0%, 
          rgba(255, 255, 255, 0) 50%, 
          rgba(255, 255, 255, 0.1) 100%);
        border-radius: inherit;
        pointer-events: none;
        z-index: 3;
      }
      
      /* Gallery card tilt effect */
      body:not([data-theme="dark"]) .gallery-card {
        transition: transform 0.3s ease;
        will-change: transform;
      }
    `;
    document.head.appendChild(contrastBackgrounds);
    
    // Add special effects for the gallery in light mode
    enhanceGalleryCards();
  }
  
  // Watch for theme changes
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'data-theme') {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        // Remove or add light mode enhancements based on theme
        const refractions = document.querySelectorAll('.glass-light-refraction');
        if (isDark) {
          refractions.forEach(el => el.remove());
          document.querySelectorAll('.light-mode-glass-pulse').forEach(el => {
            el.classList.remove('light-mode-glass-pulse');
          });
        } else if (!refractions.length) {
          // Re-initialize light mode enhancements
          enhanceLightModeGlass();
        }
      }
    });
  });
  
  observer.observe(document.documentElement, { attributes: true });
}

/**
 * Add special light-mode effects to gallery cards
 */
function enhanceGalleryCards() {
  // Check if gallery exists and we're in light mode
  const isLightMode = !document.documentElement.getAttribute('data-theme') || 
                      document.documentElement.getAttribute('data-theme') !== 'dark';
  const galleryCards = document.querySelectorAll('.gallery-card');
  
  if (!isLightMode || !galleryCards.length) return;
  
  // Add tilt effect to gallery cards
  galleryCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      
      // Calculate mouse position relative to card center (values between -1 and 1)
      const mouseX = (e.clientX - cardCenterX) / (cardRect.width / 2);
      const mouseY = (e.clientY - cardCenterY) / (cardRect.height / 2);
      
      // Apply tilt effect (max 5 degrees rotation)
      const tiltX = mouseY * -5;
      const tiltY = mouseX * 5;
      
      // Apply transform with perspective
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      
      // Add light reflection based on mouse position
      const lightReflection = `radial-gradient(
        circle at ${e.clientX - cardRect.left}px ${e.clientY - cardRect.top}px,
        rgba(255, 255, 255, 0.4) 0%,
        rgba(255, 255, 255, 0.1) 30%,
        transparent 70%
      )`;
      
      // Check if card already has a reflection element
      let reflection = card.querySelector('.gallery-reflection');
      
      if (!reflection) {
        reflection = document.createElement('div');
        reflection.classList.add('gallery-reflection');
        reflection.style.position = 'absolute';
        reflection.style.top = '0';
        reflection.style.left = '0';
        reflection.style.width = '100%';
        reflection.style.height = '100%';
        reflection.style.pointerEvents = 'none';
        reflection.style.zIndex = '3';
        reflection.style.borderRadius = 'inherit';
        card.appendChild(reflection);
      }
      
      reflection.style.background = lightReflection;
    });
    
    // Reset card on mouse leave
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      
      const reflection = card.querySelector('.gallery-reflection');
      if (reflection) {
        reflection.style.background = '';
      }
    });
  });
}
