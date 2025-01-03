import React, { useEffect, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import AllPostsWidget from "scenes/widgets/AllPostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
import { summaryApi } from "common";
import { toast } from "react-toastify";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const { userId } = useParams(); // Extract userId from URL
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  useEffect(() => {
    console.log("ProfilePage - Received UserId from URL:", userId);

    if (!userId) {
      console.error("No user ID in URL");
      toast.error("Invalid profile link");
      navigate('/home'); // Redirect if no userId
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`${summaryApi.getUser.url.replace(':id', userId)}`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
    
        const data = await response.json();
        console.log("Fetched User Data:", data);
        
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch user");
        }
    
        setUser(data.userData);
      } catch (error) {
        console.error("Profile fetch error:", error);
        toast.error("Could not load profile");
        navigate('/home'); // Redirect on error
      }
    };

    
    fetchUser();
  }, [userId, token, navigate]);

  if (!user) {
    return <div>Loading...</div>; // Or a proper loading component
  }


  
  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        justifyContent="center"
        gap="2rem"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath || ""} />
          <Box m="2rem 0" />
          <FriendListWidget userId={userId} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {/* my posts */}
          <MyPostWidget picturePath={user.picturePath} />
          <Box m="2rem 0" />
          <AllPostsWidget userId={userId} isProfile />
        </Box>
      </Box>
    </Box>
  );
}

export default ProfilePage;


// import React, { useEffect, useState } from 'react'
// import { Box, Typography, useMediaQuery } from '@mui/material'
// import { useSelector } from 'react-redux'
// import { useParams, useLocation } from 'react-router-dom'
// import Navbar from 'scenes/navbar'
// import FriendListWidget from 'scenes/widgets/FriendListWidget'
// import MyPostWidget from 'scenes/widgets/MyPostWidget'
// import AllPostsWidget from 'scenes/widgets/AllPostsWidget'
// import UserWidget from 'scenes/widgets/UserWidget'
// import { summaryApi } from 'common'

// function ProfilePage() {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState(null);
//   const { userId } = useParams();
//   const location = useLocation();
//   const token = useSelector((state)=> state.auth.token)
//   const reduxUser = useSelector((state) => state.auth.user)
//   const isNonMobileScreens = useMediaQuery("(min-width: 1000px)")

//   // Comprehensive logging
//   useEffect(() => {
//     console.group('ProfilePage Debug')
//     console.log('Current Location:', location)
//     console.log('URL User ID:', userId)
//     console.log('Redux User:', reduxUser)
//     console.groupEnd()
//   }, [location, userId, reduxUser])

//   const getUser = async()=>{
//     try {
//       // Fallback ID selection
//       const currentUserId = 
//         userId || 
//         reduxUser?._id || 
//         reduxUser?.id || 
//         (reduxUser ? Object.values(reduxUser)[0] : null)

//       console.log('Fetching user with ID:', currentUserId)

//       if (!currentUserId) {
//         throw new Error("No user ID available")
//       }

//       const response = await fetch(`${summaryApi.getUser.url.replace(':id', currentUserId)}`,{
//         method: "GET",
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       })

//       const responseData = await response.json()
//       console.log('User Fetch Response:', responseData)

//       if(!response.ok){
//         throw new Error(responseData.message || "User not found")
//       }

//       setUser(responseData.userData)      
//     } catch (error) {
//       console.error("Profile Page User Fetch Error:", error);
//       setError(error.message)
//     }
//   }

//   useEffect(()=>{
//     getUser()
//   }, [userId, reduxUser]); 

//   if(error) {
//     return (
//       <Box>
//         <Typography color="error">Error: {error}</Typography>
//         <Typography>Unable to load user profile. The user ID may be invalid.</Typography>
//       </Box>
//     )
//   }

//   if(!user) return null

//   return (
//     <Box>
//       <Navbar />
//       <Box
//         width="100%"
//         padding="2rem 6%"
//         display={isNonMobileScreens ? "flex" : "block"}
//         gap="2rem"
//         justifyContent="center"
//       >
//         <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
//           <UserWidget userId={user._id} picture={user.picturePath} />
//           <Box m="2rem 0" />
//           <FriendListWidget userId={user._id} />
//         </Box>
//         <Box
//           flexBasis={isNonMobileScreens ? "42%" : undefined}
//           mt={isNonMobileScreens ? undefined : "2rem"}
//         >
//           <MyPostWidget picturePath={user.picturePath} />
//           <Box m="2rem 0" />
//           <AllPostsWidget userId={user._id} isProfile />
//         </Box>
//       </Box>
//     </Box>
//   )
// }

// export default ProfilePage