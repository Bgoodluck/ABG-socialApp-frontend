// import {
//     ManageAccountsOutlined,
//     EditOutlined,
//     LocationOnOutlined,
//     WorkOutlineOutlined
// } from "@mui/icons-material"
// import { Box, Typography, Divider, useTheme } from "@mui/material"
// import UserImage from "components/UserImage"
// import FlexBetween from "components/FlexBetween"
// import WidgetWrapper from "components/WidgetWrapper"
// import { useSelector } from "react-redux"
// import { useEffect, useState, useCallback } from "react"
// import { useNavigate } from "react-router-dom"
// import { toast } from "react-toastify"
// import { summaryApi } from "common"
// import EditUserWidget from "./EditUserWidget"

// function UserWidget ({ userId, picture }){
//     const [user, setUser] = useState(null)
//     const [error, setError] = useState(null)
//     const {palette} = useTheme()
//     const navigate = useNavigate()
//     const token = useSelector((state)=> state.auth.token)
//     const reduxUser = useSelector((state) => state.auth.user)    
//     const dark = palette.neutral.dark
//     const medium = palette.neutral.medium
//     const main = palette.neutral.main

//     // Debug logging
//     useEffect(() => {
//         console.log("UserWidget - Received UserId:", userId)
//         console.log("UserWidget - Received PicturePath:", picture)
//         console.log("UserWidget - Redux User:", reduxUser)
//     }, [userId, picture, reduxUser])

//     const getUser = useCallback(async () => {
//         try {
//             // More robust user ID selection
//             const currentUserId = 
//                 userId || 
//                 reduxUser?.id || 
//                 reduxUser?._id || 
//                 (typeof reduxUser === 'object' ? Object.values(reduxUser)[0] : null);

//             console.log("Attempting to fetch user with ID:", currentUserId);

//             if (!currentUserId) {
//                 setError("No valid user ID found");
//                 console.error("No user ID available");
//                 return;
//             }

//             const userUrl = summaryApi.getUser.url.replace(':id', currentUserId);
    
//             const response = await fetch(userUrl, {
//                 method: "GET",
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             const responseData = await response.json();
//             console.log("Full user data response:", responseData);
            
//             if (response.ok && responseData.success) {
//                 setUser(responseData.userData);
//                 setError(null);
//             } else {
//                 throw new Error(responseData.message || "Failed to fetch user data");
//             }            
//         } catch (error) {
//             console.error("User fetch error:", error);
//             setError(error.message || "Network error. Please try again.");
//             toast.error(error.message || "Network error. Please try again."); 
//         }
//     }, [userId, reduxUser, token]);

//     useEffect(() => {
//         getUser();
//     }, [getUser]);

    
//     console.log("2", reduxUser)
//     console.log("1", user)
    

//     // Error handling
//     if (error) {
//         return (
//             <WidgetWrapper>
//                 <Typography color="error">
//                     {error}
//                 </Typography>
//             </WidgetWrapper>
//         );
//     }

//     // If no user data is available, use Redux user as fallback
//     const displayUser = reduxUser

//     if(!displayUser) {
//         console.warn("No user data available")
//         return null
//     }

//     // const {
//     //     firstName, 
//     //     lastName, 
//     //     location = '', 
//     //     occupation = '', 
//     //     viewedProfile = 0,
//     //     impressions = 0,
//     //     friends = []
//     // } = displayUser

//     const profileId =        
//         displayUser.id || 
//         (typeof displayUser === 'object' ? Object.values(displayUser)[0] : null)

//     console.log("Profile Navigation ID:", profileId)

//     // Destructuring with fallbacks
//     const {
//         firstName = 'user', 
//         lastName = '', 
//         location = '', 
//         occupation = '', 
//         viewedProfile = 0,
//         impressions = 0,
//         friends = [],
//         // picturePath = ''
//     } = displayUser

//     console.log("4", displayUser)




//     // Safe navigation for profile click
//     const handleProfileNavigation = () => {
//         console.log("Full displayUser:", displayUser);
    
//         // Validate and extract user ID
//         const userId = 
//             displayUser?._id || 
//             displayUser?.id || 
//             (typeof displayUser === 'object' ? Object.values(displayUser)[0] : null);
    
//         console.log("Extracted User ID:", userId);
    
//         if (!userId) {
//             console.error('Cannot navigate: No valid user ID');
//             toast.error('Unable to navigate to profile');
//             return;
//         }
    
//         // Ensure the userId is a valid string and trim any whitespace
//         const sanitizedUserId = String(userId).trim();
    
//         if (!sanitizedUserId) {
//             console.error('Sanitized user ID is empty');
//             toast.error('Invalid user identifier');
//             return;
//         }
    
//         console.log(`Navigating to profile: /profile/${sanitizedUserId}`);
//         navigate(`/profile/${sanitizedUserId}`, { state: { userId: sanitizedUserId } });
//     }


//     return(
//         <WidgetWrapper>
//              <FlexBetween
//                 gap="0.5rem"
//                 pb="1.1rem"
//                 onClick={handleProfileNavigation}
//              >
//                 <FlexBetween gap="1rem">
//                        <UserImage image={picture || displayUser?.picturePath || ''} />
//                        <Box>
//                           <Typography
//                              variant="h4"
//                              color={dark}
//                              fontWeight="500"
//                              sx={{
//                                 "&:hover":{
//                                     color: palette.primary.light,
//                                     cursor: "pointer"
//                                 }
//                              }}
//                           >
//                                {firstName} {lastName}
//                           </Typography>
//                           <Typography color={medium}>
//                              {friends.length} friends
//                           </Typography>
//                        </Box>
                       
//                 </FlexBetween> 
//                     <ManageAccountsOutlined/>
//                     </FlexBetween>
//                 <Divider/>

//                  {/*second row  */}
//                  <Box p="1rem 0">
//                      <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
//                         <LocationOnOutlined fontSize="large" sx={{ color: main}}/>
//                         <Typography color={medium}>{location}</Typography>   
//                     </Box> 
//                      <Box display="flex" alignItems="center" gap="1rem">
//                         <WorkOutlineOutlined fontSize="large" sx={{ color: main}}/>
//                         <Typography color={medium}>{occupation}</Typography>   
//                     </Box> 
//                  </Box>
//                  <Divider/>

//                  {/* third row */}
//                  <Box p="1rem 0">
//                     <FlexBetween mb="0.5rem">
//                            <Typography color={medium}>Who's viewed your profile</Typography>
//                            <Typography color={main} fontWeight="500">
//                                {viewedProfile}
//                            </Typography>
//                             <EditUserWidget/>
//                     </FlexBetween> 
//                     <FlexBetween>
//                          <Typography color={medium}>Impressions of your post</Typography>
//                            <Typography color={main} fontWeight="500">
//                                {impressions}
//                           </Typography>
//                     </FlexBetween> 
//                  </Box>
//                  <Divider/>

//                  {/* fourth row */}
//                  <Box p="1rem 0">
//                      <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
//                          Social Profiles
//                      </Typography>

//                      <FlexBetween gap="1rem" mb="0.5rem">
//                           <FlexBetween gap="1rem">
//                                <img src="../assets/twitter.png" alt="twitter" width="12px" height="12px" />
//                                <Box>
//                                   <Typography color={main} fontWeight="500" >
//                                      Twitter
//                                   </Typography>
//                                    <Typography color={medium}>Social Network</Typography>
//                                </Box>
//                           </FlexBetween>
//                           <EditOutlined sx={{ color: main }}/>
//                      </FlexBetween>

//                      <FlexBetween gap="1rem">
//                           <FlexBetween gap="1rem">
//                                <img src="../assets/linkedin.png" alt="linkedin" width="12px" height="12px" />
//                                <Box>
//                                   <Typography color={main} fontWeight="500">
//                                      Facebook
//                                   </Typography>
//                                    <Typography color={medium}>Social Network</Typography>
//                                </Box>
//                           </FlexBetween>
//                           <EditOutlined sx={{ color: main }}/>
//                      </FlexBetween>
//                      <FlexBetween gap="1rem">
//                           <FlexBetween gap="1rem">
//                                <img src="../assets/linkedin.png" alt="linkedin" width="12px" height="12px" />
//                                <Box>
//                                   <Typography color={main} fontWeight="500">
//                                      Instagram
//                                   </Typography>
//                                    <Typography color={medium}>Social Network</Typography>
//                                </Box>
//                           </FlexBetween>
//                           <EditOutlined sx={{ color: main }}/>
//                      </FlexBetween>
//                      <FlexBetween gap="1rem">
//                           <FlexBetween gap="1rem">
//                                <img src="../assets/linkedin.png" alt="linkedin" width="12px" height="12px" />
//                                <Box>
//                                   <Typography color={main} fontWeight="500">
//                                      LinkedIn
//                                   </Typography>
//                                    <Typography color={medium}>Network Platform</Typography>
//                                </Box>
//                           </FlexBetween>
//                           <EditOutlined sx={{ color: main }}/>
//                      </FlexBetween>
//                  </Box>
             
//         </WidgetWrapper>
//     )
// }

// export default UserWidget;

// import {
//     ManageAccountsOutlined,
//     EditOutlined,
//     LocationOnOutlined,
//     WorkOutlineOutlined
// } from "@mui/icons-material"
// import { Box, Typography, Divider, useTheme } from "@mui/material"
// import UserImage from "components/UserImage"
// import FlexBetween from "components/FlexBetween"
// import WidgetWrapper from "components/WidgetWrapper"
// import { useSelector } from "react-redux"
// import { useEffect, useState, useCallback } from "react"
// import { useNavigate } from "react-router-dom"
// import { toast } from "react-toastify"
// import { summaryApi } from "common"
// import EditUserWidget from "./EditUserWidget"

// function UserWidget ({ userId, picture }){
//     const [user, setUser] = useState(null)
//     const [error, setError] = useState(null)
//     const {palette} = useTheme()
//     const navigate = useNavigate()
//     const token = useSelector((state)=> state.auth.token)
//     const reduxUser = useSelector((state) => state.auth.user)    
//     const dark = palette.neutral.dark
//     const medium = palette.neutral.medium
//     const main = palette.neutral.main

//     // Destructuring with fallbacks
//     const {
//         firstName = 'User', 
//         lastName = '', 
//         location = 'Not specified', 
//         occupation = 'Not specified', 
//         viewedProfile = 0,
//         impressions = 0,
//         friends = [],
//         picturePath = '',
//         socialProfiles = {
//             twitter: '',
//             facebook: '',
//             instagram: '',
//             linkedin: ''
//         }
//     } = reduxUser || {}

//     const handleProfileNavigation = () => {
//         const userId = 
//             reduxUser?._id || 
//             reduxUser?.id || 
//             (typeof reduxUser === 'object' ? Object.values(reduxUser)[0] : null);
    
//         if (!userId) {
//             console.error('Cannot navigate: No valid user ID');
//             toast.error('Unable to navigate to profile');
//             return;
//         }
    
//         const sanitizedUserId = String(userId).trim();
    
//         if (!sanitizedUserId) {
//             console.error('Sanitized user ID is empty');
//             toast.error('Invalid user identifier');
//             return;
//         }
    
//         navigate(`/profile/${sanitizedUserId}`, { state: { userId: sanitizedUserId } });
//     }

//     // Error handling
//     if (!reduxUser) {
//         return (
//             <WidgetWrapper>
//                 <Typography color="error">
//                     No user data available
//                 </Typography>
//             </WidgetWrapper>
//         );
//     }

//     return(
//         <WidgetWrapper>
//              <FlexBetween
//                 gap="0.5rem"
//                 pb="1.1rem"
//                 onClick={handleProfileNavigation}
//              >
//                 <FlexBetween gap="1rem">
//                        <UserImage image={picture || picturePath || ''} />
//                        <Box>
//                           <Typography
//                              variant="h4"
//                              color={dark}
//                              fontWeight="500"
//                              sx={{
//                                 "&:hover":{
//                                     color: palette.primary.light,
//                                     cursor: "pointer"
//                                 }
//                              }}
//                           >
//                                {firstName} {lastName}
//                           </Typography>
//                           <Typography color={medium}>
//                              {friends.length} friends
//                           </Typography>
//                        </Box>
                       
//                 </FlexBetween> 
//                     <ManageAccountsOutlined/>
//                     </FlexBetween>
//                 <Divider/>

//                  {/*second row  */}
//                  <Box p="1rem 0">
//                      <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
//                         <LocationOnOutlined fontSize="large" sx={{ color: main}}/>
//                         <Typography color={medium}>{location}</Typography>   
//                     </Box> 
//                      <Box display="flex" alignItems="center" gap="1rem">
//                         <WorkOutlineOutlined fontSize="large" sx={{ color: main}}/>
//                         <Typography color={medium}>{occupation}</Typography>   
//                     </Box> 
//                  </Box>
//                  <Divider/>

//                  {/* third row */}
//                  <Box p="1rem 0">
//                     <FlexBetween mb="0.5rem">
//                            <Typography color={medium}>Who's viewed your profile</Typography>
//                            <Typography color={main} fontWeight="500">
//                                {viewedProfile}
//                            </Typography>
//                             <EditUserWidget/>
//                     </FlexBetween> 
//                     <FlexBetween>
//                          <Typography color={medium}>Impressions of your post</Typography>
//                            <Typography color={main} fontWeight="500">
//                                {impressions}
//                           </Typography>
//                     </FlexBetween> 
//                  </Box>
//                  <Divider/>

//                  {/* fourth row - Social Profiles */}
//                  <Box p="1rem 0">
//                      <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
//                          Social Profiles
//                      </Typography>

//                      {socialProfiles.twitter && (
//                      <FlexBetween gap="1rem" mb="0.5rem">
//                           <FlexBetween gap="1rem">
//                                <img src="../assets/twitter.png" alt="twitter" width="12px" height="12px" />
//                                <Box>
//                                   <Typography color={main} fontWeight="500" >
//                                      Twitter
//                                   </Typography>
//                                    <Typography color={medium}>{socialProfiles.twitter}</Typography>
//                                </Box>
//                           </FlexBetween>
//                           <EditOutlined sx={{ color: main }}/>
//                      </FlexBetween>
//                      )}

//                      {socialProfiles.facebook && (
//                      <FlexBetween gap="1rem" mb="0.5rem">
//                           <FlexBetween gap="1rem">
//                                <img src="../assets/linkedin.png" alt="linkedin" width="12px" height="12px" />
//                                <Box>
//                                   <Typography color={main} fontWeight="500">
//                                      Facebook
//                                   </Typography>
//                                    <Typography color={medium}>{socialProfiles.facebook}</Typography>
//                                </Box>
//                           </FlexBetween>
//                           <EditOutlined sx={{ color: main }}/>
//                      </FlexBetween>
//                      )}

//                      {socialProfiles.instagram && (
//                      <FlexBetween gap="1rem" mb="0.5rem">
//                           <FlexBetween gap="1rem">
//                                <img src="../assets/linkedin.png" alt="linkedin" width="12px" height="12px" />
//                                <Box>
//                                   <Typography color={main} fontWeight="500">
//                                      Instagram
//                                   </Typography>
//                                    <Typography color={medium}>{socialProfiles.instagram}</Typography>
//                                </Box>
//                           </FlexBetween>
//                           <EditOutlined sx={{ color: main }}/>
//                      </FlexBetween>
//                      )}

//                      {socialProfiles.linkedin && (
//                      <FlexBetween gap="1rem">
//                           <FlexBetween gap="1rem">
//                                <img src="../assets/linkedin.png" alt="linkedin" width="12px" height="12px" />
//                                <Box>
//                                   <Typography color={main} fontWeight="500">
//                                      LinkedIn
//                                   </Typography>
//                                    <Typography color={medium}>{socialProfiles.linkedin}</Typography>
//                                </Box>
//                           </FlexBetween>
//                           <EditOutlined sx={{ color: main }}/>
//                      </FlexBetween>
//                      )}
//                  </Box>
//         </WidgetWrapper>
//     )
// }

// export default UserWidget;


import {
    ManageAccountsOutlined,
    EditOutlined,
    LocationOnOutlined,
    WorkOutlineOutlined
} from "@mui/icons-material"
import { Box, Typography, Divider, useTheme } from "@mui/material"
import UserImage from "components/UserImage"
import FlexBetween from "components/FlexBetween"
import WidgetWrapper from "components/WidgetWrapper"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import EditUserWidget from "./EditUserWidget"

function UserWidget ({ userId, picture }){
    const [isLoading, setIsLoading] = useState(true)
    const {palette} = useTheme()
    const navigate = useNavigate()
    const reduxUser = useSelector((state) => state.auth.user)    
    const dark = palette.neutral.dark
    const medium = palette.neutral.medium
    const main = palette.neutral.main

    // Add a console log to track user changes
    useEffect(() => {
        console.log("UserWidget - Current User:", reduxUser);
        if (reduxUser) {
            setIsLoading(false)
        }
    }, [reduxUser]);

    // Destructuring with comprehensive fallbacks
    const {
        firstName = 'User', 
        lastName = '', 
        location = 'Not specified', 
        occupation = 'Not specified', 
        viewedProfile = 0,
        impressions = 0,
        friends = [],
        picturePath = '',
        bio = '',
        socialProfiles = {
            twitter: '',
            facebook: '',
            instagram: '',
            linkedin: ''
        }
    } = reduxUser || {};

    const handleProfileNavigation = () => {
        const userId = 
            reduxUser?._id || 
            reduxUser?.id || 
            (typeof reduxUser === 'object' ? Object.values(reduxUser)[0] : null);
    
        if (!userId) {
            console.error('Cannot navigate: No valid user ID');
            toast.error('Unable to navigate to profile');
            return;
        }
    
        const sanitizedUserId = String(userId).trim();
    
        if (!sanitizedUserId) {
            console.error('Sanitized user ID is empty');
            toast.error('Invalid user identifier');
            return;
        }
    
        navigate(`/profile/${sanitizedUserId}`, { state: { userId: sanitizedUserId } });
    }

    // Loading state
    if (isLoading) {
        return (
            <WidgetWrapper>
                <Typography>Loading user data...</Typography>
            </WidgetWrapper>
        );
    }

    // No user data fallback
    if (!reduxUser) {
        return (
            <WidgetWrapper>
                <Typography color="error">
                    No user data available. Please log in or refresh.
                </Typography>
            </WidgetWrapper>
        );
    }

    return(
        <WidgetWrapper>
             <FlexBetween
                gap="0.5rem"
                pb="1.1rem"
                onClick={handleProfileNavigation}
             >
                <FlexBetween gap="1rem">
                       <UserImage image={picture || picturePath || ''} />
                       <Box>
                          <Typography
                             variant="h4"
                             color={dark}
                             fontWeight="500"
                             sx={{
                                "&:hover":{
                                    color: palette.primary.light,
                                    cursor: "pointer"
                                }
                             }}
                          >
                               {firstName} {lastName}
                          </Typography>
                          <Typography color={medium}>
                             {friends.length} friends
                          </Typography>
                       </Box>
                       
                </FlexBetween> 
                    <ManageAccountsOutlined/>
                    </FlexBetween>
                <Divider/>
                  <FlexBetween>
                     <Typography color={medium} gap="3px">
                          <EditUserWidget/> Edit Profile
                     </Typography>
                  </FlexBetween>
                <Divider/>

                 {/*second row  */}
                 <Box p="1rem 0">
                     <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                        <LocationOnOutlined fontSize="large" sx={{ color: main}}/>
                        <Typography color={medium}>{location}</Typography>   
                    </Box> 
                     <Box display="flex" alignItems="center" gap="1rem">
                        <WorkOutlineOutlined fontSize="large" sx={{ color: main}}/>
                        <Typography color={medium}>{occupation}</Typography>   
                    </Box> 
                 </Box>
                 <Divider/>

                 {/* third row */}
                 <Box p="1rem 0">
                    <FlexBetween mb="0.5rem">
                           <Typography color={medium}>Who's viewed your profile</Typography>
                           <Typography color={main} fontWeight="500">
                               {viewedProfile}
                           </Typography>
                            
                    </FlexBetween> 
                    <FlexBetween>
                         <Typography color={medium}>Impressions of your post</Typography>
                           <Typography color={main} fontWeight="500">
                               {impressions}
                          </Typography>
                    </FlexBetween> 
                 </Box>
                 <Divider/>

                 {/* fourth row - Social Profiles */}
                 <Box p="1rem 0">
                     <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
                         Social Profiles
                     </Typography>

                     {socialProfiles.twitter && (
                     <FlexBetween gap="1rem" mb="0.5rem">
                          <FlexBetween gap="1rem">
                               <img src="../assets/twitter.png" alt="twitter" width="12px" height="12px" />
                               <Box>
                                  <Typography color={main} fontWeight="500" >
                                     Twitter
                                  </Typography>
                                   <Typography color={medium}>{socialProfiles.twitter}</Typography>
                               </Box>
                          </FlexBetween>
                          <EditOutlined sx={{ color: main }}/>
                     </FlexBetween>
                     )}

                     {socialProfiles.facebook && (
                     <FlexBetween gap="1rem" mb="0.5rem">
                          <FlexBetween gap="1rem">
                               <img src="../assets/linkedin.png" alt="linkedin" width="12px" height="12px" />
                               <Box>
                                  <Typography color={main} fontWeight="500">
                                     Facebook
                                  </Typography>
                                   <Typography color={medium}>{socialProfiles.facebook}</Typography>
                               </Box>
                          </FlexBetween>
                          <EditOutlined sx={{ color: main }}/>
                     </FlexBetween>
                     )}

                     {socialProfiles.instagram && (
                     <FlexBetween gap="1rem" mb="0.5rem">
                          <FlexBetween gap="1rem">
                               <img src="../assets/linkedin.png" alt="linkedin" width="12px" height="12px" />
                               <Box>
                                  <Typography color={main} fontWeight="500">
                                     Instagram
                                  </Typography>
                                   <Typography color={medium}>{socialProfiles.instagram}</Typography>
                               </Box>
                          </FlexBetween>
                          <EditOutlined sx={{ color: main }}/>
                     </FlexBetween>
                     )}

                     {socialProfiles.linkedin && (
                     <FlexBetween gap="1rem">
                          <FlexBetween gap="1rem">
                               <img src="../assets/linkedin.png" alt="linkedin" width="12px" height="12px" />
                               <Box>
                                  <Typography color={main} fontWeight="500">
                                     LinkedIn
                                  </Typography>
                                   <Typography color={medium}>{socialProfiles.linkedin}</Typography>
                               </Box>
                          </FlexBetween>
                          <EditOutlined sx={{ color: main }}/>
                     </FlexBetween>
                     )}
                     <Divider/>
                     <Box p="1rem 0">
                        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">Bio</Typography>
                    <FlexBetween mb="0.5rem">                           
                           <Typography color={main} fontWeight="500">
                               {bio}
                           </Typography>
                            
                    </FlexBetween> 
                    
                 </Box>
                 </Box>
        </WidgetWrapper>
    )
}

export default UserWidget;