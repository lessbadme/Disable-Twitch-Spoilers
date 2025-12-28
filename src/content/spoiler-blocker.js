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

    // Retry hiding after a short delay to catch Twitch's dynamic content
    setTimeout(() => {
      console.log('[Spoiler Blocker] Re-running after delay to catch dynamic content');
      this.hideExistingElements();
    }, 1000);

    // Retry again after Twitch loads more content
    setTimeout(() => {
      console.log('[Spoiler Blocker] Final re-run to catch late-loading content');
      this.hideExistingElements();
    }, 3000);

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
    console.log(`[Spoiler Blocker] Found ${elements.length} potential VOD length elements`);

    let hiddenCount = 0;
    elements.forEach(el => {
      if (!this.appliedElements.has(el)) {
        // Only hide if it looks like a duration (MM:SS or HH:MM:SS format)
        const text = el.textContent.trim();
        if (this.isDuration(text)) {
          console.log(`[Spoiler Blocker] Hiding duration: "${text}"`);
          el.classList.add('spoiler-hidden-element');
          this.appliedElements.add(el);
          hiddenCount++;
        }
      }
    });
    console.log(`[Spoiler Blocker] Hid ${hiddenCount} VOD length elements`);
  }

  isDuration(text) {
    // Match patterns like 1:23, 12:34, 1:23:45, or 12:34:56
    return /^\d{1,2}:\d{2}(:\d{2})?$/.test(text);
  }

  hideTitles() {
    // Direct selectors
    const selectors = window.TITLE_SELECTORS.join(', ');
    const elements = document.querySelectorAll(selectors);

    // Also find titles within video links (VOD preview cards)
    const videoLinkTitles = Array.from(document.querySelectorAll('a[href^="/videos/"] h4, a[href^="/videos/"] h3')).filter(el => {
      // Exclude usernames and other non-title elements
      return !el.closest('[data-a-target="video-info-game-boxart-link"]') && !el.closest('h1');
    });

    // And tooltip titles - but mark them specially
    const tooltipTitles = document.querySelectorAll('.online-side-nav-channel-tooltip__body p:first-child');

    // Combine all
    const allElements = new Set([...elements, ...videoLinkTitles, ...tooltipTitles]);

    console.log(`[Spoiler Blocker] Found ${allElements.size} title elements`);

    allElements.forEach(el => {
      if (!this.appliedElements.has(el)) {
        const isTooltip = el.closest('.online-side-nav-channel-tooltip__body');
        this.replaceTitleText(el, isTooltip);
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
    // Check direct selectors
    for (const selector of window.TITLE_SELECTORS) {
      if (element.matches(selector)) {
        this.replaceTitleText(element, false);
        return;
      }
    }

    // Check if element is a title within a video link (VOD preview cards)
    if ((element.tagName === 'H4' || element.tagName === 'H3') &&
        element.closest('a[href^="/videos/"]')) {
      // Make sure it's not a username or other text
      if (!element.closest('[data-a-target="video-info-game-boxart-link"]') &&
          !element.closest('h1')) {
        this.replaceTitleText(element, false);
        return;
      }
    }

    // Check if element is within a tooltip (hover preview)
    if (element.tagName === 'P' && element.closest('.online-side-nav-channel-tooltip__body')) {
      // Only replace if it looks like a title (first p in the tooltip)
      const tooltipBody = element.closest('.online-side-nav-channel-tooltip__body');
      if (tooltipBody && tooltipBody.querySelector('p') === element) {
        this.replaceTitleText(element, true);
        return;
      }
    }
  }

  replaceTitleText(element, isTooltip = false) {
    if (isTooltip) {
      // For tooltips, just hide the entire tooltip container instead of fighting with text replacement
      const tooltipContainer = element.closest('[class*="tw-balloon"]') || element.closest('[role="tooltip"]');
      if (tooltipContainer) {
        tooltipContainer.classList.add('spoiler-hidden-element');
        console.log(`[Spoiler Blocker] Hid tooltip container`);
        return;
      }
    }

    // For regular titles, replace the text
    if (!element.dataset.originalText) {
      element.dataset.originalText = element.textContent;
    }
    const originalText = element.textContent;
    element.textContent = '[SPOILER HIDDEN]';
    element.classList.add('spoiler-hidden-text');
    console.log(`[Spoiler Blocker] Replaced title: "${originalText.substring(0, 50)}..."`);
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

    // Remove element hiding (includes hidden tooltips)
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
