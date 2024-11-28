import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import ImagePreview from './ImagePreview';
import UploadButton from './UploadButton';
import { convertToBase64, performOCR } from '../../utils/imageProcessing';

interface ImageUploadProps {
  onTextExtracted: (text: string) => void;
  numQuestions: number;
  onQuizGenerated: (questions: any[]) => void;
  isGenerating: boolean;
}

const MAX_IMAGES = 5;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const ImageUpload: React.FC<ImageUploadProps> = ({
  onTextExtracted,
  isGenerating
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [progress, setProgress] = useState(0);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Please upload only image files (PNG, JPG, JPEG, or GIF)';
    }
    if (file.size > MAX_SIZE) {
      return 'Image size must be less than 5MB';
    }
    return null;
  };

  const handleFileSelect = async (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    const totalImages = images.length + newFiles.length;

    if (totalImages > MAX_IMAGES) {
      alert(`You can only upload up to ${MAX_IMAGES} images`);
      return;
    }

    const validFiles = newFiles.filter(file => {
      const error = validateFile(file);
      if (error) {
        alert(error);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setImages(prev => [...prev, ...validFiles]);
      
      // Process OCR for each image
      setIsProcessingOCR(true);
      try {
        for (let i = 0; i < validFiles.length; i++) {
          const text = await performOCR(validFiles[i]);
          if (text.trim()) {
            onTextExtracted(text.trim());
          }
          setProgress(((i + 1) / validFiles.length) * 100);
        }
      } catch (error) {
        console.error('OCR processing error:', error);
      } finally {
        setIsProcessingOCR(false);
        setProgress(0);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload images (up to {MAX_IMAGES})
        </label>
        <div className="flex flex-wrap gap-4">
          {images.map((image, index) => (
            <ImagePreview
              key={index}
              image={image}
              onRemove={() => removeImage(index)}
            />
          ))}
          {images.length < MAX_IMAGES && (
            <UploadButton
              disabled={isProcessingOCR || isGenerating}
              onFileSelect={handleFileSelect}
            />
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Supported formats: PNG, JPG, JPEG, GIF (max 5MB each)
        </p>
      </div>

      {isProcessingOCR && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing images... {Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;