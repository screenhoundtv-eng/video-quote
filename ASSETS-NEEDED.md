# Assets Setup Guide

This project requires the following assets to be added before deployment:

## 1. Logo Image (Optional - Placeholder Included)
**Location:** `src/assets/logo.svg`

A placeholder logo has been included. To use your own logo:
- Copy your logo from your Lovable project
- Replace `logo.svg` in the `src/assets/` directory
- Supported formats: .svg, .jpeg, .jpg, .png
- If using a different format, update the import in `VideoQuote.tsx` (line 2)

## 2. Video Files
**Location:** `public/videos/`

You need to add 5 video files (each should be 25 seconds long):
- `lake-dawn.mp4`
- `beach.mp4`
- `forest.mp4`
- `coffee.mp4`
- `interior.mp4`

Copy these from your Lovable project's video folder.

## 3. Quotes CSV (Already Included)
**Location:** `public/src/assets/dog-quotes.csv`

A sample CSV file with 50 dog quotes has been included. You can:
- Keep the existing quotes, or
- Replace with your own quotes from Lovable
- The CSV should have a header row "Quote" and quotes in rows 2-51

## How to Add Assets

1. **From Lovable:**
   - Download your Lovable project
   - Extract the files
   - Copy the logo from the assets folder to `src/assets/`
   - Copy all video files to `public/videos/`
   - Copy the CSV file if you want to use your original quotes

2. **Alternative:**
   - You can use any videos and logo you want
   - Just make sure the videos are named correctly or update the `videos` array in `VideoQuote.tsx`
