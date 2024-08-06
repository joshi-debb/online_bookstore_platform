import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/carrito.css';
import Navbar_usuario from '../components/navbar_usuario';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0); // Estado para guardar el precio total
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetails = async (bookIds) => {
      try {
        const response = await fetch('http://localhost:3000/api/books/allbooks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bookIds)
        });
        const data = await response.json();
        return data.data; // Asegúrate de acceder al arreglo de datos correctamente
      } catch (error) {
        console.error('Error fetching book details:', error);
        return [];
      }
    };

    const loadCartItems = async () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];

      const bookDetails = await fetchBookDetails(cart);
      console.log(bookDetails)
      // Añadir la cantidad de libros al detalle del carrito
      setCartItems(bookDetails);
      localStorage.setItem('cart', JSON.stringify(bookDetails));
     // calculateTotalPrice(cartWithQuantity);
    };

    const calculateTotalPrice = (cart) => {
      const total = cart.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0);
      setTotalPrice(total);
    };

    loadCartItems();
  }, []);

  const updateCartInLocalStorage = (updatedCart) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleRemoveFromCart = (bookId) => {
    const updatedCart = cartItems.filter(item => item._id !== bookId);
    updateCartInLocalStorage(updatedCart);
    setCartItems(updatedCart);
  };

  const handleQuantityChange = (bookId, quantity) => {
    const updatedCart = cartItems.map(item =>
      item._id === bookId ? { ...item, quantity: +quantity} : item
    );
    console.log(updatedCart)
    updateCartInLocalStorage(updatedCart);
    setCartItems(updatedCart);
    //calculateTotalPrice(updatedCart);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <>
      <Navbar_usuario />
      <div className="cart">
        <h2>Shopping Cart</h2>
        <div className="cart-items">
          {cartItems.map(item => (
            <div className="cart-item" key={item._id}>
              <img src={item.image_url} alt={item.title} />
              <div className="cart-item-info">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p>${item.price}</p>
                <div className="quantity-selector">
                  <label htmlFor={`quantity-${item._id}`}>Quantity: </label>
                  <input
                    type="number"
                    id={`quantity-${item._id}`}
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                  />
                </div>
                <button onClick={() => handleRemoveFromCart(item._id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="checkout-total">
          
          <button onClick={handleCheckout}>Proceed to Checkout</button>
        </div>
      </div>
    </>
  );
};

export default Cart;