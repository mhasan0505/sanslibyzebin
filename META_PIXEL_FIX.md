# Meta Pixel Event Tracking Fix - Setup Guide

## Problem Analysis

Your Meta Pixel was NOT showing Purchase and Contact events because:

1. **Client-side only tracking** - WhatsApp redirects break the connection before pixel fires
2. **No server-side events** - Meta Conversions API was not integrated
3. **Missing Contact events** - No tracking for WhatsApp messaging activity
4. **Redirect timing issues** - Immediate redirects prevented pixel completion

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
- `trackContact()` - Tracks customer messaging (WhatsApp/Email)
- `delayForPixel()` - Waits for pixel to complete before redirect

### 3. **Updated Checkout Flow** (`app/checkout/page.tsx`)

- Uses new server-side tracking functions
- Adds 1.2-second delay before WhatsApp/Email redirect
- Tracks Contact events for customer engagement
- Both WhatsApp and Email methods now properly tracked

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
- ✅ Contact events (WhatsApp/Email messaging)
- ⚠️ If token is missing, server-side will log warning and fallback to client-side

## Event Flow

### Purchase Event (WhatsApp)

```
User clicks "Order via WhatsApp"
  ↓
Save order to database
  ↓
Track Purchase (client-side pixel)
  ↓
Track Purchase (server-side API with email/phone)
  ↓
Track Contact (server-side API)
  ↓
Wait 1.2 seconds for pixel to fire
  ↓
Redirect to WhatsApp
```

### Purchase Event (Email)

Same flow, but redirects to mailto instead

## Testing

### In Meta Pixel Dashboard

1. Go to **Events Manager** → Your Pixel → **Test Events**
2. Place a test order via WhatsApp/Email
3. You should see:
   - ✅ **Purchase** event with order value
   - ✅ **Contact** event (for WhatsApp/Email method)
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
- Checkout method (whatsapp/email)
- Customer email (hashed)
- Customer phone (hashed)
- Currency

### Contact Event

- Checkout method (whatsapp/email)
- Customer email (hashed)
- Customer phone (hashed)

## Next Steps for Optimization

1. **Add WhatsApp Template Messages** - Send order confirmation from WhatsApp Business API
2. **Implement Order Status Tracking** - Track when orders move to "Processing", "Shipped", etc.
3. **Add Dynamic Ads** - Use Purchase events to retarget in campaigns
4. **Set Up Conversions** - Define Purchase as conversion in Meta Ads Manager
5. **Create Custom Audiences** - Build audiences from purchase events for lookalike campaigns

## Files Modified

- ✅ `app/api/pixel-events/route.ts` - NEW
- ✅ `lib/metaPixel.ts` - UPDATED
- ✅ `app/checkout/page.tsx` - UPDATED
