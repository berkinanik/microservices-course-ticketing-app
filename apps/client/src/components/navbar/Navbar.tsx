import Link from 'next/link';

import { AuthButtons } from './AuthButtons';

import { type CurrentUser } from '~/@types';

interface Props {
  currentUser: CurrentUser;
}

export const Navbar: React.FC<Props> = ({ currentUser }) => {
  return (
    <nav className="w-full bg-cyan-700">
      <div className="mx-auto flex max-w-[1200px] flex-row justify-between p-4">
        <div className="flex flex-row gap-4">
          <Link href="/">Home</Link>

          {currentUser && <Link href="/orders">Orders</Link>}
        </div>

        <AuthButtons currentUser={currentUser} />
      </div>
    </nav>
  );
};
