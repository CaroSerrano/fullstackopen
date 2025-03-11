import { GET_BOOKS, ME } from '../queries';
import { useQuery } from '@apollo/client';

const GenreBooks = ({ show }) => {
  const { data: userData, loading: userLoading } = useQuery(ME);
  
  const favoriteGenre = userData?.me?.favoriteGenre || null;
  
  const { loading, error, data } = useQuery(GET_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre, // Evita hacer la consulta si no hay un género favorito
  });

  if (!show) {
    return null;
  }

  if (userLoading || loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  if (!data) return null;

  const books = data.allBooks;

  return (
    <div>
      <h2>recommendations</h2>
      books in your favorite genre <strong>{favoriteGenre}</strong>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GenreBooks;
