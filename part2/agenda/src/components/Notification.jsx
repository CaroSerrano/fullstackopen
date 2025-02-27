const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }
  const notificationStyle = {
    color: message.error ? "red" : "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    marginBottom: 10,
  };

  return <div style={notificationStyle}>{message.message}</div>;
};

export default Notification;
