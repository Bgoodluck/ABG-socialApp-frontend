import React, { useState, useEffect } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    TextField, 
    Button, 
    Box, 
    Typography, 
    Avatar, 
    IconButton, 
    useMediaQuery, 
    useTheme 
} from '@mui/material';
import { 
    Edit as EditIcon, 
    Close as CloseIcon, 
    CloudUpload as CloudUploadIcon 
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setLogin } from 'store/userSlice';
import { summaryApi } from 'common';
import { userCache } from 'helpers/userCache';

const EditUserWidget = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    
    // Redux state
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);

    // Modal state
    const [open, setOpen] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        location: '',
        occupation: '',
        bio: '',
        picture: null,
        previewImage: null
    });

    // Social profiles state
    const [socialProfiles, setSocialProfiles] = useState({
        twitter: '',
        facebook: '',
        instagram: '',
        linkedin: ''
    });

    // Initialize form when user changes
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                location: user.location || '',
                occupation: user.occupation || '',
                bio: user.bio || '',
                picture: null,
                previewImage: user.picturePath || null
            });

            // Initialize social profiles
            setSocialProfiles({
                twitter: user.socialProfiles?.twitter || '',
                facebook: user.socialProfiles?.facebook || '',
                instagram: user.socialProfiles?.instagram || '',
                linkedin: user.socialProfiles?.linkedin || ''
            });
        }
    }, [user]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle file upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                picture: file,
                previewImage: URL.createObjectURL(file)
            }));
        }
    };

    // Handle social profile changes
    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setSocialProfiles(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Create form data for file upload
            const formDataToSend = new FormData();
            formDataToSend.append('userId', user.id);
            formDataToSend.append('firstName', formData.firstName);
            formDataToSend.append('lastName', formData.lastName);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('location', formData.location);
            formDataToSend.append('occupation', formData.occupation);
            formDataToSend.append('bio', formData.bio);
            
            // Append picture if new file is selected
            if (formData.picture) {
                formDataToSend.append('picture', formData.picture);
            }

            // Append social profiles
            formDataToSend.append('socialProfiles', JSON.stringify(socialProfiles));

            // Extensive logging for debugging
            console.log("Sending Update Request:", Object.fromEntries(formDataToSend));

            // Make API call
            const response = await fetch(summaryApi.updateUser.url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            const result = await response.json();

            console.log("API Response:", result);

            if (result.data.picture) {
                await fetch(summaryApi.updateProfilePictureInPost.url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'  // Explicitly set content type
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        newPicturePath: result.data.picture  // Note the key is newPicturePath
                    })
                })
            }

            if (result.success) {
                // Comprehensive state update
             await dispatch(setLogin({
                    user: {
                        ...result.data,
                        picturePath: result.data.picture || result.data.picturePath,
                        socialProfiles: socialProfiles
                    },
                    token: token
                }));

                console.log("reduxredux", setLogin)
                userCache.invalidate(user._id || user.id);
                toast.success('Profile updated successfully!');
                setOpen(false);
            } else {
                toast.error(result.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            toast.error('An error occurred while updating profile');
        }
    };

    return (
        <>
            {/* Edit Icon in UserWidget */}
            <IconButton 
                onClick={() => setOpen(true)}
                sx={{ 
                    color: theme.palette.neutral.main,
                    '&:hover': { 
                        color: theme.palette.primary.light 
                    }
                }}
            >
                <EditIcon />
            </IconButton>

            {/* Modal Dialog */}
            <Dialog 
                open={open} 
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="md"
                fullScreen={!isNonMobileScreens}
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h4">Edit Profile</Typography>
                        <IconButton onClick={() => setOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Box 
                            display="grid" 
                            gap="15px" 
                            gridTemplateColumns={isNonMobileScreens ? "repeat(2, minmax(0, 1fr))" : "1fr"}
                        >
                            {/* Profile Picture Upload */}
                            <Box 
                                gridcolumn={isNonMobileScreens ? "span 2" : "1"} 
                                display="flex" 
                                flexDirection="column" 
                                alignItems="center"
                            >
                                <Avatar 
                                    src={formData.previewImage} 
                                    sx={{ 
                                        width: 100, 
                                        height: 100, 
                                        mb: 2 
                                    }} 
                                />
                                <Button 
                                    component="label" 
                                    variant="contained" 
                                    startIcon={<CloudUploadIcon />}
                                >
                                    Upload Picture
                                    <input 
                                        type="file" 
                                        hidden 
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                    />
                                </Button>
                            </Box>

                            {/* Personal Details */}
                            <TextField
                                name="firstName"
                                label="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                name="lastName"
                                label="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                name="email"
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                name="location"
                                label="Location"
                                value={formData.location}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                name="occupation"
                                label="Occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            
                            {/* Bio Field */}
                            <TextField
                                name="bio"
                                label="Bio"
                                multiline
                                rows={4}
                                value={formData.bio}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                gridcolumn={isNonMobileScreens ? "span 2" : "1"}
                            />

                            {/* Social Profiles */}
                            <TextField
                                name="twitter"
                                label="Twitter Profile"
                                value={socialProfiles.twitter}
                                onChange={handleSocialChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                name="facebook"
                                label="Facebook Profile"
                                value={socialProfiles.facebook}
                                onChange={handleSocialChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                name="instagram"
                                label="Instagram Profile"
                                value={socialProfiles.instagram}
                                onChange={handleSocialChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                name="linkedin"
                                label="LinkedIn Profile"
                                value={socialProfiles.linkedin}
                                onChange={handleSocialChange}
                                fullWidth
                                margin="normal"
                            />
                        </Box>

                        {/* Submit Button */}
                        <Box mt={3} display="flex" justifyContent="center">
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary"
                                size="large"
                            >
                                Save Changes
                            </Button>
                        </Box>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default EditUserWidget;