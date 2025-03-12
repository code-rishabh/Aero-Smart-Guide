'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { 
  BookOpen, 
  Video, 
  Music, 
  ArrowLeft, 
  Image as ImageIcon, 
  FileText, 
  Box,
  FileAudio
} from 'lucide-react';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import QRCodeDisplay from '@/components/QRCodeDisplay';

interface Content {
  _id: string;
  type: string;
  link: string;
  filename?: string;
  placement: string[];
}

interface Step {
  _id: string;
  description: string;
  buffer?: {
    type: string;
    data: number[];
  };
  created_at: string;
  updated_at: string;
  contents: Content[];
}

interface Guide {
  _id: string;
  name: string;
  description: string;
  icon: string;
  welcome_audio: string;
  steps: Step[];
  guide_id: number;
  created_at: string;
  updated_at: string;
  qrCodeUrl?: string;
}

export default function GuideDetailsPage() {
  const [mounted, setMounted] = useState(false);
  const [guide, setGuide] = useState<Guide | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = pathname.includes('/admin/');

  const getBackPath = () => {
    return isAdmin
      ? '/admin/guides/manage'
      : '/creators/guides/manage';
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const fetchGuideDetails = async () => {
      try {
        const { data } = await axios.get(`/guide-info?id=${params.id}`);
        if (data.status) {
          const guide = {
            ...data.guide,
            steps: data.guide.steps.map((step: Step) => ({
              ...step,
              contents: step.contents.map((content: Omit<Content, '_id'> & { _id?: string }) => ({
                _id: content._id,
                type: content.type,
                link: content.link,
                filename: content.filename,
                placement: content.placement || []
              }))
            }))
          };
          setGuide(guide);
        } else {
          toast.error('Failed to fetch guide details');
        }
      } catch (error) {
        console.error('Error fetching guide details:', error);
        toast.error('Error fetching guide details');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchGuideDetails();
    }
  }, [params.id, router, isAdmin, mounted]);

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-khaki">Loading guide details...</div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-khaki">Guide not found</div>
      </div>
    );
  }

  const ContentTypeIcon = ({ type }: { type: string }) => {
    switch (type.toLowerCase()) {
      case 'video':
        return <Video className="w-5 h-5 text-brass-light" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-brass-light" />;
      case 'audio':
        return <FileAudio className="w-5 h-5 text-brass-light" />;
      case 'document':
        return <FileText className="w-5 h-5 text-brass-light" />;
      case '3d':
        return <Box className="w-5 h-5 text-brass-light" />;
      default:
        return <FileText className="w-5 h-5 text-brass-light" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with back button */}
        <div className="flex items-center space-x-4 mb-6">
          <Link
            href={getBackPath()}
            className="p-2 hover:bg-olive-light/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-olive" />
          </Link>
          <h1 className="text-2xl font-bold text-olive">Guide Details: {guide?.name}</h1>
        </div>

        {/* Guide Info */}
        <div className="bg-white rounded-lg shadow border border-brass-light/20 p-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-lg bg-brass-light/20 flex items-center justify-center">
              {guide?.icon ? (
                <Image 
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${guide.icon.split('/').pop()}`}
                  alt="Guide Icon" 
                  width={64}
                  height={64}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <BookOpen className="w-8 h-8 text-brass-light" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-khaki-dark">{guide?.description}</p>
              {guide?.welcome_audio && (
                <div className="mt-4 flex items-center text-sm text-khaki">
                  <Music className="w-4 h-4 mr-2" />
                  Welcome Audio Available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Steps with Contents */}
        <div className="bg-white rounded-lg shadow border border-brass-light/20 p-6">
          <h2 className="text-lg font-semibold text-olive mb-4">Steps</h2>
          <div className="space-y-6">
            {guide?.steps.map((step, index) => (
              <div key={step._id} className="border border-brass-light/20 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brass-light/20 flex items-center justify-center">
                    <span className="text-brass-light font-medium">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-olive">Step {index + 1}</h3>
                    <p className="text-sm text-khaki-dark">
                      {step.description || 'No description available'}
                    </p>
                    <p className="text-xs text-khaki mt-2">
                      Created: {new Date(step.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Step Contents */}
                {step.contents.length > 0 && (
                  <div className="mt-4 pl-14">
                    <h4 className="text-sm font-medium text-olive mb-2">Media Content</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {step.contents.map((content, index) => (
                        <div key={content._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <ContentTypeIcon type={content.type} />
                            <div>
                              <p className="text-sm font-medium text-olive">
                                {content.filename || content.link.split('/').pop() || `${content.type} ${index + 1}`}
                              </p>
                              <p className="text-xs text-khaki-dark truncate">{content.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <a 
                              href={content.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-brass hover:text-brass-light"
                            >
                              View Content
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* QR Code */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-olive mb-4">Guide QR Code</h3>
          <QRCodeDisplay 
            guideId={guide._id}
            guideName={guide.name} 
          />
        </div>
      </div>
    </div>
  );
} 