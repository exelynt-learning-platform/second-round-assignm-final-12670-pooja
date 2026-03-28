import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../features/chat/chatSlice';

/**
 * Redux store configuration
 * Combines all reducers and applies middleware
 */
export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  // Optional: custom middleware config can go here
});

export default store;
