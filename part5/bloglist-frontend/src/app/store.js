import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from '../features/notification/notificationSlice';
import blogReducer from '../features/blogs/blogSlice'
import loggedUserReducer from '../features/login/loggedUserSlice'
import userReducer from '../features/users/usersSlice'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    loggedUser: loggedUserReducer,
    users: userReducer
  },
});

export default store;
