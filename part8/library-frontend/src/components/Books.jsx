import { useEffect, useState } from 'react';
import { GET_BOOKS } from '../queries';
import { useQuery } from '@apollo/client';

const Books = (props) => {
  const [filter, setFilter] = useState('');
  const { loading, error, data } = useQuery(GET_BOOKS);
  const filteredResult = useQuery(GET_BOOKS, {
    variables: { genre: filter },
  });

  if (!props.show) {
    return null;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const books = data.allBooks;
  const genres = new Set(books.flatMap((b) => b.genres));

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filter === '' &&
            books.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          {filter !== '' &&
            filteredResult.data.allBooks.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div>
        <h3>Filter by genre</h3>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value={''}>all genres</option>
          {[...genres].map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Books;
