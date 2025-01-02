alert("The extension is running.")
// background.js

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

// Update blocking rules
function updateBlockingRules() {
  chrome.webRequest.onBeforeRequest.removeListener(blockingListener);

  if (blockedSites.length > 0) {
    chrome.webRequest.onBeforeRequest.addListener(
      blockingListener,
      { urls: blockedSites.map((site) => `*://*.${site}/*`) },
      ["blocking"]
    );
  }
}

// Blocking listener function
function blockingListener(details) {
  console.log(`Blocking: ${details.url}`);
  return { cancel: true };
}
