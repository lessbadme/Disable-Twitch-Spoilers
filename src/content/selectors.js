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
  '.tw-media-card-stat',
  '[class*="MediaCardStat"]',
  '[data-a-target="video-time"]',
  '[class*="video-length"]',
  '[class*="duration-overlay"]',
  '.video-duration-overlay',
  'p[class*="VideoDuration"]',
  '[class*="ScVideoLength"]',
  'div[class*="video-time"]',
  'span[class*="video-time"]'
];

const PLAYER_TIME_SELECTORS = [
  '[data-a-target="player-seekbar-current-time"]',
  '[data-a-target="player-seekbar-duration"]',
  '.vod-seekbar-preview-overlay__wrapper',
  '[data-test-selector="vod-seekbar-preview-overlay-wrapper"]',
  '.seekbar-thumb'
];

const SEEKBAR_PROGRESS_SELECTORS = [
  'span[data-test-selector="seekbar-segment__segment"][style*="background-color: rgb(169, 112, 255)"]',
  'span.seekbar-segment[style*="rgb(169, 112, 255)"]'
];

const TITLE_SELECTORS = [
  '[data-a-target="stream-title"]',
  '[data-a-target="video-title"]',
  'h3[class*="tw-title"][class*="video"]',
  'h3[class*="video-card"]',
  '.video-card-title',
  'div[class*="VideoTitle"]',
  'p[class*="VideoTitle"]'
];

// Make available globally for content scripts
if (typeof window !== 'undefined') {
  window.THUMBNAIL_SELECTORS = THUMBNAIL_SELECTORS;
  window.VOD_LENGTH_SELECTORS = VOD_LENGTH_SELECTORS;
  window.PLAYER_TIME_SELECTORS = PLAYER_TIME_SELECTORS;
  window.SEEKBAR_PROGRESS_SELECTORS = SEEKBAR_PROGRESS_SELECTORS;
  window.TITLE_SELECTORS = TITLE_SELECTORS;
}
