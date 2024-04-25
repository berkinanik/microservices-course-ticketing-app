import mongoose from 'mongoose';

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  password: string;
}

interface TicketModel extends mongoose.Model<any> {
  build(attrs: TicketAttrs): TicketDoc;
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
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.__v;
        delete ret._id;
      },
    },
  },
);

const buildTicket = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

ticketSchema.statics.build = buildTicket;

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
