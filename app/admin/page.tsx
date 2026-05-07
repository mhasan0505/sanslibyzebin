"use client";

import { getAllProducts } from "@/lib/products";
import { Order, OrderStatus } from "@/types/order";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const currencyFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-BD", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

type DashboardStat = {
  label: string;
  value: string;
  helper: string;
};

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function AdminPage() {
  const products = getAllProducts();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const normalizeImageSrc = (src: string | undefined): string => {
    if (!src) return "/favicon/favicon.ico";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    if (src.startsWith("/")) return src;
    return `/${src}`;
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setOrdersLoading(true);
        setOrdersError(null);

        const response = await fetch("/api/orders", {
          method: "GET",
          cache: "no-store",
        });
        const payload = (await response.json()) as {
          ok: boolean;
          message?: string;
          orders?: Order[];
        };

        if (!response.ok || !payload.ok || !payload.orders) {
          throw new Error(payload.message || "Failed to load orders");
        }

        setOrders(payload.orders);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load orders";
        setOrdersError(message);
      } finally {
        setOrdersLoading(false);
      }
    };

    void loadOrders();
  }, []);

  const handleStatusChange = async (
    orderId: string,
    nextStatus: OrderStatus,
  ) => {
    const previousOrders = orders;

    setUpdatingOrderId(orderId);
    setOrdersError(null);
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: nextStatus,
              paymentStatus:
                nextStatus === "Cancelled"
                  ? "Refunded"
                  : nextStatus === "Delivered"
                    ? "Paid"
                    : order.paymentStatus,
            }
          : order,
      ),
    );

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const payload = (await response.json()) as {
        ok: boolean;
        message?: string;
        order?: Order;
      };

      if (!response.ok || !payload.ok || !payload.order) {
        throw new Error(payload.message || "Failed to update order status");
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? payload.order! : order,
        ),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update order";
      setOrders(previousOrders);
      setOrdersError(message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const totalOrders = orders.length;
  const totalOrderRevenue = orders.reduce((sum, order) => {
    const itemsTotal = order.items.reduce(
      (itemsSum, item) => itemsSum + item.unitPrice * item.quantity,
      0,
    );
    return sum + itemsTotal + order.shippingFee;
  }, 0);
  const pendingOrders = orders.filter(
    (order) => order.status === "Pending" || order.status === "Processing",
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered",
  ).length;
  const deliveredRate = totalOrders
    ? Math.round((deliveredOrders / totalOrders) * 100)
    : 0;

  const orderStats: DashboardStat[] = [
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      helper: `${pendingOrders} need fulfillment`,
    },
    {
      label: "Order Revenue",
      value: currencyFormatter.format(totalOrderRevenue),
      helper: "Includes shipping fee",
    },
    {
      label: "Pending Queue",
      value: pendingOrders.toString(),
      helper: "Pending + Processing",
    },
    {
      label: "Delivered Rate",
      value: `${deliveredRate}%`,
      helper: `${deliveredOrders} delivered`,
    },
  ];

  const orderStatusCounts = useMemo(
    () =>
      orders.reduce<Record<string, number>>((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {}),
    [orders],
  );

  const paymentMethodCounts = useMemo(
    () =>
      orders.reduce<Record<string, number>>((acc, order) => {
        acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1;
        return acc;
      }, {}),
    [orders],
  );

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 10),
    [orders],
  );

  return (
    <main className="min-h-screen bg-white mt-20 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage orders, track fulfillment, and monitor payment status.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {orderStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded border border-gray-200 bg-gray-50 p-4"
            >
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-gray-500">{stat.helper}</p>
            </div>
          ))}
        </section>

        <section className="rounded border border-gray-200">
          {ordersLoading ? (
            <div className="p-6 text-sm text-gray-500">Loading orders...</div>
          ) : ordersError ? (
            <div className="p-6 text-sm text-red-600">{ordersError}</div>
          ) : recentOrders.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">
              No orders yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Mobile
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Update Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const itemsTotal = order.items.reduce(
                      (sum, item) => sum + item.unitPrice * item.quantity,
                      0,
                    );
                    const orderTotal = itemsTotal + order.shippingFee;

                    const isExpanded = expandedOrderId === order.id;

                    return (
                      <>
                        <tr
                          key={order.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">
                            <span className="font-medium text-gray-900">
                              {order.id.slice(0, 12)}...
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900">
                                {order.customerName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {order.district}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {order.customerPhone}
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {currencyFormatter.format(orderTotal)}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-800">
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-800">
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                void handleStatusChange(
                                  order.id,
                                  e.target.value as OrderStatus,
                                )
                              }
                              disabled={updatingOrderId === order.id}
                              className="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 focus:border-gray-400 focus:outline-none disabled:opacity-50"
                            >
                              {ORDER_STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">
                            {dateFormatter.format(new Date(order.createdAt))}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedOrderId((current) =>
                                  current === order.id ? null : order.id,
                                )
                              }
                              className="rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                            >
                              {isExpanded ? "Hide" : "View"}
                            </button>
                          </td>
                        </tr>
                        {isExpanded ? (
                          <tr className="border-b border-gray-200 bg-gray-50/70">
                            <td colSpan={9} className="px-4 py-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Customer Info
                                  </p>
                                  <div className="mt-2 space-y-1 text-sm text-gray-700">
                                    <p>
                                      <span className="font-medium text-gray-900">
                                        Name:
                                      </span>{" "}
                                      {order.customerName}
                                    </p>
                                    <p>
                                      <span className="font-medium text-gray-900">
                                        Mobile:
                                      </span>{" "}
                                      {order.customerPhone}
                                    </p>
                                    <p>
                                      <span className="font-medium text-gray-900">
                                        Address:
                                      </span>{" "}
                                      {order.shippingAddress || "N/A"}
                                    </p>
                                    <p>
                                      <span className="font-medium text-gray-900">
                                        District:
                                      </span>{" "}
                                      {order.district}
                                    </p>
                                    <p>
                                      <span className="font-medium text-gray-900">
                                        Instruction:
                                      </span>{" "}
                                      {order.specialInstructionMessage || "N/A"}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Order Info
                                  </p>
                                  <div className="mt-2 space-y-1 text-sm text-gray-700">
                                    <p>
                                      <span className="font-medium text-gray-900">
                                        Order ID:
                                      </span>{" "}
                                      {order.id}
                                    </p>
                                    <p>
                                      <span className="font-medium text-gray-900">
                                        Payment Method:
                                      </span>{" "}
                                      {order.paymentMethod}
                                    </p>
                                    <p>
                                      <span className="font-medium text-gray-900">
                                        Payment Status:
                                      </span>{" "}
                                      {order.paymentStatus}
                                    </p>
                                    <p>
                                      <span className="font-medium text-gray-900">
                                        Order Status:
                                      </span>{" "}
                                      {order.status}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                  Products
                                </p>
                                <div className="mt-2 space-y-3">
                                  {order.items.map((item, index) => {
                                    const fallbackProduct = productById.get(
                                      item.productId,
                                    );
                                    const productName =
                                      item.productName ||
                                      fallbackProduct?.name ||
                                      `Product #${item.productId}`;
                                    const imageSrc = normalizeImageSrc(
                                      item.productImage ||
                                        fallbackProduct?.images?.[0],
                                    );

                                    return (
                                      <div
                                        key={`${order.id}-${item.productId}-${index}`}
                                        className="flex items-center gap-3 rounded border border-gray-200 bg-white p-3"
                                      >
                                        <div className="relative h-14 w-14 overflow-hidden rounded bg-gray-100">
                                          <Image
                                            src={imageSrc}
                                            alt={productName}
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                        <div className="min-w-0 flex-1 text-sm text-gray-700">
                                          <p className="font-medium text-gray-900">
                                            {productName}
                                          </p>
                                          <p>Qty: {item.quantity}</p>
                                          <p>
                                            Size: {item.selectedSize || "N/A"} |
                                            Color: {item.selectedColor || "N/A"}
                                          </p>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">
                                          {currencyFormatter.format(
                                            item.unitPrice * item.quantity,
                                          )}
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <section className="rounded border border-gray-200 bg-gray-50 p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Order Status
              </h3>
              <div className="mt-4 space-y-2 text-sm">
                {Object.entries(orderStatusCounts).map(([status, count]) => (
                  <div key={status} className="flex justify-between">
                    <span className="text-gray-600">{status}</span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Payment Methods
              </h3>
              <div className="mt-4 space-y-2 text-sm">
                {Object.entries(paymentMethodCounts).map(([method, count]) => (
                  <div key={method} className="flex justify-between">
                    <span className="text-gray-600">{method}</span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
