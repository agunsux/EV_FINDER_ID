# EV Finder Indonesia - Vercel Deployment Checklist

This document provides a step-by-step checklist to deploy the EV Finder Indonesia platform to Vercel, ensuring all environment variables and post-deploy validations are executed correctly.

## 1. Prerequisites
- [x] All code has been committed to the `main` branch.
- [x] `package-lock.json` is updated and committed.
- [x] SEO tags (`index.html`, `robots.txt`, `sitemap.xml`) are finalized.
- [x] Build passes locally without errors.

## 2. Environment Variables Needed
You must add the following variables in your Vercel Project Settings before or during the initial deployment:

- `OPENAI_API_KEY`: Your OpenAI API key (required for AI features).
- `OPENAI_BASE_URL`: (Optional) Use this if routing through a proxy or different provider like Groq/Together.
- `OPENAI_MODEL`: (Optional) E.g., `gpt-4o`. If omitted, defaults to `gpt-4o`.

*(Note: Vercel serverless functions will automatically read these variables securely. They are never exposed to the client bundle.)*

## 3. Vercel Deployment Steps
1. Navigate to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New > Project**.
2. Select your EV Finder repository from GitHub.
3. In the "Configure Project" screen, ensure the Framework Preset is detected as **Vite**.
4. Leave the Build Command as `npm run build` and Output Directory as `dist`.
5. Expand the **Environment Variables** section and paste the variables listed in Step 2.
6. Click **Deploy**. Vercel will automatically build the React frontend and map the `api/` directory to Serverless Functions.

## 4. Post-Deploy Testing
Once Vercel provides your production URL (e.g., `https://ev-finder-id.vercel.app`), verify the following:
- [ ] **Frontend Validation**: Load the homepage and ensure the dark theme and images render correctly.
- [ ] **API Validation**: Navigate to `[your-url]/api/vehicles` in your browser. It should return a valid JSON array of vehicles.
- [ ] **AI Advisor Validation**: Open the `/advisor` page on the live site. Submit a query (e.g., "Budget 500 juta, untuk keluarga"). The response should generate within 5-10 seconds using the live OpenAI key.
- [ ] **SEO Check**: Verify the `title` and `meta` tags using a tool like [Meta Tags](https://metatags.io/) or by sharing the link on WhatsApp/Slack to ensure the Open Graph image and description appear.
