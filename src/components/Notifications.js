// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Modal,
//   IconButton,
//   Badge,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemAvatar,
//   Avatar,
//   Divider
// } from '@mui/material';
// import { Notifications, Close } from '@mui/icons-material';
// import { useSelector } from 'react-redux';
// import { formatDistanceToNow } from 'date-fns';
// import { summaryApi } from 'common';

// const NotificationsIndicator = () => {
//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
  
//   const user = useSelector((state) => state.auth.user);
//   const token = useSelector((state) => state.auth.token);
//   const posts = useSelector((state) => state.auth.posts);

//   useEffect(() => {
//     if (user && posts.length > 0) {
//       fetchNotifications();
//     }
//   }, [user, posts]);



//   const getImageUrl = (picturePath) => {
//     if (!picturePath) return '';
    
//     // If it's already a full URL, return as is
//     if (picturePath.startsWith('http')) return picturePath;
    
//     // Convert backslashes to forward slashes
//     const formattedPath = picturePath.replace(/\\/g, '/');
    
//     // Construct the full URL (adjust the base URL according to your backend)
//     // You might want to get this from an environment variable or config
//     return `${process.env.REACT_APP_BACKEND_URL}/${formattedPath}`;
//   };



//   const fetchNotifications = async () => {
//     try {
//       const response = await fetch(`${summaryApi.getNotified.url}/${user._id}`, {
//         method: summaryApi.getNotified.method,
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//       });
  
//       if (!response.ok) {
//         throw new Error('Failed to fetch notifications');
//       }
  
//       const data = await response.json();
//       console.log("data", data)
//       const processedNotifications = processNotifications(data.notifications);
//       console.log("notify", processNotifications)
//       setNotifications(processedNotifications);
//       setUnreadCount(processedNotifications.filter(n => !n.read).length);
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//     }
//   };




//   const processNotifications = (rawNotifications) => {
//     return rawNotifications
//       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//       .map(notification => ({
//         ...notification,
//         timeAgo: formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
//       }));
//   };

//   const handleOpen = () => {
//     setOpen(true);
//     markNotificationsAsRead();
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };



//   const markNotificationsAsRead = async () => {
//   try {
//     await fetch(`${summaryApi.markNotified.url}/${user._id}/mark-read`, {
//       method: summaryApi.markNotified.method,
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//     });
//     setUnreadCount(0);
//   } catch (error) {
//     console.error('Error marking notifications as read:', error);
//   }
// };




//   return (
//     <>
//       <IconButton onClick={handleOpen} sx={{ position: 'relative' }}>
//         <Badge badgeContent={unreadCount} color="error">
//           <Notifications />
//         </Badge>
//       </IconButton>

//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="notifications-modal"
//       >
//         <Box
//           sx={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             width: { xs: '90%', sm: '500px' },
//             bgcolor: 'background.paper',
//             boxShadow: 24,
//             borderRadius: 2,
//             p: 4,
//             maxHeight: '80vh',
//             overflow: 'auto'
//           }}
//         >
//           <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//             <Typography variant="h6" component="h2">
//               Notifications
//             </Typography>
//             <IconButton onClick={handleClose}>
//               <Close />
//             </IconButton>
//           </Box>

//           <List>
//             {notifications.length > 0 ? (
//               notifications.map((notification, index) => (
//                 <React.Fragment key={notification._id}>
//                   <ListItem alignItems="flex-start">
//                     <ListItemAvatar>
//                       <Avatar 
//                         src={getImageUrl(notification?.fromUser?.picture || notification?.fromUser?.picturePath)} 
//                         alt={`${notification.fromUser.firstName} ${notification.fromUser.lastName}`}
//                       />
//                     </ListItemAvatar>
//                     <ListItemText
//                       primary={
//                         <Typography component="span" variant="body1">
//                           <strong>{notification.fromUser.firstName} {notification.fromUser.lastName}</strong>
//                           {notification.type === 'like' 
//                             ? ' liked your post'
//                             : ' commented on your post'
//                           }
//                         </Typography>
//                       }
//                       secondary={
//                         <Typography
//                           component="span"
//                           variant="body2"
//                           color="text.secondary"
//                         >
//                           {notification.timeAgo}
//                         </Typography>
//                       }
//                     />
//                   </ListItem>
//                   {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
//                 </React.Fragment>
//               ))
//             ) : (
//               <Typography variant="body1" textAlign="center" py={2}>
//                 No notifications yet
//               </Typography>
//             )}
//           </List>
//         </Box>
//       </Modal>
//     </>
//   );
// };

// export default NotificationsIndicator;


import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Modal,
  IconButton,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress
} from '@mui/material';
import { Notifications, Close } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { summaryApi } from 'common';
import { userCache } from 'helpers/userCache';

const NotificationsIndicator = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);  
  const [error, setError] = useState(null);
  
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const posts = useSelector((state) => state.auth.posts);




  useEffect(() => {
    const unsubscribe = userCache.subscribe((userId, newData) => {
      // Update notifications when user data changes
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => {
          if (notification.fromUser._id === userId) {
            return {
              ...notification,
              fromUser: newData
            };
          }
          return notification;
        })
      );
    });

    return () => unsubscribe();
  }, []);



  useEffect(() => {
    if (user && posts.length > 0) {
      fetchNotifications();
    }
  }, [user, posts]);



  const getImageUrl = (picturePath) => {
    if (!picturePath) return '';
    
    // If it's already a full URL, return as is
    if (picturePath.startsWith('http')) return picturePath;
    
    // Convert backslashes to forward slashes
    const formattedPath = picturePath.replace(/\\/g, '/');
    
    // Construct the full URL (adjust the base URL according to your backend)
    // You might want to get this from an environment variable or config
    return `${process.env.REACT_APP_BACKEND_URL}/${formattedPath}`;
  };


  const fetchUserBatch = async (userIds) => {
    try {
      const response = await fetch(`${summaryApi.batchGetUser.url}`, {
        method: summaryApi.batchGetUser.method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userIds })
      });
  
      if (!response.ok) throw new Error('Failed to fetch user data');
      
      const data = await response.json();
      
      // Validate the response structure
      if (!data || !data.users || !Array.isArray(data.users)) {
        console.error('Invalid response format:', data);
        return [];
      }
  
      // Process and cache valid user data
      data.users.forEach(user => {
        if (user && user._id) {
          userCache.set(user._id, user);
        }
      });
      
      return data.users;
    } catch (error) {
      console.error('Error fetching user batch:', error);
      return [];
    }
  };
  
  const processNotifications = async (rawNotifications) => {
    if (!Array.isArray(rawNotifications)) {
      console.error('Invalid notifications format:', rawNotifications);
      return [];
    }
  
    const userIds = [...new Set(
      rawNotifications
        .filter(n => n && n.fromUser && n.fromUser._id)
        .map(n => n.fromUser._id)
    )];
  
    if (userIds.length === 0) return [];
  
    await fetchUserBatch(userIds);
    
    return rawNotifications
      .filter(notification => notification && notification.fromUser)
      .map(notification => {
        const userData = userCache.get(notification.fromUser._id);
        return {
          ...notification,
          fromUser: userData || notification.fromUser,
          timeAgo: formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };


  const fetchNotifications = useCallback(async () => {
    if (!user?._id || !token) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${summaryApi.getNotified.url}/${user._id}`, {
        method: summaryApi.getNotified.method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) throw new Error('Failed to fetch notifications');

      const data = await response.json();
      const processedNotifications = await processNotifications(data.notifications);
      
      setNotifications(processedNotifications);
      setUnreadCount(processedNotifications.filter(n => !n.read).length);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?._id, token]);



  // const processNotifications = (rawNotifications) => {
  //   return rawNotifications
  //     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  //     .map(notification => ({
  //       ...notification,
  //       timeAgo: formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
  //     }));
  // };

  const handleOpen = () => {
    setOpen(true);
    markNotificationsAsRead();
  };

  const handleClose = () => {
    setOpen(false);
  };



  const markNotificationsAsRead = async () => {
  try {
    await fetch(`${summaryApi.markNotified.url}/${user._id}/mark-read`, {
      method: summaryApi.markNotified.method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    setUnreadCount(0);
  } catch (error) {
    console.error('Error marking notifications as read:', error);
  }
};


useEffect(() => {
  if (user?._id && token) {
    fetchNotifications();
    
    // Poll every 30 seconds
    const pollInterval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(pollInterval);
  }
}, [user?._id, token, fetchNotifications]);

// Clear cache on logout
useEffect(() => {
  if (!user || !token) {
    userCache.clear();
  }
}, [user, token]);




  return (
    <>
      <IconButton onClick={handleOpen} sx={{ position: 'relative' }}>
        <Badge badgeContent={unreadCount} color="error">
          <Notifications />
        </Badge>
      </IconButton>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="notifications-modal"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '500px' },
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            maxHeight: '80vh',
            overflow: 'auto'
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" component="h2">
              Notifications
            </Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>

          {isLoading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
          
          {error && (
            <Typography color="error" textAlign="center" py={2}>
              {error}
            </Typography>
          )}


<List>
            {!isLoading && notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <React.Fragment key={notification._id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar 
                        src={getImageUrl(notification?.fromUser?.picture || notification?.fromUser?.picturePath)} 
                        alt={`${notification.fromUser.firstName} ${notification.fromUser.lastName}`}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography component="span" variant="body1">
                          <strong>{notification.fromUser.firstName} {notification.fromUser.lastName}</strong>
                          {notification.type === 'like' 
                            ? ' liked your post'
                            : ' commented on your post'
                          }
                        </Typography>
                      }
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {notification.timeAgo}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))
            ) : (
              !isLoading && (
                <Typography variant="body1" textAlign="center" py={2}>
                  No notifications yet
                </Typography>
              )
            )}
          </List>
        </Box>
      </Modal>
    </>
  );
};

export default NotificationsIndicator;