import { createContext, useReducer } from 'react';

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload;
    case 'REMOVE':
      return '';
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ''
  );

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {
        // eslint-disable-next-line react/prop-types
        props.children
      }
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
