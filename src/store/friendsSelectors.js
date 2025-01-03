import { createSelector } from 'reselect';

// Memoized selector for friends
export const selectFriends = createSelector(
  [
    (state) => state.auth.user,
    (state, userId) => userId
  ],
  (user, userId) => {
    // If a specific userId is provided, try to match it
    if (userId && userId !== user?._id) {
      return Object.freeze([]);
    }
    return Object.freeze(user?.friends || []);
  }
);

// Optimized friend existence check
export const selectIsFriend = createSelector(
  [
    (state) => state.auth.user?.friends || [],
    (_, friendId) => friendId
  ],
  (friends, friendId) => {
    // Safely check if the friend exists
    return friends.some((friend) => friend._id === friendId);
  }
);