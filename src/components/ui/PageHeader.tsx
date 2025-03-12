'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-olive-light/10 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-olive" />
        </button>
        <h1 className="text-2xl font-bold text-olive">{title}</h1>
        {description && <p className="text-olive">{description}</p>}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
} 