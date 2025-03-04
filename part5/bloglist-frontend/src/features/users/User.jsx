import { ListGroup } from 'react-bootstrap';

const User = ({ user }) => {
  if (!user) {
    return null;
  }
  return (
    <div>
      <h2>{user.name}</h2>
      <p>Added blogs:</p>
      <ListGroup numbered>
        {user.blogs.map((b) => (
          <ListGroup.Item variant='secondary' key={b.id}>
            {b.title}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default User;
