import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector(({ notification }) => notification);

  const notificationStyle = {
    display: notification.message !== '' ? '' : 'none',
    color: notification.error ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    marginBottom: 10,
  };

  return <div style={notificationStyle}>{notification.message}</div>;
};

export default Notification;
