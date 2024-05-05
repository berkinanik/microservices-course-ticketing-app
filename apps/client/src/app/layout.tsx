import { type Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';

import { Toaster } from 'sonner';

import { type CurrentUserResponse } from '~/@types';
import { Navbar } from '~/components';
import { buildClientServer } from '~/http';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = buildClientServer(headers);
  const currentUser = await client
    .get<CurrentUserResponse>('/api/users/current-user')
    .then((res) => (res.ok ? res.data.currentUser : null));

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar currentUser={currentUser} />
        <main className="mx-auto max-w-[1200px] px-6 py-8">{children}</main>
        <Toaster visibleToasts={5} pauseWhenPageIsHidden />
      </body>
    </html>
  );
}
