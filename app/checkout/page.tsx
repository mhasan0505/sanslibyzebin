"use client";

import { useCart } from "@/context/CartContext";
import { trackInitiateCheckout, trackPurchase } from "@/lib/metaPixel";
import { Order } from "@/types/order";
import { formatCurrency, parsePriceSafe } from "@/utils/helpers";
import {
  ArrowLeft,
  CreditCard,
  Mail,
  MessageCircle,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const SHIPPING_FEE = 120;
const STORE_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8801773808773";
const STORE_ORDER_EMAIL =
  process.env.NEXT_PUBLIC_ORDER_EMAIL || "orders@sanslibyzebin.com";

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
  const [placedVia, setPlacedVia] = useState<"whatsapp" | "email" | null>(null);
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

  const persistOrder = async (): Promise<boolean> => {
    const payload: Order = {
      id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      customerPhone: formData.phone.trim(),
      district: formData.city.trim(),
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

      return true;
    } catch {
      setError(
        "We could not save your order right now. Please try again in a moment.",
      );
      return false;
    }
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

  const buildOrderMessage = () => {
    const itemLines = cart
      .map((item, index) => {
        const unitPrice = parsePriceSafe(item.product.price, 0);
        const lineTotal = unitPrice * item.quantity;

        return [
          `${index + 1}. ${item.product.name}`,
          `   Qty: ${item.quantity}`,
          `   Unit Price: ${item.product.price}`,
          `   Line Total: ${formatCurrency(lineTotal)}`,
          `   Size: ${item.selectedSize || "N/A"}`,
          `   Color: ${item.selectedColor || "N/A"}`,
        ].join("\n");
      })
      .join("\n\n");

    return [
      "New Order Request",
      "",
      "Customer Details",
      `Name: ${formData.firstName} ${formData.lastName}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone}`,
      `Address: ${formData.address}`,
      `City: ${formData.city}`,
      `Postal Code: ${formData.postalCode}`,
      `Special Instructions: ${formData.specialInstructions || "None"}`,
      "",
      "Order Items",
      itemLines,
      "",
      "Order Summary",
      `Subtotal: ${formatCurrency(cartTotal)}`,
      `Shipping: ${shipping === 0 ? "Free" : formatCurrency(shipping)}`,
      `Grand Total: ${formatCurrency(grandTotal)}`,
      "",
      "Payment Method: Cash On Delivery",
    ].join("\n");
  };

  const handleOrderOnWhatsApp = () => {
    if (!validateForm()) return;

    void (async () => {
      const saved = await persistOrder();
      if (!saved) return;

      trackPurchase({
        items: cart,
        orderValue: grandTotal,
        method: "whatsapp",
      });

      const cleanNumber = STORE_WHATSAPP_NUMBER.replace(/\D/g, "");
      const message = encodeURIComponent(buildOrderMessage());
      const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      setPlacedVia("whatsapp");
      clearCart();
    })();
  };

  const handleOrderByEmail = () => {
    if (!validateForm()) return;

    void (async () => {
      const saved = await persistOrder();
      if (!saved) return;

      trackPurchase({
        items: cart,
        orderValue: grandTotal,
        method: "email",
      });

      const subject = encodeURIComponent(
        `New Order - ${formData.firstName} ${formData.lastName}`,
      );
      const body = encodeURIComponent(buildOrderMessage());
      window.location.href = `mailto:${STORE_ORDER_EMAIL}?subject=${subject}&body=${body}`;

      setPlacedVia("email");
      clearCart();
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
            Complete your order details to place your casual luxury picks.
          </p>
        </div>

        {placedVia ? (
          <div className="rounded-2xl border border-[#e6d3b8] bg-white p-10 text-center shadow-[0_12px_34px_rgba(44,36,22,0.08)]">
            <ShieldCheck className="w-12 h-12 mx-auto text-[#153532]" />
            <h2 className="mt-4 text-3xl font-heading text-[#153532]">
              Order Request Sent
            </h2>
            <p className="mt-2 text-[#5d4a30]">
              Your details were prepared and sent via {placedVia}. Our team will
              follow up with confirmation shortly.
            </p>
            <Link
              href="/co-ords"
              className="mt-6 inline-flex rounded-md bg-[#153532] px-6 py-3 text-sm font-semibold tracking-wide text-white hover:bg-[#0f2725]"
            >
              Back to Co-Ords
            </Link>
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
                onClick={handleOrderOnWhatsApp}
                className="mt-6 w-full rounded-md bg-[#1f7f45] py-3 text-sm font-semibold tracking-wide text-white hover:bg-[#1b6f3d] inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Order on WhatsApp
              </button>
              <button
                onClick={handleOrderByEmail}
                className="mt-3 w-full rounded-md bg-[#153532] py-3 text-sm font-semibold tracking-wide text-white hover:bg-[#0f2725] inline-flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" /> Order by Email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
