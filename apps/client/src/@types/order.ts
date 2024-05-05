import { type OrderStatus } from '~/constants';

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  expiresAt?: string;
  ticket: {
    id: string;
    price: number;
  };
  version: number;
}

export interface OrdersResponse {
  orders: Order[];
}

export interface OrderResponse {
  order: Order;
}
