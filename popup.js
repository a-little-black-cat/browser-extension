// popup.js

document.addEventListener("DOMContentLoaded", () => {
  const siteList = document.getElementById("site-list");
  const saveButton = document.getElementById("save");

  // Load blocked sites from storage
  chrome.storage.local.get("blockedSites", (data) => {
    siteList.value = data.blockedSites ? data.blockedSites.join("\n") : "";
  });

  // Save blocked sites to storage
  saveButton.addEventListener("click", () => {
    const sites = siteList.value.split("\n").map((site) => site.trim()).filter((site) => site);
    chrome.storage.local.set({ blockedSites: sites }, () => {
      alert("Blocked sites updated!");
    });

    // Update the background script's listener
    chrome.runtime.sendMessage({ action: "updateBlockedSites" });
  });
});
