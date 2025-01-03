import React from 'react'
import { PersonAddOutlined, PersonRemoveOutlined } from '@mui/icons-material'
import { Box, IconButton, Typography, useTheme } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setFriends } from 'store/userSlice'
import FlexBetween from './FlexBetween'
import UserImage from './UserImage'
import { useNavigate } from 'react-router-dom'
import { summaryApi } from 'common'
import { selectIsFriend } from 'store/friendsSelectors'





function Friend({
    friendId,
    name,
    subtitle,
    userPicture
}) {
    const dispatch = useDispatch()    
    const { id, picturePath } = useSelector((state) => state.auth.user || {})
    const navigate = useNavigate()
    const token = useSelector((state)=> state.auth.token)
    
    // Use the new memoized selector
    const isFriend = useSelector(state => selectIsFriend(state, friendId));

    const { palette } = useTheme()
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium

    const userId = id ;
    
    
    // Use Boolean to ensure a boolean result
    // const isFriend = Boolean(friends.find((friend) => friend._id === friendId));

    const handleFriend = async (friendId) => {
        if (!userId || !friendId) {
            console.error("Missing userId or friendId");
            return;
        }
    
        try {
            const url = summaryApi.addRemoveFriend.url
                .replace(':id', userId)
                .replace(':friendsId', friendId);
    
            const response = await fetch(url, {
                method: summaryApi.addRemoveFriend.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to add/remove friend');
            }
    
            const data = await response.json();
            
            // Update friends in the store
            dispatch(setFriends({ friends: data.data.friends }));
            
            console.log(data.message);
        } catch (error) {
            console.error('Friend action failed:', error);
        }
    };


    const handleProfileNavigation = () => {
        // Ensure friendId is valid
        if (!friendId) {
            console.error('Cannot navigate: No valid friend ID');
            return;
        }
    
        // Navigate to the friend's profile
        navigate(`/profile/${friendId}`);
    };
    
    


  return (
    <FlexBetween>
          <FlexBetween gap="1rem">
               <UserImage image={userPicture} size='55px' />
               <Box
                 onClick={handleProfileNavigation}
               >
                  <Typography
                      color={main}
                      variant='h5'
                      fontWeight="500"
                      sx={{
                        "&:hover": {
                            color: palette.primary.light,
                            cursor: "pointer"
                        }
                      }}
                  >
                      {name}
                  </Typography>
                  <Typography color={medium} fontSize="0.75rem">
                    {subtitle}
                  </Typography>
               </Box>
          </FlexBetween>
          {/* <IconButton onClick={() => handleFriend(friendId)} disabled={isFriend}></IconButton> */}
          <IconButton 
             onClick={() => handleFriend(friendId)}
             sx={{
                backgroundColor: primaryLight, p: "0.6rem"
             }}
         >
            {isFriend ? (
                <PersonRemoveOutlined
                    sx={{ color: primaryDark }}
                />) : (
                <PersonAddOutlined
                     sx={{ color: primaryDark }} 
                />
                )}
 
         </IconButton>
    </FlexBetween>
  )
}

export default Friend