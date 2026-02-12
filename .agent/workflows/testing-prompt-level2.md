---
description: Level 2 deep-dive testing for secondary pages and cross-feature flows
---

# 🧪 Mortgage Flyer Pro — Level 2 Deep-Dive Testing

This prompt covers the **secondary pages, integration flows, and edge cases** not covered by the primary test suite. Run this AFTER the primary test suite passes.

Open **http://localhost:8080/** in Chrome. Follow each step in order. If any step fails, stop and report the step number and what you saw.

---

## Test L2-1: Marketing Dashboard

1. Navigate to `http://localhost:8080/` (the Flyer Builder)
2. Click **"Suite Dashboard"** in the header
3. **Expected**: The Marketing Dashboard loads — **NOT** the Flyer Builder (verify it's a different page)
4. **Expected**: Dark background with "Mortgage Marketing Suite" headline and "Welcome, Scott" greeting
5. **Expected**: "Enterprise Marketing Cloud" badge with sparkle icon
6. **Expected**: System Status card shows "All Systems Operational" with green pulse indicator
7. **Expected**: Two main tool cards displayed in a grid:
   - **Listing Studio** — badge "Studio", features: Print Flyers, Social Posts, Live Sync
   - **Rate Watch** — badge "Pro", features: Cyber Matrix, Uplink Sync, Legal Disclosures
8. Hover over each card → **Expected**: Accent glow effect, arrow icon slides in
9. Click **"Listing Studio"** card → **Expected**: Navigates to `/builder` (Flyer Builder)
10. Go back. Click **"Rate Watch"** card → **Expected**: Navigates to `/rate-engine`
11. **Expected**: Three footer info cards visible: Live Support, Asset Cloud (2.4 GB), Next Gen (v3.0.4)

---

## Test L2-2: Rate Engine / Rate Watch

1. Navigate to `http://localhost:8080/rate-engine`
2. **Expected**: Rate Engine Builder loads — different UI from the Flyer Builder
3. **Expected**: Left sidebar with editor tabs/controls, right side with flyer preview
4. **Expected**: No crash, no blank screen, all elements render
5. Look for rate data display → **Expected**: Live rates shown (30-yr, 15-yr, Jumbo, ARM, FHA, VA)
6. Look for template/format controls → **Expected**: Template and export options available
7. Check for a "Smart Share" or share button → **Expected**: Share functionality present
8. **Expected**: Agent Toolkit section with partner/agent data
9. Switch between any available templates → **Expected**: Preview updates without crash
10. **Expected**: No console errors throughout interaction

---

## Test L2-3: Live Property Flyer (Client-Facing)

1. From the Flyer Builder (`/`), click **"Web Version"** in the header
2. **Expected**: Opens `/property-live/24419-214th-ave-se` in a new tab
3. **Expected**: Loading spinner with "Loading Web Experience..." text appears briefly
4. **Expected**: After loading:
   - Fixed header bar with "LIVE WEB VERSION" badge in amber
   - Property address displayed in header
   - **Back** button, **Share** button (amber), and **Print** icon
5. **Expected**: The full flyer renders as a centered document with ambient glow behind it
6. **Expected**: Flyer content **syncs from the builder** — if you changed address/rate in the builder, the live version should reflect those changes
7. Click **Share** button → **Expected**: Either native share dialog OR "Link copied to clipboard!" toast
8. Resize to mobile width → **Expected**: Mobile contact footer appears with Call, Text, Share buttons
9. **Expected**: No horizontal overflow, flyer scales down on mobile
10. **Expected**: Page has proper HTML `<title>` and `<meta>` tags (check in page source or DevTools → Elements → `<head>`)

---

## Test L2-4: Lead Capture Page

1. Navigate to `http://localhost:8080/lead/24419-214th-ave-se`
2. **Expected**: Lead capture page loads with:
   - Hero image at top (property photo covering ~50% of viewport)
   - Property headline + address + price overlay on the hero
   - Location badge with city/state
3. **Expected**: Property details panel on the left:
   - 4 stat boxes: Beds, Baths, Sq Ft, Built
   - "About This Property" section
   - "Key Features" bullet list with checkmark icons
   - Agent contact card with headshot, name, brokerage, and call button
4. **Expected**: Lead capture form on the right:
   - "Interested?" heading with "Get more info or schedule a tour" subtext
   - Form fields: Name, Email, Phone (all required), Pre-approval dropdown, Message (optional)
   - "Request Information" submit button styled with accent color
   - Privacy disclaimer text
5. **Expected**: Loan Officer card below the form showing:
   - LO headshot + name + company
   - "Current 30-Year Rate" with rate value
6. **Expected**: Footer with company name, NMLS number, Equal Housing Opportunity

---

## Test L2-5: Lead Capture Form Submission

1. On the Lead Capture page (`/lead/24419-214th-ave-se`), fill out the form:
   - Name: `Test Buyer`
   - Email: `test@example.com`
   - Phone: `555-123-4567`
   - Pre-approval: Select "Yes, I'm pre-approved"
   - Message: `I'd like to schedule a tour this weekend`
2. Click **"Request Information"**
3. **Expected**: Button shows loading spinner during submission
4. **Expected**: After submission:
   - Form transitions to success state with "Request Sent!" message
   - Checkmark icon in accent-colored circle
   - Text says "[Agent Name] will be in touch with you shortly"
   - Toast: "Thanks! We'll be in touch soon."
5. **Expected**: No crash, no error

---

## Test L2-6: Leads Dashboard

1. Navigate to `http://localhost:8080/leads`
2. **Expected**: Leads Dashboard loads with:
   - Header: "Lead Intelligence" or "Leads Dashboard" title
   - Back arrow link to return to builder
   - Stats cards (Total Leads, Page Views, etc.)
3. **Expected**: If you submitted a lead in Test L2-5, it should appear in the leads list:
   - Name: `Test Buyer`
   - Email: `test@example.com`
   - Phone: `555-123-4567`
   - Property: the address from the lead capture page
   - Timestamp: recent time
   - Source: `qr_scan`
4. Click a contact action on the lead (Call, Text, or Email icon) → **Expected**: Opens phone/sms/mail link or shows appropriate action
5. Look for notification controls → **Expected**: Enable Notifications button or bell icon present
6. Look for **Clear All** button → **Expected**: Present (DO NOT click unless you want to wipe test data)
7. Test the **Delete** button on a single lead → **Expected**: Lead is removed from the list
8. **Expected**: Empty state message if no leads remain

---

## Test L2-7: Lead Capture → Dashboard Flow (Integration)

1. Navigate to `http://localhost:8080/lead/maple-valley` (or any valid lead slug)
2. Submit a lead with:
   - Name: `Integration Test`
   - Email: `integration@test.com`
   - Phone: `555-999-0000`
   - Pre-approval: "Cash buyer"
3. **Expected**: Success state appears
4. Now navigate to `http://localhost:8080/leads`
5. **Expected**: The lead you just submitted ("Integration Test") appears in the dashboard list
6. **Expected**: Lead shows correct details (name, email, phone, property, pre-approval status)
7. Verify the page views counter has incremented from your visit to the lead capture page

---

## Test L2-8: Builder → Live Flyer Data Sync

1. Navigate to `http://localhost:8080/` (Flyer Builder)
2. Change the property address to something unique, e.g., `123 Test Sync Lane`
3. Change the list price to `$999,999`
4. Change the interest rate to `5.5%`
5. Now click **"Web Version"** in the header to open the live flyer
6. **Expected**: The live flyer at `/property-live/...` shows:
   - Address: `123 Test Sync Lane` (or whatever you typed)
   - Price: `$999,999`
   - Rate should reflect current builder settings
7. **Expected**: Both pages stay in sync via localStorage
8. **Note**: If the live flyer uses slug-based data that doesn't match the edited address, it may fall back to default data — this is expected behavior (address mismatch guard)

---

## Test L2-9: Deep Link Routes

1. Navigate to `http://localhost:8080/property/maple-valley`
   - **Expected**: Flyer Builder loads (with slug-based data if available)
2. Navigate to `http://localhost:8080/flyer/test-slug`
   - **Expected**: Live Flyer page loads (may show default data)
3. Navigate to `http://localhost:8080/live/test-slug`
   - **Expected**: Live Flyer page loads (alternate route)
4. Navigate to `http://localhost:8080/lead/test-property`
   - **Expected**: Lead Capture page loads (may show default property data)
5. **Expected**: None of these routes crash — they all gracefully handle unknown slugs

---

## Test L2-10: Edge Cases & Error Handling

1. Navigate to `http://localhost:8080/property-live/nonexistent-slug-xyz`
   - **Expected**: Page loads without crash (may show default data or a fallback)
2. Navigate to `http://localhost:8080/lead/nonexistent-slug-xyz`
   - **Expected**: Page loads without crash (may show default data)
3. On the Flyer Builder, rapidly click between all 4 format tabs
   - **Expected**: No race conditions, no flickering, preview updates cleanly each time
4. On the Flyer Builder, open Export Modal → click a format card → immediately close the modal
   - **Expected**: Export starts in background, toast confirms progress, modal closes cleanly
5. Set the list price to `0` → **Expected**: No crash, no NaN, displays `$0`
6. Set the list price to a very large number (e.g., `99999999`) → **Expected**: Proper formatting `$99,999,999`
7. Clear the address field entirely → **Expected**: No crash, preview shows empty or placeholder
8. Open browser DevTools → Console → **Expected**: No red errors accumulated during all tests above

---

## 🏁 Level 2 Quick Summary Template

Copy and fill in:

```
L2-1  Marketing Dashboard:        [PASS/FAIL] —
L2-2  Rate Engine:                 [PASS/FAIL] —
L2-3  Live Property Flyer:        [PASS/FAIL] —
L2-4  Lead Capture Page:          [PASS/FAIL] —
L2-5  Lead Form Submission:       [PASS/FAIL] —
L2-6  Leads Dashboard:            [PASS/FAIL] —
L2-7  Lead → Dashboard Flow:      [PASS/FAIL] —
L2-8  Builder → Live Sync:        [PASS/FAIL] —
L2-9  Deep Link Routes:           [PASS/FAIL] —
L2-10 Edge Cases:                 [PASS/FAIL] —
```
