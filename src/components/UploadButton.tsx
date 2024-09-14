import { styled } from "@mui/material/styles";
import { Text } from "./Text";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState } from "react";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function UploadButton() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setUploadedImage(reader.result as string);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <div className="grid gap-4">
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Upload files
        <VisuallyHiddenInput
          type="file"
          onChange={handleImageChange}
          multiple
        />
      </Button>
      {uploadedImage && (
        <div className="w-full cursor-pointer transition-all duration-200 rounded-lg shadow bg-gray-800 border border-gray-600">
          <img
            className="rounded-t-lg w-full h-[200px] overflow-hidden"
            src={uploadedImage}
            alt="Uploaded Image"
          />
          <div className="p-5">
            <Text
              as="h5"
              className="mb-2 text-2xl font-bold tracking-tight text-white"
            >
              Uploaded Image
            </Text>
            <Text as="p" className="mb-3 font-normal text-gray-400">
              Your uploaded image is displayed here.
            </Text>
          </div>
        </div>
      )}
    </div>
  );
}
