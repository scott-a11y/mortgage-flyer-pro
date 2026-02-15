# 🏡 Mortgage Flyer Pro — Complete Platform SOP
**Owner: Scott Little | IA Loans — NMLS# 1947498**
**Company: IA Mortgage (iamortgage.org)**
**Licensed: OR, WA, ID**

---

## 📌 Platform Overview

Mortgage Flyer Pro is a co-branded marketing platform built by Scott Little for real estate agent partners. It generates premium mortgage rate flyers, property listing materials, buyer experience pages, and lead tracking — all co-branded with the agent's identity and brokerage.

**Live URL:** https://mortgage-flyer-pro.vercel.app
**Tech Stack:** React, TypeScript, Vite, Supabase, Tailwind CSS, Framer Motion
**AI Engine:** Google Gemini (for ghost detailing and AI Command Center)
**Hosting:** Vercel (auto-deploys from GitHub `main` branch)
**Database:** Supabase (PostgreSQL + Storage + Edge Functions)
**Repository:** github.com/scott-a11y/mortgage-flyer-pro

---

## 🧑‍💼 Who Is This For?

### Primary User: Scott Little (Admin / Broker)
- Manages all agent partners
- Creates and deploys co-branded flyers
- Monitors leads across all agents
- Configures rate engines and property listings
- Uses AI Command Center for quick updates

### Secondary Users: Agent Partners
Each agent gets:
- A personalized dashboard at `/dashboard/{agent-id}`
- Co-branded rate flyers with their headshot and contact info
- Access to the Buyer Experience Studio
- Lead notifications from their flyers

---

## 👥 Current Agent Partners

### 1. Celeste Zarling
- **Brokerage:** Century 21 North Homes — Kirkland
- **Title:** Real Estate Professional
- **Phone:** (425) 281-0487
- **Email:** celestezarling@gmail.com
- **Website:** celestezarling.com
- **Color Theme:** Century 21 (Gold #C8A951 / Dark #1B1B1B)
- **Agent ID:** celeste-zarling
- **Dashboard:** /dashboard/celeste-zarling

### 2. Adrian Mitchell
- **Brokerage:** Works Real Estate
- **Title:** Oregon REALTOR®
- **Phone:** (971) 712-4291
- **Email:** adrian.mitchell@worksrealestate.co
- **Website:** worksrealestate.co
- **Color Theme:** Works RE (Black #1A1A1A / White #FFFFFF / Gold #C8A951)
- **Agent ID:** adrian-mitchell
- **Dashboard:** /dashboard/adrian-mitchell
- **SOP:** /adrian-sop (also available at ADRIAN_SOP.md)
- **Focus:** Buyer-side agent — uses Buyer Experience Studio as primary tool

### 3. Sarah Chen
- **Brokerage:** Windermere Real Estate
- **Title:** Luxury Home Specialist
- **Phone:** (206) 555-0188
- **Email:** sarah.chen@windermere.com
- **Color Theme:** Windermere (Blue #003B5C / White #F5F5F5)
- **Agent ID:** sarah-chen

### 4. Marcus Rivera
- **Brokerage:** RE/MAX Northwest
- **Title:** Residential Specialist
- **Phone:** (503) 555-0142
- **Email:** marcus.rivera@remax.com
- **Color Theme:** RE/MAX (Red #DC3545 / Blue #003DA5)
- **Agent ID:** marcus-rivera

### 5. Priya Patel
- **Brokerage:** Compass Real Estate
- **Title:** Real Estate Advisor
- **Phone:** (425) 555-0167
- **Email:** priya.patel@compass.com
- **Color Theme:** Compass (Black #000000 / White #FFFFFF)
- **Agent ID:** priya-patel

### 6. David Kim
- **Brokerage:** John L. Scott Real Estate
- **Title:** Broker / REALTOR®
- **Phone:** (206) 555-0134
- **Email:** david.kim@johnlscott.com
- **Color Theme:** John L. Scott (Blue #003875 / Gold #B8860B)
- **Agent ID:** david-kim

### 7. Jennifer Okafor
- **Brokerage:** Coldwell Banker Bain
- **Title:** Global Luxury Specialist
- **Phone:** (360) 555-0198
- **Email:** jennifer.okafor@cbbain.com
- **Color Theme:** Coldwell Banker (Blue #012169 / White #FFFFFF)
- **Agent ID:** jennifer-okafor

---

## 🗺️ All Routes & Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Marketing Dashboard | Main command center showing stats, product suite, and partner network |
| `/dashboard` | Marketing Dashboard | Same as above |
| `/dashboard/:agentId` | Agent Dashboard | Agent-specific view with their branding, stats, and assets |
| `/agents` | Agent Management | Full CRUD for managing agent profiles, headshots, and brokerage themes |
| `/builder` | Property Flyer Builder | Create and edit property listing flyers |
| `/rate-engine` | Rate Engine / Flyer Builder | Create co-branded mortgage rate flyers |
| `/property/:slug` | Property Flyer (Builder) | Edit a specific property listing flyer |
| `/property-live/:slug` | Live Property Flyer | Public view of a property listing flyer |
| `/flyer/:slug` | Live Flyer | Public co-branded rate flyer (agent-facing with sharing tools) |
| `/live/:slug` | Live Flyer | Same as above, alternate route |
| `/lead/:slug` | Lead Capture Page | Client-facing lead capture form tied to a flyer |
| `/leads` | Leads Dashboard | View and manage all captured leads |
| `/buyer-agent` | Buyer Agent Toolkit | Buyer Experience Studio for creating post-showing recaps |
| `/tour-live` | Buyer Experience Tour | Live preview of a buyer experience page |
| `/adrian-sop` | Adrian's SOP | Shareable SOP page for Adrian Mitchell |
| `*` | 404 Not Found | Catch-all error page |

---

## 🧰 Product Suite (Tools)

### 1. Listing Studio (`/builder`, `/property/:slug`)
**Purpose:** Create premium property listing flyers
**Features:**
- Property details (address, price, beds, baths, sqft, lot size, year built)
- Multiple photo upload (hero, kitchen, bath, outdoor)
- Layout templates: Luxury, Modern, Traditional, Property Listing
- Co-branded with agent + broker info
- Export: PDF, social media graphic, shareable live link
- QR code for lead capture

### 2. Rate Engine (`/rate-engine`)
**Purpose:** Create co-branded mortgage rate flyers
**Features:**
- Live mortgage rate integration
- Rate trend indicators (up, down, same)
- Multiple rate products (30yr Fixed, 15yr Fixed, ARM, FHA, VA)
- Agent headshot and branding
- QR code linking to pre-approval
- Shareable live link that always shows current rates
- Manual rate refresh for agents

### 3. Buyer Experience Studio (`/buyer-agent`)
**Purpose:** Create personalized post-showing property recaps for buyers
**Features:**
- Property data import (address, photos, specs)
- "Agent's Take" — personalized perspective text
- Tour Insights — categorized observations (Highlight, Vibe, Pro, Con)
- Local Gems — nearby restaurants, parks, schools, shops
- Financing Strategy selector (30yr Fixed, ARM, FHA/VA)
- AI Ghost Detailer — Gemini-powered writing assistant
- Buyer name personalization
- Shareable link for buyers to review after showings

### 4. Lead Capture & Dashboard (`/lead/:slug`, `/leads`)
**Purpose:** Track buyer engagement and capture contact info
**Features:**
- Lead forms on flyers and listing pages
- Real-time lead notifications (browser push + optional email via EmailJS)
- Lead list with contact info, source, and engagement metrics
- Daily lead checking workflow
- Response time tracking

### 5. Agent Management (`/agents`)
**Purpose:** Manage all agent partner profiles
**Features:**
- Add, edit, delete agent profiles
- Headshot photo upload (Supabase Storage)
- Brokerage theme picker with presets:
  - Century 21, RE/MAX, Coldwell Banker, Keller Williams
  - Compass, Sotheby's, eXp Realty, Berkshire Hathaway
  - Windermere, John L. Scott, Works Real Estate
- Custom RGB color picker for primary, secondary, accent
- Contact info management (phone, email, website, license #)
- Search and filter agents
- Direct link to each agent's dashboard

### 6. AI Command Center (Floating Chat Bubble)
**Purpose:** Natural language interface for platform management
**Available on:** Every page (gold bot icon, bottom-right corner)
**Powered by:** Google Gemini with keyword fallback
**Capabilities:**
- `"Update Celeste's phone to (425) 555-1234"` → Updates agent profile
- `"List all agents"` → Shows all partners
- `"Add a new agent named Jane Smith from RE/MAX"` → Creates new agent
- `"Change Adrian's title to Senior REALTOR®"` → Updates field
- `"Show help"` → Lists available commands
**Quick Action Buttons:** List all agents, Update Celeste's phone, Add new agent, Show help

---

## 🗄️ Database Schema (Supabase)

### Tables

#### `agent_profiles`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Full name |
| title | TEXT | Professional title |
| phone | TEXT | Phone number |
| email | TEXT | Email address |
| brokerage | TEXT | Brokerage name |
| website | TEXT | Agent website |
| license_number | TEXT | License # |
| headshot_url | TEXT | URL to headshot image |
| color_primary | TEXT | Primary brand color hex |
| color_secondary | TEXT | Secondary brand color hex |
| color_accent | TEXT | Accent brand color hex |
| created_at | TIMESTAMPTZ | Record creation time |
| updated_at | TIMESTAMPTZ | Last update time |

#### `flyer_analytics`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| flyer_slug | TEXT | Flyer identifier |
| referrer | TEXT | Traffic source |
| user_agent | TEXT | Browser/device info |
| notified | BOOLEAN | Whether admin was notified |
| created_at | TIMESTAMPTZ | View timestamp |

#### `leads`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Lead's full name |
| email | TEXT | Lead's email |
| phone | TEXT | Lead's phone |
| source | TEXT | Which flyer/page they came from |
| created_at | TIMESTAMPTZ | When they submitted |

### Storage Buckets

#### `media` (public read)
- **Folder: `headshots/`** — Agent headshot photos
- **Folder: `properties/{slug}/`** — Property photos (hero, kitchen, bath, backyard)

### Edge Functions

#### `fetch-mortgage-rates`
- Fetches current mortgage rates from external API
- No JWT required (public access)

#### `generate-market-insights`
- AI-generated market commentary
- No JWT required

---

## 🏘️ Property Listings

### Active Listings

#### 1. Bothell — 16454 108th Ave NE
- **Address:** 16454 108th Ave NE, Bothell, WA 98011
- **Price:** $1,097,990
- **Specs:** 4 bed / 2.75 bath / 2,614 sqft / 7,841 sqft lot
- **MLS:** 2336816
- **Year Built:** 2024 (new construction)
- **Agent Pairing:** Celeste Zarling (Century 21)
- **Hero Image:** /bothell-hero.jpg
- **Slug:** `bothell`
- **Routes:**
  - Builder: `/property/bothell`
  - Live: `/property-live/bothell`
  - Lead: `/lead/bothell`
- **Key Features:**
  - Open-concept great room with vaulted ceilings
  - Chef's Kitchen with quartz countertops
  - Primary suite with heated floors
  - Smart home ready (Ring, Nest compatible)
  - A/C included
  - EV-ready garage
  - Walking distance to Canyon Park Town Center
  - Northshore School District

#### 2. Maple Valley — 27009 228th Pl SE
- **Price:** $975,000
- **Specs:** 4 bed / 3 bath / 3,200 sqft
- **Slug:** `maple-valley`
- **Color Theme:** Sotheby's style (Dark)
- **Routes:**
  - Builder: `/property/maple-valley`
  - Live: `/property-live/maple-valley`
  - Lead: `/lead/maple-valley`

---

## 🎨 Brokerage Color Themes

| Brokerage | Primary | Secondary | Accent |
|-----------|---------|-----------|--------|
| Century 21 | #C8A951 (Gold) | #1B1B1B (Black) | #FFFFFF (White) |
| RE/MAX | #DC3545 (Red) | #003DA5 (Blue) | #FFFFFF (White) |
| Coldwell Banker | #012169 (Blue) | #FFFFFF (White) | #A89968 (Gold) |
| Keller Williams | #B40101 (Red) | #000000 (Black) | #FFFFFF (White) |
| Compass | #000000 (Black) | #FFFFFF (White) | #000000 (Black) |
| Sotheby's | #00263A (Navy) | #FFFFFF (White) | #9E8B6E (Gold) |
| eXp Realty | #1C1C1C (Black) | #3B6CB4 (Blue) | #FFFFFF (White) |
| Berkshire Hathaway | #53284F (Purple) | #FFFFFF (White) | #A98A4C (Gold) |
| Windermere | #003B5C (Blue) | #F5F5F5 (Light Gray) | #FFFFFF (White) |
| John L. Scott | #003875 (Blue) | #FFFFFF (White) | #B8860B (Gold) |
| Works Real Estate | #1A1A1A (Black) | #FFFFFF (White) | #C8A951 (Gold) |

---

## 🤖 AI Features

### Ghost Detailer (aiService.ts)
- **Model:** Gemini 1.5 Flash
- **Purpose:** Generates personalized agent perspectives for property listings
- **Input:** Property details, agent name, buyer context
- **Output:** Professional property description from agent's POV
- **Used in:** Buyer Experience Studio

### AI Command Center (aiCommandService.ts)
- **Model:** Gemini 1.5 Flash
- **Purpose:** Natural language command processing
- **Intents:** update_agent, create_agent, delete_agent, list_agents, general_question
- **Fallback:** Keyword-based parsing when API unavailable
- **Matching:** Fuzzy agent name matching (e.g., "celeste" → "Celeste Zarling")

---

## 🔧 Services Architecture

### Frontend Services (src/lib/services/)

| Service | File | Purpose |
|---------|------|---------|
| Agent Service | `agentService.ts` | CRUD for agent profiles (Supabase) |
| Flyer Service | `flyerService.ts` | CRUD for flyer templates, analytics tracking |
| AI Service | `aiService.ts` | Gemini Ghost Detailer for property descriptions |
| AI Command Service | `aiCommandService.ts` | NLP command processor for AI chat |
| Storage Service | `storageService.ts` | File uploads to Supabase Storage |

### Data Files (src/data/)

| File | Purpose |
|------|---------|
| `agentPartners.ts` | Hardcoded fallback agent data (7 agents) |
| `bothellProperty.ts` | Full listing data for Bothell property |
| `propertyData.ts` | Slug → property data mapping |

---

## 📱 Sharing Workflows

### For Rate Flyers
1. Agent gets their permanent link (e.g., `/flyer/celeste-zarling`)
2. Share via: text, email, social media, email signature, QR at open houses
3. Rates auto-update — link never goes stale
4. Buyers scan QR for pre-approval

### For Property Listings
1. Create flyer in Listing Studio
2. Export as PDF or get live link
3. Share on MLS, Zillow, social media
4. QR code routes to lead capture page
5. Agent gets notification when leads come in

### For Buyer Experience
1. Agent tours property with buyer
2. Within 2 hours, create recap in Buyer Experience Studio
3. Personalize with buyer's name, add Agent's Take, Tour Insights, Local Gems
4. Send link to buyer via text
5. Buyer shares with co-buyer, family — premium experience

---

## 🔑 Environment Variables

| Variable | Purpose | Where |
|----------|---------|-------|
| `VITE_SUPABASE_URL` | Supabase project URL | .env + Vercel |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key | .env + Vercel |
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI features | .env + Vercel |

---

## 🚀 Deployment

### Production
- **URL:** https://mortgage-flyer-pro.vercel.app
- **Platform:** Vercel
- **Deploy Method:** Auto-deploy from GitHub `main` branch
- **Build Command:** `npm run build` (Vite)
- **Framework:** Vite

### Database
- **Platform:** Supabase
- **Project ID:** zipkipnnkmcbpkflmgtx
- **Migrations:** `supabase/migrations/` pushed via `npx supabase db push --linked`

---

## 📞 Contact

**Scott Little** — Platform Owner & Mortgage Broker
- 📱 Phone: (360) 606-1106
- 📧 Email: scott@ialoans.com
- 🌐 Website: iamortgage.org
- 🏢 Company: IA Mortgage
- 📋 NMLS: 1947498

---

**Last Updated:** February 15, 2026
**Version:** 2.0 — Full Platform Edition
