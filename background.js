chrome.runtime.onInstalled.addListener(function () {
    // Query for all tabs with HTTP protocol
    chrome.tabs.query({ url: 'http://*/*' }, function (tabs) {
        // Loop over the tabs and inject the content script
        for (let tab of tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
            });
        }
    });
});
