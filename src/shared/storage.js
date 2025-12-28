// Storage wrapper functions for managing user settings

async function getSettings() {
  try {
    const result = await browser.storage.local.get('settings');
    return result.settings || window.DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error loading settings:', error);
    return window.DEFAULT_SETTINGS;
  }
}

async function saveSettings(settings) {
  try {
    await browser.storage.local.set({ settings });
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
}

// Make available globally for content scripts and popup
if (typeof window !== 'undefined') {
  window.getSettings = getSettings;
  window.saveSettings = saveSettings;
}
