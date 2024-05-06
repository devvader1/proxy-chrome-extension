"use strict";
chrome.runtime.onInstalled.addListener(() => {
    // Query for all tabs with HTTP protocol
    chrome.tabs.query({ url: "http://*/*" }, (tabs) => {
        // Loop over the tabs and inject the content script
        for (let tab of tabs) {
            if (tab.id !== undefined) {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ["content.js"],
                });
            }
        }
    });
});
