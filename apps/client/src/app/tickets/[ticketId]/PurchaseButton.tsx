'use client';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { Button } from '~/components';
import { buildClient } from '~/http';
import { toastErrors } from '~/utils';

interface Props {
  ticketId: string;
  disabled: boolean;
}

export const PurchaseButton: React.FC<Props> = ({ ticketId, disabled }) => {
  const router = useRouter();
  const client = buildClient();
  const handlePurchase = async () => {
    await client.post('/api/orders', { ticketId }).then((res) => {
      if (res.ok) {
        toast.success('Order created successfully');
        router.refresh();
      } else {
        toastErrors(res.errors);
      }
    });
  };

  return (
    <Button disabled={disabled} onClick={handlePurchase}>
      Purchase
    </Button>
  );
};
