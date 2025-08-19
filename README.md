# Project 11 #AIAugustAppADay: Accessibility Checker

![Last Commit](https://img.shields.io/github/last-commit/davedonnellydev/ai-august-2025-11)

**📆 Date**: 19/Aug/2025  
**🎯 Project Objective**: Create a bookmarklet that injects axe-core into any webpage and provides accessibility checking with results overlay.  
**🚀 Features**: Generate bookmarklet for browser; Inject axe-core from CDN; Run accessibility analysis; Display results in lightweight overlay; Download/Copy results as JSON; Focus trap and keyboard navigation support  
**🛠️ Tech used**: Next.js, TypeScript, Mantine UI, axe-core, vanilla JavaScript  
**▶️ Live Demo**: _[https://your-demo-url.com](https://your-demo-url.com)_  
_(Link will be added after deployment)_

## 🗒️ Summary

**Lessons learned**  
_Building a bookmarklet-based accessibility checker provides a lightweight, cross-platform solution that works on any webpage without requiring installation or permissions._

**Blockers**  
_None encountered during initial development_

**Final thoughts**  
_This approach offers a great user experience by allowing users to check accessibility on any webpage they visit, making it a valuable tool for developers and accessibility advocates._

This project has been built as part of my AI August App-A-Day Challenge. You can read more information on the full project here: [https://github.com/davedonnellydev/ai-august-2025-challenge](https://github.com/davedonnellydev/ai-august-2025-challenge).

## 🧪 Testing

![CI](https://github.com/davedonnellydev/ai-august-2025-11/actions/workflows/npm_test.yml/badge.svg)  
_Note: Test suite runs automatically with each push/merge._

## 🚀 How It Works

The Accessibility Checker creates a bookmarklet that you can add to your browser's bookmarks bar. When clicked on any webpage, it:

1. **Injects axe-core** from CDN if not already loaded
2. **Runs accessibility analysis** on the current page
3. **Displays results** in a lightweight overlay
4. **Provides options** to download or copy results as JSON
5. **Maintains accessibility** with focus trap and keyboard navigation

### Features

- **Lightweight**: Uses vanilla JavaScript and CSS for speed
- **Accessible**: Focus trap, Escape key to close, keyboard navigation
- **Cross-platform**: Works in any modern browser
- **No installation**: Just drag to bookmarks bar
- **Detailed results**: Shows violations, passes, and affected elements
- **Export options**: Download JSON or copy to clipboard

## Quick Start

1. **Clone and install:**

   ```bash
   git clone https://github.com/davedonnellydev/ai-august-2025-11.git
   cd ai-august-2025-11
   npm install
   ```

2. **Start development:**

   ```bash
   npm run dev
   ```

3. **Create bookmarklet:**
   - Open the application in your browser
   - Click "Create Accessibility Checker Bookmarklet"
   - Drag the generated bookmarklet to your bookmarks bar

4. **Test on any webpage:**
   - Navigate to any website
   - Click your accessibility checker bookmarklet
   - Review the accessibility results

5. **Run tests:**
   ```bash
   npm test
   ```

## 🧪 Testing the Bookmarklet

A test page (`test-bookmarklet.html`) is included to verify the bookmarklet functionality:

1. Open `test-bookmarklet.html` in your browser
2. Use the bookmarklet to run accessibility checks
3. Verify that accessibility issues are detected
4. Test the download and copy JSON functionality

## 🔧 Configuration

### Key Configuration Files

- `next.config.mjs` – Next.js config with bundle analyzer
- `tsconfig.json` – TypeScript config with path aliases (`@/*`)
- `theme.ts` – Mantine theme customization
- `eslint.config.mjs` – ESLint rules (Mantine + TS)
- `jest.config.cjs` – Jest testing config

### Path Aliases

```ts
import { Component } from '@/components/Component'; // instead of '../../../components/Component'
```

## 📦 Available Scripts

### Build and dev scripts

- `npm run dev` – start dev server
- `npm run build` – bundle application for production
- `npm run analyze` – analyze production bundle

### Testing scripts

- `npm run typecheck` – checks TypeScript types
- `npm run lint` – runs ESLint
- `npm run jest` – runs jest tests
- `npm run jest:watch` – starts jest watch
- `npm test` – runs `prettier:check`, `lint`, `typecheck` and `jest`

### Other scripts

- `npm run prettier:check` – checks files with Prettier
- `npm run prettier:write` – formats files with Prettier

## 📜 License

![GitHub License](https://img.shields.io/github/license/davedonnellydev/ai-august-2025-11)  
This project is licensed under the MIT License.
