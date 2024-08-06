import '../styles/autores.css';
import NavigationBar from "../components/navbar_admin";
import { Button, Modal, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

const Autores = () => {
  const [authors, setAuthors] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState({
    id: null,
    name: '',
    bio: '',
    photo: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/authors'); // Replace with your API endpoint
        console.log(response.data);
        setAuthors(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAuthors();
  }, []);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAuthor({
      ...newAuthor,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewAuthor({
      ...newAuthor,
      photo: file,
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const addNewAuthor = async () => {
    const formData = new FormData();
    for (const key in newAuthor) {
      formData.append(key, newAuthor[key]);
    }

    try {
      const response = await axios.post('http://localhost:3000/api/authors', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }); // Replace with your API endpoint
      if (response.status === 201) {
        swal("Éxito", "Autor Creado Correctamente", "success").then((result) => {
          if (result) {
            window.location.reload();
          }
        });
      } else {
        swal("Error", "No se pudo crear el autor", "error");
      }
    } catch (error) {
      console.error('Error creating author:', error);
    }
    closeModal();
  };

  const deleteAuthor = async (author_id) => {
    try {
      console.log(author_id);
      const response = await axios.delete(`http://localhost:3000/api/authors/${author_id}`);
      if (response.status === 200) {
        swal("Éxito", "Autor Eliminado Correctamente", "success").then((result) => {
          if (result) {
            window.location.reload();
          }
        });
      } else {
        swal("Error", "Hubo un problema al eliminar el autor", "error");
      }
    } catch (error) {
      console.error('Error deleting author:', error);
      swal("Error", "Hubo un problema al eliminar el autor", "error");
    }
  };

  const viewBooks = async (author_id, photo, name, bio) => {
    console.log(author_id);
    navigate('/autorbooks', {
      state: {
        author_id,
        photo,
        name,
        bio,
      },
    });
  };

  return (
    <div>
      <NavigationBar />
      <div className="bg">
        <Button variant="primary" onClick={openModal} className="add-author-button">Agregar Autor</Button>
        <div className="nft-container">
          {authors.map((author) => (
            <div className="nft" key={author._id}>
              <div className="main">
                <img className="tokenImage" src={author.photo} alt={author.name} />
                <h2>{author.name}</h2>
                <p className="description">{author.bio}</p>
                <div className="tokenInfo">
                  <button type="button" onClick={() => viewBooks(author._id, author.photo, author.name, author.bio)} className="btn btn-info">Libros</button>
                  <button type="button" onClick={() => deleteAuthor(author._id)} className="btn btn-danger">Eliminar</button>
                </div>
                <hr />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal show={modalIsOpen} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Autor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAuthorName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newAuthor.name}
                onChange={handleInputChange}
                placeholder="Ingrese el nombre del autor"
              />
            </Form.Group>
            <Form.Group controlId="formAuthorDescription">
              <Form.Label>Biografia</Form.Label>
              <Form.Control
                as="textarea"
                name="bio"
                value={newAuthor.bio}
                onChange={handleInputChange}
                rows={3}
                placeholder="Ingrese una descripción"
              />
            </Form.Group>
            <Form.Group controlId="formAuthorImage">
              <Form.Label>Imagen</Form.Label>
              <Form.Control
                type="file"
                name="photo"
                onChange={handleFileChange}
                placeholder="Ingrese la URL de la imagen"
              />
            </Form.Group>
            {previewImage && (
              <div className="image-preview">
                <img src={previewImage} alt="Vista previa" />
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={addNewAuthor}>
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Autores;
