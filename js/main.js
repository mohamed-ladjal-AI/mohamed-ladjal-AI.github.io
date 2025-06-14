/**
 * Main JavaScript for Mohamed Ladjal's AI Portfolio
 * Handles interactions, animations, and functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio initialization started');
  
  // Initialize all components
  initNavigation();
  initScrollAnimations();
  initStatCounters();
  initNeuralNetworkAnimation();
  setupFormHandling();
  
  console.log('Portfolio initialization completed');
});

/**
 * Initialize navigation functionality
 * Handles scroll behavior, active states, and mobile menu
 */
function initNavigation() {
  const header = document.querySelector('.main-header');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-menu-link');
  
  // Scroll handler for header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Update active nav link based on scroll position
    updateActiveNavLink();
  });
  
  // Mobile menu toggle
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }
  
  // Smooth scroll for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Close mobile menu if open
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
      
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Calculate offset with header height
        const headerHeight = document.querySelector('.main-header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - headerHeight;
        
        // Smooth scroll to target
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Initial active link update
  updateActiveNavLink();
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Get current scroll position
  let currentPos = window.pageYOffset;
  
  // Add offset for header height
  const headerHeight = document.querySelector('.main-header').offsetHeight;
  currentPos += headerHeight + 50; // Add extra offset for better UX
  
  // Check which section is in view
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (currentPos >= sectionTop && currentPos < sectionTop + sectionHeight) {
      const sectionId = section.getAttribute('id');
      
      // Remove active class from all links
      navLinks.forEach(link => {
        link.classList.remove('active');
      });
      
      // Add active class to corresponding nav link
      document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('active');
    }
  });
}

/**
 * Initialize scroll animations
 * Reveals elements as they enter the viewport
 */
function initScrollAnimations() {
  const sections = document.querySelectorAll('.section');
  const revealElements = document.querySelectorAll('.reveal');
  
  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });
  
  // Observe all sections
  sections.forEach(section => {
    section.classList.add('section'); // Ensure the section has the class
    observer.observe(section);
  });
  
  // Observe reveal elements
  revealElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * Initialize stat counters
 * Animates counting from 0 to target value
 */
function initStatCounters() {
  const statElements = document.querySelectorAll('.stat-number');
  
  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const targetValue = parseInt(element.getAttribute('data-count')) || 0;
        
        // Animate counter
        animateCounter(element, targetValue);
        
        // Unobserve after animation starts
        observer.unobserve(element);
      }
    });
  }, {
    threshold: 0.5
  });
  
  // Observe all stat elements
  statElements.forEach(stat => {
    observer.observe(stat);
  });
}

/**
 * Animate counter from 0 to target value
 */
function animateCounter(element, targetValue) {
  let currentValue = 0;
  const duration = 1500; // milliseconds
  const stepTime = 30; // milliseconds
  const totalSteps = duration / stepTime;
  const stepSize = targetValue / totalSteps;
  
  // Reset the counter
  element.textContent = '0';
  
  // Create interval to increment counter
  const interval = setInterval(() => {
    currentValue += stepSize;
    
    // Check if we've reached the target
    if (currentValue >= targetValue) {
      element.textContent = targetValue;
      clearInterval(interval);
    } else {
      element.textContent = Math.floor(currentValue);
    }
  }, stepTime);
}

/**
 * Initialize neural network animation
 * Creates a canvas-based visualization of connected nodes
 */
function initNeuralNetworkAnimation() {
  const container = document.getElementById('neural-network');
  
  if (!container) return;
  
  // Create canvas element
  const canvas = document.createElement('canvas');
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  
  // Network parameters
  const nodes = [];
  const nodeCount = 80;
  const connectionDistance = 100;
  const colors = {
    node: getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
    connection: getComputedStyle(document.documentElement).getPropertyValue('--primary-light').trim()
  };
  
  // Node class
  class Node {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
      this.connections = [];
    }
    
    update() {
      // Update position
      this.x += this.vx;
      this.y += this.vy;
      
      // Bounce off edges
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      
      // Find connections
      this.connections = [];
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i] === this) continue;
        
        const dx = this.x - nodes[i].x;
        const dy = this.y - nodes[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionDistance) {
          this.connections.push({
            node: nodes[i],
            opacity: 1 - (distance / connectionDistance)
          });
        }
      }
    }
    
    draw() {
      // Draw connections
      for (let i = 0; i < this.connections.length; i++) {
        const connection = this.connections[i];
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(connection.node.x, connection.node.y);
        ctx.strokeStyle = `${colors.connection}${Math.floor(connection.opacity * 50).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      
      // Draw node
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = colors.node;
      ctx.fill();
    }
  }
  
  // Initialize nodes
  for (let i = 0; i < nodeCount; i++) {
    nodes.push(new Node(
      Math.random() * canvas.width,
      Math.random() * canvas.height
    ));
  }
  
  // Animation loop
  function animate() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw nodes
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      nodes[i].draw();
    }
    
    // Continue animation
    requestAnimationFrame(animate);
  }
  
  // Start animation
  animate();
  
  // Handle resize
  window.addEventListener('resize', () => {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  });
}

/**
 * Setup form handling
 * Validates and processes contact form submissions
 */
function setupFormHandling() {
  const contactForm = document.getElementById('contact-form');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const formValues = Object.fromEntries(formData);
    
    // Validate form
    if (!validateForm(formValues)) return;
    
    // Simulate form submission
    simulateFormSubmission(formValues, contactForm);
  });
}

/**
 * Validate form values
 */
function validateForm(formValues) {
  let isValid = true;
  
  // Check name
  if (!formValues.name || formValues.name.trim() === '') {
    showFormError('name', 'Please enter your name');
    isValid = false;
  } else {
    clearFormError('name');
  }
  
  // Check email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formValues.email || !emailRegex.test(formValues.email)) {
    showFormError('email', 'Please enter a valid email address');
    isValid = false;
  } else {
    clearFormError('email');
  }
  
  // Check message
  if (!formValues.message || formValues.message.trim() === '') {
    showFormError('message', 'Please enter a message');
    isValid = false;
  } else {
    clearFormError('message');
  }
  
  return isValid;
}

/**
 * Show form error
 */
function showFormError(fieldId, message) {
  const field = document.getElementById(fieldId);
  
  // Create error message if it doesn't exist
  let errorElement = field.parentNode.querySelector('.error-message');
  
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    field.parentNode.appendChild(errorElement);
  }
  
  // Set error message and highlight field
  errorElement.textContent = message;
  field.classList.add('error');
}

/**
 * Clear form error
 */
function clearFormError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorElement = field.parentNode.querySelector('.error-message');
  
  // Remove error message and highlight
  if (errorElement) {
    errorElement.remove();
  }
  
  field.classList.remove('error');
}

/**
 * Simulate form submission
 */
function simulateFormSubmission(formValues, form) {
  // Disable form
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';
  
  // Simulate API call
  setTimeout(() => {
    // Show success message
    form.innerHTML = `
      <div class="form-success">
        <h3>Message Sent!</h3>
        <p>Thank you for your message, ${formValues.name}. I'll get back to you soon.</p>
      </div>
    `;
    
    console.log('Form submitted with values:', formValues);
  }, 1500);
}

/**
 * Scroll to puzzle game
 */
function scrollToPuzzle() {
  setTimeout(() => {
    const puzzleContainer = document.querySelector('.puzzle-container');
    if (puzzleContainer) {
      puzzleContainer.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, 100);
}
