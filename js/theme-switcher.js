/**
 * Theme Switcher
 * Handles theme switching functionality for the portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
});

/**
 * Initialize theme switcher functionality
 */
function initThemeSwitcher() {
  const themeToggle = document.querySelector('.theme-toggle');
  
  if (!themeToggle) return;
  
  // Set initial theme based on user preference or system preference
  setInitialTheme();
  
  // Add click event to theme toggle
  themeToggle.addEventListener('click', () => {
    toggleTheme();
  });
}

/**
 * Set initial theme
 */
function setInitialTheme() {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme) {
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    // Check for system preference
    const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = prefersDarkTheme ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', initialTheme);
    localStorage.setItem('theme', initialTheme);
  }
  
  // Update theme toggle icon
  updateThemeToggleIcon();
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  // Apply new theme
  document.documentElement.setAttribute('data-theme', newTheme);
  
  // Save preference
  localStorage.setItem('theme', newTheme);
  
  // Update theme toggle icon
  updateThemeToggleIcon();
  
  // Trigger animation
  animateThemeChange();
}

/**
 * Update theme toggle icon based on current theme
 */
function updateThemeToggleIcon() {
  const themeToggle = document.querySelector('.theme-toggle');
  const currentTheme = document.documentElement.getAttribute('data-theme');
  
  if (!themeToggle) return;
  
  // Update SVG icon based on current theme
  if (currentTheme === 'dark') {
    themeToggle.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3V4M12 20V21M21 12H20M4 12H3M18.364 5.636L17.657 6.343M6.343 17.657L5.636 18.364M18.364 18.364L17.657 17.657M6.343 6.343L5.636 5.636M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  } else {
    themeToggle.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.752 15.002C20.5633 15.4975 19.2879 15.747 18 15.75C12.615 15.75 8.25 11.385 8.25 6C8.25 4.755 8.49 3.558 8.91 2.445C5.165 3.636 2.5 7.118 2.5 11.25C2.5 16.635 6.865 21 12.25 21C16.367 21 19.858 18.419 21.062 14.748C21.293 14.677 21.517 14.593 21.735 14.497L21.752 15.002Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }
}

/**
 * Animate theme change with a flash effect
 */
function animateThemeChange() {
  // Create flash overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    z-index: 9999;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  
  // Add to body and animate
  document.body.appendChild(overlay);
  
  // Trigger animation
  setTimeout(() => {
    overlay.style.opacity = '0.5';
    
    setTimeout(() => {
      overlay.style.opacity = '0';
      
      setTimeout(() => {
        overlay.remove();
      }, 300);
    }, 100);
  }, 10);
}
