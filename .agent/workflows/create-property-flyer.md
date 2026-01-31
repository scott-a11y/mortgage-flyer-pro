---
description: Create a new property listing flyer with marketing assets
---

# Creating a New Property Listing Flyer

This workflow guides you through creating a professional property listing flyer with all marketing materials for a new listing.

## Prerequisites
- Property details (address, price, specs, features)
- Agent contact information
- Preferred color theme

## Steps

### 1. Gather Property Information
Collect the following information for the listing:
- **Address**: Full address including city, state, zip
- **List Price**: The listing price
- **MLS Number**: The MLS listing number
- **Specs**: Bedrooms, bathrooms, square footage, lot size, year built, garage
- **Features**: Key selling points (at least 10-13 bullet points)
- **Open House Date/Time**: If applicable
- **HOA**: Monthly HOA fees if applicable

### 2. Create Property Data File
Create a new data file at `src/data/[propertySlug].ts` using this template:

```typescript
import { PropertyListing } from "@/types/property";
import { FlyerData, ColorTheme } from "@/types/flyer";

export const yourPropertyTheme: ColorTheme = {
    id: "theme-id",
    name: "Theme Name",
    primary: "#1e3a5f",   // Primary color (header, footer)
    secondary: "#d4af37", // Accent color (highlights, badges)
    accent: "#ffffff"
};

export const yourProperty: PropertyListing = {
    specs: {
        address: "123 Example St",
        city: "City",
        state: "WA",
        zip: "98000",
        listPrice: 500000,
        mlsNumber: "1234567",
        bedrooms: 4,
        bathrooms: 2.5,
        squareFootage: 2500,
        lotSize: "0.25 Acres",
        yearBuilt: 2000,
        garage: "2-Car Attached",
        hoa: 0,
        propertyType: "Single Family"
    },
    features: {
        headline: "Your Property Headline",
        subheadline: "Subheadline with key features",
        bulletPoints: [
            "Feature 1",
            "Feature 2",
            // Add 10-13 features
        ]
    },
    openHouse: {
        date: "Saturday, Month Day, Year",
        startTime: "1:00 PM",
        endTime: "4:00 PM"
    },
    images: {
        hero: "/your-property-hero.png",
        secondary: [
            "/your-property-kitchen.png",
            "/your-property-bath.png",
            "/your-property-backyard.png"
        ]
    },
    financing: {
        listPrice: 500000,
        downPaymentPercent: 20,
        interestRate: 6.5,
        loanTermYears: 30,
        hoa: 0
    }
};

export const yourFlyerData: FlyerData = {
    // ... (copy from existing template and update)
};
```

### 3. Generate Property Images
Use AI image generation to create professional property images:

// turbo
```bash
# Generate hero image (exterior)
# Generate kitchen image
# Generate bathroom image
# Generate backyard/specialty feature image
```

Place generated images in the `public/` folder.

### 4. Add Agent Headshots
If new agent, generate or obtain headshots and place in `public/` folder.

### 5. Add Route for New Property
Update `src/App.tsx` to add a route if needed:

```tsx
<Route path="/property/:slug" element={<PropertyFlyerBuilder />} />
```

The PropertyFlyerBuilder will automatically load the data based on the slug.

### 6. Preview and Export
// turbo
```bash
npm run dev
```

Navigate to `http://localhost:8080/property/[slug]` to preview.

Use the export buttons to download:
- Print Flyer (8.5×11 PDF/PNG)
- Instagram Story (1080×1920)
- Facebook Post (1200×630)
- LinkedIn Post (1200×627)

### 7. Color Theme Suggestions

| Theme | Primary | Secondary | Use Case |
|-------|---------|-----------|----------|
| Navy Gold | #1e3a5f | #d4af37 | Luxury, Traditional |
| Forest Green | #1d4e4f | #c9a962 | Nature, Organic |
| Modern Gray | #2d3748 | #4fd1c5 | Contemporary, Tech |
| Deep Blue | #1a365d | #ed8936 | Professional, Warm |
| Slate Rose | #374151 | #f472b6 | Modern, Feminine |

### 8. Tips for Best Results
- Use high-quality property photos when available
- Keep feature bullet points concise (under 80 characters)
- Ensure all contact information is correct
- Test QR codes before printing
- Export at 3x resolution for print quality

## Files Created/Modified
- `src/data/[propertySlug].ts` - Property data
- `public/[property-images].png` - Property images
- `src/App.tsx` - Route (if new routing needed)
