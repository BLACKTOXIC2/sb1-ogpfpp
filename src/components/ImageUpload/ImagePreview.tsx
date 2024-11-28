import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  image: File;
  onRemove: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image, onRemove }) => {
  const imageUrl = URL.createObjectURL(image);

  React.useEffect(() => {
    return () => URL.revokeObjectURL(imageUrl);
  }, [imageUrl]);

  return (
    <div className="relative group">
      <img
        src={imageUrl}
        alt="Preview"
        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
      />
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        type="button"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ImagePreview;