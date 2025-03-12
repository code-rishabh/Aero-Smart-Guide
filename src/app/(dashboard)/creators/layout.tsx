import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creator Dashboard - Aero Smart Guide',
  description: 'Manage guides and creators',
}

export default function CreatorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 