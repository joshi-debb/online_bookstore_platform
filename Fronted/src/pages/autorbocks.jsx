import "../styles/autorbocks.css";
import NavigationBar from "../components/navbar_admin";
import { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import swal from "sweetalert";
import { format, parseISO } from 'date-fns';
import axios from "axios";
import { useLocation } from "react-router-dom";

const AutorBooks = () => {
  const [books, setBooks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBookData, setEditBookData] = useState({});
  const [authors, setAuthors] = useState([]);
  const location = useLocation();
  const { author_id, photo, name, bio } = location.state;

  useEffect(() => {
    const getBooksByAuthor = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/books/author/${author_id}`
        );
        if (response.status === 200) {
          setBooks(response.data.data);
        } else {
          swal("Error", "Hubo un problema al obtener libros", "error");
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        swal("Error", "Hubo un problema al obtener libros", "error");
      }
    };

    const fetchAuthors = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/authors");
        setAuthors(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAuthors();
    getBooksByAuthor();
  }, [author_id]);

  const handleAddBook = () => {
    setShowAddModal(true);
  };

  const handleEditBook = (book) => {
    setEditBookData(book);
    setShowEditModal(true);
  };

  const handleSubmitAddBook = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("author_id", formData.get("author"));
    try {
      const response = await axios.post(
        "http://localhost:3000/api/books",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        setShowAddModal(false);
        swal("Éxito", "Libro Creado Correctamente", "success").then((result) => {
          if (result) {
            window.location.reload();
          }
        });
       
      } else {
        swal("Error", "Hubo un problema al agregar el libro", "error");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      swal("Error", "Hubo un problema al agregar el libro", "error");
    }
  };

  const handleSubmitEditBook = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedBookData = {
      ...editBookData,
      author_id:formData.get("author"),
      author: name,
      title: formData.get("title"),
      description: formData.get("description"),
      gender: formData.get("gender"),
      publishDate: formData.get("publishDate"),
      availability: formData.get("availability") === "on", // checkbox handling
      quantityAvailable: parseInt(formData.get("quantityAvailable")),
      average_score: parseFloat(formData.get("average_score")),
      price: parseFloat(formData.get("price")),
      image_url: formData.get("image_url"),
    };
    console.log(updatedBookData);
    try {
      const response = await axios.put(
        `http://localhost:3000/api/books/${editBookData._id}`,
        updatedBookData
      );
      if (response.status === 200) {
        setShowEditModal(false);
        window.location.reload();
      } else {
        swal("Error", "Hubo un problema al editar el libro", "error");
      }
    } catch (error) {
      console.error("Error editing book:", error);
      swal("Error", "Hubo un problema al editar el libro", "error");
    }
  };

  const deleteBook = async (bookId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/books/${bookId}`
      );
      if (response.status === 200) {
        swal("Éxito", "Libro Eliminado Correctamente", "success").then(
          (result) => {
            if (result) {
              window.location.reload();
            }
          })
      } else {
        swal("Error", "Hubo un problema al eliminar el libro", "error");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      swal("Error", "Hubo un problema al eliminar el libro", "error");
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="card__perfil">
        <Button
          variant="primary"
          className="add-author-button"
          onClick={handleAddBook}
        >
          Agregar Libro
        </Button>
        <div className="card1">
          <div className="card__avatar">
            <img src={photo} alt="Avatar del Autor" />
          </div>
          <div className="card__title">{name}</div>
          <div className="card__subtitle">{bio}</div>
        </div>
      </div>

      {/* Modal para agregar libro */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Libro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitAddBook}>
            <Form.Group controlId="formTitle">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Ingrese el título del libro"
                required
              />
            </Form.Group>
            <Form.Group controlId="formAuthor">
              <Form.Label>Selecciona un autor:</Form.Label>
              <Form.Control
                as="select"
                name="author"
                defaultValue={author_id} // Preselect the current author
                required
              >
                <option value="">Selecciona un autor</option>
                {authors.map((author) => (
                  <option key={author._id} value={author._id}>
                    {author.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Ingrese la descripción del libro"
                required
              />
            </Form.Group>
            <Form.Group controlId="formGender">
              <Form.Label>Género</Form.Label>
              <Form.Control
                type="text"
                name="gender"
                placeholder="Ingrese el género del libro"
                required
              />
            </Form.Group>
            <Form.Group controlId="formPublishDate">
              <Form.Label>Fecha de Publicación</Form.Label>
              <Form.Control
                type="date"
                name="publishDate"
          
                required
              />
            </Form.Group>
            <Form.Group controlId="formAvailability">
              <Form.Check
                type="checkbox"
                name="availability"
                label="Disponible"
                defaultChecked
              />
            </Form.Group>
            <Form.Group controlId="formQuantityAvailable">
              <Form.Label>Cantidad Disponible</Form.Label>
              <Form.Control
                type="number"
                name="quantityAvailable"
                placeholder="Ingrese la cantidad disponible"
                required
              />
            </Form.Group>
            <Form.Group controlId="formAverageScore">
              <Form.Label>Puntuación Promedio</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                name="average_score"
                placeholder="Ingrese la puntuación promedio"
                required
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="price"
                placeholder="Ingrese el precio del libro"
                required
              />
            </Form.Group>
            <Form.Group controlId="formImageUrl">
  <Form.Label>Imagen del Libro</Form.Label>
  <Form.Control
    type="file"
    name="imageFile" // Cambia el nombre a "imageFile"
    accept=".jpg, .jpeg, .png" // Añade tipos de archivo aceptados si es necesario
  />
</Form.Group>
            <Button variant="primary" type="submit">
              Agregar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal para editar libro */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Libro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitEditBook}>
            <Form.Group controlId="formTitle">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                name="title"
                defaultValue={editBookData.title}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                defaultValue={editBookData.description}
                required
              />

            </Form.Group>
            <Form.Group controlId="formAuthor">
              <Form.Label>Selecciona un autor:</Form.Label>
              <Form.Control
                as="select"
                name="author"
                defaultValue={author_id} // Preselect the current author
                required
              >
                <option value="">Selecciona un autor</option>
                {authors.map((author) => (
                  <option key={author._id} value={author._id}>
                    {author.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formGender">
              <Form.Label>Género</Form.Label>
              <Form.Control
                type="text"
                name="gender"
                defaultValue={editBookData.gender}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPublishDate">
              <Form.Label>Fecha de Publicación</Form.Label>
              <Form.Control
                type="date"
                name="publishDate"
                defaultValue={editBookData.publishDate}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAvailability">
              <Form.Check
                type="checkbox"
                name="availability"
                label="Disponible"
                defaultChecked={editBookData.availability}
              />
            </Form.Group>
            <Form.Group controlId="formQuantityAvailable">
              <Form.Label>Cantidad Disponible</Form.Label>
              <Form.Control
                type="number"
                name="quantityAvailable"
                defaultValue={editBookData.quantityAvailable}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAverageScore">
              <Form.Label>Puntuación Promedio</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                name="average_score"
                defaultValue={editBookData.average_score}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="price"
                defaultValue={editBookData.price}
                required
              />
            </Form.Group>
            <Form.Group controlId="formImageUrl">
              <Form.Label>URL de la Imagen</Form.Label>
              <Form.Control
                type="text"
                name="image_url"
                defaultValue={editBookData.image_url}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Sección de libros */}
      <div className="card-books">
        {books.map((book) => (
          <div className="card" key={book._id}>
            <div className="card__avatar2">
              <img src={book.image_url} alt="Imagen del Libro" />
            </div>
            <div className="content-box">
              <span className="card-title">{book.title}</span>
              <p className="card-content">{book.description}</p>
              <p className="card-content">Género: {book.gender}</p>
              <p className="card-content">
                Fecha de Publicación: {format(parseISO(book.publishDate), 'yyyy/dd/MM')}
              </p>
              <span className="see-more" onClick={() => handleEditBook(book)}>
                Editar
              </span>
              <span className="see-more1" onClick={() => deleteBook(book._id)}>
                Eliminar
              </span>
            </div>
            <div className="date-box">
              <span className="month">PRECIO</span>
              <span className="date">{book.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutorBooks;
