# 🚀 Deployment Guide: Mortgage Flyer Pro
**Making Your Flyers Accessible to Agents and Their Clients**

---

## ✅ Current Status

- **Security Audit:** ✅ PASSED (0 vulnerabilities)
- **Build:** ✅ SUCCESSFUL
- **Linting:** ✅ CLEAN (0 errors, 7 minor warnings)
- **Vite Version:** 7.3.1 (latest)

---

## 📋 Table of Contents

1. [Quick Start - Deploy to Vercel](#quick-start---deploy-to-vercel)
2. [Environment Setup](#environment-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Custom Domain Setup](#custom-domain-setup)
5. [Sharing Flyers with Agents](#sharing-flyers-with-agents)
6. [Live Rate Updates](#live-rate-updates)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Quick Start - Deploy to Vercel

### Step 1: Prepare Your Repository

```bash
# Make sure all changes are committed
git add .
git commit -m "Production ready: audit fixes and deployment prep"
git push origin main
```

### Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. Click **"Add New Project"**
3. **Import your Git repository** (GitHub/GitLab/Bitbucket)
4. **Configure Project:**
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Add Environment Variables** (see below)
6. Click **"Deploy"**

---

## 🔐 Environment Setup

### Required Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: AI Features (for market insights generation)
LOVABLE_API_KEY=your_lovable_api_key
```

### Where to Find These Values:

#### Supabase Credentials:
1. Go to [supabase.com](https://supabase.com)
2. Open your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

#### Lovable API Key (Optional):
- Used for AI-generated market insights
- Get from your Lovable account dashboard

---

## 🗄️ Supabase Configuration

### 1. Database Setup

Your Supabase project needs the `flyer_templates` table. Run this SQL in Supabase SQL Editor:

```sql
-- Create flyer_templates table
CREATE TABLE IF NOT EXISTS flyer_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  data JSONB NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id)
);

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_flyer_templates_slug ON flyer_templates(slug);
CREATE INDEX IF NOT EXISTS idx_flyer_templates_published ON flyer_templates(is_published);

-- Enable Row Level Security
ALTER TABLE flyer_templates ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published flyers
CREATE POLICY "Published flyers are viewable by everyone" 
  ON flyer_templates FOR SELECT 
  USING (is_published = true);

-- Policy: Authenticated users can create flyers
CREATE POLICY "Authenticated users can create flyers" 
  ON flyer_templates FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Policy: Users can update their own flyers
CREATE POLICY "Users can update own flyers" 
  ON flyer_templates FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = created_by);
```

### 2. Edge Functions Setup

Deploy the Supabase Edge Functions:

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy fetch-mortgage-rates
supabase functions deploy generate-market-insights

# Set secrets for functions
supabase secrets set LOVABLE_API_KEY=your_lovable_api_key
```

---

## 🌐 Custom Domain Setup

### Option 1: Use Vercel Domain
Your app will be available at: `https://your-project-name.vercel.app`

### Option 2: Custom Domain

1. **In Vercel Dashboard:**
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., `flyers.iamortgage.org`)

2. **Update DNS Records:**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or use Vercel's nameservers

3. **SSL Certificate:**
   - Automatically provisioned by Vercel
   - Usually ready in 1-2 minutes

---

## 👥 Sharing Flyers with Agents

### How It Works

1. **Create a Flyer** in the builder
2. **Save & Publish** the flyer
3. **Get the Share Link:** `https://your-domain.com/live/:slug`
4. **Send to Your Agents**

### Example Workflow:

```
1. You create a flyer for "Seattle Market - January 2026"
   Slug: seattle-jan-2026

2. Share link: https://flyers.iamortgage.org/live/seattle-jan-2026

3. Your agent sends this link to their clients via:
   - Email
   - Text message
   - Social media
   - QR code (generated automatically)
```

### Benefits for Agents:

✅ **Always Current:** Rates update automatically  
✅ **Mobile Friendly:** Works on any device  
✅ **Professional:** Co-branded with agent info  
✅ **Easy to Share:** Simple URL or QR code  
✅ **No App Required:** Opens in any browser

---

## 📊 Live Rate Updates

### How Live Rates Work:

1. **Flyer is accessed** by client
2. **App fetches latest rates** from your Supabase function
3. **Rates are displayed** in real-time
4. **Clients can refresh** to get newest rates

### Setting Up Rate Data Source:

Edit `supabase/functions/fetch-mortgage-rates/index.ts` to connect to your rate provider:

```typescript
// Example: Connect to your rate API
const response = await fetch('https://your-rate-api.com/current', {
  headers: {
    'Authorization': `Bearer ${YOUR_API_KEY}`
  }
});

const rates = await response.json();

return new Response(JSON.stringify({
  thirtyYearFixed: rates.thirtyYear,
  thirtyYearFixedAPR: rates.thirtyYearAPR,
  // ... other rates
}));
```

### Manual Rate Updates:

If you don't have an API, you can update rates manually in Supabase:

1. Go to Supabase Dashboard
2. Open Table Editor → `flyer_templates`
3. Edit the `data` JSONB field
4. Update the `rates` object
5. Save

---

## 🎨 Customization for Your Brand

### Update Branding:

1. **Logo:** Replace `src/assets/ia-mortgage-logo.png`
2. **Colors:** Edit `src/index.css` (CSS variables)
3. **Company Info:** Update default values in `src/types/flyer.ts`

### White-Label for Agents:

Each flyer can have:
- Agent's headshot
- Agent's contact info
- Agent's brokerage details
- Custom color themes
- Co-branded with your company

---

## 📱 Mobile & Social Media

### Export Options:

The app generates optimized images for:

1. **Email Banners** (600×200px)
2. **Social Media Posts** (1080×1080px)
3. **Instagram Stories** (1080×1920px)
4. **Facebook Covers** (1640×624px)

### QR Codes:

- Automatically generated for each flyer
- Links directly to live rates page
- Perfect for print materials

---

## 🔧 Troubleshooting

### Build Fails on Vercel

**Issue:** Build command fails  
**Solution:**
```bash
# Ensure package.json has correct build script
"scripts": {
  "build": "vite build"
}
```

### Environment Variables Not Working

**Issue:** App can't connect to Supabase  
**Solution:**
- Verify variables start with `VITE_`
- Redeploy after adding variables
- Check Vercel deployment logs

### Flyers Not Loading

**Issue:** 404 or "Flyer not found"  
**Solution:**
- Verify flyer is published (`is_published = true`)
- Check slug matches URL
- Verify Supabase RLS policies

### Rates Not Updating

**Issue:** Shows old rates  
**Solution:**
- Check Supabase function is deployed
- Verify function has correct permissions
- Check browser console for errors

---

## 📈 Next Level Features

### 1. Analytics

Track flyer views with Vercel Analytics:

```bash
npm install @vercel/analytics
```

Add to `src/main.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

### 2. Email Integration

Send flyers directly from the app:

- Integrate with SendGrid/Mailgun
- Create email templates
- Track opens and clicks

### 3. Agent Dashboard

Build a dashboard for agents to:
- View their flyers
- See analytics
- Download assets
- Update contact info

### 4. Automated Rate Updates

Set up a cron job to:
- Fetch rates daily
- Update all published flyers
- Notify agents of changes

---

## 🎯 Deployment Checklist

Before going live:

- [ ] All environment variables set in Vercel
- [ ] Supabase database tables created
- [ ] Edge functions deployed
- [ ] Custom domain configured (optional)
- [ ] Test flyer creation and sharing
- [ ] Verify live rates work
- [ ] Test on mobile devices
- [ ] Update branding/logos
- [ ] Create sample flyers for agents
- [ ] Document sharing process for agents

---

## 📞 Support & Resources

### Vercel Documentation
- [Deploying Vite Apps](https://vercel.com/docs/frameworks/vite)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

### Supabase Documentation
- [Edge Functions](https://supabase.com/docs/guides/functions)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### Your App URLs (After Deployment)
- **Main App:** `https://your-domain.vercel.app`
- **Live Flyer:** `https://your-domain.vercel.app/live/:slug`
- **Builder:** `https://your-domain.vercel.app/`

---

## 🚀 Ready to Deploy!

Your app is production-ready. Follow the steps above to deploy and start sharing live rate flyers with your agents and their clients!

**Questions?** Check the troubleshooting section or review the Vercel/Supabase documentation.

---

**Last Updated:** January 15, 2026  
**Version:** 1.0.0  
**Build Status:** ✅ Production Ready
