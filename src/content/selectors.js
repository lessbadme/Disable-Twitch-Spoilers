// Twitch element selectors with fallbacks for stability
// These target common Twitch UI elements that might contain spoilers

const THUMBNAIL_SELECTORS = [
  '[data-a-target="preview-card-image"]',
  '[data-a-target="preview-card-image-link"] img',
  'img[class*="preview-card"]',
  'img[class*="tw-image"][alt*="thumbnail"]',
  'img[class*="tw-image"][alt*="preview"]',
  '.preview-card-image-link img',
  'a[class*="preview-card"] img',
  '.video-preview-card img',
  '[class*="ScCardImageLink"] img',
  '[class*="ThumbnailCard"] img'
];

const VOD_LENGTH_SELECTORS = [
  '[data-a-target="video-time"]',
  '[class*="video-length"]',
  '[class*="duration-overlay"]',
  '.video-duration-overlay',
  'p[class*="VideoDuration"]',
  '[class*="ScVideoLength"]',
  'div[class*="video-time"]',
  'span[class*="video-time"]'
];

const TITLE_SELECTORS = [
  '[data-a-target="video-title"]',
  'h3[class*="tw-title"]',
  'h3[class*="video-card"]',
  '.video-card-title',
  '[class*="CoreText"][class*="title"]',
  'a[data-a-target*="title"] h3',
  'div[class*="VideoTitle"]',
  'p[class*="VideoTitle"]'
];

const HOVER_PREVIEW_SELECTORS = [
  'video[class*="preview"]',
  '[class*="hover-preview"]',
  'video[autoplay]',
  '[data-a-target="animated-channel-viewers-list-item"] video',
  '[class*="preview-card"] video',
  '.video-preview-card video'
];

// Make available globally for content scripts
if (typeof window !== 'undefined') {
  window.THUMBNAIL_SELECTORS = THUMBNAIL_SELECTORS;
  window.VOD_LENGTH_SELECTORS = VOD_LENGTH_SELECTORS;
  window.TITLE_SELECTORS = TITLE_SELECTORS;
  window.HOVER_PREVIEW_SELECTORS = HOVER_PREVIEW_SELECTORS;
}
