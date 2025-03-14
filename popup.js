// References to DOM elements
const todayTab = document.getElementById('todayTab');
const historyTab = document.getElementById('historyTab');
const todayView = document.getElementById('todayView');
const historyView = document.getElementById('historyView');
const totalTimeEl = document.getElementById('totalTime');
const todayStatsEl = document.getElementById('todayStats');
const historyStatsEl = document.getElementById('historyStats');

// Add event listeners to tabs
todayTab.addEventListener('click', () => {
  todayTab.classList.add('active');
  historyTab.classList.remove('active');
  todayView.classList.add('active');
  historyView.classList.remove('active');
  
  // Add fade effect
  historyView.style.opacity = 0;
  setTimeout(() => {
    todayView.classList.add('active');
    historyView.classList.remove('active');
    requestAnimationFrame(() => {
      todayView.style.opacity = 1;
    });
  }, 300);
  loadTodayStats();
});

historyTab.addEventListener('click', () => {
  historyTab.classList.add('active');
  todayTab.classList.remove('active');
  historyView.classList.add('active');
  todayView.classList.remove('active');
  
  // Add fade effect
  todayView.style.opacity = 0;
  setTimeout(() => {
    historyView.classList.add('active');
    todayView.classList.remove('active');
    requestAnimationFrame(() => {
      historyView.style.opacity = 1;
    });
  }, 300);
  loadHistoryStats();
});

// Format milliseconds into human-readable time
function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

// Load today's statistics
function loadTodayStats() {
  chrome.runtime.sendMessage({ action: 'getStats' }, (response) => {
    const data = response.todayData;
    todayStatsEl.innerHTML = '';
    
    if (!data || Object.keys(data).length === 0) {
      todayStatsEl.innerHTML = '<p>No data recorded today.</p>';
      totalTimeEl.textContent = '0m';
      return;
    }
    
    // Calculate total time and find max time for the progress bar
    let totalTime = 0;
    let maxTime = 0;
    
    Object.values(data).forEach(time => {
      totalTime += time;
      if (time > maxTime) maxTime = time;
    });
    
    // Display total time
    totalTimeEl.textContent = formatTime(totalTime);
    
    // Sort sites by time (descending)
    const sortedSites = Object.entries(data)
      .sort((a, b) => b[1] - a[1]);
    
    // Create site stats elements
    sortedSites.forEach(([site, time], index) => {
      const percentage = (time / maxTime) * 100;
      
      const siteEl = document.createElement('div');
      siteEl.className = 'site-stat';
      siteEl.style.opacity = '0';
      siteEl.style.transform = 'translateY(10px)';
      siteEl.innerHTML = `
        <div class="site-info">
          <div class="site-name">${site}</div>
          <div class="site-time">${formatTime(time)}</div>
        </div>
        <div class="bar-container">
          <div class="bar" style="width: 0%"></div>
        </div>
      `;
      
      todayStatsEl.appendChild(siteEl);
      
      // Animate in with slight delay based on index
      setTimeout(() => {
        siteEl.style.opacity = '1';
        siteEl.style.transform = 'translateY(0)';
        siteEl.querySelector('.bar').style.width = `${percentage}%`;
      }, index * 100);
    });
  });
}

// Load historical statistics
function loadHistoryStats() {
  chrome.runtime.sendMessage({ action: 'getHistory' }, (response) => {
    const historyData = response.historyData;
    historyStatsEl.innerHTML = '';
    
    if (!historyData || Object.keys(historyData).length === 0) {
      historyStatsEl.innerHTML = '<p>No historical data available.</p>';
      return;
    }
    
    // Process data for the chart
    const dates = [];
    const dailyTotals = [];
    
    // Get all unique sites across all days
    const allSites = new Set();
    Object.values(historyData).forEach(dayData => {
      Object.keys(dayData).forEach(site => allSites.add(site));
    });
    
    // Get dates in order (most recent first)
    const orderedDates = Object.keys(historyData).sort((a, b) => {
      return new Date(b) - new Date(a);
    });
    
    // Calculate top 5 sites overall
    const siteTotals = {};
    allSites.forEach(site => {
      siteTotals[site] = 0;
      orderedDates.forEach(date => {
        if (historyData[date] && historyData[date][site]) {
          siteTotals[site] += historyData[date][site];
        }
      });
    });
    
    const top5Sites = Object.entries(siteTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    // Display top 5 sites
    historyStatsEl.innerHTML = '<h3>Top Sites (7 days)</h3>';
    
    top5Sites.forEach(([site, totalTime]) => {
      const siteEl = document.createElement('div');
      siteEl.className = 'site-stat';
      siteEl.innerHTML = `
        <div class="site-name">${site}</div>
        <div class="site-time">${formatTime(totalTime)}</div>
      `;
      historyStatsEl.appendChild(siteEl);
    });
    
    // Prepare data for the chart
    orderedDates.reverse().forEach(date => {
      const formattedDate = new Date(date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      dates.push(formattedDate);
      
      let dailyTotal = 0;
      if (historyData[date]) {
        Object.values(historyData[date]).forEach(time => {
          dailyTotal += time;
        });
      }
      
      // Convert to hours for the chart
      dailyTotals.push(dailyTotal / (1000 * 60 * 60));
    });
    
    // Draw the chart (if Chart.js is available)
    if (typeof Chart !== 'undefined') {
      const ctx = document.getElementById('weeklyChart').getContext('2d');
      
      // Destroy existing chart if it exists
      if (window.screenTimeChart) {
        window.screenTimeChart.destroy();
      }
      
      window.screenTimeChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: dates,
          datasets: [{
            label: 'Screen Time (hours)',
            data: dailyTotals,
            backgroundColor: '#4285f4'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Hours'
              }
            }
          }
        }
      });
    } else {
      // Chart.js not loaded - show message
      const chartEl = document.getElementById('weeklyChart');
      chartEl.style.display = 'none';
      
      const message = document.createElement('p');
      message.textContent = 'Chart.js is required for the weekly chart.';
      historyStatsEl.appendChild(message);
    }
  });
}

// Load today's stats by default when popup opens
document.addEventListener('DOMContentLoaded', loadTodayStats); 
