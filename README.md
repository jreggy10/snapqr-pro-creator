# SnapQR Pro Creator

A modern, feature-rich QR code generator built with React, TypeScript, and Tailwind CSS. Create custom QR codes instantly with advanced options like logo embedding, custom text, and adjustable resolution.

## Features

- **Instant QR Generation**: Generate QR codes from text or URLs in seconds
- **Custom Text**: Add custom text below your QR codes
- **Logo Integration**: Embed logos directly into QR codes
- **Adjustable Resolution**: Export QR codes in various resolutions (100px - 1000px)
- **Multiple Export Options**: Download as PNG or copy to clipboard
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Keyboard Support**: Press Enter to generate QR codes quickly

## Technology Stack

- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **QR Generation**: qrcode.react
- **State Management**: React Hooks with TanStack Query
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd snapqr-pro-creator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Basic QR Code Generation

1. Enter any text or URL in the input field
2. Click "Generate QR Code" or press Enter
3. Your QR code will appear instantly

### Advanced Options

Click on "Advanced Options" to access:

- **Custom Text**: Add text below your QR code
- **Logo URL**: Enter a URL to an image to embed as a logo
- **Show Logo**: Toggle to enable/disable logo embedding
- **Export Resolution**: Adjust the size of your exported QR code (100px - 1000px)

### Export Options

Once you've generated a QR code:

- **Copy**: Copy the QR code to your clipboard
- **Download**: Save the QR code as a PNG file

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── QRGenerator.tsx    # Main QR code generator component
│   └── ui/                # shadcn/ui components
├── hooks/
│   ├── use-mobile.tsx     # Mobile detection hook
│   └── use-toast.ts       # Toast notification hook
├── lib/
│   └── utils.ts           # Utility functions
├── pages/
│   ├── Index.tsx          # Home page
│   └── NotFound.tsx       # 404 page
├── App.tsx                # Main app component
├── main.tsx               # App entry point
└── vite-env.d.ts          # Vite type definitions
```

## Development

### Code Quality

The project includes:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- React best practices

### Component Architecture

- **QRGenerator**: Main component handling QR code generation, state management, and user interactions
- **UI Components**: Reusable shadcn/ui components for consistent design
- **Hooks**: Custom hooks for reusable logic

## Deployment

### Using Lovable

1. Visit your [Lovable Project](https://lovable.dev/projects/3c1ceab0-b631-4d10-9c4a-394319f6f1c8)
2. Click on Share → Publish
3. Your app will be deployed automatically

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your preferred hosting service (Vercel, Netlify, etc.)

## Custom Domain

To connect a custom domain:
1. Navigate to Project → Settings → Domains in Lovable
2. Click "Connect Domain"
3. Follow the instructions to set up your custom domain

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit them: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is private and proprietary.

## Support

For support or questions:
- Visit the [Lovable Project](https://lovable.dev/projects/3c1ceab0-b631-4d10-9c4a-394319f6f1c8)
- Check the documentation
- Open an issue in the repository

## Future Enhancements

- Batch QR code generation
- QR code analytics
- More customization options (colors, shapes)
- QR code scanning functionality
- Export to multiple formats (SVG, PDF)
- QR code templates
- API integration for dynamic QR codes
