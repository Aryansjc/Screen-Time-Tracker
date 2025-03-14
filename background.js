// Variables to track current state
let currentUrl = '';
let startTime = null;
let todayData = {};
let isTracking = false;

// Initialize when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  const today = new Date().toLocaleDateString();
  chrome.storage.local.get([today], (result) => {
    todayData = result[today] || {};
  });
  
  // Create an alarm to save data every minute
  chrome.alarms.create('saveData', { periodInMinutes: 1 });
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    updateCurrentTab(tab);
  }
});

// Listen for tab activation changes
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, updateCurrentTab);
});

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener(windowId => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Browser lost focus, stop tracking
    saveCurrentSession();
    isTracking = false;
  } else {
    // Browser gained focus, start tracking current tab
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs.length > 0) {
        updateCurrentTab(tabs[0]);
      }
    });
  }
});

// Save data periodically
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'saveData') {
    saveCurrentSession();
    saveTodayData();
  }
});

// Update function for the current tab
function updateCurrentTab(tab) {
  if (!tab || !tab.url || tab.url.startsWith('chrome://')) {
    return;
  }
  
  // Save time for previous URL before switching
  saveCurrentSession();
  
  // Set new URL and start time
  currentUrl = new URL(tab.url).hostname;
  startTime = Date.now();
  isTracking = true;
}

// Save the current browsing session
function saveCurrentSession() {
  if (!isTracking || !currentUrl || !startTime) {
    return;
  }
  
  const now = Date.now();
  const duration = now - startTime;
  
  // Only record if spent more than 1 second on the site
  if (duration > 1000) {
    // Add time to today's data
    if (!todayData[currentUrl]) {
      todayData[currentUrl] = 0;
    }
    todayData[currentUrl] += duration;
  }
  
  startTime = now;
}

// Save today's data to storage
function saveTodayData() {
  const today = new Date().toLocaleDateString();
  chrome.storage.local.set({ [today]: todayData });
}

// Message handler for popup requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStats') {
    // Ensure latest data is saved
    saveCurrentSession();
    
    const today = new Date().toLocaleDateString();
    chrome.storage.local.get([today], (result) => {
      sendResponse({ todayData: result[today] || {} });
    });
    return true; // Indicates async response
  } else if (request.action === 'getHistory') {
    // Get data for the last 7 days
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString());
    }
    
    chrome.storage.local.get(dates, (result) => {
      sendResponse({ historyData: result });
    });
    return true; // Indicates async response
  }
}); 