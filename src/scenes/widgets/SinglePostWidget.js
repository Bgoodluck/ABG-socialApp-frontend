import React, { useState, useEffect } from 'react'
import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
    SendOutlined,
    ArrowBackIosOutlined,
    ArrowForwardIosOutlined,
    DeleteOutlined
} from "@mui/icons-material"
import { Box, Divider, IconButton, Typography, TextField, useTheme, ListItemText, ListItemIcon, MenuItem, Menu} from "@mui/material"
import FlexBetween from 'components/FlexBetween'
import Friend from "components/Friend"
import WidgetWrapper from 'components/WidgetWrapper'
import { useDispatch, useSelector } from 'react-redux'
import { setPost } from 'store/userSlice'
import { summaryApi } from 'common'
import { formatDistanceToNow } from 'date-fns'

function SinglePostWidget({  
    userId,
    postId,
    postUserId,
    name,
    description,
    location,
    userPicture,
    picture,
    video,
    mixSeriesId,  
    likes,
    comments: initialComments,
    onPostDelete
}) {
    const [isComment, setIsComment] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState(initialComments || []);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [mediaFiles, setMediaFiles] = useState([]);
    
    const dispatch = useDispatch();   
    const token = useSelector((state)=> state.auth.token);
    const loggedInUserId = useSelector((state)=> state.auth.user);
    const [anchorEl, setAnchorEl] = useState(null); // For the share menu
    const open = Boolean(anchorEl);
    
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;

    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;

    const getUserMediaUrl = (path, type = 'image') => {
        if (!path) return null;
        
        // Existing logic for non-live posts
        if (path.startsWith('http') || path.startsWith('https')) return path;
        
        const normalizedPath = path.replace(/\\/g, '/').replace('uploads/', '');
        return `https://abg-socialapp-backend.onrender.com/uploads/${normalizedPath}`;
    };

    const handleLike = async () => {
        try {
            const currentUserId = userId || loggedInUserId?.id || loggedInUserId?._id

            const response = await fetch(
                summaryApi.likePost.url.replace(':id', postId),
                {
                    method: summaryApi.likePost.method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        userId: currentUserId,
                    }),
                }
            );
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to like/unlike post');
            }
    
            const responseData = await response.json();
            console.log('Post liked/unliked successfully:', responseData);
    
            // Update the specific post in the Redux store
            dispatch(setPost({ post: responseData.updatePost }));
        } catch (error) {
            console.error('Like post error:', error);
        }
    };

    // Fetch comments when the component mounts or when postId changes
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(
                    summaryApi.getComment.url.replace(':postId', postId),
                    {
                        method: summaryApi.getComment.method,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }

                const data = await response.json();
                setComments(data.comments);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [postId, token]);

    const handleCreateComment = async () => {
        if (!commentText.trim()) return;

        try {
            const response = await fetch(summaryApi.createComment.url, {
                method: summaryApi.createComment.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    postId,
                    userId: loggedInUserId?.id || loggedInUserId?._id,
                    text: commentText,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create comment');
            }

            const data = await response.json();
            setComments(data.comments);
            setCommentText('');
        } catch (error) {
            console.error('Comment creation error:', error);
        }
    };



    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(
                summaryApi.deleteComment.url.replace(':commentId', commentId),
                {
                    method: summaryApi.deleteComment.method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        commentId,
                        userId: loggedInUserId?.id || loggedInUserId?._id  // Add user ID to verify ownership
                    }),
                }
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete comment');
            }
            
            const data = await response.json();
            setComments(data.comments);
        } catch (error) {
            console.error('Comment deletion error:', error);
        }
    }



    useEffect(() => {
        const fetchMixedMediaPosts = async () => {
            if (mixSeriesId) {
                try {
                    const url = summaryApi.getMixPost.url.replace(':mixSeriesId', mixSeriesId);
                    
                    const response = await fetch(url, {
                        method: summaryApi.getMixPost.method,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
    
                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Fetch mixed media error:', {
                            status: response.status,
                            url,
                            errorText
                        });
                        return;
                    }
    
                    const data = await response.json();
                    
                    if (data.success && data.post && data.post.mediaFiles) {
                        const files = data.post.mediaFiles.map(media => media.path);
                        setMediaFiles(files);
                        setCurrentSlide(0); // Reset slide to first image
                    } else {
                        console.warn('No media files found in mixed post:', data);
                    }
                } catch (error) {
                    console.error('Detailed error fetching mixed media:', error);
                }
            }
        };
    
        fetchMixedMediaPosts();
    }, [mixSeriesId, token]);

    // Carousel navigation handlers
    const handleNextSlide = () => {
        setCurrentSlide((prev) => 
            (prev + 1) % (mediaFiles.length || 1)
        );
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prev) => 
            prev === 0 ? (mediaFiles.length - 1 || 0) : prev - 1
        );
    };


    const handleShareClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleShare = () => {
        // Implement share functionality
        console.log('Sharing post...');
        handleClose();
    };

    const handleDeletePost = async () => {
        try {
            if (!postId) {
                console.error('Invalid postId');
                return;
            }

            const response = await fetch(
                `${summaryApi.deletePost.url.replace(':id', postId)}`,
                {
                    method: summaryApi.deletePost.method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
 
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete post');
            }

            const responseData = await response.json();
            console.log('Post deleted successfully:', responseData);
            // Update the specific post in the Redux store
            dispatch(setPost({ post: responseData.updatePost }));

            // Call the onPostDelete callback to update the parent's state
            if (onPostDelete) {
                onPostDelete(postId);
            }

            handleClose(); // Close the menu after deletion
        } catch (error) {
            console.error('Delete post error:', error);
        }
    };




    
    // Render media with carousel support
    const renderMedia = () => {
        // Prioritize mediaFiles from mixSeriesId
        if (mediaFiles && mediaFiles.length > 0) {
            const currentMedia = mediaFiles[currentSlide];
            const isVideo = currentMedia.toLowerCase().match(/\.(mp4|avi|mov)$/);

            return (
                <Box position="relative" width="100%" height="auto">
                    {mediaFiles.length > 1 && (
                        <>
                            <IconButton
                                onClick={handlePrevSlide}
                                sx={{
                                    position: 'absolute',
                                    left: 10,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 10,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                                }}
                            >
                                <ArrowBackIosOutlined />
                            </IconButton>
                            <IconButton
                                onClick={handleNextSlide}
                                sx={{
                                    position: 'absolute',
                                    right: 10,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 10,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                                }}
                            >
                                <ArrowForwardIosOutlined />
                            </IconButton>
                        </>
                    )}
                    
                    {isVideo ? (
                        <video
                            width="100%"
                            height="auto"
                            controls
                            style={{ 
                                borderRadius: "0.75rem", 
                                marginTop: "0.75rem",
                                objectFit: 'cover',
                                aspectRatio: '1/1' 
                            }}
                        >
                            <source 
                                src={getUserMediaUrl(currentMedia, 'video')} 
                                type={`video/${currentMedia.split('.').pop()}`}
                            />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <img
                            width="100%"
                            height="auto"
                            alt='post'
                            style={{ 
                                borderRadius: "0.75rem", 
                                marginTop: "0.75rem"
                            }}
                            src={getUserMediaUrl(currentMedia, 'image')}
                        />
                    )}
                    
                    {mediaFiles.length > 1 && (
                        <Box 
                            display="flex" 
                            justifyContent="center" 
                            mt="0.5rem"
                        >
                            {mediaFiles.map((_, index) => (
                                <Box
                                    key={index}
                                    width="8px"
                                    height="8px"
                                    borderRadius="50%"
                                    mx="4px"
                                    bgcolor={
                                        index === currentSlide 
                                        ? primary 
                                        : palette.neutral.light
                                    }
                                />
                            ))}
                        </Box>
                    )}
                </Box>
            );
        }
        
        // Fallback to single image or video posts
        if (picture) {
            return (
                <img
                    width="100%"
                    height="auto"
                    alt='post'
                    style={{ borderRadius: "0.75rem", marginTop: "0.75rem"}}
                    src={getUserMediaUrl(picture, 'image')}
                />
            );
        }
        
        if (video) {
            return (
                <video
                    width="100%"
                    height="auto"
                    controls
                    style={{ 
                        borderRadius: "0.75rem", 
                        marginTop: "0.75rem",
                        objectFit: 'cover',
                        aspectRatio: '1/1' 
                    }}
                >
                    <source 
                        src={getUserMediaUrl(video, 'video')} 
                        type="video/mp4"
                    />
                    Your browser does not support the video tag.
                </video>
            );
        }
    
        return null;
    };               

    return (
        <WidgetWrapper m="2rem 0">
            <Friend
                friendId={postUserId}
                name={name}
                userPicture={userPicture}
                subtitle={location}  
            />
            <Typography color={main} sx={{ mt: "1rem"}}>
                {description}
            </Typography>

            {renderMedia()}
            
            
            <FlexBetween mt="0.25rem">
                <FlexBetween gap="1rem">
                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={handleLike} sx={{ transition: "color 0.3s ease" }}>
                            {isLiked ? (
                                <FavoriteOutlined sx={{ color: primary }} />
                            ) : (
                                <FavoriteBorderOutlined sx={{ color: main }} />
                            )}
                        </IconButton>
                        <Typography>
                            {likeCount} likes
                        </Typography>
                    </FlexBetween> 

                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={()=> setIsComment(!isComment)}>
                            <ChatBubbleOutlineOutlined/>  
                        </IconButton>
                        <Typography>
                            {comments.length}
                        </Typography>                                                         
                    </FlexBetween> 
                </FlexBetween>
                <IconButton 
                    onClick={handleShareClick}
                    aria-controls={open ? 'share-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <ShareOutlined />
                </IconButton>

                <Menu
                    id="share-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'share-button',
                    }}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={handleShare}>
                        <ListItemIcon>
                            <ShareOutlined fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Share with...</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleDeletePost}>
                        <ListItemIcon>
                            <DeleteOutlined fontSize="small" sx={{ color: 'error.main' }} />
                        </ListItemIcon>
                        <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
                    </MenuItem>
                </Menu>
            </FlexBetween>

            {isComment && (
        <Box mt="0.5rem">
            {comments.map((comment, index) => {
                const isCommentOwner = (comment.userId === (loggedInUserId?.id || loggedInUserId?._id));
                
                return (
                    <Box key={comment._id + index}>
                        <Divider/>
                        <Box 
                            display="flex" 
                            flexDirection="column" 
                            gap="0.5rem" 
                            p="0.5rem"
                        >
                            <Box display="flex" alignItems="center" gap="1rem">
                                <Typography color={main} flex={1}>
                                    <strong>{comment.firstName} {comment.lastName}</strong>: {comment.text}
                                </Typography>
                                <Box display="flex" alignItems="center" gap="0.5rem">
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary" 
                                        sx={{ fontSize: '0.75rem' }}
                                    >
                                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                    </Typography>
                                    {isCommentOwner && (
                                        <IconButton 
                                            onClick={() => handleDeleteComment(comment._id)}
                                            size="small"
                                            sx={{ 
                                                color: palette.neutral.medium,
                                                '&:hover': {
                                                    color: palette.error.main
                                                }
                                            }}
                                        >
                                            <DeleteOutlined fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                );
            })}
            
            <Box display="flex" mt="1rem">
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    sx={{ mr: "1rem" }}
                />
                <IconButton onClick={handleCreateComment}>
                    <SendOutlined />
                </IconButton>
            </Box>
        </Box>
    )}
        </WidgetWrapper>
    );
}

export default SinglePostWidget;