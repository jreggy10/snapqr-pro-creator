# SnapQR

A modern, feature-rich QR code generator built with React and TypeScript. Generate custom QR codes instantly — add logos, pick colors, adjust resolution, and export as PNG or SVG.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Features

- **Instant QR Generation** — generate from any text or URL
- **Color Customization** — set custom foreground and background colors
- **Logo Embedding** — embed any image URL as a centered logo
- **Custom Text** — add a label below the QR code
- **Adjustable Resolution** — export from 100px to 1000px
- **PNG & SVG Export** — download as raster or vector, or copy to clipboard
- **Dark Mode** — toggle light/dark theme
- **Responsive** — works on desktop and mobile
- **Keyboard Shortcut** — press Enter to generate

## Tech Stack

- [React 18](https://react.dev/) + TypeScript
- [Vite](https://vitejs.dev/) (build tool)
- [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/)
- [qrcode.react](https://github.com/zpao/qrcode.react) (QR generation)
- [next-themes](https://github.com/pacocoursey/next-themes) (dark mode)
- [Lucide React](https://lucide.dev/) (icons)

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm, yarn, or bun

### Installation

```bash
git clone https://github.com/jreggy10/snapqr-pro-creator.git
cd snapqr-pro-creator
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## Usage

### Basic

1. Enter any text or URL in the input field
2. Click **Generate QR Code** or press Enter
3. Your QR code appears instantly

### Advanced Options

Expand **Advanced Options** to access:

| Option | Description |
|--------|-------------|
| Custom Text | Label displayed below the QR code |
| Logo URL | Image URL to embed as a centered logo |
| Show Logo | Toggle logo visibility |
| Foreground Color | QR code dot color |
| Background Color | QR code background color |
| Export Resolution | Output size in pixels (100–1000px) |

### Export

| Button | Output |
|--------|--------|
| Copy | Copies QR code to clipboard as PNG |
| PNG | Downloads a PNG file at selected resolution |
| SVG | Downloads a scalable vector SVG |

## Available Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## Project Structure

```
src/
├── components/
│   ├── QRGenerator.tsx    # Main QR code generator
│   └── ui/                # shadcn/ui components
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   └── utils.ts
├── pages/
│   ├── Index.tsx
│   └── NotFound.tsx
├── App.tsx
└── main.tsx
```

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
