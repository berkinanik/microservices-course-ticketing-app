'use client';

import { useRouter } from 'next/navigation';

import StripeCheckout, { type Token } from 'react-stripe-checkout';
import { toast } from 'sonner';

import { type CurrentUser, type Order } from '~/@types';
import { buildClient } from '~/http';
import { toastErrors } from '~/utils';

interface Props {
  order: Order;
  stripeKey: string;
  currentUser: NonNullable<CurrentUser>;
}

export const CheckoutForm: React.FC<Props> = ({ order, stripeKey, currentUser }) => {
  const router = useRouter();
  const client = buildClient();

  const handleToken = async (token: Token): Promise<void> => {
    await client.post('/api/payments', { token: token.id, orderId: order.id }).then((res) => {
      if (res.ok) {
        toast.success('Payment successful');

        router.refresh();
      } else {
        toastErrors(res.errors);
      }
    });
  };

  return stripeKey ? (
    <StripeCheckout
      token={handleToken}
      stripeKey={stripeKey}
      amount={order.ticket.price * 100}
      email={currentUser.email}
    />
  ) : null;
};
