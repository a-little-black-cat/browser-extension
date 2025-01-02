alert("The extension is running.")
// background.js

// List of blocked sites (you can make this dynamic with storage)
const blockedSites = [
  "twitter.com",
  "facebook.com",
  "x.com",
  "instagram.com"
];

// Function to block sites
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    console.log(`Blocking: ${details.url}`);
    return { cancel: true };
  },
  {
    urls: blockedSites.map((site) => `*://*.${site}/*`)
  },
  ["blocking"]
);
