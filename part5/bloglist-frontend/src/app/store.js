import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from '../features/notification/notificationSlice';
import blogReducer from '../features/blogs/blogSlice'
import loggedUserReducer from '../features/login/loggedUserSlice'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    loggedUser: loggedUserReducer
  },
});

export default store;
