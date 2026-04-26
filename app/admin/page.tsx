"use client";

import { getAllProducts } from "@/lib/products";
import { Order, OrderStatus } from "@/types/order";
import Link from "next/link";
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

const getOrderSourceLabel = (orderId: string): string =>
  orderId.startsWith("lp-order-") ? "Landing Page" : "Website";

export default function AdminPage() {
  const products = getAllProducts();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

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

  const totalProducts = products.length;
  const inStockProducts = products.filter((product) => product.inStock).length;
  const outOfStockProducts = totalProducts - inStockProducts;
  const featuredProducts = products.filter(
    (product) => product.featured,
  ).length;
  const newArrivals = products.filter((product) => product.newArrival).length;

  const totalInventoryValue = products.reduce(
    (sum, product) => sum + product.priceValue,
    0,
  );
  const averageProductPrice = totalProducts
    ? Math.round(totalInventoryValue / totalProducts)
    : 0;
  const stockAvailability = totalProducts
    ? Math.round((inStockProducts / totalProducts) * 100)
    : 0;

  const categoryMap = products.reduce<Record<string, number>>(
    (acc, product) => {
      const key = product.category || "Uncategorized";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {},
  );

  const categoryStats = Object.entries(categoryMap)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  const highValueProducts = [...products]
    .sort((a, b) => b.priceValue - a.priceValue)
    .slice(0, 5);

  const recentlyAdded = [...products].sort((a, b) => b.id - a.id).slice(0, 8);

  const dashboardStats: DashboardStat[] = [
    {
      label: "Total Products",
      value: totalProducts.toString(),
      helper: `${featuredProducts} featured items`,
    },
    {
      label: "In Stock",
      value: inStockProducts.toString(),
      helper: `${stockAvailability}% availability`,
    },
    {
      label: "Out of Stock",
      value: outOfStockProducts.toString(),
      helper:
        outOfStockProducts === 0 ? "No urgent restocks" : "Needs replenishment",
    },
    {
      label: "Avg Product Price",
      value: currencyFormatter.format(averageProductPrice),
      helper: `${newArrivals} new arrivals`,
    },
  ];

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

  const fulfillmentQueue = useMemo(
    () =>
      recentOrders.filter(
        (order) => order.status === "Pending" || order.status === "Processing",
      ),
    [recentOrders],
  );

  const getOrderStatusClasses = (status: string): string => {
    if (status === "Pending") return "bg-[#fff5e2] text-[#9a6a18]";
    if (status === "Processing") return "bg-[#e8f3ff] text-[#215c9a]";
    if (status === "Shipped") return "bg-[#efe9ff] text-[#5d3f9a]";
    if (status === "Delivered") return "bg-[#e7f6ef] text-[#236744]";
    return "bg-[#fde9e9] text-[#9c3535]";
  };

  const getPaymentStatusClasses = (status: string): string => {
    if (status === "Paid") return "bg-[#e7f6ef] text-[#236744]";
    if (status === "Pending") return "bg-[#fff5e2] text-[#9a6a18]";
    return "bg-[#fde9e9] text-[#9c3535]";
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-[#fef9f3] via-[#fffdf9] to-[#f8efe3] px-4 py-72 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="overflow-hidden rounded-3xl border border-[#e9d0a9] bg-white/80 shadow-[0_20px_40px_-24px_rgba(44,36,22,0.45)] backdrop-blur-sm">
          <div className="relative isolate p-6 sm:p-8 lg:p-10">
            <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[#efd6ad]/45 blur-2xl" />
            <div className="absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-[#8b6f47]/15 blur-xl" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <p className="inline-flex w-fit items-center rounded-full border border-[#d8ba8a] bg-[#fff5e8] px-3 py-1 text-xs font-semibold tracking-wide text-[#8b6f47] uppercase">
                  Sansli Admin
                </p>
                <h1 className="font-heading text-3xl leading-tight text-[#153532] sm:text-4xl">
                  Catalog Operations Dashboard
                </h1>
                <p className="max-w-2xl text-sm text-[#5d4a31] sm:text-base">
                  Monitor inventory health, identify high-value products, and
                  keep your storefront ready for campaigns from one place.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#e8ceb0] bg-[#fff9f2] p-4 text-sm text-[#614a2f] sm:min-w-72">
                <div>
                  <p className="text-xs uppercase tracking-wide opacity-70">
                    Inventory Value
                  </p>
                  <p className="font-semibold text-[#153532]">
                    {currencyFormatter.format(totalInventoryValue)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide opacity-70">
                    Categories
                  </p>
                  <p className="font-semibold text-[#153532]">
                    {categoryStats.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide opacity-70">
                    Featured
                  </p>
                  <p className="font-semibold text-[#153532]">
                    {featuredProducts}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide opacity-70">
                    New Arrivals
                  </p>
                  <p className="font-semibold text-[#153532]">{newArrivals}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-[#ecd9bf] bg-white p-5 shadow-[0_12px_30px_-20px_rgba(44,36,22,0.45)]"
            >
              <p className="text-xs font-semibold tracking-wide text-[#8b6f47] uppercase">
                {stat.label}
              </p>
              <p className="mt-2 font-heading text-3xl text-[#153532]">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-[#6a5438]">{stat.helper}</p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-[#ecd9bf] bg-white p-6 shadow-[0_12px_30px_-20px_rgba(44,36,22,0.45)]">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-heading text-2xl text-[#153532]">
                Order Management
              </h2>
              <p className="text-sm text-[#6a5438]">
                Track order flow, payment collection, and fulfillment workload.
              </p>
            </div>
            <p className="rounded-full bg-[#f6ead8] px-3 py-1 text-xs font-semibold tracking-wide text-[#7a5d3d] uppercase">
              Live Ops Snapshot
            </p>
          </div>

          {ordersLoading ? (
            <p className="mb-4 rounded-lg border border-[#efdfca] bg-[#fffdf9] px-3 py-2 text-sm text-[#6a5438]">
              Loading orders from database...
            </p>
          ) : null}

          {ordersError ? (
            <p className="mb-4 rounded-lg border border-[#f3c9c9] bg-[#fff4f4] px-3 py-2 text-sm text-[#8f3030]">
              {ordersError}
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {orderStats.map((stat) => (
              <article
                key={stat.label}
                className="rounded-xl border border-[#efdfca] bg-[#fffdf9] p-4"
              >
                <p className="text-xs font-semibold tracking-wide text-[#8b6f47] uppercase">
                  {stat.label}
                </p>
                <p className="mt-1.5 font-heading text-2xl text-[#153532]">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-[#6a5438]">{stat.helper}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <article className="rounded-xl border border-[#efdfca] bg-[#fffdf9] p-4 lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-heading text-xl text-[#153532]">
                  Recent Orders
                </h3>
                <span className="text-xs text-[#8b6f47]">
                  Last {recentOrders.length} orders
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-sm border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#efdfca] text-left text-xs tracking-wide text-[#8b6f47] uppercase">
                      <th className="py-3 pr-3">Order</th>
                      <th className="py-3 pr-3">Customer</th>
                      <th className="py-3 pr-3">Total</th>
                      <th className="py-3 pr-3">Payment</th>
                      <th className="py-3 pr-3">Status</th>
                      <th className="py-3 pr-3">Update</th>
                      <th className="py-3">Placed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => {
                      const itemsTotal = order.items.reduce(
                        (sum, item) => sum + item.unitPrice * item.quantity,
                        0,
                      );
                      const orderTotal = itemsTotal + order.shippingFee;
                      const totalUnits = order.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0,
                      );

                      return (
                        <tr
                          key={order.id}
                          className="border-b border-[#f4e7d7] text-[#3f3322]"
                        >
                          <td className="py-3 pr-3">
                            <p className="font-semibold text-[#153532]">
                              {order.id}
                            </p>
                            <p className="text-xs text-[#8b6f47]">
                              {totalUnits} items
                            </p>
                            <p className="mt-1 inline-flex rounded-full bg-[#f4ead9] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#7a5d3d]">
                              {getOrderSourceLabel(order.id)}
                            </p>
                          </td>
                          <td className="py-3 pr-3">
                            <p>{order.customerName}</p>
                            <p className="text-xs text-[#8b6f47]">
                              {order.district}
                            </p>
                          </td>
                          <td className="py-3 pr-3 font-medium text-[#153532]">
                            {currencyFormatter.format(orderTotal)}
                          </td>
                          <td className="py-3 pr-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getPaymentStatusClasses(order.paymentStatus)}`}
                            >
                              {order.paymentStatus}
                            </span>
                            <p className="mt-1 text-xs text-[#8b6f47]">
                              {order.paymentMethod}
                            </p>
                          </td>
                          <td className="py-3 pr-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getOrderStatusClasses(order.status)}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 pr-3">
                            <label
                              className="sr-only"
                              htmlFor={`status-${order.id}`}
                            >
                              Change delivery status
                            </label>
                            <select
                              id={`status-${order.id}`}
                              value={order.status}
                              onChange={(event) =>
                                void handleStatusChange(
                                  order.id,
                                  event.target.value as OrderStatus,
                                )
                              }
                              disabled={updatingOrderId === order.id}
                              className="w-32 rounded-lg border border-[#e2c8a4] bg-white px-2 py-1.5 text-xs font-medium text-[#4f3f2b] focus:border-[#8b6f47] focus:outline-none"
                            >
                              {ORDER_STATUS_OPTIONS.map((statusOption) => (
                                <option key={statusOption} value={statusOption}>
                                  {statusOption}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 text-xs text-[#735b3d]">
                            {dateFormatter.format(new Date(order.createdAt))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </article>

            <div className="space-y-5">
              <article className="rounded-xl border border-[#efdfca] bg-[#fffdf9] p-4">
                <h3 className="font-heading text-xl text-[#153532]">
                  Fulfillment Queue
                </h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {fulfillmentQueue.length ? (
                    fulfillmentQueue.slice(0, 5).map((order) => (
                      <li
                        key={order.id}
                        className="flex items-center justify-between rounded-lg border border-[#f1e3d0] bg-white px-3 py-2"
                      >
                        <div>
                          <p className="font-medium text-[#153532]">
                            {order.id}
                          </p>
                          <p className="text-xs text-[#8b6f47]">
                            {order.customerName}
                          </p>
                        </div>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getOrderStatusClasses(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="rounded-lg border border-[#f1e3d0] bg-white px-3 py-2 text-[#6a5438]">
                      Queue is clear.
                    </li>
                  )}
                </ul>
                {fulfillmentQueue.length > 0 ? (
                  <div className="mt-3 space-y-2 border-t border-[#efdfca] pt-3 text-xs">
                    {fulfillmentQueue.slice(0, 3).map((order) => (
                      <div
                        key={`${order.id}-actions`}
                        className="flex items-center justify-between gap-2"
                      >
                        <span className="font-medium text-[#5f4a31]">
                          {order.id}
                        </span>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              void handleStatusChange(order.id, "Shipped")
                            }
                            disabled={updatingOrderId === order.id}
                            className="rounded-md border border-[#d5c0a1] bg-white px-2 py-1 text-[#6f5638] hover:bg-[#fbf3e7]"
                          >
                            Mark Shipped
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              void handleStatusChange(order.id, "Delivered")
                            }
                            disabled={updatingOrderId === order.id}
                            className="rounded-md border border-[#c8dfd0] bg-[#eaf7f0] px-2 py-1 text-[#236744] hover:bg-[#def0e6]"
                          >
                            Mark Delivered
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>

              <article className="rounded-xl border border-[#efdfca] bg-[#fffdf9] p-4">
                <h3 className="font-heading text-xl text-[#153532]">
                  Order & Payment Split
                </h3>
                <div className="mt-3 space-y-3 text-sm text-[#5f4a31]">
                  <div>
                    <p className="mb-1 text-xs tracking-wide text-[#8b6f47] uppercase">
                      Order Status
                    </p>
                    {Object.entries(orderStatusCounts).map(
                      ([status, count]) => (
                        <div
                          key={status}
                          className="flex justify-between py-0.5"
                        >
                          <span>{status}</span>
                          <span className="font-semibold">{count}</span>
                        </div>
                      ),
                    )}
                  </div>
                  <div className="border-t border-[#efdfca] pt-2">
                    <p className="mb-1 text-xs tracking-wide text-[#8b6f47] uppercase">
                      Payment Methods
                    </p>
                    {Object.entries(paymentMethodCounts).map(
                      ([method, count]) => (
                        <div
                          key={method}
                          className="flex justify-between py-0.5"
                        >
                          <span>{method}</span>
                          <span className="font-semibold">{count}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <article className="rounded-2xl border border-[#ecd9bf] bg-white p-6 shadow-[0_12px_30px_-20px_rgba(44,36,22,0.45)] lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-2xl text-[#153532]">
                Recent Products
              </h2>
              <Link
                href="/collections"
                className="text-sm font-semibold text-[#8b6f47] hover:text-[#6f5638]"
              >
                View storefront
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-sm border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#efdfca] text-left text-xs tracking-wide text-[#8b6f47] uppercase">
                    <th className="py-3 pr-4">Product</th>
                    <th className="py-3 pr-4">Category</th>
                    <th className="py-3 pr-4">Price</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentlyAdded.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-[#f4e7d7] text-[#3f3322]"
                    >
                      <td className="py-3 pr-4">
                        <p className="font-medium text-[#153532]">
                          {product.name}
                        </p>
                        <p className="text-xs text-[#8b6f47]">
                          ID #{product.id}
                        </p>
                      </td>
                      <td className="py-3 pr-4">{product.category}</td>
                      <td className="py-3 pr-4">
                        {currencyFormatter.format(product.priceValue)}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            product.inStock
                              ? "bg-[#e7f6ef] text-[#236744]"
                              : "bg-[#fde9e9] text-[#9c3535]"
                          }`}
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="py-3">
                        <Link
                          href={`/products/${product.id}`}
                          className="text-xs font-semibold text-[#8b6f47] hover:text-[#6f5638]"
                        >
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <div className="space-y-5">
            <article className="rounded-2xl border border-[#ecd9bf] bg-white p-6 shadow-[0_12px_30px_-20px_rgba(44,36,22,0.45)]">
              <h2 className="font-heading text-xl text-[#153532]">
                Category Mix
              </h2>
              <div className="mt-4 space-y-3">
                {categoryStats.map((item) => {
                  const width = Math.max(
                    8,
                    Math.round((item.count / totalProducts) * 100),
                  );

                  return (
                    <div key={item.category} className="space-y-1">
                      <div className="flex items-center justify-between text-sm text-[#5f4a31]">
                        <span>{item.category}</span>
                        <span className="font-semibold">{item.count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#f2e6d5]">
                        <div
                          className="h-2 rounded-full bg-[#8b6f47]"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="rounded-2xl border border-[#ecd9bf] bg-white p-6 shadow-[0_12px_30px_-20px_rgba(44,36,22,0.45)]">
              <h2 className="font-heading text-xl text-[#153532]">
                High Value Items
              </h2>
              <ul className="mt-4 space-y-3 text-sm">
                {highValueProducts.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-center justify-between border-b border-[#f4e7d7] pb-2 text-[#4a3b27]"
                  >
                    <span className="line-clamp-1 pr-4">{product.name}</span>
                    <span className="font-semibold text-[#153532]">
                      {currencyFormatter.format(product.priceValue)}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
