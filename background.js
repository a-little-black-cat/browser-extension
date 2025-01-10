let blockedSites = [];

// Load initial blocked sites from storage
chrome.storage.local.get("blockedSites", (data) => {
  blockedSites = data.blockedSites || [];
  updateBlockingRules();
});

// Listen for updates from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateBlockedSites") {
    // Update the blocked sites based on user input
    blockedSites = message.blockedSites || [];
    chrome.storage.local.set({ blockedSites }, () => {
      updateBlockingRules();
      sendResponse({ status: "updated" }); // Ensure response after rules update
    });
    return true; // Return true to indicate sendResponse will be called asynchronously
  }
});

// Update blocking rules using declarativeNetRequest
function updateBlockingRules() {
  // Prepare the blocking rules from blockedSites
  const rules = blockedSites.map((site, index) => ({
    id: index + 1,  // Ensure unique rule IDs
    priority: 1,
    action: {
      type: "block"  // Block the request
    },
    condition: {
      urlFilter: `*://*.${site}/*`,  // Match the domains
      resourceTypes: ["main_frame"]  // Block only the main page load
    }
  }));

  // Log
