---
description: Level 3 stress testing - Rate Engine deep-dive, cross-page flows, accessibility, and edge cases
---

# 🧪 Mortgage Flyer Pro — Level 3 Stress & Integration Testing

This prompt covers the **Rate Engine deep-dive, cross-page data flows, accessibility, keyboard navigation, and stress/edge-case scenarios** not covered by Level 1 (primary builder) or Level 2 (secondary pages). Run this AFTER Levels 1 and 2 pass.

---

## Test L3-1: Marketing Dashboard — Navigation Hub

1. Navigate to `http://localhost:8080/`
2. **Expected**: Marketing Dashboard with "Mortgage Marketing Suite" headline
3. Click **Listing Studio** card → **Expected**: `/builder` loads (Flyer Builder)
4. Click **Suite Dashboard** in builder header → **Expected**: Returns to Marketing Dashboard
5. Click **Rate Watch** card → **Expected**: `/rate-engine` loads (Rate Engine)
6. Click **Suite Dashboard** in rate engine header → **Expected**: Returns to Marketing Dashboard
7. **Test**: Navigate the full loop: Dashboard → Builder → Dashboard → Rate Engine → Dashboard
8. **Expected**: No page flickering, no white flashes, transitions are clean each time

---

## Test L3-2: Rate Engine — Composer Tab (Deep Dive)

1. Navigate to `http://localhost:8080/rate-engine`
2. **Expected**: Left icon sidebar with tabs: Composer (sparkle), Library (layout), Broadcast (share)
3. **Expected**: Composer tab is active by default, showing "Specimen_Config" header
4. Look for the "Fetch Live Rates" button → Click it
5. **Expected**: Rates refresh, toast confirms update (e.g., "Rates Updated!")
6. Verify all 6 rate programs are displayed: 30-Year Fixed, 15-Year Fixed, 30-Year Jumbo, 5/1 ARM, FHA 30-Year, VA 30-Year
7. Look for program type selector (Jumbo / Conventional / Government)
8. Switch between program types → **Expected**: The flyer preview updates to show the selected program's rates
9. Find the "Headline Engine" section → **Expected**: AI Generate button, Headlines & Copy fields, CTA config
10. Edit the headline text → **Expected**: Preview updates in real-time
11. Find the "Geospatial Config" (Regions) section
12. **Expected**: 3 regional market insights displayed (e.g., Seattle Eastside, Seattle Metro, Portland Metro)
13. Find the "Identity Registry" section
14. **Expected**: Broker, Company, and Realtor contact fields present and editable
15. Edit any contact field (e.g., broker name) → **Expected**: Preview updates live

---

## Test L3-3: Rate Engine — Library Tab

1. On the Rate Engine page, click the **Library** (layout) icon in the left sidebar
2. **Expected**: "Template_Library" heading appears
3. **Expected**: Multiple layout templates available (Modern, Traditional, Luxury, Buy Before You Sell)
4. Click a different template (e.g., Traditional → Luxury)
5. **Expected**: Flyer preview changes layout/style completely
6. Click another template → **Expected**: Preview updates again, no crash
7. **Expected**: Brokerage theme selector with multiple color options
8. Click a different brokerage theme → **Expected**: Preview colors change
9. Switch back to the original template → **Expected**: Preview restores cleanly

---

## Test L3-4: Rate Engine — Broadcast Tab

1. Click the **Broadcast** (share) icon in the left sidebar
2. **Expected**: "Distribution_Control" heading appears
3. **Expected**: "Partner_Payload" section with Agent Toolkit
4. **Expected**: Agent partner list with contact info and share URLs
5. **Expected**: "Direct_Broadcast" section with a "Smart Share" button
6. Look for downloadable banner/asset options
7. **Expected**: Options for Email Banner, Social Media Card, Stories, Facebook Cover
8. Click one of the banner download buttons → **Expected**: Image generates and downloads
9. **Expected**: No crash, download completes or shows loading state

---

## Test L3-5: Rate Engine — Preview Controls

1. On the Rate Engine page, locate the **Magnification Matrix** at the bottom center of the preview
2. **Expected**: Shows "MAG: XX%" with DEC and INC buttons
3. Click **INC** several times → **Expected**: Preview zooms in smoothly (scale increases)
4. Click **DEC** several times → **Expected**: Preview zooms out smoothly (scale decreases)
5. **Expected**: Minimum zoom around 20%, maximum around 150%
6. **Expected**: Smooth cubic-bezier transition on each zoom step
7. Click "Clear_Memory" (reset) button in the top-right header area
8. **Expected**: All data resets to defaults, preview updates, no crash

---

## Test L3-6: Builder — Photo Upload & Controls

1. Navigate to `http://localhost:8080/builder`
2. Scroll to the **Photo Controls** section in the left panel
3. **Expected**: Image upload interface with hero image controls
4. Look for image URL input or file upload button
5. If there's a URL input, paste a valid image URL (e.g., `https://picsum.photos/800/600`)
6. **Expected**: Preview updates with the new image (or shows loading state)
7. If there's a file upload button, try uploading a small image
8. **Expected**: Image appears on the flyer preview
9. **Expected**: No crash on invalid URLs or failed uploads

---

## Test L3-7: Builder — Full Edit Cycle

1. Navigate to `http://localhost:8080/builder`
2. Make ALL of these changes in sequence:
   - **Address**: Change to `999 Test Boulevard`
   - **City**: Change to `Portland`
   - **State**: Change to `OR`
   - **Price**: Change to `750000`
   - **Beds**: Change to `3`
   - **Baths**: Change to `2`
   - **SqFt**: Change to `1800`
   - **Rate**: Slide to `7.25%`
   - **Down Payment**: Change to `10%`
   - **Theme**: Switch to Coldwell Banker (blue)
3. **Expected**: ALL changes reflect on the flyer preview simultaneously
4. **Expected**: Monthly payment recalculates correctly for $750K at 7.25% / 10% down
5. **Expected**: No input lag, no delayed updates, no stale data on preview
6. Switch preview format to **Instagram Story** → **Expected**: All edited data carries over
7. Switch to **Facebook Post** → **Expected**: Same data, different layout
8. Switch back to **Print Flyer** → **Expected**: All edits still intact

---

## Test L3-8: Export — All Formats Download

1. On the Builder, set format to **Print Flyer** and click **Download PDF**
2. **Expected**: PDF downloads — verify filename includes property address
3. Switch to **Instagram Story** format, click the download/export button
4. **Expected**: PNG image downloads at 1080×1920 resolution
5. Switch to **Facebook Post** format, click the download/export button
6. **Expected**: PNG image downloads at 1200×630 resolution
7. Switch to **LinkedIn Post** format, click the download/export button
8. **Expected**: PNG image downloads at 1200×627 resolution
9. Open the **Export Modal** and click **"One-Click Export All"**
10. **Expected**: All formats generate and download (or shows progress for each)
11. **Expected**: No crash, no viewport shift, no orphaned loading states

---

## Test L3-9: Keyboard Navigation & Accessibility

1. Navigate to `http://localhost:8080/builder`
2. Press **Tab** key repeatedly → **Expected**: Focus moves through interactive elements in logical order
3. **Expected**: Focus rings or outlines visible on focused elements
4. Tab to the "Export All" button → Press **Enter** → **Expected**: Export modal opens
5. Press **Escape** → **Expected**: Modal closes
6. Tab to a format tab → Press **Enter** → **Expected**: Format switches
7. Tab to the interest rate slider → Use **Arrow keys** → **Expected**: Rate value changes
8. Navigate to `http://localhost:8080/` (Marketing Dashboard)
9. Tab to a tool card → Press **Enter** → **Expected**: Navigates to the tool
10. **Expected**: No focus traps (you can always Tab out of any element)

---

## Test L3-10: Rapid Interaction Stress Test

1. Navigate to `http://localhost:8080/builder`
2. **Rapid format switching**: Click Print → Instagram → Facebook → LinkedIn → Print → Instagram (6 rapid clicks)
3. **Expected**: Preview updates correctly each time, no flash of wrong content
4. **Rapid rate changes**: Drag the rate slider back and forth quickly for 5 seconds
5. **Expected**: Preview updates in real-time, no lag accumulation, no NaN values
6. **Rapid theme changes**: Click 4 different brokerage themes in quick succession
7. **Expected**: Preview shows the LAST clicked theme, no color blending artifacts
8. Open Export Modal → Close → Open → Close → Open → Close (6 rapid toggles)
9. **Expected**: Modal animates correctly each time, no stuck overlays
10. **Expected**: Console shows zero errors throughout all rapid interactions

---

## Test L3-11: Browser Back/Forward Navigation

1. Navigate: Dashboard (`/`) → Builder (`/builder`) → Rate Engine (`/rate-engine`) → Leads (`/leads`)
2. Press **Back** → **Expected**: Returns to Rate Engine
3. Press **Back** → **Expected**: Returns to Builder
4. Press **Back** → **Expected**: Returns to Dashboard
5. Press **Forward** → **Expected**: Returns to Builder
6. Press **Forward** → **Expected**: Returns to Rate Engine
7. **Expected**: Each page loads correctly with no white flash or error state
8. **Expected**: React Router handles all transitions — no full page reloads

---

## Test L3-12: LocalStorage Data Persistence

1. Navigate to `http://localhost:8080/builder`
2. Change the address to `555 Persistence Ave`
3. Change the price to `$888,000`
4. **Hard refresh** the page (Ctrl+Shift+R)
5. **Check**: Does the flyer still show "555 Persistence Ave" and "$888,000"?
   - If YES → Data persists via localStorage (PASS)
   - If NO → Data resets to defaults on refresh (note this — may be by design)
6. Navigate to `/leads` → submit a test lead → Navigate back to `/leads`
7. **Expected**: Previously submitted leads are still displayed (localStorage persists)
8. Close the browser tab entirely, reopen `http://localhost:8080/leads`
9. **Expected**: Leads still visible from localStorage

---

## Test L3-13: Mobile-Specific Interactions

1. Open DevTools → Toggle Device Toolbar → Select **iPhone 14 Pro** (390×844)
2. Navigate to `http://localhost:8080/builder`
3. **Expected**: Single-column layout, format tabs scroll horizontally
4. Tap a format tab → **Expected**: Preview switches correctly
5. Scroll the left panel to bottom → **Expected**: All 4 sections accessible
6. Navigate to `http://localhost:8080/property-live/24419-214th-ave-se`
7. **Expected**: Mobile contact footer with Call / Text / Share buttons visible at bottom
8. Tap **Share** → **Expected**: Share dialog or "Link copied!" toast
9. Navigate to `http://localhost:8080/lead/24419-214th-ave-se`
10. **Expected**: Form is fully usable on mobile — inputs are tappable, keyboard appears
11. Navigate to `http://localhost:8080/rate-engine`
12. **Expected**: Rate engine is usable on mobile — sidebar collapses or scrolls, preview accessible

---

## 🏁 Level 3 Summary Template

```
L3-1   Dashboard Navigation Hub:     [PASS/FAIL] —
L3-2   Rate Engine Composer:          [PASS/FAIL] —
L3-3   Rate Engine Library:           [PASS/FAIL] —
L3-4   Rate Engine Broadcast:         [PASS/FAIL] —
L3-5   Rate Engine Preview Controls:  [PASS/FAIL] —
L3-6   Builder Photo Upload:          [PASS/FAIL] —
L3-7   Builder Full Edit Cycle:       [PASS/FAIL] —
L3-8   Export All Formats:            [PASS/FAIL] —
L3-9   Keyboard & Accessibility:      [PASS/FAIL] —
L3-10  Rapid Interaction Stress:      [PASS/FAIL] —
L3-11  Back/Forward Navigation:       [PASS/FAIL] —
L3-12  LocalStorage Persistence:      [PASS/FAIL] —
L3-13  Mobile Interactions:           [PASS/FAIL] —
```
