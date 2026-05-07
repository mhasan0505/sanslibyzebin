export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type PaymentStatus = "Pending" | "Paid" | "Refunded";

export type PaymentMethod = "Cash on Delivery" | "bKash" | "Nagad" | "Card";

export interface OrderItem {
  productId: number;
  quantity: number;
  unitPrice: number;
  productName?: string;
  productImage?: string;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  district: string;
  shippingAddress?: string;
  specialInstructionMessage?: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingFee: number;
  items: OrderItem[];
}
