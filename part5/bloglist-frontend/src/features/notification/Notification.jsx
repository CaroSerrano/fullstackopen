import { useSelector } from 'react-redux';
import { Toast } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const Notification = () => {
  const notification = useSelector(({ notification }) => notification);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (notification.message !== '') {
      setShow(true);
    }
  }, [notification.message]);

  let bgColor;
  notification.error ? (bgColor = 'danger') : (bgColor = 'success');

  return (
    <Toast bg={bgColor} show={show} onClose={() => setShow(false)} delay={5000} autohide>
      <Toast.Header>
        <strong className='me-auto'>BlogApp</strong>
      </Toast.Header>
      <Toast.Body>{notification.message}</Toast.Body>
    </Toast>
  );
};

export default Notification;
