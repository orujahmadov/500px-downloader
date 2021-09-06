/* Called when the user clicks on the browser action. */
chrome.browserAction.onClicked.addListener(function(_) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action", "title": activeTab.title});
  });
});

// Get url and open in new tab
chrome.runtime.onMessage.addListener(
  function(request, _, _) {
    if( request.message === "download_image" ) {
      const name = request.title.split(' ').join('-').split('/').join('-') + '.jpeg';
      chrome.downloads.download({url: request.url, filename: name}, function(download_id) {
        if (download_id === undefined) {
          chrome.downloads.download({url: request.url, filename: '500px.jpeg'}, function(download_id2) {
            if (download_id2 === undefined) {
              console.log('Fail: Invalid image name');
              /* fail */
            }
          });
        }
      });
    }
  }
);
