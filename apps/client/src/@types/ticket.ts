export interface Ticket {
  id: string;
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

export interface TicketsResponse {
  tickets: Ticket[];
}

export interface TicketResponse {
  ticket: Ticket;
}
