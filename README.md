# Twitch Spoiler Blocker

A Firefox extension that helps you avoid spoilers on Twitch.tv by hiding thumbnails, VOD lengths, titles, and hover previews.

## Features

### Current Features (v1.0.0)

- **Hide Thumbnails**: Blur video preview images to avoid visual spoilers
- **Hide VOD Length**: Hide video duration to prevent spoiling the outcome
- **Hide Titles**: Hide video titles that might contain spoilers
- **Hide Hover Previews**: Prevent animated preview videos from playing on hover

Each feature can be toggled independently through a simple popup interface.

### Coming Soon

- Auto-hide chat messages
- Quick navigation to latest VOD

## Installation

### From Source (For Development/Testing)

1. Clone or download this repository
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from the extension directory
5. The extension will be loaded and active on all Twitch.tv pages

### From Firefox Add-ons (Coming Soon)

The extension will be available on the Firefox Add-ons store once it's published.

## Usage

1. Click the extension icon in your Firefox toolbar while on any Twitch.tv page
2. Toggle the features you want to enable/disable
3. Settings are saved automatically and persist across browser sessions
4. Changes take effect immediately on the current page

## How It Works

The extension uses:
- **Manifest V3** for modern Firefox compatibility
- **MutationObserver** to detect and hide dynamically loaded content
- **browser.storage.local** to save your preferences
- **CSS classes** for performant hiding/blurring of elements

## File Structure

```
spoilerwarning/
├── manifest.json              # Extension configuration
├── icons/                     # Extension icons
├── src/
│   ├── content/              # Content scripts (runs on Twitch pages)
│   │   ├── content.js        # Initialization
│   │   ├── spoiler-blocker.js # Core hiding logic
│   │   ├── selectors.js      # Twitch element selectors
│   │   └── content.css       # Hiding styles
│   ├── popup/                # Popup UI
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   └── shared/               # Shared utilities
│       ├── storage.js
│       └── constants.js
└── README.md
```

## Development

### Prerequisites

- Firefox 109.0 or later
- Basic knowledge of JavaScript and Firefox extensions

### Making Changes

1. Edit the relevant files in the `src/` directory
2. Reload the extension in `about:debugging#/runtime/this-firefox`
3. Refresh the Twitch page to see your changes

### Updating Selectors

If Twitch updates their UI and the extension stops working:

1. Inspect the Twitch page with Firefox DevTools
2. Find the new CSS selectors for the elements
3. Update the selector arrays in `src/content/selectors.js`
4. Test thoroughly across different Twitch pages

### Testing

Test the extension on these Twitch page types:
- Channel pages (live streams)
- VOD listings
- Individual VOD pages
- Browse/directory pages

## Privacy

This extension:
- Does NOT collect any data
- Does NOT send any information to external servers
- Only stores your toggle preferences locally in your browser
- Only runs on Twitch.tv pages

## License

MIT License - Feel free to use, modify, and distribute

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## Troubleshooting

### Extension not working

1. Make sure you're on a Twitch.tv page
2. Check the browser console for errors (F12 > Console)
3. Try reloading the extension in `about:debugging`
4. Try refreshing the Twitch page

### Some elements not being hidden

Twitch frequently updates their UI. If you notice elements that aren't being hidden:
1. Open an issue with a screenshot
2. Include the page URL where the issue occurs
3. The selectors in `selectors.js` may need to be updated

### Settings not saving

1. Check that the extension has the `storage` permission in `manifest.json`
2. Look for errors in the browser console
3. Try resetting to default settings by toggling all options

## Credits

Created to help avoid spoilers while enjoying Twitch VODs.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
