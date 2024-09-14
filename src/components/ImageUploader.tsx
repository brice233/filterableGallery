import React, { useState } from "react";

interface ImageUploaderProps {
  onUpload: (image: string) => void; // Add a prop to handle image upload
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        const uploadedImage = reader.result as string;
        onUpload(uploadedImage); // Call the onUpload prop with the image data
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-4">Upload Image</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {selectedImage && (
        <button
          onClick={handleUpload}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Upload
        </button>
      )}
    </div>
  );
};

export default ImageUploader;
