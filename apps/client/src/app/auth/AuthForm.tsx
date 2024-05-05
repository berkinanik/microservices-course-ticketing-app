'use client';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { Button } from '~/components';
import { buildClient } from '~/http';

interface Props {
  action: 'signUp' | 'signIn';
}

export const AuthForm: React.FC<Props> = ({ action }) => {
  const router = useRouter();
  const client = buildClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    await client
      .post<{
        user: {
          id: string;
          email: string;
        };
      }>(`/api/users/${action}`, {
        email,
        password,
      })
      .then((res) => {
        if (res.ok) {
          toast.success(
            action === 'signUp' ? 'Account created successfully!' : 'Signed in successfully!',
          );
          router.push('/');
          router.refresh();
        } else {
          for (const error of res.errors) {
            toast.error(`${error.field ? `Error in ${error.field}:<br />` : ''}${error.message}`);
          }
        }
      });
  };

  return (
    <form className="flex flex-col items-start gap-4" onSubmit={handleSubmit}>
      <h1 className="text-xl font-medium">{action === 'signIn' ? 'Sign In' : 'Sign Up'}</h1>
      <span className="h-[1px] w-full bg-black" />
      <div className="flex w-[320px] flex-col gap-2">
        <label htmlFor="email" className="text-sm font-light">
          Email Address
        </label>
        <input
          className="rounded-md border border-black px-2 py-1"
          type="text"
          name="email"
          autoComplete="email"
          placeholder="Email"
          required
        />
      </div>
      <div className="flex w-[320px] flex-col gap-2">
        <label htmlFor="password" className="text-sm font-light">
          Password
        </label>
        <input
          className="rounded-md border border-black px-2 py-1"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Password"
          required
        />
      </div>
      <Button type="submit">{action === 'signIn' ? 'Sign In' : 'Sign Up'}</Button>
    </form>
  );
};
