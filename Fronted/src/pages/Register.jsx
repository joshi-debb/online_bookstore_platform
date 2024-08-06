import "../styles/register.css"; // Asegúrate de tener tus estilos CSS importados correctamente
import { useState } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    password: "",
    photo: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/users/register`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log("Respuesta del servidor:", response.data);
      if (response.status === 201) {
        swal("Éxito", "Usuario Creado Correctamente", "success");
        navigate("/");
      } else {
        swal("Error", "No se pudo crear el usuario", "error");
      }
    } catch (error) {
      console.error("Error during user registration:", error.response?.data || error.message);
      swal("Error", "No se pudo crear el usuario", "error");
    }
  };

  return (
    <div className="container-registro">
      <div className="screen-registro">
        <div className="screen__content">
          <form className="Registro" onSubmit={handleSubmit}>
            <div className="titulo">
              <h1>BookStore Usac</h1>
            </div>

            <div className="login__field">
              <i className="login__icon fas fa-user"></i>

              <input
                type="text"
                className="login__input"
                placeholder="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                className="login__input"
                placeholder="Apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                required
              />

              <input
                type="email"
                className="login__input"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <input
                type="number"
                className="login__input"
                placeholder="Telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                required
              />

              <input
                className="login__input"
                onChange={handleInputChange}
                name="direccion"
                placeholder="Direccion"
                value={formData.direccion}
                required
              />

              <input
                type="password"
                className="login__input"
                placeholder="Contraseña"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />

              <input
                type="file"
                className="login__input"
                name="photo"
                onChange={handleFileChange}
                required
              />
              {previewImage && (
                <div className="image-preview">
                  <img src={previewImage} alt="Vista previa" />
                </div>
              )}
            </div>

            <button type="submit" className="button login__submit">
              <span className="button__text">Crear</span>
              <i className="button__icon fas fa-chevron-right"></i>
            </button>
          </form>
          <div className="social-login">
            <Link to="/">Inicia Sesión</Link>
          </div>
        </div>
        <div className="screen__background">
          <span className="screen__background__shape screen__background__shape4"></span>
          <span className="screen__background__shape screen__background__shape3"></span>
          <span className="screen__background__shape screen__background__shape2"></span>
          <span className="screen__background__shape screen__background__shape1"></span>
        </div>
      </div>
    </div>
  );
};

export default Register;
