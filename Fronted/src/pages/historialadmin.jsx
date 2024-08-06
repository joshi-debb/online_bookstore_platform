import '../styles/historialAdmin.css'; // Make sure to import your CSS file for styling
import { useState, useEffect } from 'react';
import { Card, Button, Collapse, Table } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from "../components/navbar_admin";

const HistorialAdmin = () => {
  const [open, setOpen] = useState({});
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/orders/');
        console.log(response.data.data);
        setSales(response.data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleToggle = (index) => {
    setOpen((prevState) => ({ ...prevState, [index]: !prevState[index] }));
  };

  const calculateTotalPrice = (books) => {
    return books.reduce((total, book) => total + book.price * book.quantity, 0);
  };

  const setupdatestate = async (order_id) => {
    try {
      await axios.put(`http://localhost:3000/api/orders/sttSent/${order_id}`);
    //recargar pagina
      window.location.reload();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  return (
    <div>
      <NavigationBar />
      <div className="container">
        <h1 className="my-4">Pedidos</h1>
        {sales.map((sale, index) => (
          <Card className="mb-4" key={index}>
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <div>
                  <span>{sale.user}</span>
                  <br />
                  <small className="text-muted">{sale.status}</small>
                </div>
                <span>${calculateTotalPrice(sale.books)}</span>
              </Card.Title>
              <Card.Text>
                <Button
                  variant="link"
                  onClick={() => handleToggle(index)}
                  aria-controls={`books-collapse-text-${index}`}
                  aria-expanded={open[index]}
                >
                  Ver Libros Comprados
                </Button>
              </Card.Text>
              <Collapse in={open[index]}>
                <div id={`books-collapse-text-${index}`}>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Libro</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sale.books.map((book, bookIndex) => (
                        <tr key={bookIndex}>
                          <td>{bookIndex + 1}</td>
                          <td>{book.book}</td>
                          <td>${book.price}</td>
                          <td>{book.quantity}</td>
                          <td>${book.price * book.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Collapse>
              {sale.status === 'in progress' && (
                <Button variant="primary"  onClick={() => setupdatestate(sale._id)} className="mt-3">Enviar</Button>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HistorialAdmin;
