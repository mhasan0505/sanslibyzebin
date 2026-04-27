"use client";

import { useCart } from "@/context/CartContext";
import { trackInitiateCheckout, trackPurchase } from "@/lib/metaPixel";
import { Order } from "@/types/order";
import { formatCurrency, parsePriceSafe } from "@/utils/helpers";
import { ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";

const SHIPPING_FEE = 120;

type CheckoutFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  specialInstructions: string;
};

function buildStoredDistrict(formData: CheckoutFormData): string {
  return [formData.city, formData.address, formData.postalCode]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" | ");
}

function LandingCheckoutContent() {
  const { cart, cartTotal, clearCart } = useCart();
  const searchParams = useSearchParams();
  const hasTrackedInitiateCheckout = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlaced, setIsPlaced] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    specialInstructions: "",
  });

  const shipping = useMemo(
    () => (cartTotal > 5000 ? 0 : SHIPPING_FEE),
    [cartTotal],
  );
  const grandTotal = cartTotal + shipping;
  const lpSlug = searchParams.get("lp_slug");
  const backHref = lpSlug ? `/lp/${lpSlug}` : "/collections";

  useEffect(() => {
    if (cart.length === 0) {
      hasTrackedInitiateCheckout.current = false;
      return;
    }

    if (hasTrackedInitiateCheckout.current) return;

    trackInitiateCheckout(cart);
    hasTrackedInitiateCheckout.current = true;
  }, [cart]);

  const updateField = (field: keyof CheckoutFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const validateForm = (): boolean => {
    const requiredFields: Array<keyof CheckoutFormData> = [
      "firstName",
      "lastName",
      "phone",
      "address",
      "city",
      "postalCode",
    ];

    const hasMissingField = requiredFields.some(
      (field) => !formData[field].trim(),
    );

    if (hasMissingField) {
      setError(
        "Please complete all landing checkout fields before submitting.",
      );
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmitOrder = () => {
    if (!validateForm() || cart.length === 0 || isSubmitting) {
      return;
    }

    void (async () => {
      setIsSubmitting(true);

      const payload: Order = {
        id: `lp-order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        customerPhone: formData.phone.trim(),
        district: buildStoredDistrict(formData),
        createdAt: new Date().toISOString(),
        status: "Pending",
        paymentStatus: "Pending",
        paymentMethod: "Cash on Delivery",
        shippingFee: shipping,
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: parsePriceSafe(item.product.price, 0),
        })),
      };

      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = (await response.json()) as {
          ok?: boolean;
          message?: string;
        };

        if (!response.ok || !data.ok) {
          throw new Error(data.message || "Could not save order");
        }

        trackPurchase({
          items: cart,
          orderValue: grandTotal,
          method: "landing",
        });

        setIsPlaced(true);
        clearCart();
      } catch {
        setError(
          "We could not save the landing page order right now. Please try again in a moment.",
        );
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fbf7f2_0%,#fffdf8_45%,#f7efe6_100%)] pt-40 pb-16">
      <div className="container mx-auto px-6">
        <Link
          href={backHref}
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#5d4a30] hover:text-[#2c2416]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Landing Page
        </Link>

        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#8b6b43]">
            Landing Checkout
          </p>
          <h1 className="mt-3 text-4xl font-heading text-[#153532] md:text-5xl">
            Confirm the order and send it straight to admin
          </h1>
          <p className="mt-3 text-[#5d4a30]">
            This checkout stores the order in your dashboard so the admin team
            can process it directly from the database.
          </p>
        </div>

        {isPlaced ? (
          <div className="rounded-3xl border border-[#e6d3b8] bg-white p-10 text-center shadow-[0_12px_34px_rgba(44,36,22,0.08)]">
            <ShieldCheck className="mx-auto h-12 w-12 text-[#153532]" />
            <h2 className="mt-4 text-3xl font-heading text-[#153532]">
              Order Saved To Admin
            </h2>
            <p className="mt-2 text-[#5d4a30]">
              The landing page order is now in the admin panel and ready for
              follow-up.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/admin"
                className="inline-flex rounded-md bg-[#153532] px-6 py-3 text-sm font-semibold tracking-wide text-white hover:bg-[#0f2725]"
              >
                Open Admin Orders
              </Link>
              <Link
                href={backHref}
                className="inline-flex rounded-md border border-[#153532] px-6 py-3 text-sm font-semibold tracking-wide text-[#153532] hover:bg-[#153532] hover:text-white"
              >
                Return to Offer
              </Link>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="rounded-3xl border border-[#e6d3b8] bg-white p-10 text-center shadow-[0_12px_34px_rgba(44,36,22,0.08)]">
            <h2 className="text-3xl font-heading text-[#153532]">
              No products selected yet
            </h2>
            <p className="mt-2 text-[#5d4a30]">
              Add the product from the landing page first, then complete the
              checkout here.
            </p>
            <Link
              href={backHref}
              className="mt-6 inline-flex rounded-md bg-[#153532] px-6 py-3 text-sm font-semibold tracking-wide text-white hover:bg-[#0f2725]"
            >
              Back to Landing Page
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="rounded-3xl border border-[#e6d3b8] bg-white p-6 shadow-[0_12px_34px_rgba(44,36,22,0.08)] lg:col-span-2 md:p-8">
              <h2 className="mb-6 text-2xl font-heading text-[#153532]">
                Customer Details
              </h2>

              <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  className="rounded-md border border-[#e6d3b8] px-4 py-3"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(event) =>
                    updateField("firstName", event.target.value)
                  }
                  required
                />
                <input
                  className="rounded-md border border-[#e6d3b8] px-4 py-3"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(event) =>
                    updateField("lastName", event.target.value)
                  }
                  required
                />
                <input
                  className="md:col-span-2 rounded-md border border-[#e6d3b8] px-4 py-3"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  required
                />
                <input
                  className="md:col-span-2 rounded-md border border-[#e6d3b8] px-4 py-3"
                  placeholder="Full Address"
                  value={formData.address}
                  onChange={(event) =>
                    updateField("address", event.target.value)
                  }
                  required
                />
                <input
                  className="rounded-md border border-[#e6d3b8] px-4 py-3"
                  placeholder="City / District"
                  value={formData.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  required
                />
                <input
                  className="rounded-md border border-[#e6d3b8] px-4 py-3"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={(event) =>
                    updateField("postalCode", event.target.value)
                  }
                  required
                />
                <textarea
                  className="min-h-[120px] rounded-md border border-[#e6d3b8] px-4 py-3 md:col-span-2"
                  placeholder="Special instructions (optional)"
                  value={formData.specialInstructions}
                  onChange={(event) =>
                    updateField("specialInstructions", event.target.value)
                  }
                />
              </form>

              {error ? (
                <p className="mt-4 text-sm text-red-600">{error}</p>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-wider text-[#7a603c]">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f9f1e5] px-3 py-1.5">
                  <Truck className="h-3.5 w-3.5" /> Admin-ready order
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f9f1e5] px-3 py-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> Cash on delivery
                </span>
              </div>
            </div>

            <div className="h-fit rounded-3xl border border-[#e6d3b8] bg-white p-6 shadow-[0_12px_34px_rgba(44,36,22,0.08)]">
              <h2 className="mb-5 text-2xl font-heading text-[#153532]">
                Order Summary
              </h2>

              <div className="max-h-80 space-y-4 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex gap-3 border-b border-[#f0e4d2] pb-4"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-[#f4eadf]">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm text-[#2c2416]">
                        {item.product.name}
                      </p>
                      <p className="mt-1 text-xs text-[#7a603c]">
                        Qty: {item.quantity}
                        {item.selectedSize
                          ? ` | Size: ${item.selectedSize}`
                          : ""}
                        {item.selectedColor
                          ? ` | Color: ${item.selectedColor}`
                          : ""}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#153532]">
                        {item.product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2 border-t border-[#ead9c2] pt-4 text-sm">
                <div className="flex justify-between text-[#5d4a30]">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-[#5d4a30]">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between pt-1 text-base font-semibold text-[#153532]">
                  <span>Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-[#153532] py-3 text-sm font-semibold tracking-wide text-white hover:bg-[#0f2725] disabled:cursor-not-allowed disabled:bg-[#8ba29f]"
              >
                {isSubmitting ? "Saving Order..." : "Place Landing Page Order"}
              </button>
              <p className="mt-3 text-xs leading-5 text-[#7a603c]">
                This button saves the order to the database so it appears in the
                admin dashboard.
              </p>
            </div>
          </div>
        )} 
      </div>
    </div>
  );
}

export default function LandingCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[linear-gradient(180deg,#fbf7f2_0%,#fffdf8_45%,#f7efe6_100%)] pt-40 pb-16">
          <div className="container mx-auto px-6">
            <div className="rounded-3xl border border-[#e6d3b8] bg-white p-10 text-center shadow-[0_12px_34px_rgba(44,36,22,0.08)]">
              <p className="text-sm font-semibold tracking-wide text-[#5d4a30]">
                Loading checkout...
              </p>
            </div>
          </div>
        </div>
      }
    >
      <LandingCheckoutContent />
    </Suspense>
  );
}
