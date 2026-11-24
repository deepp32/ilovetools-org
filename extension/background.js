chrome.runtime.onInstalled.addListener(() => {
  // Context menu for images
  chrome.contextMenus.create({
    id: 'ilovetools-compress-image',
    title: 'Compress image with iLoveTools',
    contexts: ['image']
  });

  chrome.contextMenus.create({
    id: 'ilovetools-resize-image',
    title: 'Resize image pixels with iLoveTools',
    contexts: ['image']
  });

  // Context menu for links (PDFs)
  chrome.contextMenus.create({
    id: 'ilovetools-pdf-tools',
    title: 'Open with iLoveTools PDF Utilities',
    contexts: ['link']
  });

  // General selection
  chrome.contextMenus.create({
    id: 'ilovetools-word-counter',
    title: 'Count words with iLoveTools',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  let url = 'https://www.ilovetools.org';
  if (info.menuItemId === 'ilovetools-compress-image') {
    url = 'https://www.ilovetools.org/compress-image';
  } else if (info.menuItemId === 'ilovetools-resize-image') {
    url = 'https://www.ilovetools.org/resize-image';
  } else if (info.menuItemId === 'ilovetools-pdf-tools') {
    url = 'https://www.ilovetools.org/merge-pdf';
  } else if (info.menuItemId === 'ilovetools-word-counter') {
    url = 'https://www.ilovetools.org/word-counter';
  }
  chrome.tabs.create({ url });
});