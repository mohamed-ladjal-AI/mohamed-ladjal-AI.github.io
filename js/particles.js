/**
 * Particles Background Effect
 * Creates an interactive particle network background with glassmorphism integration
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticlesBackground();
});

/**
 * Initialize interactive particles background
 */
function initParticlesBackground() {
  // Create canvas element
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  canvas.classList.add('particles-background');
  
  // Add to DOM before first section
  const firstSection = document.querySelector('section');
  if (firstSection) {
    document.body.insertBefore(canvas, firstSection);
  } else {
    document.body.appendChild(canvas);
  }
  
  // Set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Get context
  const ctx = canvas.getContext('2d');
  
  // Particles array
  let particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 10), 150);
  
  // Mouse position for interactivity
  let mouse = {
    x: null,
    y: null,
    radius: 150
  };
  
  // Track mouse position
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });
  
  // Reset mouse position when mouse leaves
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });
  
  // Colors
  const getColors = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      particle: isDark ? 'rgba(129, 140, 248, 0.7)' : 'rgba(67, 56, 202, 0.7)',
      line: isDark ? 'rgba(129, 140, 248, 0.15)' : 'rgba(67, 56, 202, 0.15)',
      highlight: isDark ? 'rgba(56, 189, 248, 0.9)' : 'rgba(14, 165, 233, 0.9)'
    };
  };
  
  let colors = getColors();
  
  // Particle class
  class Particle {
    constructor() {
      // Position
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      
      // Size
      this.size = Math.random() * 5 + 1;
      
      // Velocity
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 1 - 0.5;
      
      // Store original speed for reference
      this.baseSpeedX = this.speedX;
      this.baseSpeedY = this.speedY;
      
      // Interaction properties
      this.isMouseNear = false;
    }
    
    // Update particle position
    update() {
      // Check mouse interaction
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          this.isMouseNear = true;
          
          // Calculate repel force (stronger when closer)
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          
          // Apply force (repel from mouse)
          this.speedX -= forceDirectionX * force * 0.5;
          this.speedY -= forceDirectionY * force * 0.5;
        } else {
          this.isMouseNear = false;
          
          // Gradually return to base speed
          this.speedX += (this.baseSpeedX - this.speedX) * 0.05;
          this.speedY += (this.baseSpeedY - this.speedY) * 0.05;
        }
      } else {
        this.isMouseNear = false;
        
        // Gradually return to base speed
        this.speedX += (this.baseSpeedX - this.speedX) * 0.05;
        this.speedY += (this.baseSpeedY - this.speedY) * 0.05;
      }
      
      // Update position
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Bounce off edges
      if (this.x < 0 || this.x > canvas.width) {
        this.speedX = -this.speedX;
        this.baseSpeedX = -this.baseSpeedX;
      }
      
      if (this.y < 0 || this.y > canvas.height) {
        this.speedY = -this.speedY;
        this.baseSpeedY = -this.baseSpeedY;
      }
    }
    
    // Draw particle
    draw() {
      ctx.beginPath();
      
      // Use highlight color if mouse is near
      if (this.isMouseNear) {
        ctx.fillStyle = colors.highlight;
        
        // Create glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = colors.highlight;
      } else {
        ctx.fillStyle = colors.particle;
        ctx.shadowBlur = 0;
      }
      
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
  
  // Create particles
  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  
  // Connect particles with lines if they're close enough
  function connectParticles() {
    const maxDistance = 150;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          // Calculate line opacity based on distance
          const opacity = 1 - (distance / maxDistance);
          
          ctx.beginPath();
          ctx.strokeStyle = colors.line.replace('0.15', opacity * 0.3);
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }
  
  // Animation loop
  function animate() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    
    // Connect nearby particles
    connectParticles();
    
    // Request next frame
    requestAnimationFrame(animate);
  }
  
  // Handle resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Reinitialize particles
    initParticles();
  });
  
  // Handle theme changes
  const observer = new MutationObserver(() => {
    colors = getColors();
  });
  
  observer.observe(document.documentElement, { 
    attributes: true, 
    attributeFilter: ['data-theme'] 
  });
  
  // Initialize and start animation
  initParticles();
  animate();
}
