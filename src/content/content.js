// Content script entry point - initializes the spoiler blocker

(async function() {
  'use strict';

  console.log('[Spoiler Blocker] Content script loaded on:', window.location.href);

  let blocker = null;

  // Initialize the blocker with saved settings
  async function initBlocker() {
    try {
      const settings = await window.getSettings();
      console.log('[Spoiler Blocker] Loaded settings:', settings);

      // Create and initialize the blocker
      blocker = new window.TwitchSpoilerBlocker(settings);
      blocker.init();
    } catch (error) {
      console.error('[Spoiler Blocker] Error initializing:', error);
    }
  }

  // Listen for settings changes from popup
  browser.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.settings) {
      console.log('[Spoiler Blocker] Settings changed:', changes.settings.newValue);

      if (blocker) {
        blocker.updateSettings(changes.settings.newValue);
      }
    }
  });

  // Wait for DOM to be ready, then initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlocker);
  } else {
    // DOM is already loaded
    await initBlocker();
  }

  console.log('[Spoiler Blocker] Setup complete');
})();
