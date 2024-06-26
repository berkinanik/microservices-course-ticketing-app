import mongoose, { isValidObjectId } from 'mongoose';
import { Order, OrderStatus } from './order';

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
  version: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    version: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret.__v;
        delete ret._id;
      },
    },
  },
);

ticketSchema.statics.build = (attrs: TicketAttrs): TicketDoc => {
  const { id, ...rest } = attrs;

  if (!isValidObjectId(id)) {
    throw new Error(`[Ticket.build] Invalid ObjectId: ${id}`);
  }

  return new Ticket({
    _id: id,
    ...rest,
  });
};

ticketSchema.statics.findByEvent = async (event: {
  id: string;
  version: number;
}): Promise<TicketDoc | null> => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

// Run query to look at all orders. Find an order where the ticket
// is the ticket we just found *and* the orders status is *not* cancelled
// If we find an order from that means the ticket *is* reserved
ticketSchema.methods.isReserved = async function () {
  // this === the ticket document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
