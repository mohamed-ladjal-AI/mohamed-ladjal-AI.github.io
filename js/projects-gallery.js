/**
 * Projects Gallery Functionality
 * Handles project filtering, animations, and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize project gallery
  initProjectGallery();
  
  // Add filter functionality
  initFilterButtons();
  
  // Add glass interaction effects
  initGlassInteractions();
});

/**
 * Initialize the project gallery
 */
function initProjectGallery() {
  const galleryCards = document.querySelectorAll('.gallery-card');
  
  // Add staggered animation to cards
  galleryCards.forEach((card, index) => {
    // Ensure initial state for animation
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    // Set timeout for staggered appearance
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 + (index * 100));
  });
}

/**
 * Initialize filter buttons
 */
function initFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get filter value
      const filter = button.getAttribute('data-filter');
      
      // Filter gallery cards
      galleryCards.forEach(card => {
        if (filter === 'all') {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 100);
        } else {
          if (card.getAttribute('data-category') === filter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 100);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        }
      });
    });
  });
}

/**
 * Initialize glass interaction effects
 */
function initGlassInteractions() {
  const galleryCards = document.querySelectorAll('.gallery-card.glass-card');
  
  galleryCards.forEach(card => {
    // Mouse move effect
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate percentage positions
      const xPercent = Math.floor((x / rect.width) * 100);
      const yPercent = Math.floor((y / rect.height) * 100);
      
      // Create gradient based on mouse position
      card.style.background = `radial-gradient(circle at ${xPercent}% ${yPercent}%, 
        rgba(255, 255, 255, 0.2) 0%, 
        rgba(255, 255, 255, 0.1) 20%, 
        rgba(255, 255, 255, 0.05) 50%, 
        rgba(0, 0, 0, 0) 80%)`;
      
      // Subtle rotation based on mouse position
      const rotateX = ((y / rect.height) - 0.5) * 10;
      const rotateY = ((x / rect.width) - 0.5) * -10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    // Reset on mouse leave
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
      card.style.transform = '';
      
      // Add transition for smooth reset
      card.style.transition = 'all 0.5s ease';
      
      // Remove transition after reset
      setTimeout(() => {
        card.style.transition = '';
      }, 500);
    });
  });
}

/**
 * Modal functionality for project details
 */
function openProjectModal(projectId) {
  // Get modal element
  const modal = document.getElementById('project-modal');
  
  // Show modal
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Load project details
    loadProjectDetails(projectId);
  }
}

/**
 * Load project details into modal
 */
function loadProjectDetails(projectId) {
  // This would typically fetch project data from an API or data object
  // For now, we'll just log the project ID
  console.log('Loading project details for ID:', projectId);
  
  // Example of how to populate modal content (would be dynamic in production)
  const modalContent = document.querySelector('.modal-content');
  if (modalContent) {
    modalContent.innerHTML = `
      <h2>Project #${projectId} Details</h2>
      <p>Detailed information about this AI project would appear here.</p>
    `;
  }
}

/**
 * Close project modal
 */
function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}
