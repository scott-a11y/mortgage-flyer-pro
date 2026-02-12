---
description: Comprehensive QA testing checklist for Mortgage Flyer Pro
---

# 🧪 Mortgage Flyer Pro — Browser End-to-End Testing Prompt

Open **http://localhost:8080/builder** in Chrome. Follow each step in order. If any step fails, stop and report the step number and what you saw.

---

## Test 1: Page Load
1. Navigate to `http://localhost:8080/builder`
2. **Expected**: Dark gradient background loads. Header bar appears with "IA Loans Flyer Builder" title, property address chip, price/rate stats, and amber "Export All" button.
3. **Expected**: Two-panel layout — control sections on the LEFT, preview on the RIGHT.
4. Open DevTools (F12) → Console tab. **Expected**: No red errors.

---

## Test 2: Control Sections (Scrollable Sidebar)
1. The left panel contains 4 sections in a single scrollable view: **Financing Calculator**, **Property Details**, **Photo Controls**, **Agent Branding**
2. Scroll to **Property Details** → **Expected**: Property fields appear (address, price, beds, baths, sqft)
3. Scroll to **Photos** section → **Expected**: Photo/image controls appear
4. Scroll to **Agent Branding** section → **Expected**: Theme picker with brokerage color options, agent/LO contact fields
5. Scroll back to **Financing Calculator** → **Expected**: Interest rate slider and down payment controls appear
6. **Expected**: All sections are always visible without tab switching

---

## Test 3: Financing Calculator
1. On the **Financing** tab, locate the interest rate slider
2. Drag the rate slider to a different value (e.g., 7.0%)
3. **Expected**: The monthly payment number updates in real-time on the flyer preview
4. Change the down payment percentage
5. **Expected**: Monthly payment recalculates; flyer preview reflects new numbers
6. Set rate to 0% → **Expected**: No crash, payment shows principal-only
7. Set down payment to 100% → **Expected**: $0 monthly payment shown

---

## Test 4: Property Details
1. Click the **Property** tab
2. Change the property address text
3. **Expected**: Address updates on the flyer preview immediately
4. Change the list price
5. **Expected**: Price on flyer updates with proper $ formatting and commas
6. Modify beds, baths, square footage
7. **Expected**: All specs update on the flyer preview

---

## Test 5: Branding & Theme
1. Click the **Branding** tab
2. Click a different color theme (e.g., a different brokerage)
3. **Expected**: Flyer preview instantly changes colors to match the selected theme
4. Scroll down to the agent/LO contact fields
5. Edit the LO (Loan Officer) name
6. **Expected**: The LO name updates on the flyer — NOT the realtor's name (regression check)
7. Verify the active theme has a checkmark indicator

---

## Test 6: Preview Format Switching
1. Look at the format tabs above the preview: **Print Flyer**, **Instagram Story**, **Facebook Post**, **LinkedIn Post**
2. Click **Instagram Story** → **Expected**: Preview switches to a tall vertical 1080×1920 format
3. Click **Facebook Post** → **Expected**: Preview switches to a wide horizontal 1200×630 format
4. Click **LinkedIn Post** → **Expected**: Preview switches to 1200×627 format
5. Click **Print Flyer** → **Expected**: Preview returns to standard 8.5×11 format
6. **Expected**: Each format shows a size badge (e.g., "1080×1920") on the tab

---

## Test 7: Preview Auto-Scaling
1. On the **Print Flyer** format, look at the preview container
2. **Expected**: "AUTO - SCALE" indicator visible in the top-right corner of the preview
3. Resize your browser window narrower
4. **Expected**: The flyer preview scales down to fit the container without overflow
5. Resize wider again → **Expected**: Preview scales back up smoothly

---

## Test 8: Export Modal
1. Click the amber **"Export All"** button in the header
2. **Expected**: A dark modal overlay appears with "Marketing Suite" title and sparkle icon
3. **Expected**: 4 export cards (Print Flyer, Instagram Story, Facebook Post, LinkedIn Post) with hover effects
4. **Expected**: 2 "Coming Soon" cards (Print PDF, Email HTML) grayed out
5. Hover over an export card → **Expected**: Amber highlight border and download icon animation
6. Click the **×** close button → **Expected**: Modal closes
7. Reopen the modal, click **Cancel** → **Expected**: Modal closes
8. Reopen the modal, click one of the export format cards
9. **Expected**: Loading toast appears ("Exporting..."), then an image downloads or opens

---

## Test 9: PDF Download
1. In the **Financing** tab area or Quick Export section, find the **"Download Print PDF"** button
2. Click it → **Expected**: Loading toast appears ("Generating PDF...")
3. **Expected**: A PDF file downloads with the property address in the filename
4. Open the PDF → **Expected**: Full-quality flyer image at A4 dimensions

---

## Test 10: Share / Collaborate
1. Click the **"Collaborate"** button in the header
2. **Expected (with Supabase)**: A short share URL is generated and copied to clipboard; success toast appears
3. **Expected (without Supabase)**: Falls back to local sharing mode — encodes config in URL params; toast says "Share link copied! (local sharing mode)"
4. Open a new browser tab, paste the URL, and navigate to it
5. **Expected**: The flyer loads with the same property data, rate, and settings as the original
6. **Expected**: No crash or error overlay

---

## Test 11: Live Rate Refresher
1. Look for the **LiveRateRefresher** component (floating button or inline element)
2. Click the refresh button → **Expected**: Rate fetch triggers without crash
3. **Expected**: If rates update, the flyer preview reflects new values
4. **Expected**: No console errors during rate refresh

---

## Test 12: Header Actions
1. Click **"Suite Dashboard"** link → **Expected**: Navigates to home/dashboard
2. Go back. Click **"Web Version"** link → **Expected**: Opens the live property flyer in a new tab
3. Click **"Reset Flyer"** → **Expected**: First click shows "Confirm Reset?" with red highlight
4. Wait 3 seconds without clicking → **Expected**: Reset button returns to normal state
5. Click **"Reset Flyer"** then **"Confirm Reset?"** quickly → **Expected**: Page reloads with default data

---

## Test 13: Responsive Layout
1. Open DevTools → Toggle Device Toolbar (Ctrl+Shift+M)
2. Set to **iPhone 14 Pro** (390×844)
3. **Expected**: Single-column layout — preview stacks above controls
4. **Expected**: Tab bar scrolls horizontally, all buttons tappable
5. **Expected**: No horizontal page overflow
6. Switch to **iPad** (768×1024)
7. **Expected**: Layout adapts, both panels visible
8. Switch back to **Desktop** (1440×900)
9. **Expected**: Side-by-side two-panel layout restored

---

## Test 14: Route Testing
Open each URL and verify it loads without errors:

| # | URL | Expected |
|---|-----|----------|
| 1 | `http://localhost:8080/` | Marketing Dashboard ("Mortgage Marketing Suite") |
| 2 | `http://localhost:8080/dashboard` | Marketing Dashboard (same) |
| 3 | `http://localhost:8080/builder` | Flyer Builder |
| 4 | `http://localhost:8080/rate-engine` | Rate Engine Builder |
| 5 | `http://localhost:8080/leads` | Leads Dashboard |
| 6 | `http://localhost:8080/not-a-page` | 404 Not Found page |

---

## Test 15: Console Health Check
1. Go back to `http://localhost:8080/builder`
2. Open DevTools → Console
3. Scroll through all 4 sidebar sections
4. Switch through ALL 4 preview formats
5. Open and close the Export Modal (using all 3 close methods)
6. **Expected**: Zero red errors in the console throughout all interactions
7. **Expected**: No "Cannot read properties of undefined" errors
8. **Expected**: No React key warnings or hydration errors

---

## 🏁 Quick Smoke Test (2 minutes)

If short on time, just do these 6 checks:

1. ✅ `localhost:8080/` shows Marketing Dashboard — no blank screen
2. ✅ `localhost:8080/builder` shows Flyer Builder — no error overlay
3. ✅ Scroll through all 4 sections in left panel — no crash
4. ✅ Move interest rate slider — preview updates live
5. ✅ Switch to Instagram format — vertical preview renders
6. ✅ Open Export Modal — modal appears, all 3 close methods work
7. ✅ F12 Console — zero red errors
