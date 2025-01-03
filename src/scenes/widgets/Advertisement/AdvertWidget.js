
import React, { useState } from 'react';
import { Typography, useTheme } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';
import CreateAdvertModal  from './CreateAdvertModal';  
import { useDispatch, useSelector } from 'react-redux';
import AdvertDisplay from './AdvertDisplay';
import { summaryApi } from 'common';
import { setCurrentAdvert } from 'store/userSlice';

function AdvertWidget() {

     const { palette } = useTheme();
     const dark = palette.neutral.dark;
     const main = palette.neutral.main;
     const medium = palette.medium;

     const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const { currentAdvert } = useSelector((state) => state.auth.adverts);
     const [isModalOpen, setIsModalOpen] = useState(false);
    //  const [currentAdvert, setCurrentAdvert] = useState(null);
     const [error, setError] = useState(null);
    
 
     const handleCreateAdvert = async (formData) => {
         try {
             console.log('Sending formData:', Array.from(formData.entries()));
             
             const response = await fetch(summaryApi.createAdverts.url, {
                 method: summaryApi.createAdverts.method,
                 headers: {
                     Authorization: `Bearer ${token}`
                 },
                 body: formData
             });
             
             const data = await response.json();
             
             if (!response.ok) {
                 throw new Error(data.message || 'Failed to create advertisement');
             }
 
             if (data.success) {
                dispatch(setCurrentAdvert(data.data));
                 setIsModalOpen(false);
                 // Optional: Show success message
             }
         } catch (error) {
             console.error('Error creating advertisement:', error);
             setError(error.message);
         }
     };
 
     return (
         <>
             <WidgetWrapper>
                 <FlexBetween>
                     <Typography color={dark} variant="h5" fontWeight="500">
                         Sponsored
                     </Typography>
                     <Typography 
                         color={medium}
                         sx={{ 
                             cursor: 'pointer',
                             '&:hover': {
                                 color: main,
                             }
                         }}
                         onClick={() => setIsModalOpen(true)}
                     >
                         Create Ad
                     </Typography>
                 </FlexBetween>
 
                 {currentAdvert ? (
                     <AdvertDisplay advert={currentAdvert} />
                 ) : (
                     // Your default content
                     <>
                         <img
                             width="100%"
                             height="auto"
                             alt="advert"
                             src={`${process.env.REACT_APP_BACKEND_URL}/uploads/logo2.png`}
                             style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
                         />
                         <FlexBetween>
                             <Typography color={main}>Advertiser</Typography>
                             <Typography color={medium}>Your Advertiser</Typography>
                         </FlexBetween>
                         <Typography color={medium} m="0.5rem 0">
                             Create your first advertisement to see it here!
                         </Typography>
                     </>
                 )}
 
                 {error && (
                     <Typography color="error" mt={2}>
                         Error: {error}
                     </Typography>
                 )}
             </WidgetWrapper>
 
             <CreateAdvertModal 
                 open={isModalOpen}
                 onClose={() => {
                     setIsModalOpen(false);
                     setError(null);
                 }}
                 onSubmit={handleCreateAdvert}
             />
         </>
     );
 }

export default AdvertWidget;