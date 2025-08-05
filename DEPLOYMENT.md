# Deployment Instructions for Demo

## Deploying to Vercel

1. **Connect GitHub Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `out`
   - Install Command: `npm install`

3. **Environment Variables** (if needed):
   - No environment variables required for the demo

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your site

## Project Structure

```
PyCompanySummary/
├── app/                     # Next.js app directory
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main demo page
├── company_summarizer.py   # Main Python script (separate)
├── package.json            # Node.js dependencies
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vercel.json             # Vercel deployment configuration
└── README.md               # Documentation
```

## Notes

- The demo is completely separate from the Python script
- No backend required - it's a static Next.js export
- All demo data is hardcoded for demonstration purposes
- The actual functionality is in `company_summarizer.py`