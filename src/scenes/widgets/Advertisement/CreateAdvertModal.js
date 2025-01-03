import React, { useState } from 'react';

import { 
  Box, 
  Button, 
  Modal, 
  TextField, 
  Typography, 
  IconButton,
  styled
} from '@mui/material';
import { X } from 'lucide-react';

// Styled components for modal
const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 500,
  backgroundColor: theme.palette.background.paper,
  boxShadow: 24,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  maxHeight: '90vh',
  overflowY: 'auto'
}));

const CreateAdvertModal = ({ open, onClose, onSubmit }) => {
   
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    advertisement: '',
    picture: null
  });
  const [previewUrl, setPreviewUrl] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, picture: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('advertisement', formData.advertisement);
    if (formData.picture) {
        data.append('picture', formData.picture);
    }

    console.log('Submitting form data:', Array.from(data.entries()));
    
    try {
        await onSubmit(data);
        // Reset form
        setFormData({
            title: '',
            description: '',
            price: '',
            advertisement: '',
            picture: null
        });
        setPreviewUrl('');
    } catch (error) {
        console.error('Error submitting form:', error);
        // Optionally handle error here
    }
};


  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="create-advert-modal"
    >
      <ModalContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2">
            Create Advertisement
          </Typography>
          <IconButton onClick={onClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              variant="outlined"
            />
            
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              required
              variant="outlined"
            />
            
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              variant="outlined"
              InputProps={{
                startAdornment: '₦'
              }}
            />
            
            <TextField
              fullWidth
              label="Advertisement Text"
              name="advertisement"
              value={formData.advertisement}
              onChange={handleChange}
              multiline
              rows={2}
              required
              variant="outlined"
            />
            
            <Box>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="advert-image-input"
                required={!formData.picture}
              />
              <label htmlFor="advert-image-input">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                >
                  Upload Image
                </Button>
              </label>
            </Box>
            
            {previewUrl && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    maxHeight: 200,
                    maxWidth: '100%',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
              >
                Create Advertisement
              </Button>
            </Box>
          </Box>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateAdvertModal;