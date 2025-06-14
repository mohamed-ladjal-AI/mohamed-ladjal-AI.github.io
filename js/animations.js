/**
 * Animations
 * Advanced animations for Mohamed Ladjal's AI Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  initSectionAnimations();
  initElementAnimations();
  initEnhancedNeuralNetwork();
});

/**
 * Initialize section animations
 * Applies entrance animations to sections as they come into view
 */
function initSectionAnimations() {
  // Select all sections
  const sections = document.querySelectorAll('section');
  
  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add animation classes to section elements
        const section = entry.target;
        const elements = section.querySelectorAll('.animate-on-scroll');
        
        // Animate each element with delay
        elements.forEach((element, index) => {
          // Add delay based on index
          const delay = index * 100;
          element.style.transitionDelay = `${delay}ms`;
          
          // Add animation classes
          setTimeout(() => {
            element.classList.add('animated');
          }, 100);
        });
        
        // Unobserve after animation
        observer.unobserve(section);
      }
    });
  }, {
    threshold: 0.15, // Trigger when 15% of the section is visible
    rootMargin: '0px 0px -10% 0px' // Slightly before element comes into view
  });
  
  // Observe all sections
  sections.forEach(section => {
    observer.observe(section);
  });
}

/**
 * Initialize element animations
 * Applies special effects to specific elements
 */
function initElementAnimations() {
  // Animate gradient text
  animateGradientText();
  
  // Initialize parallax effects
  initParallaxEffects();
  
  // Initialize hover effects
  initHoverEffects();
}

/**
 * Animate gradient text elements
 */
function animateGradientText() {
  const gradientElements = document.querySelectorAll('.gradient-text');
  
  gradientElements.forEach(element => {
    // Add animation classes
    element.classList.add('animated-gradient-text');
  });
}

/**
 * Initialize parallax effects
 * Creates depth effect on mouse movement
 */
function initParallaxEffects() {
  // Select elements that should have parallax effect
  const parallaxElements = document.querySelectorAll('.hero-visual, .expertise-icon, .profile-image');
  
  // Add event listeners for mouse movement
  document.addEventListener('mousemove', e => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    parallaxElements.forEach(element => {
      // Calculate movement based on position and depth
      const depth = element.getAttribute('data-depth') || 0.1;
      const moveX = mouseX * depth * 50;
      const moveY = mouseY * depth * 50;
      
      // Apply transform
      element.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  });
}

/**
 * Initialize hover effects
 * Creates interactive hover animations
 */
function initHoverEffects() {
  // Expertise cards hover effect
  const expertiseCards = document.querySelectorAll('.expertise-card');
  
  expertiseCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('hovering');
    });
    
    card.addEventListener('mouseleave', () => {
      card.classList.remove('hovering');
    });
  });
  
  // Project cards hover effect
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('hovering');
    });
    
    card.addEventListener('mouseleave', () => {
      card.classList.remove('hovering');
    });
  });
  
  // Button hover effects
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.addEventListener('mouseenter', e => {
      // Create ripple effect
      const ripple = document.createElement('span');
      ripple.classList.add('btn-ripple');
      
      // Set position based on mouse
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      // Add to button
      button.appendChild(ripple);
      
      // Remove after animation
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

/**
 * Apply entrance animations to elements
 * Adds fade-in and slide-up animations with delays
 */
function applyEntranceAnimations() {
  // Select elements to animate
  const animateElements = document.querySelectorAll('.animate-entrance');
  
  // Apply animation classes with varying delays
  animateElements.forEach((element, index) => {
    // Calculate delay based on position
    const delay = index * 100; // 100ms between elements
    
    // Set delay and add animation class
    element.style.animationDelay = `${delay}ms`;
    element.classList.add('fade-in');
  });
}

// Add classes to elements that should animate on scroll
document.addEventListener('DOMContentLoaded', () => {
  // Heading elements
  document.querySelectorAll('h1, h2, h3').forEach(el => {
    el.classList.add('animate-on-scroll');
  });
  
  // Content elements
  document.querySelectorAll('.hero-content > *, .about-content > *, .expertise-card, .project-card, .contact-info, .contact-form').forEach(el => {
    el.classList.add('animate-on-scroll');
  });
  
  // Apply initial entrance animations
  applyEntranceAnimations();
});

/**
 * Enhanced Neural Network Animation
 * Creates a more sophisticated neural network visualization
 */
function initEnhancedNeuralNetwork() {
  const neuralContainer = document.getElementById('neural-network');
  if (!neuralContainer) return;

  // Create canvas for neural network
  const canvas = document.createElement('canvas');
  canvas.width = neuralContainer.offsetWidth;
  canvas.height = neuralContainer.offsetHeight;
  neuralContainer.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  
  // Neural network parameters
  const layers = [4, 8, 12, 8, 4]; // Nodes in each layer
  const neurons = [];
  const connections = [];
  let frame = 0;
  
  // Colors
  const getColors = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      neuron: isDark ? '#818cf8' : '#4338ca',
      connection: isDark ? 'rgba(165, 180, 252, 0.8)' : 'rgba(99, 102, 241, 0.8)',
      highlight: isDark ? '#38bdf8' : '#0ea5e9',
      activationColor: isDark ? '#a5b4fc' : '#818cf8',
      background: isDark ? '#0f172a' : '#f9fafb',
    };
  };
  
  let colors = getColors();
  
  // Create neurons
  const createNeurons = () => {
    neurons.length = 0;
    connections.length = 0;
    
    const layerDistance = canvas.width / (layers.length + 1);
    const margin = canvas.height * 0.1;
    
    layers.forEach((nodeCount, layerIndex) => {
      const x = layerDistance * (layerIndex + 1);
      const layerHeight = canvas.height - (margin * 2);
      const nodeSpacing = layerHeight / (nodeCount + 1);
      
      for (let i = 0; i < nodeCount; i++) {
        const y = nodeSpacing * (i + 1) + margin;
        
        neurons.push({
          x,
          y,
          layer: layerIndex,
          index: i,
          radius: 6,
          hue: 0,
          activation: 0,
          targetActivation: 0,
        });
      }
    });
    
    // Create connections between layers
    for (let l = 0; l < layers.length - 1; l++) {
      const currentLayerNeurons = neurons.filter(n => n.layer === l);
      const nextLayerNeurons = neurons.filter(n => n.layer === l + 1);
      
      currentLayerNeurons.forEach(source => {
        nextLayerNeurons.forEach(target => {
          connections.push({
            source,
            target,
            weight: Math.random() * 0.6 + 0.2, // Weight between 0.2 and 0.8
            signalProgress: 0,
            signalActive: false,
            signalTimeout: null
          });
        });
      });
    }
  };
  
  // Activate random neurons to simulate neural network activity
  const activateRandomNeurons = () => {
    const inputLayer = neurons.filter(n => n.layer === 0);
    const interval = 800; // ms between activations
    
    // Regularly activate input layer neurons
    const activateNeuron = () => {
      const neuron = inputLayer[Math.floor(Math.random() * inputLayer.length)];
      neuron.targetActivation = 1;
      
      // Propagate signal through network
      setTimeout(() => {
        propagateSignal(neuron);
      }, 100);
    };
    
    return setInterval(activateNeuron, interval);
  };
  
  // Propagate signal through the network
  const propagateSignal = (sourceNeuron) => {
    const outgoingConnections = connections.filter(c => c.source === sourceNeuron);
    
    outgoingConnections.forEach(conn => {
      // Activate the connection
      conn.signalActive = true;
      conn.signalProgress = 0;
      
      // Clear existing timeout
      if (conn.signalTimeout) {
        clearTimeout(conn.signalTimeout);
      }
      
      // Schedule target neuron activation
      conn.signalTimeout = setTimeout(() => {
        conn.target.targetActivation = Math.min(conn.target.targetActivation + conn.weight, 1);
        
        // Continue propagating if not output layer
        if (conn.target.layer < layers.length - 1) {
          setTimeout(() => {
            propagateSignal(conn.target);
          }, 100);
        }
      }, 300); // Time to travel along connection
    });
  };
  
  // Update network state
  const updateNetwork = () => {
    // Update neuron activations
    neurons.forEach(neuron => {
      // Decay activation over time
      neuron.targetActivation *= 0.95;
      
      // Smooth activation transitions
      neuron.activation += (neuron.targetActivation - neuron.activation) * 0.1;
    });
    
    // Update connection signals
    connections.forEach(conn => {
      if (conn.signalActive) {
        conn.signalProgress += 0.05;
        if (conn.signalProgress >= 1) {
          conn.signalActive = false;
        }
      }
    });
  };
  
  // Draw the network
  const drawNetwork = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update colors in case theme has changed
    colors = getColors();
    
    // Draw connections
    connections.forEach(conn => {
      ctx.beginPath();
      ctx.moveTo(conn.source.x, conn.source.y);
      ctx.lineTo(conn.target.x, conn.target.y);
      
      // Connection line style
      const baseAlpha = 0.1 + (conn.source.activation * 0.3);
      ctx.strokeStyle = colors.connection.replace('0.8', baseAlpha.toFixed(2));
      ctx.lineWidth = 1 + (conn.weight * 2);
      ctx.stroke();
      
      // Draw signal if active
      if (conn.signalActive) {
        const progress = conn.signalProgress;
        const x = conn.source.x + (conn.target.x - conn.source.x) * progress;
        const y = conn.source.y + (conn.target.y - conn.source.y) * progress;
        
        // Signal pulse
        const pulseSize = 4 + Math.sin(frame * 0.1) * 2;
        ctx.beginPath();
        ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = colors.highlight;
        ctx.fill();
      }
    });
    
    // Draw neurons
    neurons.forEach(neuron => {
      // Base neuron
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, neuron.radius, 0, Math.PI * 2);
      ctx.fillStyle = colors.neuron;
      ctx.fill();
      
      // Activation halo
      if (neuron.activation > 0.05) {
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, neuron.radius + 5 * neuron.activation, 0, Math.PI * 2);
        const glowAlpha = neuron.activation * 0.7;
        ctx.fillStyle = colors.activationColor.replace('rgb', 'rgba').replace(')', `,${glowAlpha})`);
        ctx.fill();
      }
    });
    
    frame++;
  };
  
  // Animation loop
  const animate = () => {
    updateNetwork();
    drawNetwork();
    requestAnimationFrame(animate);
  };
  
  // Initialize
  createNeurons();
  const activationInterval = activateRandomNeurons();
  animate();
  
  // Handle resize
  const handleResize = () => {
    canvas.width = neuralContainer.offsetWidth;
    canvas.height = neuralContainer.offsetHeight;
    createNeurons();
  };
  
  window.addEventListener('resize', handleResize);
  
  // Handle theme changes
  const observer = new MutationObserver(() => {
    colors = getColors();
  });
  
  observer.observe(document.documentElement, { 
    attributes: true, 
    attributeFilter: ['data-theme'] 
  });
  
  // Cleanup on page leave
  return () => {
    clearInterval(activationInterval);
    window.removeEventListener('resize', handleResize);
    observer.disconnect();
  };
}
