import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux'; 
import { Box, Button, Modal, TextField, Typography, IconButton, Pagination, Card, CardMedia, CardContent, Stack } from '@mui/material';
import { X as CloseIcon, Plus as PlusIcon } from 'lucide-react';
import FlexBetween from 'components/FlexBetween';
import CreateAdvertModal from './CreateAdvertModal';
import AdvertDisplay from './AdvertDisplay';
import { summaryApi } from 'common';
import { useDispatch, useSelector } from 'react-redux';
import { setAdverts, removeAdvert, setAdvertPage } from '../../../store/userSlice';

const AdvertsComponent = () => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const { list: adverts, totalPages, currentPage } = useSelector((state) => state.auth.adverts);
    const advertsPerPage = 10;
//   const [adverts, setAdverts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
//   const advertsPerPage = 10;
  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const fetchAdverts = async () => {
      try {
          const response = await fetch(
              `${backendURL}/api/adverts/getAll?page=${currentPage}&limit=${advertsPerPage}`,
              {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  }
              }
          );
          const data = await response.json();
          if (data.success) {
            dispatch(setAdverts({
                adverts: data.data.adverts,
                totalPages: data.data.pagination.totalPages
            }));
          }
      } catch (error) {
          console.error('Error fetching adverts:', error);
      }
  };

  const handleCreateAdvert = async (formData) => {
      try {
          const response = await fetch(summaryApi.createAdverts.url, {
              method: summaryApi.createAdverts.method,
              headers: {
                  Authorization: `Bearer ${token}`
              },
              body: formData
          });
          if (response.ok) {
              await fetchAdverts(); 
              setIsModalOpen(false);
          }
      } catch (error) {
          console.error('Error creating advert:', error);
      }
  };

  const handleDeleteAdvert = async (advertId) => {
      try {
          const response = await fetch(`${backendURL}/api/adverts/delete/own/${advertId}`, {
              method: 'DELETE',
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          if (response.ok) {
            dispatch(removeAdvert(advertId));
          }
      } catch (error) {
          console.error('Error deleting advert:', error);
      }
  };

  useEffect(() => {
      fetchAdverts();
  }, [currentPage, token]);

  return (
      <Box className="p-4">
          <CreateAdvertModal 
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleCreateAdvert}
          />
          
          <FlexBetween className="mb-4">
              <Typography variant="h5">Advertisements</Typography>
              <Button 
                  startIcon={<PlusIcon size={20} />}
                  onClick={() => setIsModalOpen(true)}
              >
                  Create Ad
              </Button>
          </FlexBetween>

          <Stack spacing={2}>
              {adverts.map((advert) => (
                  <AdvertDisplay 
                      key={advert._id} 
                      advert={advert}
                      onDelete={handleDeleteAdvert}
                  />
              ))}
          </Stack>

          {totalPages > 1 && (
              <Box className="mt-4 flex justify-center">
                  <Pagination 
                      count={totalPages}
                      page={currentPage}
                      onChange={(_, page) => setAdvertPage(page)}
                      color="primary"
                  />
              </Box>
          )}
      </Box>
  );
};

export default AdvertsComponent;

