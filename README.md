# VideoQuote App

A beautiful full-screen video player with rotating inspirational dog quotes. Built with React, TypeScript, and Tailwind CSS.

## Features

- Full-screen video background with seamless crossfade transitions
- Random dog quotes that fade in and out
- Dual video system for smooth looping
- Fullscreen support (press F or double-click)
- Responsive design
- Watermark logo overlay

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Required Assets

Before running the app, you need to add the following assets (see `ASSETS-NEEDED.md` for details):

- **Logo**: `src/assets/logo.jpeg` - Your watermark logo
- **Videos**: Place 5 video files (25 seconds each) in `public/videos/`:
  - lake-dawn.mp4
  - beach.mp4
  - forest.mp4
  - coffee.mp4
  - interior.mp4
- **Quotes**: `public/src/assets/dog-quotes.csv` - Already included with sample quotes

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Deployment to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Option 2: Using Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project"
4. Import your Git repository
5. Vercel will auto-detect the Vite framework
6. Click "Deploy"

## Project Structure

```
videoquote-app/
├── public/
│   ├── videos/              # Video files
│   └── src/assets/          # CSV file
├── src/
│   ├── assets/              # Logo and other assets
│   ├── components/          # React components
│   │   └── VideoQuote.tsx   # Main video quote component
│   ├── App.tsx              # Main app component
│   ├── index.css            # Global styles with Tailwind
│   └── main.tsx             # Entry point
├── ASSETS-NEEDED.md         # Guide for required assets
└── vercel.json              # Vercel configuration
```

## Customization

### Change Video List

Edit the `videos` array in `src/components/VideoQuote.tsx`:

```typescript
const videos = [
  "/videos/your-video-1.mp4",
  "/videos/your-video-2.mp4",
  // Add more videos...
];
```

### Change Quote Source

Replace `public/src/assets/dog-quotes.csv` with your own CSV file. Format:
```csv
Quote
"Your first quote"
"Your second quote"
...
```

### Adjust Timing

Modify constants in `src/components/VideoQuote.tsx`:
- `VIDEO_DURATION`: Length of each video segment
- Fade timing in `useEffect` hooks

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Vercel (deployment)

## License

MIT
