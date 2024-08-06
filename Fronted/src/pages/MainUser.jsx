import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MainUser.css';
import Navbar_usuario from '../components/navbar_usuario';
const MainUser = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    
    // Fetch books and genres from API
    const fetchData = async () => {
      try {
        // Fetch books
        const booksResponse = await fetch('http://localhost:3000/api/books');
        const booksData = await booksResponse.json();
        if (booksData.status && booksData.data) {
          setBooks(booksData.data);
        } else {
          console.error('Failed to fetch books:', booksData.message);
        }

        // Fetch genres
        const genresResponse = await fetch('http://localhost:3000/api/books/allgenres');
        const genresData = await genresResponse.json();
        if (genresData.status && genresData.data) {
          setGenres(genresData.data);
        } else {
          console.error('Failed to fetch genres:', genresData.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(+e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(+e.target.value);
  };

  const handleRatingChange = (e) => {
    setRating(+e.target.value);
  };

  const handleAddToCart = (bookId) => {
     // Get the current cart from local storage or initialize an empty array if it doesn't exist
  const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
  const newBook ={
    _id: bookId,
    quantity: 1

  }
  // Add the new book to the cart
  currentCart.push(newBook);

  // Save the updated cart back to local storage
  localStorage.setItem('cart', JSON.stringify(currentCart));
    console.log('cart', currentCart);
    console.log(`Book with ID ${bookId} added to cart`);
  };

  const handleViewDetails = (bookId) => {
    // Implement your logic for viewing more details here
    localStorage.setItem("libroSeleccionado", bookId )
    navigate('/libroseleccionado');
    console.log(`View details for book with ID ${bookId}`);
  };

  const filteredBooks = books.filter(book => {
    return (
      (book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       book.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedGenre === '' || book.gender === selectedGenre) &&
      (book.price >= minPrice && book.price <= maxPrice) &&
      (book.average_score >= rating)
    );
  });

  return (
    
    <div className="main-user">
      <Navbar_usuario />   
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search by title or author" 
          value={searchTerm} 
          onChange={handleSearch} 
        />
      </div>
      <div className="filters">
        <select value={selectedGenre} onChange={handleGenreChange}>
          <option value="">All Genres</option>
          {genres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
        <div className="filter-range">
          <label>Min Price: {minPrice}</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={minPrice} 
            onChange={handleMinPriceChange} 
          />
        </div>
        <div className="filter-range">
          <label>Max Price: {maxPrice}</label>
          <input 
            type="range" 
            min="0" 
            max="500" 
            value={maxPrice} 
            onChange={handleMaxPriceChange} 
          />
        </div>
        <div className="filter-range">
          <label>Rating: {rating}</label>
          <input 
            type="range" 
            min="0" 
            max="5" 
            step="0.1"
            value={rating} 
            onChange={handleRatingChange} 
          />
        </div>
      </div>
      <div className="book-catalog">
        {filteredBooks.map(book => (
          <div className="book-card" key={book._id}>
            <img src={book.image_url} alt={book.title} />
            <div className="book-info">
              <h3>{book.title}</h3>
              <p>{book.description}</p>
              <p>${book.price}</p>
              <button onClick={() => handleAddToCart(book._id)}>Agregar al Carrito</button>
              <button onClick={() => handleViewDetails(book._id)}>Ver Más</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainUser;
