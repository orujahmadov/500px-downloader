const DOWNLOAD_BUTTON_ID = 'extension-button-attached';
const REGEX_URL = '500px.com\/photo\/*';

function getImageTitle() {
  const root = document.getElementById('pxLightbox-1') || document.getElementById('root');
  let imageTitle = null;
  /* Try to get title of photo */
  const h3Elements = root.getElementsByTagName('H3');
  if (h3Elements.length > 0) {
    imageTitle = h3Elements[0].innerHTML;
  }

  return imageTitle || '500px';
}

function attachDownloadButton(parent) {

  if (parent) {
    const button = document.createElement("BUTTON");
    const text = document.createTextNode(chrome.i18n.getMessage("download_button"));
    button.appendChild(text);
    button.id = DOWNLOAD_BUTTON_ID;
    button.style.border = '0px';
    button.style.padding = '12px';
    button.style.borderRadius = '5px';
    button.style.color = 'white';
    button.style.cursor = 'pointer';
    button.style.backgroundColor = 'deepskyblue';
    button.title = 'Added by 500px Downloader Extension';
    button.addEventListener("focus", function () {
      this.style.outline = "0px";  
    });
    button.addEventListener('click', () => {
      const imageAddress = document.querySelector('.photo-show__img').src;
      chrome.runtime.sendMessage({"message": "download_image", "url": imageAddress, "title": getImageTitle()});
    });
    parent.appendChild(button);
  }
}

function findChild(node) {
  if (node.className && typeof node.className === "string" && node.className.includes("Elements__PhotoButton")) {
    return node;
  }
  if (node.childNodes.length > 0) {
    for (let child of node.childNodes) {
      const foundNode = findChild(child);
      if (foundNode) {
        return foundNode;
      }
    }
  }

  return undefined;
}

// Callback function to execute when mutations are observed
function mutationCallback(_, _) {
  const downloadButton = document.getElementById(DOWNLOAD_BUTTON_ID);
  const container = document.getElementById("copyrightTooltipContainer");
  
  const matches = window.location.href.match(REGEX_URL);
  if (matches && !downloadButton && container) {
    attachDownloadButton(findChild(container.nextSibling).parentNode);
  } else if (!matches && downloadButton) {
    downloadButton.remove();
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(mutationCallback);
// Select the node that will be observed for mutations
const targetNode = document.getElementsByTagName('body')[0];
// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

chrome.runtime.onMessage.addListener(
  function(request, _, _) {
    if( request.message === "clicked_browser_action" ) {
      const imageAddress = document.querySelector('.photo-show__img').src;
      chrome.runtime.sendMessage({"message": "download_image", "url": imageAddress, "title": getImageTitle()});
    }
  }
);
