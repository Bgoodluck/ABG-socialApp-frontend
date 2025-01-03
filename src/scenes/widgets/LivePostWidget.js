import React, { useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Webcam from 'react-webcam';
import { startRecording, stopRecording } from 'react-audio-voice-recorder';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { 
  Box, 
  Button, 
  IconButton, 
  TextField, 
  Grid,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import { 
  CameraAlt as CameraIcon, 
  Videocam as VideoIcon, 
  Mic as AudioIcon, 
  Delete as DeleteIcon,
  PhotoCamera as LiveCameraIcon,
  StopCircle as StopIcon,
  Videocam as LiveVideoIcon
} from '@mui/icons-material';
import { summaryApi } from 'common';
import { setPosts } from 'store/userSlice';

const LivePostWidget = ({ onPostComplete }) => {
  const [mediaType, setMediaType] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [description, setDescription] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [error, setError] = useState(null);
  const [isLiveCaptureOpen, setIsLiveCaptureOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [captureMode, setCaptureMode] = useState(null);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioRecorderRef = useRef(null);

  const recorderControls = useAudioRecorder();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  // File-based media capture handler
  const handleMediaCapture = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const filePreview = URL.createObjectURL(file);
      setMediaPreview(filePreview);
      setMediaType(type);
      setMediaFile(file);
    }
  };

  // Live image capture
  const handleLiveImageCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    
    // Convert base64 to file
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'captured-image.jpeg', { type: 'image/jpeg' });
        const filePreview = URL.createObjectURL(file);
        
        setMediaPreview(filePreview);
        setMediaType('image');
        setMediaFile(file);
        setIsLiveCaptureOpen(false);
        setCaptureMode(null);
      });
  };

  // Live video recording handler webcam
  const handleStartVideoRecording = useCallback(() => {
    if (!webcamRef.current || !webcamRef.current.stream) {
      console.error('Webcam stream not available');
      setError('Unable to access camera');
      return;
    }
  
    const stream = webcamRef.current.stream;
    
    // Detailed stream logging
    console.log('Stream tracks:', stream.getTracks().map(track => ({
      kind: track.kind,
      label: track.label,
      enabled: track.enabled,
      readyState: track.readyState
    })));
  
    // Try multiple MIME types with more verbose logging
    const mimeTypes = [
      'video/webm;codecs=vp9,opus', 
      'video/webm;codecs=vp8,opus', 
      'video/webm', 
      'video/mp4'
    ];
    
    let mediaRecorder;
    let supportedMimeType = null;
    for (let mimeType of mimeTypes) {
      try {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          supportedMimeType = mimeType;
          mediaRecorder = new MediaRecorder(stream, { 
            mimeType: supportedMimeType,
            videoBitsPerSecond: 2500000 // 2.5 Mbps
          });
          console.log('Using MIME type:', supportedMimeType);
          break;
        }
      } catch (error) {
        console.warn(`Unsupported MIME type: ${mimeType}`, error);
      }
    }
  
    if (!mediaRecorder) {
      setError('No supported video recording format');
      return;
    }
  
    const chunks = [];
    
    // More comprehensive data capture logging
    mediaRecorder.ondataavailable = (e) => {
      console.log('Data available event:', {
        dataSize: e.data.size,
        dataType: e.data.type,
        chunksBefore: chunks.length
      });
  
      // Always add data, even if size is 0
      chunks.push(e.data);
    };
  
    mediaRecorder.onerror = (event) => {
      console.error('MediaRecorder error:', event.error);
      setError(`Recording error: ${event.error.message}`);
    };
  
    // Start recording with explicit timeslice
    mediaRecorder.start(1000); // Collect data every 1 second
  
    // Additional safeguard to ensure data collection
    const recordingTimeout = setTimeout(() => {
      if (mediaRecorder.state === 'recording') {
        console.warn('Forcing stop after timeout');
        mediaRecorder.stop();
      }
    }, 10000); // 10 seconds max recording time
  
    mediaRecorder.onstop = () => {
      clearTimeout(recordingTimeout);
  
      console.log('Recording stopped. Total chunks:', chunks.length);
      
      // More robust blob creation
      const blob = new Blob(chunks, { 
        type: supportedMimeType || 'video/webm' 
      });
      
      console.log('Blob details:', {
        size: blob.size,
        type: blob.type
      });
  
      if (blob.size === 0) {
        console.error('No video data captured');
        setError('Failed to record video. No data collected.');
        return;
      }
  
      const videoFile = new File([blob], 'recorded-video.webm', { 
        type: blob.type 
      });
      
      const filePreview = URL.createObjectURL(videoFile);
      
      setMediaPreview(filePreview);
      setMediaType('video');
      setMediaFile(videoFile);
      setIsRecording(false);
      setIsLiveCaptureOpen(false);
      setCaptureMode(null);
    };
  
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
  
  }, [webcamRef]);
  
  const handleStopVideoRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      // Stop recording and trigger the onstop event to process chunks
      mediaRecorderRef.current.stop();
      
      // Stop all video tracks to release the camera
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  }, []);




  // Live audio recording
  const handleStartAudioRecording = useCallback(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream, { 
          mimeType: 'audio/webm' 
        });
        
        const chunks = [];
        mediaRecorder.ondataavailable = (e) => {
          console.log('Audio data available:', e.data.size);
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };
  
        // Collect chunks every second
        mediaRecorder.start(1000);
  
        mediaRecorder.onstop = () => {
          console.log('Total audio chunks:', chunks.length);
          
          if (chunks.length === 0) {
            console.error('No audio chunks recorded');
            setError('No audio was recorded');
            return;
          }
  
          const blob = new Blob(chunks, { type: 'audio/webm' });
          
          if (blob.size === 0) {
            console.error('Recorded audio blob is empty');
            setError('Failed to record audio');
            return;
          }
  
          const audioFile = new File([blob], 'recorded-audio.webm', { type: 'audio/webm' });
          const filePreview = URL.createObjectURL(audioFile);
          
          setMediaPreview(filePreview);
          setMediaType('audio');
          setMediaFile(audioFile);
          setIsRecording(false);
  
          // Clean up chunks
          chunks.length = 0;
        };
  
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
      })
      .catch(error => {
        console.error('Error accessing microphone', error);
        setError('Could not access microphone');
      });
  }, []);
  
  const handleStopAudioRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      
      // Stop all audio tracks to release the microphone
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  }, []);

  
  // Reset media method
  const resetMedia = () => {
    // Revoke object URL to prevent memory leaks
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }
    
    setMediaPreview(null);
    setMediaType(null);
    setMediaFile(null);
  };

  // Submit handler for Multer compatibility
  const handleSubmit = async () => {
    if (!mediaFile) return;

    const formData = new FormData();
    formData.append('userId', user.id);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('description', description);
    
    if (user.picturePath) {
      formData.append('userPicture', user.picturePath);
    }

    formData.append('mediaType', mediaType);
    formData.append('mediaFiles', mediaFile, mediaFile.name);

    try {
      const response = await fetch(summaryApi.livePosts.url, {
        method: summaryApi.livePosts.method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        const newPost = {
          ...result.post,
          userPicture: user.picturePath || '',
          mediaFiles: result.post.mediaFiles || [],
          mediaType: mediaType
        };

        dispatch(setPosts({ posts: [newPost] }));
        
        resetMedia();
        setDescription('');

        if (onPostComplete) {
          onPostComplete();
        }
      }
      
    } catch (error) {
      console.error('Live post creation error:', error);
      setError(error.message);
    }
  };

  // Live capture dialog
  const LiveCaptureDialog = () => (
    <Dialog 
      open={isLiveCaptureOpen} 
      onClose={() => {
        setIsLiveCaptureOpen(false);
        setIsRecording(false);
        setCaptureMode(null);
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {captureMode === 'image' ? 'Live Photo Capture' : 'Live Video Recording'}
      </DialogTitle>
      <DialogContent>
      <Webcam
  audio={true}
  ref={webcamRef}
  videoConstraints={{
    width: 1280,
    height: 720,
    facingMode: "user"
  }}
  onUserMedia={(stream) => {
    console.log('Webcam stream details:', {
      id: stream.id,
      active: stream.active,
      tracks: stream.getTracks().map(track => ({
        kind: track.kind,
        label: track.label,
        enabled: track.enabled
      }))
    });
  }}
  onUserMediaError={(error) => {
    console.error('Detailed webcam error:', {
      name: error.name,
      message: error.message,
      constraint: error.constraint
    });
    setError(`Camera access error: ${error.message}`);
  }}
  style={{ width: '100%', height: 'auto' }}
/>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          {captureMode === 'image' && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleLiveImageCapture}
            >
              Capture Photo
            </Button>
          )}
        {captureMode === 'video' && (
  <>
    {!isRecording ? (
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<LiveVideoIcon />}
        onClick={handleStartVideoRecording}
      >
        Start Recording
      </Button>
    ) : (
      <Button 
        variant="contained" 
        color="error" 
        startIcon={<StopIcon />}
        onClick={() => {
          handleStopVideoRecording();
          setIsLiveCaptureOpen(false);
        }}
      >
        Stop Recording
      </Button>
    )}
  </>
)}
        </Box>
      </DialogContent>
    </Dialog>
  );

  // Render method
  return (
    <Box sx={{ 
      p: 3, 
      bgcolor: 'background.paper', 
      borderRadius: 2, 
      boxShadow: 2 
    }}>
      <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
        <Grid item>
          <Button 
            variant="outlined" 
            component="label" 
            startIcon={<CameraIcon />}
            sx={{ flexDirection: 'column' }}
          >
            Image
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              ref={imageInputRef}
              hidden 
              onChange={(e) => handleMediaCapture(e, 'image')}
            />
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant="outlined" 
            startIcon={<LiveCameraIcon />}
            onClick={() => {
              setIsLiveCaptureOpen(true);
              setCaptureMode('image');
            }}
            sx={{ flexDirection: 'column' }}
          >
            Live Photo
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant="outlined" 
            component="label" 
            startIcon={<VideoIcon />}
            sx={{ flexDirection: 'column' }}
          >
            Video
            <input 
              type="file" 
              accept="video/*" 
              capture="environment"
              ref={videoInputRef}
              hidden 
              onChange={(e) => handleMediaCapture(e, 'video')}
            />
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant="outlined" 
            startIcon={<LiveVideoIcon />}
            onClick={() => {
              setIsLiveCaptureOpen(true);
              setCaptureMode('video');
            }}
            sx={{ flexDirection: 'column' }}
          >
            Live Video
          </Button>
        </Grid>
        <Grid item>
  <Button 
    variant={isRecording ? "contained" : "outlined"} 
    color={isRecording ? "error" : "primary"}
    startIcon={isRecording ? <StopIcon /> : <AudioIcon />}
    onClick={isRecording ? handleStopAudioRecording : handleStartAudioRecording}
    sx={{ flexDirection: 'column' }}
  >
    {isRecording ? 'Stop Recording' : 'Record Audio'}
  </Button>
</Grid>
      </Grid>

      <LiveCaptureDialog />

      {/* Media Preview */}
      {mediaPreview && (
        <Box sx={{ position: 'relative', mt: 2, mb: 2 }}>
          {mediaType === 'image' && (
            <img 
              src={mediaPreview} 
              alt="Preview" 
              style={{ 
                width: '100%', 
                height: '300px', 
                objectFit: 'cover', 
                borderRadius: '8px' 
              }}
            />
          )}
          {mediaType === 'video' && (
            <video 
              src={mediaPreview} 
              controls 
              style={{ 
                width: '100%', 
                height: '300px', 
                objectFit: 'cover',
                borderRadius: '8px' 
              }}
            />
          )}
          {mediaType === 'audio' && (
            <audio 
              src={mediaPreview} 
              controls 
              style={{ width: '100%' }}
            />
          )}
          
          <IconButton 
            color="error"
            onClick={resetMedia}
            sx={{ 
              position: 'absolute', 
              top: 10, 
              right: 10, 
              bgcolor: 'rgba(255,255,255,0.7)' 
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )}

      <TextField 
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        placeholder="Add a description..." 
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button 
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={!mediaFile}
      >
        Post
      </Button>

      {/* Error Handling */}
      {error && (
        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setError(null)} 
            severity="error" 
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default LivePostWidget;