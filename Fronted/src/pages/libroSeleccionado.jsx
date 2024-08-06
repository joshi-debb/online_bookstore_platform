import { useState, useEffect } from 'react';
import '../styles/LibroSeleccionado.css';
import { useNavigate } from 'react-router-dom';
import UserRes from "./UserRes";

const LibroSeleccionado = () => {
  const [book, setBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el bookId del localStorage
    const bookId = localStorage.getItem('libroSeleccionado');
    if (!bookId) {
      console.error('No bookId found in localStorage');
      return;
    }

    // Fetch del libro usando el bookId obtenido
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/books/${bookId}`);
        const data = await response.json();
        if (data.status && data.data) {
          setBook(data.data);
        } else {
          console.error('Failed to fetch book details:', data.message);
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    fetchBookDetails();
  }, []);

  const handleBack = () => {
    navigate('/main');
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="libro-seleccionado">
      <button className="btn-back" onClick={handleBack}>Atrás</button>
      <img src={book.image_url} alt={book.title} />
      <div className="book-details">
        <h2>{book.title}</h2>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Description:</strong> {book.description}</p>
        <p><strong>Genre:</strong> {book.gender}</p>
        <p><strong>Publish Date:</strong> {new Date(book.publishDate).toLocaleDateString()}</p>
        <p><strong>Price:</strong> ${book.price}</p>
        <p><strong>Availability:</strong> {book.availability ? 'Available' : 'Out of Stock'}</p>
        <p><strong>Quantity Available:</strong> {book.quantityAvailable}</p>
        <p><strong>Average Score:</strong> {book.average_score}</p>
      </div>
      <div style={{ padding: "5px" }}>
        <UserRes  />
      </div>
    </div>
  );
};

export default LibroSeleccionado;

