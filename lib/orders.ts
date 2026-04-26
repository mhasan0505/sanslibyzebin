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
