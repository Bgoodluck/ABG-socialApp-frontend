// import React, { useState } from "react";
// import {
//   EditOutlined,
//   DeleteOutlined,
//   AttachFileOutlined,
//   GifBoxOutlined,
//   ImageOutlined,
//   MoreHorizOutlined,
//   Mic as MicIcon
// } from "@mui/icons-material";
// import {
//   Box,
//   Divider,
//   Typography,
//   InputBase,
//   useTheme,
//   Button,
//   IconButton,
//   useMediaQuery,
// } from "@mui/material";
// import Dropzone from "react-dropzone";
// import FlexBetween from "components/FlexBetween";
// import UserImage from "components/UserImage";
// import WidgetWrapper from "components/WidgetWrapper";
// import { useDispatch, useSelector } from "react-redux";
// import { setPost } from "store/userSlice";
// import { summaryApi } from "common";
// import LivePostWidget from "./LivePostWidget";



// function MyPostWidget() {
//   const dispatch = useDispatch();
//   const [isImage, setIsImage] = useState(false);
//   const [isVideo, setIsVideo] = useState(false);
//   const [isSlide, setIsSlide] = useState(false);
//   const [isLivePost, setIsLivePost] = useState(false); 
//   const [image, setImage] = useState(null);
//   const [video, setVideo] = useState(null);
//   const [slideMedia, setSlideMedia] = useState([]);
//   const [postText, setPostText] = useState("");

//   const { palette } = useTheme();
//   const { 
//     id, 
//     firstName, 
//     lastName, 
//     picturePath  // Directly get picturePath from the user object in Redux
//   } = useSelector((state) => state.auth.user);
//   const token = useSelector((state) => state.auth.token);
//   const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
//   const mediumMain = palette.neutral.mediumMain;
//   const medium = palette.neutral.medium;

//   const resetForm = () => {
//     setPostText("");
//     setImage(null);
//     setVideo(null);
//     setSlideMedia([]);
//     setIsImage(false);
//     setIsVideo(false);
//     setIsSlide(false);
//   };

//   const handlePost = async () => {
//     try {
//       // Validation check
//       if (!postText.trim() && slideMedia.length === 0 && !image && !video && !isLivePost) {
//         console.error("No content to post");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("userId", id);

//       // Append description if exists
//       if (postText.trim()) {
//         formData.append("description", postText);
//       }

//       // Determine which API and file to use based on media type
//       let response, apiConfig;

//       if (slideMedia.length > 0) {
//         // Mixed media post
//         apiConfig = summaryApi.createMixPost;
//         slideMedia.forEach((file, index) => {
//           formData.append(`files`, file, file.name);
//         });
//       } else if (image) {
//         // Single image post
//         apiConfig = summaryApi.createPost;
//         formData.append("picture", image, image.name);
//       } else if (video) {
//         // Single video post
//         apiConfig = summaryApi.createVidPost;
//         formData.append("video", video, video.name);
//       }

//       // If no API config was set (no media), use a fallback for text-only posts
//       if (!apiConfig) {
//         apiConfig = summaryApi.createPost;
//       }

//       // Perform the post request
//       response = await fetch(apiConfig.url, {
//         method: apiConfig.method,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const data = await response.json();

//       // Enhanced error checking
//       if (!data.success) {
//         throw new Error(data.message || "Post creation failed");
//       }

//       // Safely access the first post (or the only post)
//       const newPost =
//         data.posts && data.posts.length > 0 ? data.posts[0] : data.post;

//       if (!newPost) {
//         throw new Error("No post returned from server");
//       }

//       // Dispatch the new post to Redux store
//       dispatch(setPost(newPost));

//       // Create an initial comment if text exists
//       if (postText.trim()) {
//         try {
//           await fetch(summaryApi.createComment.url, {
//             method: summaryApi.createComment.method,
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               postId: newPost._id,
//               userId: id,
//               text: postText,
//             }),
//           });
//         } catch (commentError) {
//           console.error("Error creating initial comment:", commentError);
//         }
//       }

//       // Reset the form
//       resetForm();
//     } catch (error) {
//       console.error("Error creating post:", error);
//       // Optionally, show an error message to the user
//       alert(`Failed to create post: ${error.message}`);
//     }
//   };

//   const handleSlideMediaDrop = (acceptedFiles) => {
//     // Limit to 6 media files
//     const newFiles = [...slideMedia, ...acceptedFiles].slice(0, 6);
//     setSlideMedia(newFiles);
//   };

//   const removeSlideMedia = (index) => {
//     const updatedMedia = slideMedia.filter((_, i) => i !== index);
//     setSlideMedia(updatedMedia);
//   };

//   return (
//     <WidgetWrapper>
//       <FlexBetween gap="1.5rem">
//         <UserImage image={picturePath} />
//         <InputBase
//           placeholder="What's on your mind..."
//           onChange={(e) => setPostText(e.target.value)}
//           value={postText}
//           sx={{
//             width: "100%",
//             backgroundColor: palette.neutral.light,
//             borderRadius: "2rem",
//             padding: "1rem 2rem",
//           }}
//         />
//       </FlexBetween>
//       {isLivePost && (
//         <Box mt="1rem">
//           <LivePostWidget 
//             onPostComplete={() => {
//               setIsLivePost(false); // Close LivePostWidget after post
//             }}
//           />
//         </Box>
//       )}

//       {isImage && (
//         <Box
//           borderRadius="5px"
//           border={`1px solid ${medium}`}
//           mt="1rem"
//           p="1rem"
//         >
//           <Dropzone
//             acceptedFiles=".jpg,.jpeg,.png"
//             multiple={false}
//             onDrop={(acceptedFiles) => {
//               setImage(acceptedFiles[0]);
//             }}
//           >
//             {({ getRootProps, getInputProps }) => (
//               <FlexBetween>
//                 <Box
//                   {...getRootProps()}
//                   border={`2px dashed ${palette.primary.main}`}
//                   p="1rem"
//                   width="100%"
//                   sx={{ "&:hover": { cursor: "pointer" } }}
//                 >
//                   <input {...getInputProps()} />
//                   {!image ? (
//                     <p>Add Image Here</p>
//                   ) : (
//                     <FlexBetween>
//                       <Typography>
//                         {image.name}
//                         <EditOutlined />
//                       </Typography>
//                     </FlexBetween>
//                   )}
//                 </Box>
//                 {image && (
//                   <IconButton
//                     onClick={() => setImage(null)}
//                     sx={{ width: "15%" }}
//                   >
//                     <DeleteOutlined />
//                   </IconButton>
//                 )}
//               </FlexBetween>
//             )}
//           </Dropzone>
//         </Box>
//       )}

//       {isVideo && (
//         <Box
//           borderRadius="5px"
//           border={`1px solid ${medium}`}
//           mt="1rem"
//           p="1rem"
//         >
//           <Dropzone
//             acceptedFiles=".mp4,.avi,.mov,.mkv,.webm,.quicktime"
//             multiple={false}
//             onDrop={(acceptedFiles) => {
//               setVideo(acceptedFiles[0]);
//             }}
//           >
//             {({ getRootProps, getInputProps }) => (
//               <FlexBetween>
//                 <Box
//                   {...getRootProps()}
//                   border={`2px dashed ${palette.primary.main}`}
//                   p="1rem"
//                   width="100%"
//                   sx={{ "&:hover": { cursor: "pointer" } }}
//                 >
//                   <input {...getInputProps()} />
//                   {!video ? (
//                     <p>Add Video Here</p>
//                   ) : (
//                     <FlexBetween>
//                       <Typography>
//                         {video.name}
//                         <EditOutlined />
//                       </Typography>
//                     </FlexBetween>
//                   )}
//                 </Box>
//                 {video && (
//                   <IconButton
//                     onClick={() => setVideo(null)}
//                     sx={{ width: "15%" }}
//                   >
//                     <DeleteOutlined />
//                   </IconButton>
//                 )}
//               </FlexBetween>
//             )}
//           </Dropzone>
//         </Box>
//       )}

//       {isSlide && (
//         <Box
//           borderRadius="5px"
//           border={`1px solid ${medium}`}
//           mt="1rem"
//           p="1rem"
//         >
//           <Dropzone
//             acceptedFiles=".jpg,.jpeg,.png,.mp4,.avi,.mov,.mkv"
//             multiple={true}
//             onDrop={handleSlideMediaDrop}
//           >
//             {({ getRootProps, getInputProps }) => (
//               <Box
//                 {...getRootProps()}
//                 border={`2px dashed ${palette.primary.main}`}
//                 p="1rem"
//                 width="100%"
//                 sx={{ "&:hover": { cursor: "pointer" } }}
//               >
//                 <input {...getInputProps()} />
//                 {slideMedia.length === 0 ? (
//                   <Typography>Add Up to 6 Media Files</Typography>
//                 ) : (
//                   <Box>
//                     {slideMedia.map((file, index) => (
//                       <FlexBetween key={index} mb="0.5rem">
//                         <Typography>
//                           {file.name}
//                           <EditOutlined />
//                         </Typography>
//                         <IconButton
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             removeSlideMedia(index);
//                           }}
//                           sx={{ width: "15%" }}
//                         >
//                           <DeleteOutlined />
//                         </IconButton>
//                       </FlexBetween>
//                     ))}
//                     {slideMedia.length < 6 && (
//                       <Typography color={mediumMain}>
//                         Add More Files (Total {slideMedia.length}/6)
//                       </Typography>
//                     )}
//                   </Box>
//                 )}
//               </Box>
//             )}
//           </Dropzone>
//         </Box>
//       )}

//       <Divider sx={{ margin: "1.25rem 0" }} />

//       <FlexBetween>
//       <FlexBetween
//           gap="0.25rem"
//           onClick={() => {
//             setIsImage(!isImage);
//             setIsVideo(false);
//             setIsSlide(false);
//             setIsLivePost(false);
//           }}
//         >
//           <ImageOutlined sx={{ color: mediumMain }} />
//           <Typography
//             color={mediumMain}
//             sx={{ "&:hover": { cursor: "pointer", color: medium } }}
//           >
//             Image
//           </Typography>
//         </FlexBetween>

//         <FlexBetween
//           gap="0.25rem"
//           onClick={() => {
//             setIsVideo(!isVideo);
//             setIsImage(false);
//             setIsSlide(false);
//             setIsLivePost(false);
//           }}
//         >
//           <GifBoxOutlined sx={{ color: mediumMain }} />
//           <Typography
//             color={mediumMain}
//             sx={{ "&:hover": { cursor: "pointer", color: medium } }}
//           >
//             Video
//           </Typography>
//         </FlexBetween>

//         {isNonMobileScreens && (
//           <>
//             <FlexBetween
//               gap="0.25rem"
//               onClick={() => {
//                 setIsSlide(!isSlide);
//                 setIsImage(false);
//                 setIsVideo(false);
//                 setIsLivePost(false);
//               }}
//             >
//               <AttachFileOutlined sx={{ color: mediumMain }} />
//               <Typography
//                 color={mediumMain}
//                 sx={{ "&:hover": { cursor: "pointer", color: medium } }}
//               >
//                 Slide
//               </Typography>
//             </FlexBetween>

//             {/* New Microphone/Live Post icon */}
//             <FlexBetween
//               gap="0.25rem"
//               onClick={() => {
//                 setIsLivePost(!isLivePost);
//                 setIsImage(false);
//                 setIsVideo(false);
//                 setIsSlide(false);
//               }}
//             >
//               <MicIcon sx={{ color: mediumMain }} />
//               <Typography
//                 color={mediumMain}
//                 sx={{ "&:hover": { cursor: "pointer", color: medium } }}
//               >
//                 Live
//               </Typography>
//             </FlexBetween>
//           </>
//         )}

//         <Button
//           disabled={
//             !postText &&
//             slideMedia.length === 0 &&
//             !image &&
//             !video &&
//             !isLivePost
//           }
//           onClick={handlePost}
//           sx={{
//             color: palette.background.alt,
//             backgroundColor: palette.primary.main,
//             borderRadius: "3rem",
//           }}
//         >
//           POST
//         </Button>
//       </FlexBetween>
//     </WidgetWrapper>
//   );
// }

// export default MyPostWidget;



import React, { useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MoreHorizOutlined,
  Mic as MicIcon
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  Stack
} from "@mui/material";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "store/userSlice";
import { summaryApi } from "common";
import LivePostWidget from "./LivePostWidget";

function MyPostWidget() {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [isSlide, setIsSlide] = useState(false);
  const [isLivePost, setIsLivePost] = useState(false); 
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [slideMedia, setSlideMedia] = useState([]);
  const [postText, setPostText] = useState("");

  const { palette } = useTheme();
  const { 
    id, 
    firstName, 
    lastName, 
    picturePath
  } = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const resetForm = () => {
    setPostText("");
    setImage(null);
    setVideo(null);
    setSlideMedia([]);
    setIsImage(false);
    setIsVideo(false);
    setIsSlide(false);
  };

  const handlePost = async () => {
    try {
      // Validation check
      if (!postText.trim() && slideMedia.length === 0 && !image && !video && !isLivePost) {
        console.error("No content to post");
        return;
      }

      const formData = new FormData();
      formData.append("userId", id);

      // Append description if exists
      if (postText.trim()) {
        formData.append("description", postText);
      }

      // Determine which API and file to use based on media type
      let response, apiConfig;

      if (slideMedia.length > 0) {
        // Mixed media post
        apiConfig = summaryApi.createMixPost;
        slideMedia.forEach((file, index) => {
          formData.append(`files`, file, file.name);
        });
      } else if (image) {
        // Single image post
        apiConfig = summaryApi.createPost;
        formData.append("picture", image, image.name);
      } else if (video) {
        // Single video post
        apiConfig = summaryApi.createVidPost;
        formData.append("video", video, video.name);
      }

      // If no API config was set (no media), use a fallback for text-only posts
      if (!apiConfig) {
        apiConfig = summaryApi.createPost;
      }

      // Perform the post request
      response = await fetch(apiConfig.url, {
        method: apiConfig.method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      // Enhanced error checking
      if (!data.success) {
        throw new Error(data.message || "Post creation failed");
      }

      // Safely access the first post (or the only post)
      const newPost =
        data.posts && data.posts.length > 0 ? data.posts[0] : data.post;

      if (!newPost) {
        throw new Error("No post returned from server");
      }

      // Dispatch the new post to Redux store
      dispatch(setPost(newPost));

      // Create an initial comment if text exists
      if (postText.trim()) {
        try {
          await fetch(summaryApi.createComment.url, {
            method: summaryApi.createComment.method,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              postId: newPost._id,
              userId: id,
              text: postText,
            }),
          });
        } catch (commentError) {
          console.error("Error creating initial comment:", commentError);
        }
      }

      // Reset the form
      resetForm();
    } catch (error) {
      console.error("Error creating post:", error);
      alert(`Failed to create post: ${error.message}`);
    }
  };

  const handleSlideMediaDrop = (acceptedFiles) => {
    const newFiles = [...slideMedia, ...acceptedFiles].slice(0, 6);
    setSlideMedia(newFiles);
  };

  const removeSlideMedia = (index) => {
    const updatedMedia = slideMedia.filter((_, i) => i !== index);
    setSlideMedia(updatedMedia);
  };

  return (
    <WidgetWrapper>
      {/* User Input Section */}
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPostText(e.target.value)}
          value={postText}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>

      {/* Live Post Widget */}
      {isLivePost && (
        <Box mt="1rem">
          <LivePostWidget 
            onPostComplete={() => {
              setIsLivePost(false);
            }}
          />
        </Box>
      )}

      {/* Image Upload Section */}
      {isImage && (
        <Box
          borderRadius="5px"
          border={`1px solid ${medium}`}
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => {
              setImage(acceptedFiles[0]);
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>
                        {image.name}
                        <EditOutlined />
                      </Typography>
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick={() => setImage(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      {/* Video Upload Section */}
      {isVideo && (
        <Box
          borderRadius="5px"
          border={`1px solid ${medium}`}
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".mp4,.avi,.mov,.mkv,.webm,.quicktime"
            multiple={false}
            onDrop={(acceptedFiles) => {
              setVideo(acceptedFiles[0]);
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!video ? (
                    <p>Add Video Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>
                        {video.name}
                        <EditOutlined />
                      </Typography>
                    </FlexBetween>
                  )}
                </Box>
                {video && (
                  <IconButton
                    onClick={() => setVideo(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      {/* Slide Upload Section */}
      {isSlide && (
        <Box
          borderRadius="5px"
          border={`1px solid ${medium}`}
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png,.mp4,.avi,.mov,.mkv"
            multiple={true}
            onDrop={handleSlideMediaDrop}
          >
            {({ getRootProps, getInputProps }) => (
              <Box
                {...getRootProps()}
                border={`2px dashed ${palette.primary.main}`}
                p="1rem"
                width="100%"
                sx={{ "&:hover": { cursor: "pointer" } }}
              >
                <input {...getInputProps()} />
                {slideMedia.length === 0 ? (
                  <Typography>Add Up to 6 Media Files</Typography>
                ) : (
                  <Box>
                    {slideMedia.map((file, index) => (
                      <FlexBetween key={index} mb="0.5rem">
                        <Typography>
                          {file.name}
                          <EditOutlined />
                        </Typography>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSlideMedia(index);
                          }}
                          sx={{ width: "15%" }}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      </FlexBetween>
                    ))}
                    {slideMedia.length < 6 && (
                      <Typography color={mediumMain}>
                        Add More Files (Total {slideMedia.length}/6)
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      {/* Controls Section */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2 }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
        sx={{
          '& > *': {
            flex: { xs: '1', sm: '0 auto' }
          }
        }}
      >
        {/* Media Options */}
        <Stack 
          direction="row" 
          spacing={1} 
          justifyContent={{ xs: 'space-between', sm: 'flex-start' }}
          flexWrap="wrap"
          sx={{ gap: 1 }}
        >
          {/* Image Option */}
          <FlexBetween
            gap="0.25rem"
            onClick={() => {
              setIsImage(!isImage);
              setIsVideo(false);
              setIsSlide(false);
              setIsLivePost(false);
            }}
            sx={{ 
              minWidth: 'fit-content',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 }
            }}
          >
            <ImageOutlined sx={{ color: mediumMain }} />
            <Typography
              color={mediumMain}
              sx={{ "&:hover": { color: medium } }}
            >
              Image
            </Typography>
          </FlexBetween>

          {/* Video Option */}
          <FlexBetween
            gap="0.25rem"
            onClick={() => {
              setIsVideo(!isVideo);
              setIsImage(false);
              setIsSlide(false);
              setIsLivePost(false);
            }}
            sx={{ 
              minWidth: 'fit-content',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 }
            }}
          >
            <GifBoxOutlined sx={{ color: mediumMain }} />
            <Typography
              color={mediumMain}
              sx={{ "&:hover": { color: medium } }}
            >
              Video
            </Typography>
          </FlexBetween>

          {/* Slide Option */}
          <FlexBetween
            gap="0.25rem"
            onClick={() => {
              setIsSlide(!isSlide);
              setIsImage(false);
              setIsVideo(false);
              setIsLivePost(false);
            }}
            sx={{ 
              minWidth: 'fit-content',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 }
            }}
          >
            <AttachFileOutlined sx={{ color: mediumMain }} />
            <Typography
              color={mediumMain}
              sx={{ "&:hover": { color: medium } }}
            >
              Slide
            </Typography>
          </FlexBetween>

          {/* Live Option */}
          <FlexBetween
            gap="0.25rem"
            onClick={() => {
              setIsLivePost(!isLivePost);
              setIsImage(false);
              setIsVideo(false);
              setIsSlide(false);
            }}
            sx={{ 
              minWidth: 'fit-content',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 }
            }}
          >
            <MicIcon sx={{ color: mediumMain }} />
            <Typography
              color={mediumMain}
              sx={{ "&:hover": { color: medium } }}
            >
              Live
            </Typography>
          </FlexBetween>
        </Stack>

        {/* Post Button */}
        <Button
          disabled={!postText && slideMedia.length === 0 && !image && !video && !isLivePost}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
            minWidth: { xs: '100%', sm: 'auto' },
            mt: { xs: 2, sm: 0 },
            padding: "0.6rem 2rem",
            '&:hover': {
              backgroundColor: palette.primary.dark,
            },
            '&:disabled': {
              backgroundColor: palette.neutral.light,
              color: palette.neutral.main,
            }
          }}
        >
          POST
        </Button>
      </Stack>
    </WidgetWrapper>
  );
}

export default MyPostWidget;