chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "translate",
      title: "Translate Selection",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "translate" && info.selectionText) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: translateText,
        args: [info.selectionText]
      });
    }
  });
  
  function translateText(selectedText) {
    const translations = {
      hello: "salom",
      world: "dunyo",
      text: "matn",
    };
    const result = translations[selectedText.toLowerCase()] || "Translation not found";
    alert(`Translation: ${result}`);
  }
  