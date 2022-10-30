# DevRaven Recorder

Chrome extension to automatically capture browser interactions to generate browser tests for your critical flows.

Just start recording and go through your browser flow, the recorder will automatically generate your browser test using Playwright framework.

## Features

- Captures mouse interactions including click, hover, double-click.
- Captures data inputs to input fields such as text fields, password, single and multi-select fields and textarea fields.
- Captures interactions with checkboxes and radio boxes
- Captures keystokes including Meta(Command), CTRL, ALT (Option) keys.
- Detects page navigations such as full web page, SPA or hash change events and automatically waits for navigation to complete.
- Support for capturing screenshots while recording the tests.
- Support for adding waitForSelector.

## Demo

[![Creating Synthetic Browser Tests with DevRaven Recorder](http://img.youtube.com/vi/9-xEG2Q4Pjc/0.jpg)](http://www.youtube.com/watch?v=9-xEG2Q4Pjc "Creating Synthetic Browser Tests with DevRaven Recorder")

## Installation

This chrome extension will be available on Chrome Web Store very soon, following the review and publishing process. However, you may follow the steps below to side-load the extension to your browser instances.

1. Download the [latest build zip](https://github.com/devraven-io/devraven-recorder/releases/download/v1.0/build.zip) file and extract the zip file on your machine.
2. Navigate to chrome://extensions on your Chrome browser.
3. Toggle developer mode on the top right.
4. Click 'Load unpacked' button.
5. Select the folder location for the extracted zip file.
6. The extension should be installed on your Chrome browser and ready to use.

[![Installation process](http://img.youtube.com/vi/VALhWGco4JY/0.jpg)](http://www.youtube.com/watch?v=VALhWGco4JY "DevRaven Recorder Installation")

## Known Issues

Refer [Issues](https://github.com/devraven-io/devraven-recorder/issues) for known issues and upcoming enhancements.
