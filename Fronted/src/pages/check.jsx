import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Checkout.css';
import Navbar_usuario from '../components/navbar_usuario';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(savedCart);
        console.log('Cart items:', savedCart);
      } catch (error) {
        console.error('Error loading cart items:', error);
      }
    };

    loadCartItems();
  }, []);

  const handleConfirmPurchase = async () => {
    // Construir el objeto a enviar al backend
    const userId = localStorage.getItem('iduser');
    const nameUser = localStorage.getItem('nameuser');

    const orderData = {
      user: nameUser,
      user_id: userId,
      address: "zona 2",
      books: cartItems.map(item => ({
        book_id: item._id,
        quantity: item.quantity
      }))
    };

    try {
      const response = await fetch('http://localhost:3000/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        throw new Error('Error al confirmar la compra');
      }
      
      localStorage.removeItem('cart');
      navigate('/main'); // Navega de vuelta a la página principal u otra página después de confirmar
    } catch (error) {
      console.error('Error al confirmar la compra:', error);
      // Manejar el error según sea necesario
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <>
      <Navbar_usuario />
      <div className="checkout">
        <h2>Checkout</h2>
        <div className="checkout-summary">
          {cartItems.map(item => (
            <div className="checkout-item" key={item._id}>
              <img src={item.image_url} alt={item.title} />
              <div className="checkout-item-info">
                <h3>{item.title}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price}</p>
                <p>Total: ${item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="checkout-total">
          <h3>Total: ${totalPrice.toFixed(2)}</h3>
          <button onClick={handleConfirmPurchase}>Confirmar compra</button>
        </div>
      </div>
    </>
  );
};

export default Checkout;