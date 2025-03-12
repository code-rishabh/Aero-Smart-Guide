'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Image as ImageIcon, 
  Video, 
  FileAudio, 
  FileText, 
  Box,
  X,
  Trash2,
  Eye,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import PageHeader from '@/components/ui/PageHeader';
import Image from 'next/image';
import StepDescription from './components/StepDescription';
import { generateQRCode } from '@/utils/qrcode';
import QRCodeModal from '@/components/QRCodeModal';

interface Content {
  type: 'image' | 'video' | 'audio' | '3d' | 'document';
  link: string;
  filename?: string;
}

interface Step {
  id: string;
  name: string;
  welcome_audio: string;
  description: string;
  contents: Content[];
}

interface GuideData {
  name: string;
  description: string;
  steps: Step[];
}

interface GuideResponse {
  status: boolean;
  guide: {
    _id: string;
    name: string;
    description: string;
    steps: {
      _id: string;
      name: string;
      welcome_audio: string;
      description: string;
      contents: {
        _id: string;
        type: string;
        link: string;
        placement: string[];
      }[];
      created_at: string;
      updated_at: string;
    }[];
    created_at: string;
    updated_at: string;
  };
}

export default function NewGuidePage() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Determine if we're in edit mode and get the guide ID from the URL
  const isEditMode = pathname.includes('/edit/');
  const guideId = isEditMode ? pathname.split('/').pop() : null;

  const [guideData, setGuideData] = useState<GuideData>({
    name: '',
    description: '',
    steps: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadType, setUploadType] = useState<Content['type']>('image');
  const [uploadingStepId, setUploadingStepId] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [createdGuideId, setCreatedGuideId] = useState<string>('');
  const [basePath] = useState(pathname.startsWith('/admin') ? '/admin' : '/creators');

  // Update the useEffect to use isEditMode
  useEffect(() => {
    if (isEditMode && guideId) {
      fetchGuideDetails();
    }
  }, [isEditMode, guideId]);

  const fetchGuideDetails = async () => {
    try {
      const { data } = await axios.get(`/guide-info?id=${guideId}`);
      if (data.status && data.guide) {
        // Map the guide data to include filenames
        const formattedGuide = {
          name: data.guide.name,
          description: data.guide.description,
          steps: data.guide.steps.map((step: any) => ({
            id: step._id,
            name: step.name,
            welcome_audio: step.welcome_audio,
            description: step.description,
            contents: step.contents.map((content: any) => ({
              type: content.type,
              link: content.link,
              filename: content.filename || content.link.split('/').pop() || '', // Map filename from existing content
            }))
          }))
        };

        setGuideData(formattedGuide);
        
        // Set the first step as selected if there are steps
        if (formattedGuide.steps.length > 0) {
          setSelectedStepId(formattedGuide.steps[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching guide details:', error);
      toast.error('Failed to fetch guide details');
    }
  };

  const addNewStep = () => {
    const newStep: Step = {
      id: `step-${Date.now()}`,
      name: `Step ${guideData.steps.length + 1}`,
      welcome_audio: '',
      description: '',
      contents: []
    };
    setGuideData(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
    setSelectedStepId(newStep.id);
  };

  const updateStep = (stepId: string, updates: Partial<Step>) => {
    setGuideData(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
      )
    }));
  };

  const removeContent = (stepId: string, contentIndex: number) => {
    setGuideData(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
      step.id === stepId
          ? { ...step, contents: step.contents.filter((_, idx) => idx !== contentIndex) }
        : step
      )
    }));
  };

  // Handle file upload
  const handleFileUpload = async (file: File): Promise<{ url: string; filename: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await axios.post('/upload-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.status) {
        return {
          url: data.file_url,
          filename: data.file_name
        };
      }
      throw new Error(data.message || 'Upload failed');
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  // Add this helper function at the top of the file
  const getDisplayFileName = (filename: string) => {
    // First try to get filename from the full path
    const nameFromPath = filename.split('/').pop() || filename;
    // Then remove the extension
    return nameFromPath.replace(/\.[^/.]+$/, '');
  };

  // Update submit handler to use isEditMode
  const handleSubmitGuide = async () => {
    console.log('Submit guide triggered');  // Log 1
    
    if (!guideData.name.trim()) {
      toast.error('Please enter a guide title');
      return;
    }

    if (guideData.steps.length === 0) {
      toast.error('Please add at least one step');
      return;
    }

    // Validate steps
    for (const step of guideData.steps) {
      if (!step.name.trim() || !step.description.trim()) {
        toast.error('Please fill in all step details');
        return;
      }
      if (step.contents.length === 0) {
        toast.error(`Please add at least one content item to ${step.name}`);
        return;
      }
      for (const content of step.contents) {
        if (!content.link.trim()) {
          toast.error(`Please provide a link for all content in ${step.name}`);
          return;
        }
      }
    }

    console.log('Initial guide data:', guideData);  // Log 2
    setIsSubmitting(true);

    try {
      const formattedData = {
        ...guideData,
        steps: guideData.steps.map(({ ...step }) => ({
          ...step,
          contents: step.contents.map(content => ({
            type: content.type,
            link: content.link,
            filename: content.filename,
            placement: []
          }))
        }))
      };

      console.log('Formatted data:', formattedData);  // Log 3
      console.log('Formatted data (JSON):', JSON.stringify(formattedData, null, 2));  // Log 4

      const endpoint = isEditMode 
        ? `/edit-guide/${guideId}`
        : '/add-guide';

      console.log('Sending to endpoint:', endpoint);  // Log 5
      
      const response = await axios.post(endpoint, formattedData);
      console.log('Response from server:', response.data);  // Log 6
      
      toast.success(`Guide ${isEditMode ? 'updated' : 'created'} successfully`);
      
      setCreatedGuideId(response.data.guide._id);
      setShowQRModal(true);

    } catch (error) {
      console.error(`Guide ${isEditMode ? 'update' : 'creation'} error:`, error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} guide`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the media button click handler
  const handleMediaButtonClick = async (stepId: string, type: Content['type']) => {
    if (!fileInputRef.current) return;
    
    setUploadType(type);
    setUploadingStepId(stepId);
    fileInputRef.current.click();
  };

  // Update the file change handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingStepId) return;

    try {
      const { url, filename } = await handleFileUpload(file);
      
      setGuideData(prev => ({
        ...prev,
        steps: prev.steps.map(step => 
          step.id === uploadingStepId
            ? {
                ...step,
                contents: [...step.contents, {
                  type: uploadType,
                  link: url,
                  filename: filename
                }]
              }
            : step
        )
      }));

      toast.success('File uploaded successfully');
    } catch (error) {
    console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setUploadingStepId(null);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50">
      <div className="border-b border-brass-light/20 px-4 py-3">
        <PageHeader title={isEditMode ? 'Edit Guide' : 'Create New Guide'}>
          <button
            onClick={handleSubmitGuide}
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 bg-transparent border border-brass hover:bg-brass-light text-olive-dark rounded-lg text-sm font-medium transition-colors duration-200"
          >
            {isSubmitting 
              ? `${isEditMode ? 'Updating' : 'Creating'} Guide...` 
              : `${isEditMode ? 'Update' : 'Create'} Guide`}
          </button>
        </PageHeader>

        {/* Add Guide Title and Description */}
        <div className="mt-4 space-y-4 max-w-3xl">
          <div>
            <input
              type="text"
              value={guideData.name}
              onChange={(e) => setGuideData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter guide title"
              className="w-full rounded-lg bg-white/90 border border-brass-light/20 px-3 py-2 text-olive-dark placeholder-khaki/50 focus:outline-none focus:ring-1 focus:ring-brass-light"
            />
          </div>
          <div>
            <textarea
              value={guideData.description}
              onChange={(e) => setGuideData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter guide description"
              rows={2}
              className="w-full rounded-lg bg-white/90 border border-brass-light/20 px-3 py-2 text-olive-dark placeholder-khaki/50 focus:outline-none focus:ring-1 focus:ring-brass-light"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Steps Sidebar */}
        <div className="w-80 border-r border-brass-light/20 flex flex-col">
          <div className="p-4 border-b border-brass-light/20">
            <button
              onClick={addNewStep}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-brass-light hover:bg-brass text-olive-dark rounded-lg text-sm font-medium transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Step
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {guideData.steps.map((step, index) => (
              <div
                key={step.id}
                onClick={() => setSelectedStepId(step.id)}
                className={`
                  p-3 rounded-lg cursor-pointer transition-colors
                  ${selectedStepId === step.id 
                    ? 'bg-olive-light/20 border border-brass-light/20' 
                    : 'hover:bg-olive-light/10'}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-brass text-olive rounded flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-olive truncate">{step.name || 'Untitled Step'}</h3>
                      <p className="text-xs text-khaki-dark truncate">{step.contents.length} media items</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newSteps = guideData.steps.filter(s => s.id !== step.id);
                      setGuideData(prev => ({ ...prev, steps: newSteps }));
                    }}
                    className="text-khaki-dark hover:text-brass-light transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          {selectedStepId ? (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto  rounded-lg shadow-lg border border-brass-light/20 p-6">
                {guideData.steps.find(step => step.id === selectedStepId) && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-khaki-dark">Step Title</label>
                      <input
                        type="text"
                        value={guideData.steps.find(step => step.id === selectedStepId)?.name}
                        onChange={(e) => updateStep(selectedStepId, { name: e.target.value })}
                        className="mt-1 block w-full rounded-lg bg-white/90 border border-brass-light/20 px-3 py-2 text-olive-dark placeholder-khaki/50 focus:outline-none focus:ring-1 focus:ring-brass-light"
                        placeholder="Enter step title"
                      />
                    </div>

                    <div>
                      <StepDescription
                        description={guideData.steps.find(step => step.id === selectedStepId)?.description || ''}
                        welcomeAudio={guideData.steps.find(step => step.id === selectedStepId)?.welcome_audio || ''}
                        isEditMode={isEditMode}
                        stepId={selectedStepId}
                        onDescriptionChange={(newDesc) => updateStep(selectedStepId, { description: newDesc })}
                        onAudioSelect={(audioUrl) => updateStep(selectedStepId, { welcome_audio: audioUrl })}
                      />
                    </div>

                    {/* Media Upload Grid */}
                    <div>
                      <label className="block text-sm font-medium text-khaki-dark mb-3">Media Files</label>
                      <div className="grid grid-cols-5 gap-3">
                        {[
                          { icon: ImageIcon, type: 'image' as const, label: 'Image' },
                          { icon: Video, type: 'video' as const, label: 'Video' },
                          { icon: FileAudio, type: 'audio' as const, label: 'Audio' },
                          { icon: Box, type: '3d' as const, label: '3D Model' },
                          { icon: FileText, type: 'document' as const, label: 'Document' }
                        ].map((item) => (
                          <button 
                            key={item.type}
                            onClick={() => handleMediaButtonClick(selectedStepId!, item.type)}
                            className="group flex flex-col items-center justify-center p-3 border border-brass-light/20 rounded-lg hover:bg-brass-light/5 transition-all hover:border-brass-light bg-white/90"
                          >
                            <item.icon className="w-5 h-5 text-khaki group-hover:text-brass transition-colors" />
                            <span className="mt-1 text-xs text-khaki group-hover:text-brass transition-colors">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Media Preview */}
                    {guideData.steps.find(step => step.id === selectedStepId)?.contents.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-khaki-dark mb-3">Uploaded Media</label>
                        <div className="grid grid-cols-3 gap-4">
                          {guideData.steps.find(step => step.id === selectedStepId)?.contents.map((item, i) => (
                            <div key={i} className="group relative bg-white rounded-lg border border-brass-light/20 overflow-hidden hover:border-brass-light transition-all">
                              <div className="p-3">
                                <div className="flex items-start space-x-3">
                                  {/* File Type Icon */}
                                  <div className="p-2 bg-brass-light/10 rounded">
                                    {item.type === 'image' && <ImageIcon className="w-4 h-4 text-brass" />}
                                    {item.type === 'video' && <Video className="w-4 h-4 text-brass" />}
                                    {item.type === 'audio' && <FileAudio className="w-4 h-4 text-brass" />}
                                    {item.type === '3d' && <Box className="w-4 h-4 text-brass" />}
                                    {item.type === 'document' && <FileText className="w-4 h-4 text-brass" />}
                                  </div>
                                  
                                  {/* File Info */}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-olive truncate">
                                      {getDisplayFileName(item.filename || item.link)}
                                    </p>
                                    <p className="text-xs text-khaki mt-0.5 capitalize">{item.type}</p>
                                  </div>
                                </div>

                                {/* Preview Area */}
                                {item.type === 'image' && (
                                  <div className="mt-3 relative aspect-video w-full overflow-hidden rounded">
                                    <Image
                                      src={item.link}
                                      alt={item.filename || 'Preview'}
                                      fill
                                      unoptimized
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                            </div>

                              {/* Action Buttons */}
                              <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => window.open(item.link, '_blank')}
                                  className="p-1.5 bg-olive-light/10 rounded text-olive hover:bg-olive-light/20 transition-colors"
                                  title="Preview"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                              </button>
                                <button 
                                  onClick={() => {
                                    if (confirm('Are you sure you want to remove this media?')) {
                                      removeContent(selectedStepId, i);
                                    }
                                  }}
                                  className="p-1.5 bg-olive-light/10 rounded text-red-400 hover:bg-red-50 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-khaki">
              <div className="text-center">
                <h3 className="text-lg font-medium">No Step Selected</h3>
                <p className="mt-1">Select a step from the sidebar or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept={
          uploadType === 'image' ? 'image/*' :
          uploadType === 'video' ? 'video/*' :
          uploadType === 'audio' ? 'audio/*' :
          uploadType === 'document' ? '.pdf,.doc,.docx' :
          uploadType === '3d' ? '.glb,.gltf' :
          undefined
        }
      />

      {showQRModal && (
        <QRCodeModal
          guideId={createdGuideId}
          guideName={guideData.name}
          onDownload={() => {
            setShowQRModal(false);
            router.push(`${basePath}/guides/manage`);
          }}
          onClose={() => {
            if (confirm('Are you sure? The QR code is required for VR access.')) {
              setShowQRModal(false);
              router.push(`${basePath}/guides/manage`);
            }
          }}
        />
      )}
    </div>
  );
} 