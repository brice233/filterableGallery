import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

interface FormData {
  name: string;
  description: string;
  text: string;
  image: File | null;
  category: "negative" | "positive" | "neutral";
}

interface UploadImageDialogProps {
  onUploadSuccess: () => void;
}

const UploadImageDialog = ({ onUploadSuccess }: UploadImageDialogProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    text: "",
    image: null,
    category: "negative",
  });

  const [open, setOpen] = useState(false);

  console.log("formdata", formData);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = async () => {
    // Ensure an image is selected
    if (!formData.image) {
      console.log("No image selected");
      return;
    }

    const cloudinaryUrl =
      "https://api.cloudinary.com/v1_1/dtobkagh6/image/upload";
    const uploadPreset = "gallery"; // Create this preset in your Cloudinary account

    // Create formData for Cloudinary
    const formDataToSend = new FormData();
    formDataToSend.append("file", formData.image);
    formDataToSend.append("upload_preset", uploadPreset);

    try {
      // Upload to Cloudinary
      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formDataToSend,
      });
      const data = await response.json();

      // Check if upload was successful
      if (data.secure_url) {
        console.log("Uploaded image URL:", data.secure_url);

        // Now, send the image URL and other form data to your backend
        const serverData = {
          name: formData.name,
          description: formData.description,
          imageUrl: data.secure_url,
          category: formData.category,
        };

        const serverResponse = await fetch(
          "http://localhost:8080/api/v1/pest",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(serverData),
          }
        );

        const result = await serverResponse.json();
        console.log(result);
        
        // Call the onUploadSuccess callback to trigger revalidation
        onUploadSuccess();
      } else {
        console.error("Image upload failed", data);
      }
    } catch (error) {
      console.error("Error uploading image", error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Upload Pest
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[400px] mx-auto p-4">
        <DialogHeader>
          <DialogTitle>Upload Pest</DialogTitle>
          <DialogDescription>
            Upload a pest image and fill out the form.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full p-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="block w-full p-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="block w-full p-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              <option value="negative">Negative</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Photo
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full p-2 text-sm text-gray-700 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button onClick={handleSubmit}>Upload Pest</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadImageDialog;
