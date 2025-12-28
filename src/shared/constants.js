// Default settings for the extension
const DEFAULT_SETTINGS = {
  hideThumbnails: true,
  hideVodLength: true,
  hideTitles: false,
  hideHoverPreviews: true
};

// Make available globally for content scripts (non-module context)
if (typeof window !== 'undefined') {
  window.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
}
