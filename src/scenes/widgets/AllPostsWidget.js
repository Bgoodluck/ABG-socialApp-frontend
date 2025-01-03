// import React, { useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import { setPosts } from 'store/userSlice'
// import { summaryApi } from 'common';
// import SinglePostWidget from './SinglePostWidget';

// function AllPostsWidget({ userId, isProfile }) {
//     const dispatch = useDispatch();
//     // Initialize posts as an empty array to prevent undefined error
//     const posts = useSelector((state) => state.auth.posts || [])
//     const token = useSelector((state) => state.auth.token)

    

//     const getPosts = async () => {
//         try {
//             const response = await fetch(summaryApi.getAllPost.url, {
//                 method: summaryApi.getAllPost.method,
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 }
//             })
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             const data = await response.json();
            
//             // More robust way to get posts
//             const postsData = data.posts || data.userPosts || [];
//             dispatch(setPosts({ posts: postsData }));
//         } catch (error) {
//             console.error("Error fetching posts:", error.message);            
//         }
//     }
    
//     const getUserPost = async (userId) => {
//         try {
//             const response = await fetch(
//                 summaryApi.userPost.url.replace(':userId', userId), 
//                 {
//                     method: summaryApi.userPost.method,
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 }
//             );
            
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
            
//             const data = await response.json();
//             if (data.success) {
//                 const userPostsData = data.userPosts || data.posts || [];
//                 dispatch(setPosts({ posts: userPostsData }));
//             }
//         } catch (error) {
//             console.error("Error fetching user posts:", error.message);
//         }
//     }

//     useEffect(() => {
//         if (isProfile && userId) {
//             getUserPost(userId);
//         } else {
//             getPosts();
//         }
//     }, [isProfile, userId]); 



//     const getLivePosts = async()=>{
//         try {
//             const response = await fetch(summaryApi.getLivePost.url, {
//                 method: summaryApi.getLivePost.method,
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 }
//             })
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             const data = await response.json();
            
//             // More robust way to get live posts
//             const livePostsData = data.posts || [];
//             dispatch(setPosts({ posts: livePostsData }));
//         } catch (error) {
//             console.error("Error fetching live posts:", error.message);            
//         }
//     }



//     const getLiveByPostId = async(postId)=>{
//         try {
//             const response = await fetch(`${summaryApi.getLivePostId.url}/${postId}`, {
//                 method: summaryApi.getLivePostId.method,
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 }
//             })
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             const data = await response.json();
            
//             // More robust way to get live posts
//             const livePostsData = data.posts || [];
//             dispatch(setPosts({ posts: livePostsData }));
//         } catch (error) {
//             console.error("Error fetching live posts by postId:", error.message);            
//         }
//     }


//     useEffect(()=>{
//         getLivePosts();
//         getLiveByPostId(); // replace postId with the actual postId you want to get live updates for
//     })





//     // Optional: Add a loading state or placeholder
//     if (posts.length === 0) {
//         return <div>No posts found</div>;
//     }

//     return (
//         <>
//             {posts.map(({
//                 _id,
//                 userId: postUserId,
//                 firstName,
//                 lastName,
//                 description,
//                 location,
//                 userPicture,
//                 picture,
//                 video,
//                 mixSeriesId,
//                 likes,
//                 comments     
//             }) => (
//                 <SinglePostWidget
//                     key={_id}
//                     postId={_id}
//                     postUserId={postUserId}
//                     name={`${firstName} ${lastName}`}
//                     description={description}
//                     location={location}
//                     userPicture={userPicture}
//                     picture={picture}
//                     video={video}
//                     mixSeriesId={mixSeriesId}
//                     likes={likes}
//                     comments={comments}
//                 />
//             ))}
//         </>
//     )
// }

// export default AllPostsWidget



import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPosts } from 'store/userSlice';
import { summaryApi } from 'common';
import SinglePostWidget from './SinglePostWidget';

function AllPostsWidget({ userId, isProfile, livePostId }) {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.auth.posts || []);
    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            let postsData = [];

            // Fetch posts based on context
            if (isProfile && userId) {
                // Fetch user-specific posts
                const response = await fetch(
                    summaryApi.userPost.url.replace(':userId', userId),
                    {
                        method: summaryApi.userPost.method,
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                postsData = data.userPosts || data.posts || [];
            } else {
                // Fetch all posts
                const allPostsResponse = await fetch(summaryApi.getAllPost.url, {
                    method: summaryApi.getAllPost.method,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!allPostsResponse.ok) {
                    throw new Error(`HTTP error! status: ${allPostsResponse.status}`);
                }

                const allPostsData = await allPostsResponse.json();
                postsData = allPostsData.posts || allPostsData.userPosts || [];
            }

            // If livePostId is provided, fetch specific post
            if (livePostId) {
                const specificPostResponse = await fetch(
                    `${summaryApi.getLivePostId.url}/${livePostId}`, 
                    {
                        method: summaryApi.getLivePostId.method,
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (!specificPostResponse.ok) {
                    throw new Error(`HTTP error! status: ${specificPostResponse.status}`);
                }

                const specificPostData = await specificPostResponse.json();
                if (specificPostData.post) {
                    postsData = [specificPostData.post];
                }
            }

            console.log("Fetched Posts:", postsData);
            
            // Normalize posts data
            const normalizedPosts = postsData.map(post => ({
                ...post,
                userPicture: post.userPicture || (user && user.picturePath) || '',
                mediaFiles: post.mediaFiles || []
            }));

            dispatch(setPosts({ posts: normalizedPosts }));
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setIsLoading(false);
        }
    };


    const handlePostDelete = (deletedPostId) => {
        dispatch(setPosts({ 
            posts: posts.filter(post => post._id !== deletedPostId)
        }));
    };

    useEffect(() => {
        fetchPosts();
    }, [isProfile, userId, livePostId]);

    if (isLoading) {
        return <div>Loading posts...</div>;
    }

    if (posts.length === 0) {
        return <div>No posts found</div>;
    }

    
    return (
    <>
        {posts.map(({
            _id,
            userId: postUserId,
            firstName,
            lastName,
            description,
            location,
            userPicture,
            picture,
            video,
            mixSeriesId,
            likes,
            comments,
            mediaFiles = []
        }) => {
            // Improved media file detection
            const imageFile = mediaFiles.find(file => 
                file.type === 'image' || 
                file.mimetype?.startsWith('image/')
            );

            const videoFile = mediaFiles.find(file => 
                file.type === 'video' || 
                file.type === 'raw' || 
                file.type === 'mp4' || 
                file.type === 'quicktime' || 
                file.type === 'webm' ||
                file.mimetype?.startsWith('video/')
            );

            const audioFile = mediaFiles.find(file => 
                file.type === 'audio' || 
                file.mimetype?.startsWith('audio/')
            );

            return (
                <SinglePostWidget
                    key={_id}
                    postId={_id}
                    postUserId={postUserId}
                    name={`${firstName} ${lastName}`}
                    description={description}
                    location={location}
                    userPicture={
                        userPicture || 
                        picture || 
                        (user && user.picturePath) || 
                        ''
                    }
                    picture={
                        picture || 
                        (imageFile && `/uploads/${imageFile.path}`) || 
                        (mediaFiles[0] && `/uploads/${mediaFiles[0].path}`)
                    }
                    video={
                        video || 
                        (videoFile && `/uploads/${videoFile.path}`) ||
                        (audioFile && `/uploads/${audioFile.path}`)
                    }
                    mixSeriesId={mixSeriesId}
                    likes={likes}
                    comments={comments}
                    onPostDelete={handlePostDelete}
                />
            );
        })}
    </>
);
}

export default AllPostsWidget;

// import React, { useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import { setPosts } from 'store/userSlice'
// import { summaryApi } from 'common';
// import SinglePostWidget from './SinglePostWidget';

// function AllPostsWidget({ userId, isProfile }) {
//     const dispatch = useDispatch();
//     const posts = useSelector((state) => state.auth.posts || [])
//     const token = useSelector((state) => state.auth.token)

//     const fetchLivePosts = async () => {
//         try {
//             const livePostResponse = await fetch(summaryApi.getLivePost.url, {
//                 method: summaryApi.getLivePost.method,
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                 },
//             });
            
//             const userLivePostResponse = await fetch(
//                 isProfile && userId 
//                     ? summaryApi.getLivePostId.url.replace(':id', userId)
//                     : summaryApi.getLivePost.url, 
//                 {
//                     method: summaryApi.getLivePostId.method,
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                     },
//                 }
//             );

//             if (!livePostResponse.ok || !userLivePostResponse.ok) {
//                 throw new Error('Failed to fetch live posts');
//             }

//             const livePostData = await livePostResponse.json();
//             const userLivePostData = await userLivePostResponse.json();

//             // Combine or prioritize live posts
//             const combinedPosts = [
//                 ...(livePostData.post ? [livePostData.post] : []),
//                 ...(userLivePostData.post ? [userLivePostData.post] : [])
//             ];

//             // Existing post fetching logic
//             const postsResponse = isProfile && userId 
//                 ? await fetch(summaryApi.userPost.url.replace(':userId', userId), {
//                     method: summaryApi.userPost.method,
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 })
//                 : await fetch(summaryApi.getAllPost.url, {
//                     method: summaryApi.getAllPost.method,
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 });

//             const postsData = await postsResponse.json();
//             const regularPosts = postsData.posts || postsData.userPosts || [];

//             // Merge live posts with regular posts, avoiding duplicates
//             const uniquePosts = [
//                 ...combinedPosts,
//                 ...regularPosts.filter(post => 
//                     !combinedPosts.some(livePost => livePost._id === post._id)
//                 )
//             ];

//             dispatch(setPosts({ posts: uniquePosts }));

//         } catch (error) {
//             console.error("Error fetching live and regular posts:", error);
//         }
//     };

//     useEffect(() => {
//         fetchLivePosts();
//     }, [isProfile, userId, token]);

//     // Optional: Add a loading state or placeholder
//     if (posts.length === 0) {
//         return <div>No posts found</div>;
//     }

//     return (
//         <>
//             {posts.map(({
//                 _id,
//                 userId: postUserId,
//                 firstName,
//                 lastName,
//                 description,
//                 location,
//                 userPicture,
//                 picture,
//                 video,
//                 mixSeriesId,
//                 likes,
//                 comments     
//             }) => (
//                 <SinglePostWidget
//                     key={_id}
//                     postId={_id}
//                     postUserId={postUserId}
//                     name={`${firstName} ${lastName}`}
//                     description={description}
//                     location={location}
//                     userPicture={userPicture}
//                     picture={picture}
//                     video={video}
//                     mixSeriesId={mixSeriesId}
//                     likes={likes}
//                     comments={comments}
//                 />
//             ))}
//         </>
//     )
// }

// export default AllPostsWidget



// import React, { useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import { setPosts } from 'store/userSlice'
// import { summaryApi } from 'common';
// import SinglePostWidget from './SinglePostWidget';

// function AllPostsWidget({ userId, isProfile }) {
//     const dispatch = useDispatch();
//     const posts = useSelector((state) => state.auth.posts || [])
//     const token = useSelector((state) => state.auth.token)
//     const { 
//         id, 
//         firstName, 
//         lastName, 
//         picturePath  // Directly get picturePath from the user object in Redux
//       } = useSelector((state) => state.auth.user);

//     console.log("popopop", userId)
//     console.log("gOAL", isProfile)
//     console.log("JelL", picturePath)
    

//     const fetchLivePosts = async () => {
//         try {
//             const livePostResponse = await fetch(summaryApi.getLivePost.url, {
//                 method: summaryApi.getLivePost.method,
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                 },
//             });
            
//             const userLivePostResponse = await fetch(
//                 isProfile && userId
                
//                     ? summaryApi.getLivePostId.url.replace(':id', userId)
//                     : summaryApi.getLivePost.url, 
//                 {
//                     method: summaryApi.getLivePostId.method,
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                     },
//                 }
//             );

            
    
//             if (!livePostResponse.ok || !userLivePostResponse.ok) {
//                 throw new Error('Failed to fetch live posts');
//             }
    
//             const livePostData = await livePostResponse.json();
//             const userLivePostData = await userLivePostResponse.json();
    
//             console.log('Live Post Data:', livePostData);
//             console.log('User Live Post Data:', userLivePostData);
    
//             // Enhance live posts with additional properties
//             const enhancedLivePosts = [
//                 ...(livePostData.post ? [{ 
//                     ...livePostData.post, 
//                     isLivePost: true,
//                     mediaFiles: livePostData.post.mediaFiles || [] // Ensure mediaFiles exists
//                 }] : []),
//                 ...(userLivePostData.post ? [{ 
//                     ...userLivePostData.post, 
//                     isLivePost: true,
//                     mediaFiles: userLivePostData.post.mediaFiles || [] // Ensure mediaFiles exists
//                 }] : [])
//             ];
    
//             // Existing post fetching logic
//             const postsResponse = isProfile && userId 
//                 ? await fetch(summaryApi.userPost.url.replace(':userId', userId), {
//                     method: summaryApi.userPost.method,
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 })
//                 : await fetch(summaryApi.getAllPost.url, {
//                     method: summaryApi.getAllPost.method,
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 });
    
//             const postsData = await postsResponse.json();
//             const regularPosts = postsData.posts || postsData.userPosts || [];
    
//             // Merge live posts with regular posts, avoiding duplicates
//             const uniquePosts = [
//                 ...enhancedLivePosts,

//                 ...regularPosts.filter(post => 
//                     !enhancedLivePosts.some(livePost => livePost._id === post._id)
//                 )
//             ];
    
//             console.log('Unique Posts (including Live Posts):', uniquePosts);
    
//             dispatch(setPosts({ posts: uniquePosts }));
    
//         } catch (error) {
//             console.error("Error fetching live and regular posts:", error);
//         }
//     };
    
//     useEffect(() => {
//         fetchLivePosts();
//     }, [isProfile, userId, token]);

//     // Optional: Add a loading state or placeholder
//     if (posts.length === 0) {
//         return <div>No posts found</div>;
//     }

//     return (
//         <>
//             {posts.map(({
//                 _id,
//                 userId: postUserId,
//                 firstName,
//                 lastName,
//                 description,
//                 location,
//                 userPicture,
//                 picture,
//                 video,
//                 mixSeriesId,
//                 likes,
//                 comments,
//                 isLivePost,
//                 mediaFiles     
//             }) => (
//                 <SinglePostWidget
//                     key={_id}
//                     postId={_id}
//                     postUserId={postUserId}
//                     name={`${firstName} ${lastName}`}
//                     description={description}
//                     location={location}
//                     userPicture={userPicture}
//                     picture={picture}
//                     video={video}
//                     mixSeriesId={mixSeriesId}
//                     likes={likes}
//                     comments={comments}
//                     isLivePost={isLivePost}
//                     mediaFiles={mediaFiles || []}
//                 />
//             ))}
//         </>
//     )
// }

// export default AllPostsWidget