import { orders as seedOrders } from "@/app/data/orders";
import { prisma } from "@/lib/prisma";
import { Order } from "@/types/order";
import { NextResponse } from "next/server";

const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

const PAYMENT_STATUSES = ["Pending", "Paid", "Refunded"] as const;

const PAYMENT_METHODS = ["Cash on Delivery", "bKash", "Nagad", "Card"] as const;

const isOrderStatus = (value: string): boolean =>
  ORDER_STATUSES.includes(value as (typeof ORDER_STATUSES)[number]);

const isPaymentStatus = (value: string): boolean =>
  PAYMENT_STATUSES.includes(value as (typeof PAYMENT_STATUSES)[number]);

const isPaymentMethod = (value: string): boolean =>
  PAYMENT_METHODS.includes(value as (typeof PAYMENT_METHODS)[number]);

type DbOrder = {
  id: string;
  customerName: string;
  customerPhone: string;
  district: string;
  createdAt: Date;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingFee: number;
  items: Array<{
    productId: number;
    quantity: number;
    unitPrice: number;
  }>;
};

function toOrderDto(order: DbOrder): Order {
  return {
    id: order.id,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    district: order.district,
    createdAt: order.createdAt.toISOString(),
    status: order.status as Order["status"],
    paymentStatus: order.paymentStatus as Order["paymentStatus"],
    paymentMethod: order.paymentMethod as Order["paymentMethod"],
    shippingFee: order.shippingFee,
    items: order.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
  };
}

async function ensureSeedOrders() {
  const count = await prisma.order.count();

  if (count > 0) {
    return;
  }

  await prisma.$transaction(
    seedOrders.map((order) =>
      prisma.order.create({
        data: {
          id: order.id,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          district: order.district,
          createdAt: new Date(order.createdAt),
          status: order.status,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          shippingFee: order.shippingFee,
          items: {
            create: order.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
      }),
    ),
  );
}

export async function GET() {
  try {
    await ensureSeedOrders();

    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      ok: true,
      orders: orders.map(toOrderDto),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        ok: false,
        message: "Failed to fetch orders",
        error: message,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<Order>;

    if (
      !payload.id ||
      !payload.customerName ||
      !payload.customerPhone ||
      !payload.district ||
      !payload.status ||
      !payload.paymentStatus ||
      !payload.paymentMethod ||
      !Array.isArray(payload.items)
    ) {
      return NextResponse.json(
        {
          ok: false,
          message: "Missing required order fields",
        },
        { status: 400 },
      );
    }

    if (!isOrderStatus(payload.status)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid order status",
        },
        { status: 400 },
      );
    }

    if (!isPaymentStatus(payload.paymentStatus)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid payment status",
        },
        { status: 400 },
      );
    }

    if (!isPaymentMethod(payload.paymentMethod)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid payment method",
        },
        { status: 400 },
      );
    }

    const created = await prisma.order.create({
      data: {
        id: payload.id,
        customerName: payload.customerName,
        customerPhone: payload.customerPhone,
        district: payload.district,
        status: payload.status,
        paymentStatus: payload.paymentStatus,
        paymentMethod: payload.paymentMethod,
        shippingFee: payload.shippingFee ?? 0,
        createdAt: payload.createdAt ? new Date(payload.createdAt) : undefined,
        items: {
          create: payload.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({
      ok: true,
      order: toOrderDto(created),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        ok: false,
        message: "Failed to create order",
        error: message,
      },
      { status: 500 },
    );
  }
}
