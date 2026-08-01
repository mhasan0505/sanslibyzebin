import { orders } from "@/app/data/orders";
import { Order, OrderStatus } from "@/types/order";

export function getAllOrders(): Order[] {
  return orders;
}

export function getOrderById(id: string): Order | undefined {
  return orders.find((order) => order.id === id);
}

export function getOrdersByStatus(status: OrderStatus): Order[] {
  return orders.filter((order) => order.status === status);
}

export async function saveOrderToDatabase(
  order: Order,
): Promise<{ ok: boolean; message?: string }> {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    const payload = (await response.json()) as {
      ok: boolean;
      message?: string;
      order?: Order;
    };

    if (!response.ok || !payload.ok) {
      return {
        ok: false,
        message: payload.message || "Failed to save order",
      };
    }

    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Network error saving order";
    console.error("Error saving order to database:", message);
    return { ok: false, message };
  }
}

