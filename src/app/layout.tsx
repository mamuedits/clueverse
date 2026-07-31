import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ClueVerse - Secret Word Party Game',
  description: 'Play ClueVerse real-time party game with your friends. Turn-based clues, word hints, live discussion chat, and AI word pairs!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-gray-100 min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
