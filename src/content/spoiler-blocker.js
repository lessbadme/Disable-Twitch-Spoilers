// Core spoiler blocking logic with MutationObserver

class TwitchSpoilerBlocker {
  constructor(settings) {
    this.settings = settings;
    this.observer = null;
    this.appliedElements = new WeakSet();
  }

  init() {
    console.log('[Spoiler Blocker] Initializing with settings:', this.settings);

    // Apply initial hiding on existing DOM
    this.hideExistingElements();

    // Set up MutationObserver for dynamic content
    this.observer = new MutationObserver((mutations) => {
      this.handleMutations(mutations);
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log('[Spoiler Blocker] Initialized and observing DOM');
  }

  hideExistingElements() {
    if (this.settings.hideThumbnails) {
      this.hideThumbnails();
    }
    if (this.settings.hideVodLength) {
      this.hideVodLength();
    }
    if (this.settings.hideTitles) {
      this.hideTitles();
    }
    if (this.settings.hideHoverPreviews) {
      this.hideHoverPreviews();
    }
  }

  handleMutations(mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) { // Element node
          this.processNode(node);
        }
      }
    }
  }

  processNode(node) {
    // Process the node itself
    this.applyHidingToNode(node);

    // Process all child elements
    const children = node.querySelectorAll('*');
    children.forEach(child => this.applyHidingToNode(child));
  }

  applyHidingToNode(element) {
    if (this.appliedElements.has(element)) {
      return; // Already processed
    }

    // Check each feature and apply hiding if enabled
    if (this.settings.hideThumbnails) {
      this.checkAndHideThumbnail(element);
    }
    if (this.settings.hideVodLength) {
      this.checkAndHideVodLength(element);
    }
    if (this.settings.hideTitles) {
      this.checkAndHideTitle(element);
    }
    if (this.settings.hideHoverPreviews) {
      this.checkAndHideHoverPreview(element);
    }

    this.appliedElements.add(element);
  }

  hideThumbnails() {
    const selectors = window.THUMBNAIL_SELECTORS.join(', ');
    const elements = document.querySelectorAll(selectors);
    console.log(`[Spoiler Blocker] Found ${elements.length} thumbnail elements`);

    elements.forEach(el => {
      if (!this.appliedElements.has(el)) {
        el.classList.add('spoiler-hidden-thumbnail');
        this.appliedElements.add(el);
      }
    });
  }

  hideVodLength() {
    const selectors = window.VOD_LENGTH_SELECTORS.join(', ');
    const elements = document.querySelectorAll(selectors);
    console.log(`[Spoiler Blocker] Found ${elements.length} VOD length elements`);

    elements.forEach(el => {
      if (!this.appliedElements.has(el)) {
        // Only hide if it looks like a duration (MM:SS or HH:MM:SS format)
        const text = el.textContent.trim();
        if (this.isDuration(text)) {
          el.classList.add('spoiler-hidden-element');
          this.appliedElements.add(el);
        }
      }
    });
  }

  isDuration(text) {
    // Match patterns like 1:23, 12:34, 1:23:45, or 12:34:56
    return /^\d{1,2}:\d{2}(:\d{2})?$/.test(text);
  }

  hideTitles() {
    const selectors = window.TITLE_SELECTORS.join(', ');
    const elements = document.querySelectorAll(selectors);
    console.log(`[Spoiler Blocker] Found ${elements.length} title elements`);

    elements.forEach(el => {
      if (!this.appliedElements.has(el)) {
        // Store original text if not already stored
        if (!el.dataset.originalText) {
          el.dataset.originalText = el.textContent;
        }
        // Replace with spoiler warning
        el.textContent = '[SPOILER HIDDEN]';
        el.classList.add('spoiler-hidden-text');
        this.appliedElements.add(el);
      }
    });
  }

  hideHoverPreviews() {
    const selectors = window.HOVER_PREVIEW_SELECTORS.join(', ');
    const elements = document.querySelectorAll(selectors);
    console.log(`[Spoiler Blocker] Found ${elements.length} hover preview elements`);

    elements.forEach(el => {
      if (!this.appliedElements.has(el)) {
        el.classList.add('spoiler-hidden-hover-preview');
        // Also prevent autoplay
        if (el.tagName === 'VIDEO') {
          el.pause();
          el.removeAttribute('autoplay');
        }
        this.appliedElements.add(el);
      }
    });
  }

  checkAndHideThumbnail(element) {
    for (const selector of window.THUMBNAIL_SELECTORS) {
      if (element.matches(selector)) {
        element.classList.add('spoiler-hidden-thumbnail');
        return;
      }
    }
  }

  checkAndHideVodLength(element) {
    for (const selector of window.VOD_LENGTH_SELECTORS) {
      if (element.matches(selector)) {
        // Only hide if it looks like a duration
        const text = element.textContent.trim();
        if (this.isDuration(text)) {
          element.classList.add('spoiler-hidden-element');
        }
        return;
      }
    }
  }

  checkAndHideTitle(element) {
    for (const selector of window.TITLE_SELECTORS) {
      if (element.matches(selector)) {
        // Store original text if not already stored
        if (!element.dataset.originalText) {
          element.dataset.originalText = element.textContent;
        }
        // Replace with spoiler warning
        element.textContent = '[SPOILER HIDDEN]';
        element.classList.add('spoiler-hidden-text');
        return;
      }
    }
  }

  checkAndHideHoverPreview(element) {
    for (const selector of window.HOVER_PREVIEW_SELECTORS) {
      if (element.matches(selector)) {
        element.classList.add('spoiler-hidden-hover-preview');
        if (element.tagName === 'VIDEO') {
          element.pause();
          element.removeAttribute('autoplay');
        }
        return;
      }
    }
  }

  updateSettings(newSettings) {
    console.log('[Spoiler Blocker] Updating settings:', newSettings);
    this.settings = newSettings;

    // Clear applied elements to reprocess
    this.appliedElements = new WeakSet();

    // Remove all existing classes
    this.removeAllHiding();

    // Reapply with new settings
    this.hideExistingElements();
  }

  removeAllHiding() {
    // Remove thumbnail hiding
    document.querySelectorAll('.spoiler-hidden-thumbnail').forEach(el => {
      el.classList.remove('spoiler-hidden-thumbnail');
    });

    // Remove element hiding
    document.querySelectorAll('.spoiler-hidden-element').forEach(el => {
      el.classList.remove('spoiler-hidden-element');
    });

    // Remove text hiding and restore original text
    document.querySelectorAll('.spoiler-hidden-text').forEach(el => {
      if (el.dataset.originalText) {
        el.textContent = el.dataset.originalText;
        delete el.dataset.originalText;
      }
      el.classList.remove('spoiler-hidden-text');
    });

    // Remove hover preview hiding
    document.querySelectorAll('.spoiler-hidden-hover-preview').forEach(el => {
      el.classList.remove('spoiler-hidden-hover-preview');
    });
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.removeAllHiding();
    console.log('[Spoiler Blocker] Destroyed');
  }
}

// Make available globally for content script
if (typeof window !== 'undefined') {
  window.TwitchSpoilerBlocker = TwitchSpoilerBlocker;
}
