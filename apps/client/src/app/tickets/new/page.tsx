'use client';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { Button } from '~/components';
import { buildClient } from '~/http';
import { toastErrors } from '~/utils';

export default function NewTicketPage() {
  const router = useRouter();
  const client = buildClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const price = +parseFloat(formData.get('price') as string).toFixed(2);

    await client
      .post('/api/tickets', {
        title,
        price,
      })
      .then((res) => {
        if (res.ok) {
          toast.success('Ticket created successfully!');
          router.push('/');
          router.refresh();
        } else {
          toastErrors(res.errors);
        }
      });
  };

  return (
    <div>
      <h1 className="mb-2 text-lg font-bold">Create a new ticket</h1>
      <form className="flex flex-col items-start gap-4" onSubmit={handleSubmit}>
        <div className="flex w-[320px] flex-col gap-2">
          <label htmlFor="title" className="text-sm font-light">
            Title
          </label>
          <input
            className="rounded-md border border-black px-2 py-1"
            type="text"
            name="title"
            placeholder="Title"
            required
          />
        </div>

        <div className="flex w-[320px] flex-col gap-2">
          <label htmlFor="price" className="text-sm font-light">
            Price
          </label>
          <input
            className="rounded-md border border-black px-2 py-1"
            type="text"
            name="price"
            placeholder="Price"
            required
            onBlur={(e) => {
              try {
                if (!e.currentTarget.value) return;

                const userInput = Math.round(parseFloat(e.currentTarget.value) * 100) / 100;

                if (isNaN(userInput)) throw new Error('Invalid price value');

                e.currentTarget.value = userInput.toFixed(2);
              } catch (err) {
                toast.error('Invalid price value');
              }
            }}
          />
        </div>

        <Button type="submit">Create</Button>
      </form>
    </div>
  );
}
