/**
 * Glass Effects
 * Additional JavaScript effects for glassmorphism elements
 */

document.addEventListener('DOMContentLoaded', () => {
  initMouseMoveEffects();
  initParallaxEffects();
  initGlassFormInteractions();
  initGlassShadowEffects();
});

/**
 * Initialize mouse move effects for glass cards
 * Creates a subtle tilt effect as the mouse moves over cards
 */
function initMouseMoveEffects() {
  const glassCards = document.querySelectorAll('.glass-card:not(.glass-parallax-inner)');
  
  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      // Get position of mouse relative to card
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate rotation values based on mouse position
      // Convert to percentage of card dimensions
      const xPercent = x / rect.width;
      const yPercent = y / rect.height;
      
      // Calculate rotation values (max 3 degrees in any direction)
      const rotateX = (yPercent - 0.5) * -6; // Invert Y axis
      const rotateY = (xPercent - 0.5) * 6;
      
      // Apply rotation transform
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) 
                             scale3d(1.02, 1.02, 1.02)`;
      
      // Create shine effect where the mouse is
      updateShineEffect(card, xPercent, yPercent);
    });
    
    card.addEventListener('mouseleave', () => {
      // Reset transformations when mouse leaves
      card.style.transform = '';
      
      // Remove shine effect
      const shine = card.querySelector('.glass-shine');
      if (shine) {
        shine.remove();
      }
    });
  });
}

/**
 * Create a shine effect that follows the mouse on glass cards
 */
function updateShineEffect(element, xPercent, yPercent) {
  // Check if shine element already exists, create if not
  let shine = element.querySelector('.glass-shine');
  
  if (!shine) {
    shine = document.createElement('div');
    shine.classList.add('glass-shine');
    shine.style.position = 'absolute';
    shine.style.pointerEvents = 'none';
    shine.style.width = '150px';
    shine.style.height = '150px';
    shine.style.borderRadius = '50%';
    shine.style.background = 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)';
    shine.style.transform = 'translate(-50%, -50%)';
    shine.style.zIndex = '1';
    element.style.overflow = 'hidden';
    element.appendChild(shine);
  }
  
  // Position the shine based on mouse coordinates
  const x = xPercent * element.offsetWidth;
  const y = yPercent * element.offsetHeight;
  
  shine.style.left = `${x}px`;
  shine.style.top = `${y}px`;
}

/**
 * Initialize parallax effects for elements with glass-parallax class
 * Creates a 3D depth effect when scrolling
 */
function initParallaxEffects() {
  const parallaxElements = document.querySelectorAll('.glass-parallax');
  
  if (!parallaxElements.length) return;
  
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    parallaxElements.forEach(element => {
      const elementRect = element.getBoundingClientRect();
      const elementMiddle = elementRect.top + elementRect.height / 2;
      const viewportMiddle = window.innerHeight / 2;
      const distanceFromCenter = elementMiddle - viewportMiddle;
      
      // Calculate parallax shift (more intense when element is in viewport center)
      const parallaxShift = (distanceFromCenter / window.innerHeight) * 30;
      
      // Get the inner element to animate
      const innerElement = element.querySelector('.glass-parallax-inner');
      if (innerElement) {
        innerElement.style.transform = `translateY(${parallaxShift}px) scale(${1 + Math.abs(parallaxShift) / 500})`;
      }
    });
  });
}

/**
 * Initialize special effects for glass form inputs
 */
function initGlassFormInteractions() {
  const glassInputs = document.querySelectorAll('.glass-input');
  
  glassInputs.forEach(input => {
    // Add focus effects
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('glass-input-focused');
    });
    
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('glass-input-focused');
    });
    
    // Add typing ripple effect
    input.addEventListener('input', (e) => {
      createTypingRipple(input);
    });
  });
}

/**
 * Create a ripple effect when typing in glass inputs
 */
function createTypingRipple(input) {
  const ripple = document.createElement('div');
  ripple.classList.add('typing-ripple');
  
  // Style the ripple
  ripple.style.position = 'absolute';
  ripple.style.width = '40px';
  ripple.style.height = '40px';
  ripple.style.borderRadius = '50%';
  ripple.style.background = 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)';
  ripple.style.transform = 'translate(-50%, -50%) scale(0)';
  ripple.style.pointerEvents = 'none';
  ripple.style.zIndex = '0';
  ripple.style.opacity = '0';
  
  // Position ripple near cursor or at input end
  const rect = input.getBoundingClientRect();
  const cursorPosition = input.selectionStart || input.value.length;
  const charWidth = 8; // Approximate character width
  
  // For single line inputs use horizontal position
  // For textareas would need more complex positioning
  const x = Math.min(cursorPosition * charWidth, input.offsetWidth - 20);
  const y = input.offsetHeight / 2;
  
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  
  // Add to input parent for proper positioning
  input.parentElement.style.position = 'relative';
  input.parentElement.appendChild(ripple);
  
  // Animate and remove
  requestAnimationFrame(() => {
    ripple.style.transition = 'all 0.5s ease-out';
    ripple.style.transform = 'translate(-50%, -50%) scale(1)';
    ripple.style.opacity = '1';
    
    setTimeout(() => {
      ripple.style.opacity = '0';
      setTimeout(() => {
        ripple.remove();
      }, 500);
    }, 300);
  });
}

/**
 * Initialize shadow effects for glass elements
 * Creates dynamic shadows based on mouse position
 */
function initGlassShadowEffects() {
  const glassElements = document.querySelectorAll('.glass-card, .glass-container');
  
  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    glassElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;
      
      // Calculate distance between mouse and element center
      const distanceX = mouseX - elementCenterX;
      const distanceY = mouseY - elementCenterY;
      
      // Only apply effect if mouse is close to the element (within 400px)
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      if (distance < 400) {
        // Calculate shadow offset (max 10px)
        const shadowX = distanceX / 40;
        const shadowY = distanceY / 40;
        
        // Apply dynamic shadow
        element.style.boxShadow = `
          ${shadowX}px ${shadowY}px 20px rgba(31, 38, 135, 0.2),
          0 8px 32px 0 rgba(31, 38, 135, 0.1)
        `;
      } else {
        // Reset to default shadow when mouse is far
        element.style.boxShadow = '';
      }
    });
  });
}
