# Meta Pixel Event Tracking Fix - Setup Guide

## Problem Analysis

Your Meta Pixel was NOT showing Purchase and Contact events because:

1. **Client-side only tracking** - Fast navigation can interrupt pixel delivery
2. **No server-side events** - Meta Conversions API was not integrated
3. **Missing Contact events** - No explicit contact signal was tracked for checkout actions

## Solution Overview

I've implemented a complete server-side event tracking system with these improvements:

### 1. **Server-Side Meta Conversions API** (`app/api/pixel-events/route.ts`)

- Sends Purchase and Contact events directly to Meta
- Hash PII (email, phone) for privacy compliance
- Event deduplication with unique IDs
- Fallback if client-side tracking fails

### 2. **Enhanced Pixel Library** (`lib/metaPixel.ts`)

New functions added:

- `trackPurchaseWithServerFallback()` - Tracks purchase on both client and server
- `trackContact()` - Tracks explicit contact events when needed

### 3. **Updated Checkout Flow** (`app/checkout/page.tsx`)

- Uses new server-side tracking functions
- Stores orders directly in the admin order system
- Tracks Purchase events with checkout metadata

## Configuration Required

### Step 1: Get Meta Conversions API Access Token

1. Go to [Meta Business Manager](https://business.facebook.com)
2. Navigate to **Events Manager** → Select your pixel
3. Go to **Settings** → **Conversions API**
4. Click **Generate Access Token**
5. Copy the token

### Step 2: Add Environment Variable

Add to your `.env.local`:

```env
META_CONVERSIONS_API_TOKEN=your_access_token_here
```

Get your pixel ID from Meta Events Manager (usually in format like `964446712667457`)

### Step 3: Verify Setup

The system will work even WITHOUT the access token:

- ✅ Client-side tracking (visible in Meta Pixel's test events)
- ✅ Contact events when explicitly triggered
- ⚠️ If token is missing, server-side will log warning and fallback to client-side

## Event Flow

### Purchase Event (Checkout)

```
User clicks "Place Order"
  ↓
Save order to database
  ↓
Track Purchase (client-side pixel)
  ↓
Track Purchase (server-side API with email/phone)
  ↓
```

### Purchase Event (Landing Checkout)

Same flow, with checkout method marked as landing

## Testing

### In Meta Pixel Dashboard

1. Go to **Events Manager** → Your Pixel → **Test Events**
2. Place a test order from checkout
3. You should see:
   - ✅ **Purchase** event with order value

- ✅ **Contact** event (if you trigger contact tracking)
- ✅ Customer email/phone (hashed)

### Common Issues & Fixes

**Issue: Still no Purchase events showing**

- ✅ Check token is added to `.env.local`
- ✅ Token must have `events` permission
- ✅ Verify pixel ID matches in layout.tsx
- ✅ Check browser console for errors

**Issue: Contact events not appearing**

- ✅ Confirm `trackContact()` is being called
- ✅ Check Meta pixel is initialized
- ✅ Verify Access Token has proper permissions

**Issue: Events appearing but missing data**

- ✅ Ensure email/phone are being passed correctly
- ✅ Check Meta Pixel dashboard for validation errors
- ✅ Email should be in full format (user@example.com)
- ✅ Phone should include country code

## Data Being Tracked

### Purchase Event

- Order value (total with shipping)
- Number of items
- Product IDs
- Checkout method (dashboard/landing)
- Customer email (hashed)
- Customer phone (hashed)
- Currency

### Contact Event

- Checkout method (dashboard)
- Customer email (hashed)
- Customer phone (hashed)

## Next Steps for Optimization

1. **Add order confirmation notifications** - Send confirmation after status update
2. **Implement Order Status Tracking** - Track when orders move to "Processing", "Shipped", etc.
3. **Add Dynamic Ads** - Use Purchase events to retarget in campaigns
4. **Set Up Conversions** - Define Purchase as conversion in Meta Ads Manager
5. **Create Custom Audiences** - Build audiences from purchase events for lookalike campaigns

## Files Modified

- ✅ `app/api/pixel-events/route.ts` - NEW
- ✅ `lib/metaPixel.ts` - UPDATED
- ✅ `app/checkout/page.tsx` - UPDATED
