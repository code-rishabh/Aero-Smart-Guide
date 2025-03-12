import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Aero Smart Guide',
  description: 'Manage guides and creators',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 