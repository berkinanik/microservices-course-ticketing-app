import Link from 'next/link';

import { type Order } from '~/@types';
import { Button } from '~/components';
import { OrderStatus } from '~/constants';

interface Props {
  order: Order;
}

export const OrderInfo: React.FC<Props> = ({ order }) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-semibold">Great choice!</h2>

      {order.status === OrderStatus.Created && (
        <>
          <p>Please refresh the page to see the payment options.</p>
        </>
      )}

      {order.status === OrderStatus.AwaitingPayment && (
        <>
          <p>Your order is awaiting payment.</p>
          {/* TODO expiration timer */}
          <Link href={`/orders/${order.id}`}>
            <Button>Pay now</Button>
          </Link>
        </>
      )}

      {order.status === OrderStatus.Complete && (
        <>
          <p>Your order is complete.</p>
          <p>Enjoy the event!</p>
        </>
      )}
    </div>
  );
};
