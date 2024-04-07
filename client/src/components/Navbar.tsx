import Link from 'next/link';

interface Props {
  currentUser: { id: string; email: string } | null;
}

export const Navbar: React.FC<Props> = ({ currentUser }) => {
  return (
    <nav className="w-full bg-cyan-700">
      <div className="mx-auto flex max-w-[1200px] flex-row justify-between p-4">
        <div>
          <Link href="/">Home</Link>
        </div>

        {currentUser ? <div>Sign Out</div> : null}
      </div>
    </nav>
  );
};
