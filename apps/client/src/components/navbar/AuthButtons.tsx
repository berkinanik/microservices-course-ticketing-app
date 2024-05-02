'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { type CurrentUser } from '~/@types';
import { buildClient } from '~/http';

interface Props {
  currentUser: CurrentUser;
}

export const AuthButtons: React.FC<Props> = ({ currentUser }) => {
  const client = buildClient();
  const router = useRouter();

  const handleSignout = async () => {
    await client
      .post('/api/users/signout')
      .then(() => {
        toast.success('Signed out successfully!');
        router.push('/');
        router.refresh();
      })
      .catch(() => {
        toast.error('Failed to logout');
      });
  };

  return (
    <ul className="flex flex-row gap-4">
      {currentUser ? (
        <>
          <li>
            <button onClick={handleSignout}>Sign out</button>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link href="/auth/signup">Sign Up</Link>
          </li>
          <li>
            <Link href="/auth/signin">Sign In</Link>
          </li>
        </>
      )}
    </ul>
  );
};
