'use client';

import Link from 'next/link';
import { 
  BookOpen, 
  BookPlus, 
  Eye, 
  Edit2, 
  Trash2,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import { useState } from 'react';

interface Guide {
  id: string;
  title: string;
  description: string;
  lastModified: string;
  status: 'published' | 'draft';
  steps: number;
}

// Sample data - replace with actual data fetching
const sampleGuides: Guide[] = [
  {
    id: '1',
    title: 'Vehicle Maintenance Protocol XJ-238',
    description: 'Complete maintenance guide for XJ series vehicles including routine checks and advanced repairs.',
    lastModified: '2024-03-15',
    status: 'published',
    steps: 12
  },
  {
    id: '2',
    title: 'Emergency Response Procedures',
    description: 'Standard operating procedures for emergency response scenarios and equipment handling.',
    lastModified: '2024-03-14',
    status: 'draft',
    steps: 8
  },
  // Add more sample guides as needed
];

export default function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  const handleDeleteGuide = (guideId: string) => {
    // Implement delete functionality
    console.log('Deleting guide:', guideId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-olive">Maintenance Guides</h1>
            <p className="mt-2 text-khaki-dark">Manage and organize your maintenance guides</p>
          </div>
          <Link
            href="/creators/new-guide"
            className="inline-flex items-center px-6 py-3 bg-brass hover:bg-brass-light text-olive-dark rounded-lg text-sm font-medium transition-colors duration-200"
          >
            <BookPlus className="w-4 h-4 mr-2" />
            Create New Guide
          </Link>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-brass-light/20 p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-khaki" />
              <input
                type="text"
                placeholder="Search guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-brass-light/20 focus:outline-none focus:ring-1 focus:ring-brass-light text-olive-dark placeholder-khaki/50"
              />
            </div>
            <button className="inline-flex items-center px-4 py-2 bg-white border border-brass-light/20 text-olive hover:bg-olive-light/10 rounded-lg text-sm font-medium transition-colors duration-200">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid gap-6">
          {sampleGuides.map((guide) => (
            <div
              key={guide.id}
              className="bg-white rounded-lg shadow-sm border border-brass-light/20 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-6 h-6 text-olive" />
                      <h3 className="text-lg font-semibold text-olive">{guide.title}</h3>
                    </div>
                    <p className="mt-2 text-khaki-dark">{guide.description}</p>
                    <div className="mt-4 flex items-center space-x-4 text-sm">
                      <span className="text-khaki">Last modified: {guide.lastModified}</span>
                      <span className="text-khaki">Steps: {guide.steps}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        guide.status === 'published' 
                          ? 'bg-olive-light/10 text-olive' 
                          : 'bg-khaki-light/10 text-khaki'
                      }`}>
                        {guide.status.charAt(0).toUpperCase() + guide.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button 
                      className="p-2 text-khaki hover:text-brass hover:bg-olive-light/10 rounded-lg transition-colors"
                      title="View Guide"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-2 text-khaki hover:text-brass hover:bg-olive-light/10 rounded-lg transition-colors"
                      title="Edit Guide"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-2 text-khaki hover:text-brass hover:bg-olive-light/10 rounded-lg transition-colors"
                      title="Delete Guide"
                      onClick={() => handleDeleteGuide(guide.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sampleGuides.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-khaki mx-auto mb-4" />
            <h3 className="text-lg font-medium text-olive">No Guides Found</h3>
            <p className="mt-2 text-khaki-dark">Get started by creating your first maintenance guide.</p>
            <Link
              href="/creators/new-guide"
              className="inline-flex items-center px-6 py-3 mt-6 bg-brass hover:bg-brass-light text-olive-dark rounded-lg text-sm font-medium transition-colors duration-200"
            >
              <BookPlus className="w-4 h-4 mr-2" />
              Create New Guide
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}