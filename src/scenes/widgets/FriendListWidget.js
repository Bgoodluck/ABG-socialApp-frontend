import { Box, Typography, useTheme } from "@mui/material";
import { summaryApi } from "common";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "store/userSlice";
import { selectFriends } from 'store/friendsSelectors'

function FriendListWidget({ userId }){
    const dispatch = useDispatch()    
    const { palette } = useTheme()
    const token = useSelector((state)=> state.auth.token) 
    const { _id } = useSelector((state) => state.auth.user)
    const friends = useSelector(selectFriends);

    const getFriends = async()=>{
        try {
            // Use the correct user ID (either passed in or from current user)
            const currentUserId = userId || _id;

            const url = summaryApi.getUserFriends.url
                .replace(':id', currentUserId);

            const response = await fetch(url, {
                method: summaryApi.getUserFriends.method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Error fetching data")
            }

            const data = await response.json();
            // Update friends in the store using the correct payload
            dispatch(setFriends({ friends: data.data.friends }));
            
        } catch (error) {
            console.error("Failed to fetch friends:", error);
        }
    }

    useEffect(()=>{
        getFriends()
        // eslint-disable-next-line
    },[])

    return(
        <WidgetWrapper>
            <Typography
                color={palette.neutral.dark}
                variant="h5"
                fontWeight="500"
                sx={{ mb: "1.5rem" }}
            >
                Friend List
            </Typography>
            <Box display="flex" flexDirection="column" gap="1.5rem">
                {friends.length > 0 ? (
                    friends.map((friend, index)=>(
                        <Friend 
                            key={index}
                            friendId={friend._id} 
                            name={`${friend.firstName} ${friend.lastName}`}
                            subtitle={friend.occupation} 
                            userPicture={friend.picturePath}
                        />
                    ))
                ) : (
                    <Typography>No friends found</Typography>
                )}
            </Box>
        </WidgetWrapper>
    )
}

export default FriendListWidget;