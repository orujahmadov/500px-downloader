chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {

      var imageAddress = document.querySelector('.photo-show__img').src;
      
      chrome.runtime.sendMessage({"message": "download_image", "url": imageAddress, "title": request.title});
    }
  }
);
