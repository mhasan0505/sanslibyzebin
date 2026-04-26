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

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json(
        {
          ok: false,
          message: "Order not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, order: toOrderDto(order) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        ok: false,
        message: "Failed to fetch order",
        error: message,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const payload = (await request.json()) as {
      status?: string;
      paymentStatus?: string;
      paymentMethod?: string;
      district?: string;
      customerPhone?: string;
      customerName?: string;
      shippingFee?: number;
    };

    const data: {
      status?: string;
      paymentStatus?: string;
      paymentMethod?: string;
      district?: string;
      customerPhone?: string;
      customerName?: string;
      shippingFee?: number;
    } = {};

    if (payload.status) {
      if (!isOrderStatus(payload.status)) {
        return NextResponse.json(
          {
            ok: false,
            message: "Invalid order status",
          },
          { status: 400 },
        );
      }

      data.status = payload.status;

      if (!payload.paymentStatus) {
        if (payload.status === "Cancelled") {
          data.paymentStatus = "Refunded";
        }

        if (payload.status === "Delivered") {
          data.paymentStatus = "Paid";
        }
      }
    }

    if (payload.paymentStatus) {
      if (!isPaymentStatus(payload.paymentStatus)) {
        return NextResponse.json(
          {
            ok: false,
            message: "Invalid payment status",
          },
          { status: 400 },
        );
      }

      data.paymentStatus = payload.paymentStatus;
    }

    if (payload.paymentMethod) {
      if (!isPaymentMethod(payload.paymentMethod)) {
        return NextResponse.json(
          {
            ok: false,
            message: "Invalid payment method",
          },
          { status: 400 },
        );
      }

      data.paymentMethod = payload.paymentMethod;
    }

    if (payload.district) {
      data.district = payload.district;
    }

    if (payload.customerPhone) {
      data.customerPhone = payload.customerPhone;
    }

    if (payload.customerName) {
      data.customerName = payload.customerName;
    }

    if (typeof payload.shippingFee === "number") {
      data.shippingFee = payload.shippingFee;
    }

    const updated = await prisma.order.update({
      where: { id },
      data,
      include: { items: true },
    });

    return NextResponse.json({ ok: true, order: toOrderDto(updated) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        ok: false,
        message: "Failed to update order",
        error: message,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    await prisma.order.delete({ where: { id } });

    return NextResponse.json({
      ok: true,
      message: "Order deleted",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        ok: false,
        message: "Failed to delete order",
        error: message,
      },
      { status: 500 },
    );
  }
}
