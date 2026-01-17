# CT-CoTCollapser

A SillyTavern/CozyTavern extension that improves the quality of life when working with Chain of Thought (CoT) or Reasoning blocks.

It allows you to quickly **collapse/close** an open reasoning block by interacting with its content, saving you from having to hunt for the small "collapse" chevron/arrow.

## Features

- **Long Press (Desktop/Mobile):** Click and hold (300ms) anywhere on the reasoning text to collapse the block.
- **Double Click (Desktop):** Double-click anywhere on the reasoning text to collapse.
- **Double Tap (Mobile):** Double-tap on the text to collapse.
- **SteppedThinking Support:** Also supports collapsing `executing` blocks from the SteppedThinking extension.

## Installation

### Automated Installation

If this extension is available in the SillyTavern "Download Extensions" list, simply search for it and click install.

### Manual Installation

1. Open your SillyTavern installation folder.
2. Navigate to `public/scripts/extensions/third-party`.
3. Clone or download this repository into a new folder named `CT-CoTCollapser`.
   ```bash
   git clone https://github.com/leyam3k/CT-CoTCollapser
   ```
4. Restart SillyTavern or reload the page.

## Usage

Simply interact with any **expanded** reasoning block (the grey box showing the AI's thought process):

- **Mouse:** Click and hold for 0.3s OR Double-click.
- **Touch:** Long press OR Double-tap.

The block will close.

## License

MIT
