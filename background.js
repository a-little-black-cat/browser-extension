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
  // Prepare blocking rules for the sites stored in blockedSites
  const rules = blockedSites.map((site, index) => ({
    id: index + 1,  // Ensure unique rule IDs
    priority: 1,
    action: {
      type: "block"
    },
    condition: {
      urlFilter: `*://*.${site}/*`,
      resourceTypes: ["main_frame"]
    }
  }));

  // Update the dynamic rules
  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: rules,
    removeRuleIds: [] // Optionally remove previous rules if needed
  }, () => {
    console.log("Blocking rules updated!");
  });
}
