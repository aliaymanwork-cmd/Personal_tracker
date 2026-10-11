import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Pulse — AI Health Tracker', description: 'Your personal nutrition, movement, strength and recovery dashboard.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
