# SnapQR

A clean, ad-free QR code generator for churches, nonprofits, and small events. Make polished, shareable codes without a marketing budget.

**No ads. No expiring codes. No signup.** Everything runs in your browser, and your content and logo never leave your device.

**Analytics:** the live site uses cookieless [Umami](https://umami.is) to count visits and which features get used (QR type, download format, quick style, and whether a logo or the scan check was involved). Events carry fixed labels only, never what you put in a code; see `src/lib/analytics.ts`. Localhost and deploy previews aren't tracked.

**[Live Demo →](https://qr.jregs.com)**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://qr.jregs.com)

## Features

- **7 code types:** link, WiFi, contact card (vCard), calendar event, email, SMS, and plain text
- **Styling:** colors, dot styles, corner styles, one-click presets, and logo upload
- **Scannability check:** a live badge warns before a design becomes hard to scan. It checks contrast, logo size, quiet zone, and density, then test-decodes the rendered code at three sizes.
- **Exports:** PNG (up to 4096px), SVG (vector, with the caption as real text), PDF (US Letter, A4, or a 4×6 sign), and copy to clipboard
- **Phone card:** a 1080×1920 "show this" image. On phones it opens the share sheet so you can save it straight to your camera roll.
- **Remembers your last design** in this browser
- **Dark mode** and a responsive layout

## Tech Stack

- [React 18](https://react.dev/) + TypeScript, built with [Vite](https://vitejs.dev/)
- [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/)
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) (rendering), [jsQR](https://github.com/cozmo/jsQR) (scan check)
- [jsPDF](https://github.com/parallax/jsPDF) + [svg2pdf.js](https://github.com/yWorks/svg2pdf.js) (vector PDF, loaded on demand)
- [Vitest](https://vitest.dev/) (tests)

## Getting Started

Requires Node.js 18 or later.

```bash
git clone https://github.com/jreggy10/snapqr-pro-creator.git
cd snapqr-pro-creator
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080).

## Available Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm test          # Run unit tests
```

## Project Structure

```
src/
├── components/
│   ├── QRGenerator.tsx      # Page composition: panels + preview
│   ├── TrustPromise.tsx
│   ├── qr/                  # ContentPanel, StylePanel, CardPanel, QRPreview, ScanBadge, ExportBar
│   │   └── forms/           # One form per code type
│   └── ui/                  # shadcn/ui components
├── hooks/
│   ├── use-qr-design.ts     # Design state + localStorage persistence
│   └── use-scannability.ts  # Heuristics + debounced test decode
├── lib/
│   ├── qr/                  # QRDesign type, payload encoders, renderer options, scannability
│   └── export/              # PNG/SVG, PDF, phone card, file helpers
└── pages/
```

The whole design is one `QRDesign` object (`src/lib/qr/types.ts`). A saved library or brand kit can store it as is.

## Deployment

Build the app and deploy the `dist` folder to any static host:

```bash
npm run build
```

**Vercel** — connect the repo and it deploys automatically on push.  
**Netlify** — drag and drop the `dist` folder, or connect via Git.  
**GitHub Pages** — use the [vite-plugin-gh-pages](https://github.com/nekomeowww/vite-plugin-gh-pages) or the official Actions workflow.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## License

[MIT](LICENSE)

## Support

Open an [issue](https://github.com/jreggy10/snapqr-pro-creator/issues) for bug reports or feature requests.
