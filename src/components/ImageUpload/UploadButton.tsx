import React from 'react';
import { Upload } from 'lucide-react';

interface UploadButtonProps {
  disabled: boolean;
  onFileSelect: (files: FileList) => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ disabled, onFileSelect }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      onFileSelect(files);
    }
  };

  return (
    <div className="w-24 h-24">
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
        id="image-upload"
        multiple
      />
      <label
        htmlFor="image-upload"
        className={`w-full h-full flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg cursor-pointer
          ${disabled 
            ? 'bg-gray-50 border-gray-300 cursor-not-allowed' 
            : 'border-blue-300 hover:border-blue-400 hover:bg-blue-50'}`}
      >
        <Upload className={`w-6 h-6 ${disabled ? 'text-gray-400' : 'text-blue-600'}`} />
        <span className="text-xs text-center text-gray-600">Upload</span>
      </label>
    </div>
  );
};

export default UploadButton;