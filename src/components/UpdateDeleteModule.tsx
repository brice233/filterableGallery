import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

interface Pest {
  _id: string;
  name: string;
  description: string;
  category: "negative" | "positive" | "neutral";
  imageUrl: string;
}

interface UpdateDeleteModuleProps {
  isOpen: boolean;
  onClose: () => void;
  pest: Pest | null;
  onUpdateSuccess: () => void;
}

const UpdateDeleteModule: React.FC<UpdateDeleteModuleProps> = ({
  isOpen,
  onClose,
  pest,
  onUpdateSuccess,
}) => {
  const [formData, setFormData] = useState<Omit<Pest, "_id">>({
    name: "",
    description: "",
    category: "neutral",
    imageUrl: "",
  });

  useEffect(() => {
    if (pest) {
      setFormData({
        name: pest.name,
        description: pest.description,
        category: pest.category,
        imageUrl: pest.imageUrl,
      });
    }
  }, [pest]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name as string]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!pest) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/pest/${pest._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        onUpdateSuccess();
      } else {
        console.error("Failed to update pest");
      }
    } catch (error) {
      console.error("Error updating pest:", error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Update Pest</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <MenuItem value="negative">Negative</MenuItem>
              <MenuItem value="positive">Positive</MenuItem>
              <MenuItem value="neutral">Neutral</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">Update</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UpdateDeleteModule;
