/**
 * Hero Section Interactive Elements
 * Handles animations and interactions for the redesigned hero section
 */

// Initialize hero section when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initHeroInteractions();
    initProfileAnimations();
    initNeuralConnections();
    initIndicatorAnimation();
});

/**
 * Initialize hero section interactions
 */
function initHeroInteractions() {
    // Add scroll-based parallax effect for background elements
    const heroSection = document.querySelector('.hero-section');
    const backgroundElements = document.querySelector('.hero-bg-elements');
    
    if (!heroSection || !backgroundElements) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (backgroundElements) {
            backgroundElements.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Add intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe hero elements
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-buttons');
    heroElements.forEach(el => observer.observe(el));
}

/**
 * Initialize profile container animations
 */
function initProfileAnimations() {
    const profileContainer = document.querySelector('.profile-container');
    const profileImage = document.querySelector('.profile-image');
    
    if (!profileContainer || !profileImage) return;
    
    // Add mouse move effect for subtle 3D tilt
    profileContainer.addEventListener('mousemove', (e) => {
        const rect = profileContainer.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const tiltX = (y / rect.height) * 10;
        const tiltY = (x / rect.width) * -10;
        
        profileContainer.style.transform = `
            translateY(-10px) 
            rotateX(${tiltX}deg) 
            rotateY(${tiltY}deg)
        `;
    });
    
    // Reset transform on mouse leave
    profileContainer.addEventListener('mouseleave', () => {
        profileContainer.style.transform = 'translateY(-10px) rotateX(0deg) rotateY(0deg)';
    });
    
    // Add click effect to profile image
    profileImage.addEventListener('click', () => {
        profileImage.style.transform = 'scale(1.05)';
        setTimeout(() => {
            profileImage.style.transform = 'scale(1)';
        }, 200);
    });
}

/**
 * Initialize neural network connections
 */
function initNeuralConnections() {
    const neuralNetwork = document.querySelector('.neural-network');
    const nodes = document.querySelectorAll('.neural-node');
    
    if (!neuralNetwork || nodes.length === 0) return;
    
    // Create SVG for connections
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '0';
    
    neuralNetwork.appendChild(svg);
    
    // Create connections between nodes
    const connections = [];
    const nodePositions = [];
    
    // Get node positions
    nodes.forEach((node, index) => {
        const rect = node.getBoundingClientRect();
        const containerRect = neuralNetwork.getBoundingClientRect();
        
        nodePositions.push({
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2,
            layer: parseInt(node.dataset.layer)
        });
    });
    
    // Create connections between adjacent layers
    nodePositions.forEach((node1, i) => {
        nodePositions.forEach((node2, j) => {
            if (i !== j && Math.abs(node1.layer - node2.layer) === 1) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', node1.x);
                line.setAttribute('y1', node1.y);
                line.setAttribute('x2', node2.x);
                line.setAttribute('y2', node2.y);
                line.setAttribute('stroke', 'var(--hero-neural-color)');
                line.setAttribute('stroke-width', '1');
                line.setAttribute('opacity', '0.3');
                line.style.strokeDasharray = '5,5';
                line.style.animation = `neuralPulse ${2 + Math.random() * 2}s ease-in-out infinite`;
                line.style.animationDelay = `${Math.random() * 2}s`;
                
                svg.appendChild(line);
                connections.push(line);
            }
        });
    });
    
    // Animate connections
    setInterval(() => {
        const randomConnection = connections[Math.floor(Math.random() * connections.length)];
        if (randomConnection) {
            randomConnection.style.opacity = '0.8';
            randomConnection.style.strokeWidth = '2';
            
            setTimeout(() => {
                randomConnection.style.opacity = '0.3';
                randomConnection.style.strokeWidth = '1';
            }, 1000);
        }
    }, 2000);
    
    // Add click effect to nodes
    nodes.forEach(node => {
        node.addEventListener('click', () => {
            // Pulse effect
            node.style.transform = 'scale(1.5)';
            node.style.boxShadow = '0 0 30px var(--hero-neural-color)';
            
            // Activate connected lines
            connections.forEach(line => {
                const x1 = parseFloat(line.getAttribute('x1'));
                const y1 = parseFloat(line.getAttribute('y1'));
                const x2 = parseFloat(line.getAttribute('x2'));
                const y2 = parseFloat(line.getAttribute('y2'));
                
                const nodeRect = node.getBoundingClientRect();
                const containerRect = neuralNetwork.getBoundingClientRect();
                const nodeX = nodeRect.left - containerRect.left + nodeRect.width / 2;
                const nodeY = nodeRect.top - containerRect.top + nodeRect.height / 2;
                
                if ((Math.abs(x1 - nodeX) < 10 && Math.abs(y1 - nodeY) < 10) ||
                    (Math.abs(x2 - nodeX) < 10 && Math.abs(y2 - nodeY) < 10)) {
                    line.style.opacity = '1';
                    line.style.strokeWidth = '3';
                    line.style.stroke = 'var(--hero-accent)';
                }
            });
            
            setTimeout(() => {
                node.style.transform = 'scale(1)';
                node.style.boxShadow = '0 0 20px var(--hero-neural-color)';
                
                connections.forEach(line => {
                    line.style.opacity = '0.3';
                    line.style.strokeWidth = '1';
                    line.style.stroke = 'var(--hero-neural-color)';
                });
            }, 1500);
        });
    });
}

/**
 * Initialize AI indicators animation
 */
function initIndicatorAnimation() {
    const indicators = document.querySelectorAll('.indicator');
    
    if (indicators.length === 0) return;
    
    // Animate indicators in sequence
    setInterval(() => {
        indicators.forEach((indicator, index) => {
            setTimeout(() => {
                indicator.classList.toggle('active');
            }, index * 500);
        });
    }, 4000);
}

/**
 * Add typing effect to hero title
 */
function initTypingEffect() {
    const titleLines = document.querySelectorAll('.title-line');
    
    titleLines.forEach((line, lineIndex) => {
        const text = line.textContent;
        line.textContent = '';
        line.style.opacity = '1';
        
        setTimeout(() => {
            let charIndex = 0;
            const typeInterval = setInterval(() => {
                if (charIndex < text.length) {
                    line.textContent += text[charIndex];
                    charIndex++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 50);
        }, lineIndex * 1000);
    });
}

/**
 * Initialize button hover effects
 */
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('btn-ripple');
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Add click sound effect (optional)
        button.addEventListener('click', (e) => {
            // Add subtle click feedback
            button.style.transform = 'scale(0.98)';
            setTimeout(() => {
                button.style.transform = '';
            }, 100);
        });
    });
}

/**
 * Responsive adjustments
 */
function handleResponsiveAdjustments() {
    const updateLayout = () => {
        const isMobile = window.innerWidth <= 768;
        const heroMain = document.querySelector('.hero-main');
        
        if (heroMain) {
            if (isMobile) {
                // Disable some animations on mobile for performance
                const particles = document.querySelectorAll('.ai-particle');
                particles.forEach(particle => {
                    particle.style.display = 'none';
                });
            } else {
                const particles = document.querySelectorAll('.ai-particle');
                particles.forEach(particle => {
                    particle.style.display = 'block';
                });
            }
        }
    };
    
    window.addEventListener('resize', updateLayout);
    updateLayout(); // Run on initial load
}

/**
 * Initialize performance optimizations
 */
function initPerformanceOptimizations() {
    // Use requestAnimationFrame for smooth animations
    let ticking = false;
    
    const updateAnimations = () => {
        // Update any frame-based animations here
        ticking = false;
    };
    
    const requestTick = () => {
        if (!ticking) {
            requestAnimationFrame(updateAnimations);
            ticking = true;
        }
    };
    
    // Throttle scroll events
    window.addEventListener('scroll', requestTick);
    
    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
        const animations = document.querySelectorAll('[style*="animation"]');
        
        if (document.hidden) {
            animations.forEach(el => {
                el.style.animationPlayState = 'paused';
            });
        } else {
            animations.forEach(el => {
                el.style.animationPlayState = 'running';
            });
        }
    });
}

// Initialize all hero functions
document.addEventListener('DOMContentLoaded', () => {
    initHeroInteractions();
    initProfileAnimations();
    initNeuralConnections();
    initIndicatorAnimation();
    initButtonEffects();
    handleResponsiveAdjustments();
    initPerformanceOptimizations();
    
    // Optional: Add typing effect with delay
    setTimeout(() => {
        // initTypingEffect(); // Uncomment if you want typing effect
    }, 1000);
});

// Export functions for use in other scripts
window.HeroSection = {
    initHeroInteractions,
    initProfileAnimations,
    initNeuralConnections,
    initIndicatorAnimation
};
