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
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-center
                sm:left-auto sm:right-6 sm:translate-x-0 sm:text-right
                sm:bottom-6 pointer-events-none select-none opacity-25">
  <p className="text-[8px] sm:text-[10px] text-gray-400 italic">
    Developed by
  </p>
  <p className="text-[10px] sm:text-xs font-bold tracking-[0.35em] text-primary-300">
    MAMUEDITS
  </p>
</div>
        {children}
      </body>
    </html>
  );
}
