'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Eye, Edit2, BookPlus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import axios from '@/lib/axios';

interface Guide {
  _id: string;
  name: string;
  description: string;
  steps_count: number;
  created_at: string;
  updated_at: string;
  status?: 'published' | 'draft';
  steps?: string[];
}

interface RawContent {
  _id: string;
  type: string;
  link: string;
  filename?: string;
  placement?: string[];
}

interface RawStep {
  _id: string;
  contents?: RawContent[];
}

interface RawGuide {
  _id: string;
  name: string;
  description: string;
  steps?: RawStep[];
}

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const [deleteGuideId, setDeleteGuideId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchGuides();
    }
  }, [mounted]);

  const fetchGuides = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get('/get-all-guides');
      console.log('Fetched guides:', data);
      const processedGuides = Array.isArray(data) 
        ? data.map((guide: RawGuide) => ({
            ...guide,
            steps: guide.steps?.map((step: RawStep) => ({
              ...step,
              contents: step.contents?.map((content: RawContent) => ({
                _id: content._id,
                type: content.type,
                link: content.link,
                filename: content.filename,
                placement: content.placement || []
              }))
            }))
          }))
        : data.guides?.map((guide: RawGuide) => ({
            ...guide,
            steps: guide.steps?.map((step: RawStep) => ({
              ...step,
              contents: step.contents?.map((content: RawContent) => ({
                _id: content._id,
                type: content.type,
                link: content.link,
                filename: content.filename,
                placement: content.placement || []
              }))
            }))
          })) || [];
      console.log('Processed guides:', processedGuides);
      setGuides(processedGuides);
    } catch (error) {
      console.error('Error fetching guides:', error);
      toast.error('Failed to fetch guides');
      setGuides([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getDetailsPath = (guideId: string) => {
    return isAdmin
      ? `/admin/guides/manage/${guideId}`
      : `/creators/guides/manage/${guideId}`;
  };

  const getCreatePath = () => {
    return isAdmin ? '/admin/guides/new' : '/creators/guides/new';
  };

  const getEditPath = (guideId: string) => {
    return isAdmin
      ? `/admin/guides/edit/${guideId}`
      : `/creators/guides/edit/${guideId}`;
  };

  const handleDeleteGuide = (guideId: string) => {
    setDeleteGuideId(guideId);
  };

  const confirmDeleteGuide = async () => {
    if (!deleteGuideId) return;
    
    try {
      await axios.post(`/delete-guide/${deleteGuideId}`);
      toast.success('Guide deleted successfully');
      fetchGuides();
    } catch (error) {
      console.error('Error deleting guide:', error);
      toast.error('Failed to delete guide');
    } finally {
      setDeleteGuideId(null);
    }
  };

  const filteredGuides = guides.filter(guide =>
    guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center py-12">
          <p className="text-khaki">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-olive">Manage Guides</h1>
              <div className="mt-4 flex items-center space-x-4">
                <div className="max-w-md relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-khaki" />
                  <input
                    type="text"
                    placeholder="Search guides..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-brass-light/20 focus:outline-none focus:ring-1 focus:ring-brass-light text-olive-dark placeholder-khaki/50"
                  />
                </div>
                <button className="inline-flex items-center px-4 py-2 bg-white border border-brass-light/20 text-olive hover:bg-olive-light/10 rounded-lg text-sm font-medium transition-colors duration-200">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Guides Grid */}
          <div className="grid gap-6">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-khaki">Loading guides...</p>
              </div>
            ) : filteredGuides.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-khaki mx-auto mb-4" />
                <h3 className="text-lg font-medium text-olive">No Guides Found</h3>
                <p className="mt-2 text-khaki-dark">Get started by creating your first maintenance guide.</p>
                <Link
                  href={getCreatePath()}
                  className="inline-flex items-center px-6 py-3 mt-6 bg-brass hover:bg-brass-light text-olive-dark rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  <BookPlus className="w-4 h-4 mr-2" />
                  Create New Guide
                </Link>
              </div>
            ) : (
              filteredGuides.map((guide) => (
                <div
                  key={`guide-${guide._id}-${guide.name.replace(/\s+/g, '-')}`}
                  className="bg-white rounded-lg shadow-sm border border-brass-light/20 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <BookOpen className="w-6 h-6 text-olive" />
                          <h3 className="text-lg font-semibold text-olive">{guide.name}</h3>
                        </div>
                        <p className="mt-2 text-khaki-dark">{guide.description}</p>
                        <div className="mt-4 flex items-center space-x-4 text-sm">
                          <span className="text-khaki">
                            Last modified: {new Date(guide.created_at || '').toLocaleDateString()}
                          </span>
                          <span className="text-khaki">
                            Steps: {guide.steps_count || 0}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            guide.status === 'published'
                              ? 'bg-olive-light/10 text-olive'
                              : 'bg-khaki-light/10 text-khaki'
                          }`}>
                            {(guide.status || 'draft').charAt(0).toUpperCase() + (guide.status || 'draft').slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        <Link
                          href={getDetailsPath(guide._id)}
                          className="p-2 text-khaki hover:text-brass hover:bg-olive-light/10 rounded-lg transition-colors flex items-center"
                          title="View Guide Details"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>

                        <Link
                          href={getEditPath(guide._id)}
                          className="p-2 text-khaki hover:text-brass hover:bg-olive-light/10 rounded-lg transition-colors flex items-center"
                          title="Edit Guide"
                        >
                          <Edit2 className="w-5 h-5" />
                        </Link>

                        {/* Delete button - only visible to admin */}
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteGuide(guide._id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center"
                            title="Delete Guide"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteGuideId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-olive mb-4">
              Delete Guide
            </h3>
            <p className="text-khaki-dark mb-6">
              Are you sure you want to delete this guide? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteGuideId(null)}
                className="px-4 py-2 text-sm font-medium text-khaki hover:text-khaki-dark transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteGuide}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}