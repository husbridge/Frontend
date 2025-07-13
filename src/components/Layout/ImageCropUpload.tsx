import React, { useState, useRef, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop';
import { BiEdit, BiX, BiCheck } from 'react-icons/bi';
import Avatar from "@components/Layout/avatar";

// Helper function to create image from URL
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

// Helper function to get cropped image
const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Canvas toBlob failed'));
      }
    }, 'image/jpeg', 0.95);
  });
};

interface ImageCropUploadProps {
  currentImageUrl?: string;
  onUpload: (formData: FormData) => void;
  isPending?: boolean;
  altText?: string;
}

const ImageCropUpload: React.FC<ImageCropUploadProps> = ({ 
  currentImageUrl, 
  onUpload, 
  isPending = false,
  altText = "User"
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [showCropper, setShowCropper] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImageSrc(reader.result as string);
          setShowCropper(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels || !selectedFile) return;
    
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      const formData = new FormData();
      formData.append('profile-picture', croppedBlob, selectedFile.name);

      onUpload(formData);

      // Reset states
      setShowCropper(false);
      setImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setSelectedFile(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setSelectedFile(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-start">
      <Avatar 
        alt={altText} 
        imageUrl={currentImageUrl} 
        size={96}
      />

      {/* Upload Button */}
      <label
        className="flex items-center mt-3 cursor-pointer mb-6 ml-2"
      >
        <BiEdit size={20} />
        <p className="underline ml-2 font-medium text-sm">
          {isPending ? "Uploading..." : "Update"}
        </p>
        <input
          data-testid="file-upload"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileSelect}
          disabled={isPending}
        />
      </label>

      {/* Crop Modal */}
      {showCropper && imageSrc && (
        <div className="fixed inset-0 bg-opacity-100 text-white-100 flex items-center justify-center z-50">
          <div className="bg-black-100 bg-opacity-100 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Crop Image</h3>
              <button
                onClick={handleCropCancel}
                className="text-white-100 hover:text-white-100"
              >
                <BiX size={24} />
              </button>
            </div>

            {/* Cropper Container */}
            <div className="relative w-full h-64 bg-black-100 mb-4">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round"
                showGrid={false}
              />
            </div>

            {/* Zoom Control */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Zoom
              </label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
                style={{
                  accentColor: '#ffc107'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCropCancel}
                className="px-4 py-2 text-sm font-medium text-black-100 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleCropConfirm}
                className="px-4 py-2 text-sm font-medium text-black-100 bg-yellow-100 hover:bg-yellow-300 rounded-md flex items-center"
                disabled={isPending}
              >
                <BiCheck size={18} className="mr-1" />
                {isPending ? "Uploading..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCropUpload;
