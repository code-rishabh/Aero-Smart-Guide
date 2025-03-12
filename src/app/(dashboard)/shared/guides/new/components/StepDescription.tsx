'use client';

import { useState, useEffect, useRef } from 'react';
import { Edit2, Check, Volume2, Play, Pause } from 'lucide-react';
// import axios from '@/lib/axios';
import toast from 'react-hot-toast';

interface StepDescriptionProps {
  description: string;
  welcomeAudio: string;
  isEditMode?: boolean;
  stepId: string;
  onDescriptionChange: (description: string) => void;
  onAudioSelect: (audioUrl: string) => void;
}

export default function StepDescription({ 
  description, 
  welcomeAudio,
  isEditMode = false,
  stepId,
  onDescriptionChange,
  onAudioSelect 
}: StepDescriptionProps) {
  const [isEditing, setIsEditing] = useState(!isEditMode);
  const [generatedAudios, setGeneratedAudios] = useState<{ [key: string]: string[] }>({});
  const [selectedAudio, setSelectedAudio] = useState<string | null>(welcomeAudio || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const TTS_BASE_URL = 'https://6fea-103-197-74-186.ngrok-free.app';
  // const TTS_BASE_URL = 'https://6143-2409-40c2-1044-150-1183-a2cd-36ec-60c5.ngrok-free.app';

  const handleConfirmDescription = () => {
    if (!description.trim()) {
      toast.error('Please enter a description first');
      return;
    }
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setGeneratedAudios(prev => ({
      ...prev,
      [stepId]: []
    }));
    setSelectedAudio(null);
  };

  const handleGenerateSpeech = async () => {
    if (!description.trim()) {
      toast.error('Please enter a description first');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(`${TTS_BASE_URL}/generate-audio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          text: description
        })
      });

      const data = await response.json();

      if (data.file_path) {
        // Ensure we have the complete URL
        const fullUrl = data.file_path.startsWith('http') 
          ? data.file_path 
          : `${TTS_BASE_URL}${data.file_path.startsWith('/') ? '' : '/'}${data.file_path}`;

        console.log('Generated audio URL:', fullUrl);

        setGeneratedAudios(prev => ({
          ...prev,
          [stepId]: [...(prev[stepId] || []), fullUrl]
        }));

        toast.success('Audio generated successfully');
      } else {
        throw new Error('No audio file path in response');
      }
    } catch (error) {
      console.error('Error generating audio:', error);
      toast.error('Failed to generate audio');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAudioSelect = (audioUrl: string) => {
    setSelectedAudio(audioUrl);
    onAudioSelect(audioUrl);
    toast.success('Audio selected');
  };

  const togglePlay = async (audioUrl: string) => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
      }

      if (playingAudio === audioUrl) {
        audioRef.current.pause();
        setPlayingAudio(null);
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        audioRef.current = new Audio(audioUrl);
        await audioRef.current.play();
        setPlayingAudio(audioUrl);

        // Handle audio ending
        audioRef.current.onended = () => {
          setPlayingAudio(null);
        };
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      toast.error('Failed to play audio');
    }
  };

  const currentStepAudios = generatedAudios[stepId] || [];

  // Add cleanup for blob URLs when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup blob URLs
      Object.values(generatedAudios).flat().forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [generatedAudios]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-khaki-dark">Description</label>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <button
              onClick={handleConfirmDescription}
              className="inline-flex items-center px-3 py-1.5 bg-olive text-white rounded-lg text-sm transition-colors hover:bg-olive-dark"
            >
              <Check className="w-4 h-4 mr-1" />
              Confirm
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-3 py-1.5 bg-brass text-white rounded-lg text-sm transition-colors hover:bg-brass-light"
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
            </button>
          )}
        </div>
      </div>

      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        disabled={!isEditing}
        rows={4}
        className={`w-full rounded-lg px-3 py-2 text-olive-dark ${
          isEditing 
            ? 'bg-white border border-brass-light/20 focus:outline-none focus:ring-1 focus:ring-brass-light' 
            : 'bg-gray-50 border-transparent'
        }`}
        placeholder="Enter step description"
      />

      {!isEditing && (
        <div className="space-y-4">
          {welcomeAudio && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-khaki-dark mb-2">Current Welcome Audio</label>
              <div className="p-3 rounded-lg border border-brass-light/20 bg-white">
                <audio 
                  controls 
                  src={welcomeAudio}
                  className="w-full"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={handleGenerateSpeech}
              disabled={currentStepAudios.length >= 3 || isGenerating}
              className="inline-flex items-center px-3 py-1.5 bg-brass text-white rounded-lg text-sm transition-colors hover:bg-brass-light disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Audio...
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 mr-1" />
                  {currentStepAudios.length > 0 ? 'Regenerate' : 'Generate'} Speech 
                  ({currentStepAudios.length}/3)
                </>
              )}
            </button>
          </div>

          {currentStepAudios.length > 0 && (
            <>
              <label className="block text-sm font-medium text-khaki-dark mt-4 mb-2">New Audio Samples</label>
              <div className="space-y-2">
                {currentStepAudios.map((audioUrl, index) => (
                  <div 
                    key={`${audioUrl}-${index}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-brass-light/20 bg-white"
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => togglePlay(audioUrl)}
                        className="p-2 rounded-full hover:bg-brass-light/20 transition-colors"
                      >
                        {playingAudio === audioUrl ? (
                          <Pause className="w-5 h-5 text-brass" />
                        ) : (
                          <Play className="w-5 h-5 text-brass" />
                        )}
                      </button>
                      <span className="text-sm text-olive">Sample {index + 1}</span>
                    </div>

                    <button
                      onClick={() => handleAudioSelect(audioUrl)}
                      className={`px-3 py-1.5 rounded-lg text-sm ${
                        selectedAudio === audioUrl 
                          ? 'bg-brass text-white' 
                          : 'bg-brass-light/10 text-brass hover:bg-brass-light/20'
                      }`}
                    >
                      {selectedAudio === audioUrl ? 'Selected' : 'Select'}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
} 