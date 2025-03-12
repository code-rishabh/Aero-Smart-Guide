'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useUser } from '@/context/UserContext';

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      console.log('No user found, redirecting to login');
      router.replace('/login');
      return;
    }

    const isAdmin = user.role === 0;
    const isAdminPath = pathname.startsWith('/admin');
    const isCreatorPath = pathname.startsWith('/creators');

    // Redirect based on role
    if (isAdminPath && !isAdmin) {
      console.log('Non-admin accessing admin path, redirecting to creators');
      router.replace('/creators');
    } else if (isCreatorPath && isAdmin) {
      console.log('Admin accessing creator path, redirecting to admin');
      router.replace('/admin');
    }
  }, [user, pathname, router]);

  if (!user) return null;

  return (
    <DashboardLayout isAdmin={user.role === 0}>
      {children}
    </DashboardLayout>
  );
} 