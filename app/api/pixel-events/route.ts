import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side Meta Conversions API integration
 * Sends purchase and contact events to Meta for better tracking accuracy
 * Particularly important for WhatsApp orders where client-side tracking may fail
 */

const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "964446712667457";
const META_ACCESS_TOKEN = process.env.META_CONVERSIONS_API_TOKEN;

type EventData = {
  event_name: "Purchase" | "Contact" | "InitiateCheckout";
  event_id: string;
  event_time: number;
  event_source_url?: string;
  action_source: "website";
  user_data?: {
    em?: string[]; // email hash
    ph?: string[]; // phone hash
    client_user_agent?: string;
  };
  custom_data?: {
    currency?: string;
    value?: number;
    content_name?: string;
    content_type?: string;
    num_items?: number;
    checkout_method?: string;
  };
};

function sha256Hash(str: string): string {
  return createHash("sha256").update(str).digest("hex");
}

async function sendToMetaConversionsAPI(
  eventData: EventData,
): Promise<boolean> {
  // If no access token, fall back to client-side tracking only
  if (!META_ACCESS_TOKEN) {
    console.warn(
      "META_CONVERSIONS_API_TOKEN not set. Using client-side pixel only.",
    );
    return false;
  }

  try {
    const payload = {
      data: [
        {
          event_name: eventData.event_name,
          event_id: eventData.event_id,
          event_time: eventData.event_time,
          action_source: eventData.action_source,
          event_source_url: eventData.event_source_url,
          user_data: eventData.user_data || {},
          custom_data: eventData.custom_data || {},
        },
      ],
    };

    const response = await fetch(
      `https://graph.facebook.com/v20.0/${META_PIXEL_ID}/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          access_token: META_ACCESS_TOKEN,
          test_event_code: process.env.META_TEST_EVENT_CODE,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Meta Conversions API error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send event to Meta Conversions API:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      eventName: string;
      eventId: string;
      pageUrl?: string;
      email?: string;
      phone?: string;
      currency?: string;
      value?: number;
      contentName?: string;
      contentType?: string;
      numItems?: number;
      checkoutMethod?: string;
    };

    const eventData: EventData = {
      event_name: body.eventName as EventData["event_name"],
      event_id: body.eventId,
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      event_source_url:
        body.pageUrl || request.headers.get("origin") || undefined,
      user_data: {
        client_user_agent: request.headers.get("user-agent") || undefined,
      },
      custom_data: {
        currency: body.currency,
        value: body.value,
        content_name: body.contentName,
        content_type: body.contentType,
        num_items: body.numItems,
        checkout_method: body.checkoutMethod,
      },
    };

    // Hash PII if provided (Meta requires hashed values)
    if (body.email) {
      eventData.user_data!.em = [sha256Hash(body.email.toLowerCase().trim())];
    }
    if (body.phone) {
      eventData.user_data!.ph = [
        sha256Hash(body.phone.replace(/\D/g, "").toLowerCase()),
      ];
    }

    // Send to Meta Conversions API
    const success = await sendToMetaConversionsAPI(eventData);

    return NextResponse.json(
      {
        ok: success,
        message: success
          ? "Event sent to Meta"
          : "Event queued for client-side retry",
      },
      { status: success ? 200 : 202 },
    );
  } catch (error) {
    console.error("Pixel event API error:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to process pixel event" },
      { status: 500 },
    );
  }
}
