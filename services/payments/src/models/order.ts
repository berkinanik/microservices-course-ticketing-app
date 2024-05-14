import { OrderStatus } from '@b.anik/ticketing-common';
import mongoose, { isValidObjectId } from 'mongoose';

interface OrderAttrs {
  id: string;
  version: number;
  price: number;
  userId: string;
  status: OrderStatus;
}

export interface OrderDoc extends mongoose.Document {
  version: number;
  price: number;
  userId: string;
  status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
  findByEvent(event: { id: string; version: number }): Promise<OrderDoc | null>;
}

const orderSchema = new mongoose.Schema(
  {
    version: {
      type: Number,
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
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

orderSchema.statics.build = (attrs: OrderAttrs): OrderDoc => {
  const { id, ...rest } = attrs;

  if (!isValidObjectId(id)) {
    throw new Error(`[Order.build] Invalid ObjectId: ${id}`);
  }

  return new Order({
    _id: id,
    ...rest,
  });
};

orderSchema.statics.findByEvent = async (event: {
  id: string;
  version: number;
}): Promise<OrderDoc | null> => {
  return Order.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
