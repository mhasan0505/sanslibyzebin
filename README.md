# Sansli By Zebin

Modern fashion storefront for Sansli By Zebin, built with Next.js App Router and TypeScript.

The project showcases a premium boutique shopping experience with curated collections, dynamic product browsing, interactive filtering, cart and wishlist management, and responsive UI interactions optimized for both desktop and mobile.

## Highlights

- Elegant homepage with hero storytelling, category previews, and trending products
- Dedicated collection pages including a focused Co-Ords shopping route
- Advanced sidebar filters by color, size, fabric, price range, stock status, and sort order
- Color-aware filter swatches for faster visual selection
- Product detail pages with image gallery, zoom support, and variant selection
- Persistent cart and wishlist state using localStorage
- Search modal with real-time product filtering
- Smooth, tasteful motion and transitions powered by Framer Motion
- SEO-friendly metadata configured in App Router layouts and pages

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Framer Motion
- Lucide React
- React Slick + Slick Carousel
- react-medium-image-zoom

## Project Structure

```text
app/                App Router pages, route-level layout, and metadata
components/         Reusable UI building blocks (header, cards, filters, gallery)
context/            Cart and wishlist providers
data/               Raw product source data (JSON)
hooks/              Reusable React hooks (localStorage, modal, media query)
lib/                Shared constants
types/              Domain types and interfaces
utils/              Utility helpers (search, sorting, price parsing)
public/             Static assets (brand assets and product images)
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended)

### Installation

```bash
pnpm install
```

### Run Development Server

```bash
pnpm dev
```

Open <http://localhost:3000> in your browser.

## Available Scripts

```bash
pnpm dev      # Start local development server
pnpm build    # Create production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Product Data Workflow

Product data is managed from a single source of truth:

- Raw catalog data: data/products.json
- Normalized application model: app/data/products.ts

This keeps listing pages, search, filters, and product details in sync.

## Key Routes

- / - Home landing page
- /co-ords - Main shop experience with advanced filters
- /collections - Collection browsing
- /products/[id] - Product details
- /checkout - Checkout flow UI
- /about - Brand story page

## Deployment

You can deploy this project on Vercel or any platform that supports Next.js Node runtime.

Recommended deployment flow:

1. Create a production build
2. Run lint checks
3. Deploy using your preferred CI/CD pipeline

## Meta Pixel Tracking Setup

Essential setup is already wired in the app for these events:

- PageView
- ViewContent
- AddToCart
- InitiateCheckout
- Purchase

### 1. Configure environment values

Create a local env file from `.env.example` and set your production values:

- `NEXT_PUBLIC_META_PIXEL_ID`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_ORDER_EMAIL`

### 2. Verify browser-side tracking

1. Install Meta Pixel Helper in Chrome
2. Open your site and navigate across multiple pages
3. Confirm events fire in this flow:
   - Product page load -> ViewContent
   - Add to cart -> AddToCart
   - Open checkout -> InitiateCheckout
   - Submit order (WhatsApp or Email) -> Purchase

### 3. Verify in Meta Events Manager

1. Open Test Events for your pixel
2. Trigger the full funnel on your site
3. Confirm event parameters include content IDs, value, and currency

### 4. Production checklist

- Pixel ID is set correctly in deployment environment variables
- Domain is verified in Meta Business settings
- Event Match Quality and deduplication strategy are reviewed if server-side Conversions API is added later

## Live Demo

- Website: <https://www.sanslibyzebin.com/>

## Brand Note

This repository is a custom storefront implementation for Sansli By Zebin. Content, imagery, and brand assets belong to their respective owners.

New arrivel ✨

Price-3900

Elegance & confidence ✨

Beautiful 3 pc stiched set✨
Fabric-soft silk ✨

Beautiful 0 size lock stone work ✨

Available size-36,38,40,40,42,44,46,48,50,52,54,56✨
