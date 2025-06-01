# Mobbins Screenshot Downloader

A tool to download app screenshots from Mobbins, providing an alternative to their paid subscription service.

## Overview

This tool allows you to download app screenshots from Mobbins without requiring a paid subscription. It's designed to help developers and designers access UI references more efficiently.

## Features

- Download all screenshots from any Mobbins app page
- Simple and easy to use
- No subscription required
- Fast and efficient downloads

## Installation

```bash
# Clone the repository
git clone https://github.com/ajagatobby/fuck-mobbins.git

# Navigate to the project directory
cd fuck-mobbins

# Install dependencies
    pnpm install
```

## Run app

```bash
    pnpm dev
```

## Usage

1. Copy the URL of the app you want to download screenshots from on Mobbins
2. The URL should be in this format:
   ```
   https://mobbin.com/apps/[app-name]-[platform]-[uuid]/[uuid]/screens
   ```
   Example:
   ```
   https://mobbin.com/apps/airbnb-ios-e62cd3cf-0432-4936-903f-b9c01124e2bb/85abcdd2-8bd7-4331-afd3-a0147602104a/screens
   ```
3. Run the tool with the URL as an argument
4. Screenshots will be downloaded to your local machine

## License

MIT License

## Disclaimer

This tool is created for educational purposes. Please respect Mobbins' terms of service and use this tool responsibly.
