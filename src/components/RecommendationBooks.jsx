/* import { useQuery } from '@apollo/client';
import { GET_BOOKS_BY_GENRE, GET_USER_FAVORITE_GENRE } from '../graphql/queries';

const RecommendationBooks = () => {
  // Obtener el género favorito del usuario
  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER_FAVORITE_GENRE);

  // Obtener los libros basados en el género favorito del usuario
  const favoriteGenre = userData?.me?.favoriteGenre;
  
  // Realizar la consulta para obtener los libros por el género favorito
  const { data, loading, error } = useQuery(GET_BOOKS_BY_GENRE, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre, // Omitir la consulta si el género favorito no está disponible
  }); 

  if (userLoading || loading) return <p>Cargando...</p>;
  if (userError || error) return <p>Error: {userError?.message || error?.message}</p>;

  // Si no hay libros recomendados, mostramos un mensaje
  const recommendedBooks = data?.allBooks || [];

  return (
    <div>
      <h2>Libros recomendados</h2>
      <p>Género favorito: {favoriteGenre || 'N/A'}</p>
      
      {recommendedBooks.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Año de publicación</th>
              <th>Autor</th>
            </tr>
          </thead>
          <tbody>
            {recommendedBooks.map(book => (
              <tr key={book.id || `${book.title}-${book.published}-${book.author.name}`}>
                <td>{book.title}</td>
                <td>{book.published}</td>
                <td>{book.author.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron libros recomendados para este género.</p>
      )}
    </div>
  );
};

export default RecommendationBooks;
 */

//VERSION MAL Error: Not authenticated in recomendatio
/* import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_BOOKS_BY_GENRE, GET_USER_FAVORITE_GENRE } from '../graphql/queries';
import React, { useEffect } from 'react'; 
const RecommendationBooks = () => {
  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER_FAVORITE_GENRE);
  const [getBooksByGenre, { data, loading, error }] = useLazyQuery(GET_BOOKS_BY_GENRE);

  const favoriteGenre = userData?.me?.favoriteGenre;

  // Ejecuta la consulta de libros cuando el género favorito esté disponible
  useEffect(() => {
    console.log("books", data);
    if (favoriteGenre) {
      getBooksByGenre({ variables: { genre: favoriteGenre } });
    }
  },[favoriteGenre, getBooksByGenre]);

 

  if (userLoading || loading) return <p>Cargando...</p>;
  if (userError || error) return <p>Error: {userError?.message || error?.message}</p>;

  const recommendedBooks = data?.allBooks || [];

  return (
    <div>
      <h2>Libros recomendados</h2>
      <p>Género favorito: {favoriteGenre || 'No definido, por favor selecciona uno en tu perfil.'}</p>
      {recommendedBooks.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Año de publicación</th>
              <th>Autor</th>
            </tr>
          </thead>
          <tbody>
            {recommendedBooks.map((book, index) => (
              <tr key={book.id || `${book.title}-${index}`}>
                <td>{book.title}</td>
                <td>{book.published}</td>
                <td>{book.author?.name || 'Autor desconocido'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron libros recomendados para este género.</p>
      )}
    </div>
  );
};

export default RecommendationBooks; */
import { useQuery } from '@apollo/client';
import { GET_BOOKS_BY_GENRE, GET_USER_FAVORITE_GENRE } from '../graphql/queries';

const RecommendationBooks = ({ show }) => {
  const token = localStorage.getItem('user-token');
  if (!show) return null; // Solo renderiza si está visible
  if (!token) return <p>Error: Usuario no autenticado.</p>; // Maneja usuarios no autenticados

  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER_FAVORITE_GENRE);

  if (userLoading) return <p>Cargando...</p>;
  if (userError) return <p>Error al cargar el género favorito: {userError.message}</p>;

  const favoriteGenre = userData?.me?.favoriteGenre;
  if (!favoriteGenre) return <p>No tienes un género favorito definido.</p>;

  const { data: bookData, loading: bookLoading, error: bookError } = useQuery(GET_BOOKS_BY_GENRE, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre, // Evita ejecutar la consulta si no hay género favorito
  });

  if (bookLoading) return <p>Cargando libros...</p>;
  if (bookError) return <p>Error al cargar libros: {bookError.message}</p>;

  const recommendedBooks = bookData?.allBooks || [];

  return (
    <div>
      <h2>Libros recomendados</h2>
      <p>Género favorito: {favoriteGenre}</p>
      {recommendedBooks.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Año de publicación</th>
              <th>Autor</th>
            </tr>
          </thead>
          <tbody>
            {recommendedBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.published}</td>
                <td>{book.author?.name || 'Autor desconocido'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron libros recomendados para este género.</p>
      )}
    </div>
  );
};

export default RecommendationBooks;
