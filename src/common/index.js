const backendURL = "https://abg-socialapp-backend.onrender.com"


export const summaryApi = {
    signUp : {
        url: `${backendURL}/api/user/signup`,
        method: "POST",
        data: {
            firstName: String,
            lastName: String,
            email: String,
            password: String,
            picture: String,
            role: String
        }
    },

    signIn : {
        url: `${backendURL}/api/user/signin`,
        method: "POST",
        data: {
            email: String,
            password: String
        }
    },

    getUser: {
        url: `${backendURL}/api/user/get/:id`,
        method: "GET",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        })
        
    },

    addRemoveFriend:{
        url: `${backendURL}/api/user/:id/:friendsId`,
        method: "PATCH",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        })
    },

    getUserFriends: {
        url: `${backendURL}/api/user/:id/friends`,
        method: "GET",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        })
    },

    createPost: {
        url: `${backendURL}/api/post/create`,
        method: "POST",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        }),
        data: {
            content: String,
            picture: File
        }
    },

    createVidPost: {
        url: `${backendURL}/api/post/video`,
        method: "POST",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        }),
        data: {
            content: String,
            video: File
        }
    },

    createMixPost: {
        url: `${backendURL}/api/post/createMix`,
        method: "POST",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        }),
        data: {
            content: String,
            mediaFiles: [File]
        }
    },

    getMixPost: {
        url: `${backendURL}/api/post/mixpost/:mixSeriesId`,
        method: "GET",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        })
    },

    livePosts: {
        url: `${backendURL}/api/post/liveposts`,
        method: "POST",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        })        
    },

    getLivePost: {
        url: `${backendURL}/api/post/getlive`,
        method: "GET",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        })
    },

    getLivePostId: {
        url: `${backendURL}/api/post/getlivepost/:id`,
        method: "GET",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        })
    },

    getAllPost:{
        url: `${backendURL}/api/post/get`,
        method: "GET",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        })
    },

    userPost:{
        url: `${backendURL}/api/post/:userId/posts`,
        method: "GET",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        })
    },

    likePost: {
        url: `${backendURL}/api/post/:id/like`,
        method: "PATCH",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        })
    },

    deletePost: {
        url: `${backendURL}/api/post/:id/remove`,
        method: "DELETE",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        })
    },
    
    createComment: {
        url: `${backendURL}/api/comment/create`,
        method: "POST",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        }),
        data: {
            postId: String,
            userId: String,
            firstName: String,
            lastName: String,
            text: String
        }
    },

    getComment: {
        url: `${backendURL}/api/comment/get/:postId`,
        method: "GET",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        }),
    },

    deleteComment: {
        url: `${backendURL}/api/comment/remove/:commentId`,
        method: "DELETE",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        })
    },

    updateUser: {
        url: `${backendURL}/api/user/update-user`,
        method: "POST",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        }),
        data: {
            userId: String,
            firstName: String,
            lastName: String,
            email: String,
            picture: String,
            location: String,
            occupation: String,
            bio: String,
            role: String
        }
    },

    updateProfilePictureInPost: {
        url: `${backendURL}/api/post/update-posts-pictures`,
        method: "POST",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        }),
        data: {
            postId: String,
            picture: File
        }
    },

    searchForUsers: {
        url: `${backendURL}/api/user/search`,
        method: "GET",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        }),
        params: {
            searchText: String
        }
    },

    getNotified: {
        url: `${backendURL}/api/notification`,
        method: "GET",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        })
    },

    markNotified: {
        url: `${backendURL}/api/notification`,
        method: "PUT",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        })
    },

    batchGetUser: {
        url: `${backendURL}/api/user/batch`,
        method: "POST",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        }),
        params: {
            userIds: [String]
        }
    },

    createAdverts: {
        url: `${backendURL}/api/adverts/create`,
        method: "POST",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        }),
        data: {
            userId: String,
            description: String,
            price: Number,
            advertisement: String,
            picture: File
        }
    },

    getAdverts: {
        url: `${backendURL}/api/adverts/getAll`,
        method: "GET",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        })
    },

    deleteAdvert: {
        url: `${backendURL}/api/adverts/delete/own/:advertId`,
        method: "DELETE",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        })
    },

    packageAdvert: {
        url: `${backendURL}/api/package/subscribe`,
        method: "POST",
        headers: (token) => ({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        })
    },

    listPackages: {
        url: `${backendURL}/api/package/list`,
        method: "GET",
        headers: (token) => ({
            Authorization: `Bearer ${token}`
        })
    },

    stripeOrder: {
        url: `${backendURL}/api/order/stripe`,
        method: "POST",
        headers: (token) => ({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }),
        // data: {
        //     amount: Number,
        //     currency: String,
        //     description: String,
        //     paymentMethodId: String
        // }
    },

    flutterwaveOrder: {
        url: `${backendURL}/api/order/flutterwave`,
        method: "POST",
        headers: (token) => ({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }),
        // data: {
        //     amount: Number,
        //     currency: String,
        //     description: String,
        //     paymentMethodId: String
        // }
    },

    stripeVerify: {
        url: `${backendURL}/api/order/verify`,
        method: "POST",
        headers: (token) => ({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }),
        // data: {
        //     signature: String,
        //     event: String
        // }
    }

}