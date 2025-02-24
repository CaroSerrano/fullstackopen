import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setMessage(state, action) {
      return action.payload;
    },
    removeMessage() {
      return '';
    },
  },
});

export const { setMessage, removeMessage } =
  notificationSlice.actions;
export default notificationSlice.reducer;

export const setNotification = (message, seconds) => {
  return (dispatch) => {
    const time = seconds * 1000
    dispatch(setMessage(message));
    setTimeout(() => {
      dispatch(removeMessage())
    }, time)
  };
};
