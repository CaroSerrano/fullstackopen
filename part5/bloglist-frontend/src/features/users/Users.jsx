import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Users = () => {
  const users = useSelector(({ users }) => users);
  console.log('users', users);

  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <td> </td>
            <td>blogs created</td>
          </tr>
          {[...users].map((u) => (
            <tr key={u.id}>
              <td>
                <Link to={`/users/${u.id}`}>{u.name}</Link>
              </td>
              <td>{u.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
