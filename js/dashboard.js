/**
 * AI Dashboard Visualization
 * Creates a glass dashboard with AI metrics visualization
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardViz();
});

/**
 * Initialize AI dashboard visualization
 */
function initDashboardViz() {
  const dashboardContainer = document.getElementById('ai-dashboard');
  if (!dashboardContainer) return;

  createDashboardComponents(dashboardContainer);
  initDashboardAnimations(dashboardContainer);
}

/**
 * Create dashboard visualization components
 */
function createDashboardComponents(container) {
  // Create AI performance metrics
  const perfMetrics = document.createElement('div');
  perfMetrics.className = 'dashboard-card glass-card glass-card-3d';
  perfMetrics.innerHTML = `
    <h3>AI Model Performance</h3>
    <div class="metrics-container">
      <div class="metric-item">
        <div class="metric-circle" data-percentage="94">
          <svg viewBox="0 0 120 120">
            <circle class="bg" cx="60" cy="60" r="54" />
            <circle class="progress" cx="60" cy="60" r="54" />
          </svg>
          <div class="percentage">94<span>%</span></div>
        </div>
        <div class="metric-label">Accuracy</div>
      </div>
      <div class="metric-item">
        <div class="metric-circle" data-percentage="89">
          <svg viewBox="0 0 120 120">
            <circle class="bg" cx="60" cy="60" r="54" />
            <circle class="progress" cx="60" cy="60" r="54" />
          </svg>
          <div class="percentage">89<span>%</span></div>
        </div>
        <div class="metric-label">Precision</div>
      </div>
      <div class="metric-item">
        <div class="metric-circle" data-percentage="92">
          <svg viewBox="0 0 120 120">
            <circle class="bg" cx="60" cy="60" r="54" />
            <circle class="progress" cx="60" cy="60" r="54" />
          </svg>
          <div class="percentage">92<span>%</span></div>
        </div>
        <div class="metric-label">Recall</div>
      </div>
    </div>
  `;
  
  // Create AI activity visualization
  const activityViz = document.createElement('div');
  activityViz.className = 'dashboard-card glass-card glass-card-3d';
  activityViz.innerHTML = `
    <h3>Neural Network Activity</h3>
    <div class="activity-container">
      <canvas class="activity-canvas"></canvas>
      <div class="activity-labels">
        <div class="activity-label">Input Layer</div>
        <div class="activity-label">Hidden Layer 1</div>
        <div class="activity-label">Hidden Layer 2</div>
        <div class="activity-label">Output Layer</div>
      </div>
    </div>
  `;
  
  // Create training progress visualization
  const trainingProgress = document.createElement('div');
  trainingProgress.className = 'dashboard-card glass-card glass-card-3d';
  trainingProgress.innerHTML = `
    <h3>Training Progress</h3>
    <div class="progress-container">
      <div class="progress-chart">
        <canvas class="progress-canvas"></canvas>
      </div>
      <div class="progress-stats">
        <div class="stat">
          <div class="stat-label">Epochs</div>
          <div class="stat-value">100/100</div>
        </div>
        <div class="stat">
          <div class="stat-label">Loss</div>
          <div class="stat-value">0.024</div>
        </div>
        <div class="stat">
          <div class="stat-label">Training Time</div>
          <div class="stat-value">2.5 hrs</div>
        </div>
      </div>
    </div>
  `;
  
  // Add components to container
  container.appendChild(perfMetrics);
  container.appendChild(activityViz);
  container.appendChild(trainingProgress);
}

/**
 * Initialize dashboard animations
 */
function initDashboardAnimations(container) {
  // Initialize metrics circles
  initMetricsCircles();
  
  // Initialize activity visualization
  initActivityViz();
  
  // Initialize progress chart
  initProgressChart();
}

/**
 * Initialize metrics circles
 */
function initMetricsCircles() {
  const metricCircles = document.querySelectorAll('.metric-circle');
  
  metricCircles.forEach(circle => {
    const percentage = parseInt(circle.getAttribute('data-percentage'));
    const progressCircle = circle.querySelector('.progress');
    
    // Calculate circle circumference
    const radius = progressCircle.getAttribute('r');
    const circumference = 2 * Math.PI * radius;
    
    // Set circle styles
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference;
    
    // Animate the circle
    setTimeout(() => {
      const offset = circumference - (percentage / 100) * circumference;
      progressCircle.style.strokeDashoffset = offset;
    }, 500);
  });
}

/**
 * Initialize neural network activity visualization
 */
function initActivityViz() {
  const canvas = document.querySelector('.activity-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  const container = canvas.parentElement;
  canvas.width = container.offsetWidth;
  canvas.height = 180;
  
  // Neural network structure
  const layers = [6, 8, 8, 4];
  const neurons = [];
  
  // Initialize neurons
  initNeurons();
  
  // Animation frame
  let frame = 0;
  
  // Colors
  const getColors = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      neuron: isDark ? '#818cf8' : '#4338ca',
      connection: isDark ? 'rgba(165, 180, 252, 0.4)' : 'rgba(99, 102, 241, 0.4)',
      activeNeuron: isDark ? '#38bdf8' : '#0ea5e9',
      background: isDark ? '#0f172a' : '#f9fafb',
    };
  };
  
  let colors = getColors();
  
  // Initialize neurons
  function initNeurons() {
    neurons.length = 0;
    
    const horizontalSpacing = canvas.width / (layers.length + 1);
    const margin = 30;
    
    for (let l = 0; l < layers.length; l++) {
      const nodeCount = layers[l];
      const layerX = horizontalSpacing * (l + 1);
      const layerHeight = canvas.height - (margin * 2);
      const verticalSpacing = layerHeight / (nodeCount + 1);
      
      for (let n = 0; n < nodeCount; n++) {
        const y = verticalSpacing * (n + 1) + margin;
        
        neurons.push({
          x: layerX,
          y: y,
          layer: l,
          index: n,
          active: Math.random() > 0.7,
          activation: Math.random(),
          radius: 6
        });
      }
    }
  }
  
  // Draw network
  function drawNetwork() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update colors
    colors = getColors();
    
    // Draw connections
    for (let i = 0; i < neurons.length; i++) {
      const neuron = neurons[i];
      
      // Only draw connections from this layer to next layer
      if (neuron.layer < layers.length - 1) {
        // Get next layer neurons
        const nextLayerNeurons = neurons.filter(n => n.layer === neuron.layer + 1);
        
        for (let j = 0; j < nextLayerNeurons.length; j++) {
          const targetNeuron = nextLayerNeurons[j];
          
          // Draw connection
          ctx.beginPath();
          ctx.moveTo(neuron.x, neuron.y);
          ctx.lineTo(targetNeuron.x, targetNeuron.y);
          
          // Set connection style
          const activationStrength = neuron.active ? 0.5 + (neuron.activation * 0.5) : 0.1;
          ctx.strokeStyle = colors.connection.replace('0.4', activationStrength.toFixed(2));
          ctx.lineWidth = neuron.active ? 1.5 : 0.5;
          ctx.stroke();
        }
      }
    }
    
    // Draw neurons
    for (let i = 0; i < neurons.length; i++) {
      const neuron = neurons[i];
      
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, neuron.radius, 0, Math.PI * 2);
      
      // Set fill style based on activation
      if (neuron.active) {
        ctx.fillStyle = colors.activeNeuron;
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = colors.activeNeuron;
      } else {
        ctx.fillStyle = colors.neuron;
        ctx.shadowBlur = 0;
      }
      
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
  
  // Update neurons
  function updateNeurons() {
    for (let i = 0; i < neurons.length; i++) {
      const neuron = neurons[i];
      
      // Randomly activate/deactivate neurons
      if (Math.random() < 0.01) {
        neuron.active = !neuron.active;
      }
      
      // Update activation
      if (neuron.active) {
        neuron.activation = 0.6 + Math.sin(frame * 0.05 + i * 0.2) * 0.4;
      } else {
        neuron.activation *= 0.95;
      }
    }
    
    frame++;
  }
  
  // Animation loop
  function animate() {
    updateNeurons();
    drawNetwork();
    requestAnimationFrame(animate);
  }
  
  // Start animation
  animate();
  
  // Handle resize
  window.addEventListener('resize', () => {
    canvas.width = container.offsetWidth;
    initNeurons();
  });
  
  // Handle theme changes
  const observer = new MutationObserver(() => {
    colors = getColors();
  });
  
  observer.observe(document.documentElement, { 
    attributes: true, 
    attributeFilter: ['data-theme'] 
  });
}

/**
 * Initialize progress chart
 */
function initProgressChart() {
  const canvas = document.querySelector('.progress-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  const container = canvas.parentElement;
  canvas.width = container.offsetWidth;
  canvas.height = 120;
  
  // Chart data
  const trainingData = {
    loss: generateSmoothData(100, 0.8, 0.02),
    accuracy: generateSmoothData(100, 0.4, 0.94)
  };
  
  // Colors
  const getColors = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      loss: isDark ? '#ef4444' : '#dc2626',
      accuracy: isDark ? '#22c55e' : '#16a34a',
      grid: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      text: isDark ? '#94a3b8' : '#64748b'
    };
  };
  
  let colors = getColors();
  
  // Generate smooth random data
  function generateSmoothData(points, start, end) {
    const data = [];
    let current = start;
    
    for (let i = 0; i < points; i++) {
      // Progress toward end value with some noise
      const progress = i / (points - 1);
      const target = start + (end - start) * progress;
      current = current + (target - current) * 0.1 + (Math.random() * 0.05 - 0.025);
      data.push(current);
    }
    
    return data;
  }
  
  // Draw chart
  function drawChart() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update colors
    colors = getColors();
    
    // Draw grid
    drawGrid();
    
    // Draw loss curve
    drawCurve(trainingData.loss, colors.loss, 0, 1);
    
    // Draw accuracy curve
    drawCurve(trainingData.accuracy, colors.accuracy, 0, 1);
    
    // Draw axis labels
    drawLabels();
  }
  
  // Draw grid
  function drawGrid() {
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    
    // Draw horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = canvas.height - (canvas.height * (i / 4));
      
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }
  
  // Draw a curve
  function drawCurve(data, color, min, max) {
    const dataRange = max - min;
    const pointCount = data.length;
    const pointSpacing = canvas.width / (pointCount - 1);
    
    // Draw curve
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    for (let i = 0; i < pointCount; i++) {
      const x = i * pointSpacing;
      const normalizedValue = (data[i] - min) / dataRange;
      const y = canvas.height - (normalizedValue * canvas.height);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // Draw area under curve
    ctx.beginPath();
    ctx.fillStyle = `${color}33`; // 20% opacity
    
    for (let i = 0; i < pointCount; i++) {
      const x = i * pointSpacing;
      const normalizedValue = (data[i] - min) / dataRange;
      const y = canvas.height - (normalizedValue * canvas.height);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();
  }
  
  // Draw axis labels
  function drawLabels() {
    ctx.fillStyle = colors.text;
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    // Draw epoch labels
    ctx.fillText('0', 5, canvas.height - 5);
    ctx.textAlign = 'right';
    ctx.fillText('100', canvas.width - 5, canvas.height - 5);
  }
  
  // Draw initial chart
  drawChart();
  
  // Handle resize
  window.addEventListener('resize', () => {
    canvas.width = container.offsetWidth;
    drawChart();
  });
  
  // Handle theme changes
  const observer = new MutationObserver(() => {
    colors = getColors();
    drawChart();
  });
  
  observer.observe(document.documentElement, { 
    attributes: true, 
    attributeFilter: ['data-theme'] 
  });
}
