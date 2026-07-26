"use client";

import { useCart } from "@/context/CartContext";
import {
  trackInitiateCheckout,
  trackPurchaseWithServerFallback,
} from "@/lib/metaPixel";
import {
  buildWhatsAppOrderUrl,
  formatCurrency,
} from "@/utils/helpers";
import {
  ArrowLeft,
  CreditCard,
  MessageCircle,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const SHIPPING_FEE = 120;

type CheckoutFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  specialInstructions: string;
};

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const hasTrackedInitiateCheckout = useRef(false);
  const [isPlaced, setIsPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const requiredFields: Array<keyof CheckoutFormData> = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "postalCode",
    ];

    const hasMissingField = requiredFields.some(
      (field) => !formData[field].trim(),
    );

    if (hasMissingField) {
      setError("Please complete all checkout fields before submitting.");
      return false;
    }

    setError("");
    return true;
  };

  const handlePlaceOrder = () => {
    if (!validateForm() || isSubmitting) return;

    void (async () => {
      setIsSubmitting(true);

      const generatedWhatsAppUrl = buildWhatsAppOrderUrl({
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        customerPhone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        postalCode: formData.postalCode.trim(),
        specialInstructions: formData.specialInstructions.trim(),
        items: cart.map((item) => ({
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        })),
        subtotal: cartTotal,
        shipping,
        grandTotal,
      });

      await trackPurchaseWithServerFallback({
        items: cart,
        orderValue: grandTotal,
        method: "whatsapp",
        customerEmail: formData.email,
        customerPhone: formData.phone,
      });

      setWhatsAppUrl(generatedWhatsAppUrl);
      setIsPlaced(true);
      clearCart();
      setIsSubmitting(false);

      // Automatically open WhatsApp with pre-filled order data
      window.open(generatedWhatsAppUrl, "_blank");
    })();
  };

  return (
    <div className="min-h-screen bg-background pt-72 pb-14">
      <div className="container mx-auto px-6">
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 text-sm text-[#5d4a30] hover:text-[#2c2416] mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-heading text-[#153532]">
            Checkout
          </h1>
          <p className="mt-3 text-[#5d4a30]">
            Complete your details to send your order directly to our WhatsApp.
          </p>
        </div>

        {isPlaced ? (
          <div className="rounded-2xl border border-[#e6d3b8] bg-white p-10 text-center shadow-[0_12px_34px_rgba(44,36,22,0.08)] max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-heading text-[#153532]">
              Order Sent to WhatsApp
            </h2>
            <p className="mt-3 text-[#5d4a30] leading-relaxed">
              Your order details have been formatted for WhatsApp! If WhatsApp did not open automatically, please click the button below to send your order directly to our team.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20bd5a] px-8 py-3.5 text-base font-bold tracking-wide text-white transition-transform hover:scale-105 shadow-md"
              >
                <MessageCircle className="w-5 h-5 fill-current" /> Open WhatsApp Order
              </a>
              <Link
                href="/co-ords"
                className="inline-flex items-center justify-center rounded-full border border-[#153532] px-6 py-3.5 text-sm font-semibold tracking-wide text-[#153532] hover:bg-[#153532] hover:text-white transition-colors"
              >
                Back to Co-Ords
              </Link>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="rounded-2xl border border-[#e6d3b8] bg-white p-10 text-center shadow-[0_12px_34px_rgba(44,36,22,0.08)]">
            <h2 className="text-3xl font-heading text-[#153532]">
              Your Cart Is Empty
            </h2>
            <p className="mt-2 text-[#5d4a30]">Add products before checkout.</p>
            <Link
              href="/co-ords"
              className="mt-6 inline-flex rounded-md bg-[#153532] px-6 py-3 text-sm font-semibold tracking-wide text-white hover:bg-[#0f2725]"
            >
              Shop Co-Ords
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 rounded-2xl border border-[#e6d3b8] bg-white p-6 md:p-8 shadow-[0_12px_34px_rgba(44,36,22,0.08)]">
              <h2 className="text-2xl font-heading text-[#153532] mb-6">
                Shipping Details
              </h2>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="border border-[#e6d3b8] rounded-md px-4 py-3"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  required
                />
                <input
                  className="border border-[#e6d3b8] rounded-md px-4 py-3"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  required
                />
                <input
                  className="md:col-span-2 border border-[#e6d3b8] rounded-md px-4 py-3"
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                />
                <input
                  className="md:col-span-2 border border-[#e6d3b8] rounded-md px-4 py-3"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  required
                />
                <input
                  className="md:col-span-2 border border-[#e6d3b8] rounded-md px-4 py-3"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  required
                />
                <input
                  className="border border-[#e6d3b8] rounded-md px-4 py-3"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  required
                />
                <input
                  className="border border-[#e6d3b8] rounded-md px-4 py-3"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={(e) => updateField("postalCode", e.target.value)}
                  required
                />
                <textarea
                  className="md:col-span-2 border border-[#e6d3b8] rounded-md px-4 py-3 min-h-[120px]"
                  placeholder="Special Instructions (optional): measurements, custom fitting notes, design preferences, delivery timing, etc."
                  value={formData.specialInstructions}
                  onChange={(e) =>
                    updateField("specialInstructions", e.target.value)
                  }
                />
              </form>

              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

              <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-wider text-[#7a603c]">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f9f1e5] px-3 py-1.5">
                  <Truck className="w-3.5 h-3.5" /> Fast Delivery
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f9f1e5] px-3 py-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Secure Order
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f9f1e5] px-3 py-1.5">
                  <CreditCard className="w-3.5 h-3.5" /> Cash On Delivery
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#e6d3b8] bg-white p-6 shadow-[0_12px_34px_rgba(44,36,22,0.08)] h-fit">
              <h2 className="text-2xl font-heading text-[#153532] mb-5">
                Order Summary
              </h2>

              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex gap-3 border-b border-[#f0e4d2] pb-4"
                  >
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-[#f4eadf] shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-[#2c2416] line-clamp-2">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-[#7a603c] mt-1">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-[#153532] mt-1">
                        {item.product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2 text-sm border-t border-[#ead9c2] pt-4">
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
                <div className="flex justify-between text-base font-semibold text-[#153532] pt-1">
                  <span>Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="mt-6 w-full rounded-md bg-[#153532] py-3 text-sm font-semibold tracking-wide text-white hover:bg-[#0f2725] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
