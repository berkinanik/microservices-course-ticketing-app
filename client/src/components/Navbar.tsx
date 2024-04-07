import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav className="w-full bg-cyan-700">
      <div className="mx-auto flex max-w-[1200px] flex-row justify-between p-4">
        <div>
          <Link href="/">Home</Link>
        </div>

        <div>Sign Out</div>
      </div>
    </nav>
  );
};
