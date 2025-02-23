chrome.commands.onCommand.addListener((command) => {
  if (command === "move_tab") {
    chrome.windows.getAll({ populate: true }, (windows) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0 || windows.length < 2) return;

        let currentTab = tabs[0];
        let currentWindowId = currentTab.windowId;

        // Sort windows by ID for consistent rotation
        let sortedWindows = windows.sort((a, b) => a.id - b.id);
        let currentIndex = sortedWindows.findIndex(w => w.id === currentWindowId);

        // Determine the next window in a circular fashion
        let nextIndex = (currentIndex + 1) % sortedWindows.length;
        let targetWindow = sortedWindows[nextIndex];

        // Move the tab to the next window
        chrome.tabs.move(currentTab.id, { windowId: targetWindow.id, index: -1 }, (movedTab) => {
          // Ensure the moved tab is activated
          chrome.tabs.update(movedTab.id, { active: true }, () => {
            // Bring the new window to the front
            chrome.windows.update(targetWindow.id, { focused: true });
          });
        });
      });
    });
  }
});
