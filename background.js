let blockedSites = [];

// Load initial blocked sites from storage
chrome.storage.local.get("blockedSites", (data) => {
  blockedSites = data.blockedSites || [];
  updateBlockingRules();
});

// Listen for updates from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateBlockedSites") {
    chrome.storage.local.get("blockedSites", (data) => {
      blockedSites = data.blockedSites || [];
      updateBlockingRules();
    });
    sendResponse({ status: "updated" });
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

  // Log the rules for debugging
  console.log('Updating blocking rules with sites:', rules);

  // Update dynamic rules
  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: rules,  // Add new blocking rules
    removeRuleIds: []  // Optionally, you can remove old rules
  }, () => {
    console.log("Blocking rules updated!");
  });
}

}

