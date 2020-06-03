const DOWNLOAD_BUTTON_ID = 'extension-button-attached';

const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const attachDownloadButton = () => {
  const root = document.getElementById('pxLightbox-1') || document.getElementById('root');
  
  if (root) {
    const button = document.createElement("BUTTON");
    const text = document.createTextNode("Download");
    button.appendChild(text);
    button.id = DOWNLOAD_BUTTON_ID;
    button.style.position = 'absolute';
    button.style.top = '65%';
    button.style.right = '25px';
    button.style.border = '0px';
    button.style.padding = '10px';
    button.style.color = 'black';
    button.style.cursor = 'pointer';
    button.style.zIndex = 100;
    button.addEventListener('click', () => {
      const imageAddress = document.querySelector('.photo-show__img').src;
      chrome.runtime.sendMessage({"message": "download_image", "url": imageAddress, "title": 'some-title'});
    });
    root.appendChild(button);
  }
}

// Select the node that will be observed for mutations
const targetNode = document.getElementsByTagName('body')[0];

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

var detectionCount = 0;
// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
  const downloadButton = document.getElementById(DOWNLOAD_BUTTON_ID);
  if (!downloadButton) {
    sleep(500).then(() => {
      attachDownloadButton()
    });
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      const imageAddress = document.querySelector('.photo-show__img').src;
      chrome.runtime.sendMessage({"message": "download_image", "url": imageAddress, "title": request.title});
    }
  }
);
