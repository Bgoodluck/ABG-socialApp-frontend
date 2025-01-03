// // userCache.js
// class UserCache {
//     constructor(cacheTimeout = 5 * 60 * 1000) { // 5 minutes default
//       this.cache = new Map();
//       this.cacheTimeout = cacheTimeout;
//     }
  
//     set(userId, userData) {
//       this.cache.set(userId, {
//         data: userData,
//         timestamp: Date.now()
//       });
//     }
  
//     get(userId) {
//       const cached = this.cache.get(userId);
//       if (!cached) return null;
  
//       const isExpired = Date.now() - cached.timestamp > this.cacheTimeout;
//       if (isExpired) {
//         this.cache.delete(userId);
//         return null;
//       }
  
//       return cached.data;
//     }
  
//     batchGet(userIds) {
//       return userIds.map(id => ({
//         id,
//         data: this.get(id)
//       })).filter(item => item.data !== null);
//     }
  
//     clear() {
//       this.cache.clear();
//     }
//   }
  
//   // Create a singleton instance
//   export const userCache = new UserCache();


// class UserCache {
//     constructor(cacheTimeout = 5 * 60 * 1000) { // 5 minutes default
//       this.cache = new Map();
//       this.cacheTimeout = cacheTimeout;
//       this.subscribers = new Set(); // Add subscribers for cache updates
//     }
  
//     set(userId, userData) {
//       const oldData = this.cache.get(userId);
      
//       // Check if profile picture has changed
//       if (oldData && 
//           oldData.data.picture !== userData.picture || 
//           oldData.data.picturePath !== userData.picturePath) {
//         this.notifySubscribers(userId, userData);
//       }
  
//       this.cache.set(userId, {
//         data: userData,
//         timestamp: Date.now()
//       });
//     }
  
//     get(userId) {
//       const cached = this.cache.get(userId);
//       if (!cached) return null;
  
//       const isExpired = Date.now() - cached.timestamp > this.cacheTimeout;
//       if (isExpired) {
//         this.cache.delete(userId);
//         return null;
//       }
  
//       return cached.data;
//     }
  
//     batchGet(userIds) {
//       const now = Date.now();
//       return userIds
//         .map(id => {
//           const cached = this.cache.get(id);
//           if (!cached) return { id, data: null };
          
//           const isExpired = now - cached.timestamp > this.cacheTimeout;
//           if (isExpired) {
//             this.cache.delete(id);
//             return { id, data: null };
//           }
          
//           return { id, data: cached.data };
//         })
//         .filter(item => item.data !== null);
//     }
  
//     // New method to subscribe to cache updates
//     subscribe(callback) {
//       this.subscribers.add(callback);
//       return () => this.subscribers.delete(callback);
//     }
  
//     // New method to notify subscribers of updates
//     notifySubscribers(userId, newData) {
//       this.subscribers.forEach(callback => {
//         callback(userId, newData);
//       });
//     }
  
//     clear() {
//       this.cache.clear();
//       this.subscribers.clear();
//     }
  
//     // New method to invalidate specific user's cache
//     invalidate(userId) {
//       this.cache.delete(userId);
//     }
  
//     // New method to check if cache needs refresh
//     needsRefresh(userId) {
//       const cached = this.cache.get(userId);
//       if (!cached) return true;
      
//       return Date.now() - cached.timestamp > this.cacheTimeout;
//     }
//   }
  
//   // Create a singleton instance
//   export const userCache = new UserCache();
  
//   // Export the class for testing purposes
//   export default UserCache;



  
// set(userId, userData) {
//     // Validate inputs
//     if (!userId || !userData) {
//       console.warn('Attempted to cache invalid user data:', { userId, userData });
//       return;
//     }

    
    
//     // Check if profile picture has changed
//     const hasNewPicture = oldData && (
//       (userData.picture && oldData.data.picture !== userData.picture) ||
//       (userData.picturePath && oldData.data.picturePath !== userData.picturePath)
//     );
    
    

    
//     });
//   }
  
//     get(userId) {
//       if (!userId) return null;
      
//       const cached = this.cache.get(userId);
//       if (!cached) return null;
  
//       const isExpired = Date.now() - cached.timestamp > this.cacheTimeout;
//       if (isExpired) {
//         this.cache.delete(userId);
//         return null;
//       }
  
//       return cached.data;
//     }
  
//     batchGet(userIds) {
//       if (!Array.isArray(userIds)) {
//         console.warn('Invalid userIds passed to batchGet:', userIds);
//         return [];
//       }
  
//       return userIds
//         .filter(id => id != null)
//         .map(id => ({
//           id,
//           data: this.get(id)
//         }))
//         .filter(item => item.data !== null);
//     }
  
//     clear() {
//       this.cache.clear();
//     }
  
//     invalidate(userId) {
//       if (userId) {
//         this.cache.delete(userId);
//       }
//     }
//   }
  
//   export const userCache = new UserCache();


class UserCache {
    constructor(cacheTimeout = 5 * 60 * 1000) { // 5 minutes default
      this.cache = new Map();
      this.cacheTimeout = cacheTimeout;
      this.subscribers = new Set(); // Add subscribers for cache updates
    }
  
    set(userId, userData) {
        if (!userId || !userData) {
            console.warn('Attempted to cache invalid user data:', { userId, userData });
            return;
        }
        
        const oldData = this.cache.get(userId);
      
        // Check if profile picture has changed
        const hasNewPicture = oldData && (
            (userData.picture && oldData.data.picture !== userData.picture) ||
            (userData.picturePath && oldData.data.picturePath !== userData.picturePath)
        );

        if (hasNewPicture) {
            // Handle picture update if needed
            console.log('Profile picture updated for user:', userId);
        }

        this.notifySubscribers(userId, userData);
  
        this.cache.set(userId, {
            data: userData,
            timestamp: Date.now()
        });
    }
  
    get(userId) {
        const cached = this.cache.get(userId);
        if (!cached) return null;
    
        const isExpired = Date.now() - cached.timestamp > this.cacheTimeout;
        if (isExpired) {
            this.cache.delete(userId);
            return null;
        }
    
        return cached.data;
    }
  
    batchGet(userIds) {
        const now = Date.now();
        return userIds
            .map(id => {
                const cached = this.cache.get(id);
                if (!cached) return { id, data: null };
                
                const isExpired = now - cached.timestamp > this.cacheTimeout;
                if (isExpired) {
                    this.cache.delete(id);
                    return { id, data: null };
                }
                
                return { id, data: cached.data };
            })
            .filter(item => item.data !== null);
    }
  
    // New method to subscribe to cache updates
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }
  
    // New method to notify subscribers of updates
    notifySubscribers(userId, newData) {
        this.subscribers.forEach(callback => {
            callback(userId, newData);
        });
    }
  
    clear() {
        this.cache.clear();
        this.subscribers.clear();
    }
  
    // New method to invalidate specific user's cache
    invalidate(userId) {
        this.cache.delete(userId);
    }
  
    // New method to check if cache needs refresh
    needsRefresh(userId) {
        const cached = this.cache.get(userId);
        if (!cached) return true;
        
        return Date.now() - cached.timestamp > this.cacheTimeout;
    }
}
  
// Create a singleton instance
export const userCache = new UserCache();
  
// Export the class for testing purposes
export default UserCache;