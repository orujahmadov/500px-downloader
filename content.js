const DOWNLOAD_BUTTON_ID = 'extension-button-attached';
const REGEX_URL = '500px.com\/photo\/*';

const getRoot = () => {
  return document.getElementById('pxLightbox-1') || document.getElementById('root');
}

const getImageTitle = (root) => {
  let imageTitle = null;
  /* Try to get title of photo */
  const h3Elements = root.getElementsByTagName('H3');
  if (h3Elements.length > 0) {
    imageTitle = h3Elements[0].innerHTML;
  }

  return imageTitle || '500px';
}

const attachDownloadButton = () => {
  const root = getRoot();
  
  if (root) {
    const button = document.createElement("BUTTON");
    const text = document.createTextNode(chrome.i18n.getMessage("download_button"));
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
    button.title = 'Added by 500px Downloader Extension';
    button.addEventListener("focus", function () {
      this.style.outline = "0px";  
    });
    button.addEventListener('click', () => {
      const imageAddress = document.querySelector('.photo-show__img').src;
      chrome.runtime.sendMessage({"message": "download_image", "url": imageAddress, "title": getImageTitle(root)});
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
  const matches = window.location.href.match(REGEX_URL);
  if (matches && !downloadButton) {
    attachDownloadButton();
  } else if (!matches && downloadButton) {
    downloadButton.remove();
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      const root = getRoot();
      const imageAddress = document.querySelector('.photo-show__img').src;
      chrome.runtime.sendMessage({"message": "download_image", "url": imageAddress, "title": getImageTitle(root)});
    }
  }
);
