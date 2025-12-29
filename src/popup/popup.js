// Popup logic for managing toggle settings

(async function() {
  'use strict';

  console.log('[Popup] Initializing...');

  // Get all toggle elements
  const toggles = {
    hideThumbnails: document.getElementById('toggle-thumbnails'),
    hideVodLength: document.getElementById('toggle-vod-length'),
    hideTitles: document.getElementById('toggle-titles'),
    hidePlayerTimes: document.getElementById('toggle-player-times')
  };

  // Initialize popup with saved settings
  async function initPopup() {
    try {
      const settings = await window.getSettings();
      console.log('[Popup] Loaded settings:', settings);

      // Set toggle states from settings
      toggles.hideThumbnails.checked = settings.hideThumbnails;
      toggles.hideVodLength.checked = settings.hideVodLength;
      toggles.hideTitles.checked = settings.hideTitles;
      toggles.hidePlayerTimes.checked = settings.hidePlayerTimes;

      // Add change listeners to all toggles
      Object.keys(toggles).forEach(key => {
        toggles[key].addEventListener('change', () => handleToggleChange(key));
      });

      console.log('[Popup] Initialized successfully');
    } catch (error) {
      console.error('[Popup] Error initializing:', error);
    }
  }

  // Handle toggle change
  async function handleToggleChange(settingKey) {
    try {
      const settings = await window.getSettings();
      settings[settingKey] = toggles[settingKey].checked;

      console.log(`[Popup] Toggle changed: ${settingKey} = ${settings[settingKey]}`);

      await window.saveSettings(settings);
      console.log('[Popup] Settings saved successfully');
    } catch (error) {
      console.error('[Popup] Error saving settings:', error);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPopup);
  } else {
    await initPopup();
  }
})();
