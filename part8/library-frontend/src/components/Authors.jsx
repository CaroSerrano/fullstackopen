import { GET_AUTHORS } from '../queries';
import { useQuery } from '@apollo/client';
import UpdateAuthorForm from './updateAuthorForm';

const Authors = (props) => {
  const { loading, error, data } = useQuery(GET_AUTHORS);

  if (!props.show) {// eslint-disable-line
    return null;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  const authors = data.allAuthors;
  
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <UpdateAuthorForm />
    </div>
  );
};

export default Authors;
