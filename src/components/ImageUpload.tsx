import React, { useState } from 'react';
import { createWorker } from 'tesseract.js';
import { Upload, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onTextExtracted: (text: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onTextExtracted }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const worker = await createWorker({
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });

      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      
      const trimmedText = text.trim();
      if (trimmedText) {
        onTextExtracted(trimmedText);
      } else {
        throw new Error('No text could be extracted from the image');
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to extract text from image';
        
      alert(`OCR Error: ${errorMessage}. Please try another image or enter text manually.`);
      console.error('OCR Error:', errorMessage);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, JPEG, or GIF)');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('Image size must be less than 5MB');
      return;
    }

    processImage(file);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Or upload an image
      </label>
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isProcessing}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed rounded-lg cursor-pointer
            ${isProcessing 
              ? 'bg-gray-50 border-gray-300 cursor-not-allowed' 
              : 'border-blue-300 hover:border-blue-400 hover:bg-blue-50'}`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-sm text-gray-600">Processing image... {progress}%</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Click to upload an image</span>
            </>
          )}
        </label>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Supported formats: PNG, JPG, JPEG, GIF (max 5MB)
      </p>
    </div>
  );
};

export default ImageUpload;