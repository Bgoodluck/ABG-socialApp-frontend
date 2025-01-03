// import { createSlice } from "@reduxjs/toolkit";


// const initialState = {
//     mode: "light",
//     user: null,
//     token: null,
//     posts: []
// };


// export const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers: {
//         setMode: (state) => {
//             state.mode = state.mode === "light"  ? "dark" : "light";
//         },
//         setLogin: (state, action) => {
//             console.log("Full Login Payload:", action.payload);
//             state.user = {
//                 ...state.user,
//                 ...action.payload.user,
//                 picturePath: action.payload.user.picture || action.payload.user.picturePath || state.user.picturePath
//             };
//             state.token = action.payload.token || state.token;
//             console.log("Updated User State:", state.user);
//         },
//         setLogout: (state) => {
//             state.user = null;
//             state.token = null;           
//         },
//         setFriends: (state, action)=>{
//             if (state.user) {
//                 state.user.friends = action.payload.friends;                
//             } else{
//                 console.log("User friends non-existent :(");
//             }
//         },
//         setUser: (state, action) => {
//             state.user = action.payload;
//         },
//         setToken: (state, action) => {
//             state.token = action.payload;
//         },
//         setPosts: (state, action) => {
//             state.posts = action.payload.posts;
//         },
//         setPost: (state, action) => {
//             if (action.payload.post) {
//                 const updatedPosts = state.posts.map((post) => {  
//                     if(post._id === action.payload.post._id) {
//                         return action.payload.post;
//                     }
//                     return post;
//                 });
                
//                 // If the post is not in the existing posts, add it to the beginning
//                 if (!updatedPosts.some(post => post._id === action.payload.post._id)) {
//                     updatedPosts.unshift(action.payload.post);
//                 }
                
//                 state.posts = updatedPosts;
//             }
//         }
//     }
// })


// export const {
//     setMode,
//     setLogin,
//     setLogout,
//     setFriends,
//     setUser,
//     setToken,
//     setPosts,
//     setPost
// } = authSlice.actions

// export default authSlice.reducer;






import { createSlice } from "@reduxjs/toolkit";
import { userCache } from 'helpers/userCache';

const initialState = {
    mode: "light",
    user: null,
    token: null,
    posts: [],
    adverts: {
        list: [],
        currentAdvert: null,
        totalPages: 1,
        currentPage: 1
    }
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action) => {
            state.user = {
                ...state.user,
                ...action.payload.user,
                picturePath: action.payload.user.picture || action.payload.user.picturePath || state.user?.picturePath
            };
            state.token = action.payload.token || state.token;
            
            // If user data is updated, invalidate their cache entry
            if (state.user?._id || state.user?.id) {
                userCache.invalidate(state.user._id || state.user.id);
            }
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
            // Clear entire cache on logout
            userCache.clear();
        },
        setFriends: (state, action) => {
            if (state.user) {
                state.user.friends = action.payload.friends;
            }
        },
        setUser: (state, action) => {
            state.user = action.payload;
            // Invalidate specific user's cache entry
            if (action.payload?._id || action.payload?.id) {
                userCache.invalidate(action.payload._id || action.payload.id);
            }
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => {
            if (action.payload.post) {
                const updatedPosts = state.posts.map((post) => {  
                    if (post._id === action.payload.post._id) {
                        return action.payload.post;
                    }
                    return post;
                });
                
                if (!updatedPosts.some(post => post._id === action.payload.post._id)) {
                    updatedPosts.unshift(action.payload.post);
                }
                
                state.posts = updatedPosts;
            }
        },

        setAdverts: (state, action) => {
            state.adverts.list = action.payload.adverts;
            state.adverts.totalPages = action.payload.totalPages;
        },
        addAdvert: (state, action) => {
            state.adverts.list = [action.payload, ...state.adverts.list];
            state.adverts.currentAdvert = action.payload;
        },
        removeAdvert: (state, action) => {
            state.adverts.list = state.adverts.list.filter(
                (advert) => advert._id !== action.payload
            );
        },
        setCurrentAdvert: (state, action) => {
            state.adverts.currentAdvert = action.payload;
        },
        setAdvertPage: (state, action) => {
            state.adverts.currentPage = action.payload;
        }
    }
});

export const {
    setMode,
    setLogin,
    setLogout,
    setFriends,
    setUser,
    setToken,
    setPosts,
    setPost,
    setAdverts,
    addAdvert,
    removeAdvert,
    setCurrentAdvert,
    setAdvertPage
} = authSlice.actions;

export default authSlice.reducer;