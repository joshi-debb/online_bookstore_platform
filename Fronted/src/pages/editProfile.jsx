import "../styles/register.css"; // Asegúrate de tener tus estilos CSS importados correctamente
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import swal from "sweetalert";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar_usuario from "../components/navbar_usuario";
const EditProfile = () => {

    const user_id = localStorage.getItem('iduser');

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        direccion: "",
        password: ""    
    });
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/users/getUser/${user_id}`);
                const userData = response.data;
                setFormData({
                    nombre: userData.nombre,
                    apellido: userData.apellido,
                    email: userData.email,
                    telefono: userData.telefono,
                    direccion: userData.direccion,
                    password: userData.password                
                });
                setPreviewImage(userData.photo);
            } catch (error) {
                console.error("Error fetching user data:", error);
                swal("Error", "No se pudieron cargar los datos del usuario", "error");
            }
        };

        fetchUserData();
    }, [user_id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(
                `http://localhost:3000/api/users/update/${user_id}`,formData
            
            );
            console.log("Respuesta del servidor:", response.data);
            if (response.status === 201) {
                swal("Éxito", "Perfil Actualizado Correctamente", "success");
            } else {
                swal("Error", "No se pudo actualizar el perfil", "error");
            }
        } catch (error) {
            console.error("Error during user update:", error.response?.data || error.message);
            swal("Error", "No se pudo actualizar el perfil", "error");
        }
    };

    return (
        <div>
            <Navbar_usuario />
        
        <div className="container-registro">
            <div className="screen-registro">
                <div className="screen__content">
                    <form className="Registro" onSubmit={handleSubmit}>
                        <div className="titulo">
                            <h1>Editar Perfil</h1>
                        </div>

                        <div className="login__field">
                            <i className="login__icon fas fa-user"></i>

                            {previewImage && (
                                <div className="image-preview">
                                    <img src={previewImage} alt="Vista previa" />
                                </div>
                            )}

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

                        </div>

                        <button type="submit" className="button login__submit">
                            <span className="button__text">Actualizar</span>
                            <i className="button__icon fas fa-chevron-right"></i>
                        </button>
                    </form>
                   
                </div>
                <div className="screen__background">
                    <span className="screen__background__shape screen__background__shape4"></span>
                    <span className="screen__background__shape screen__background__shape3"></span>
                    <span className="screen__background__shape screen__background__shape2"></span>
                    <span className="screen__background__shape screen__background__shape1"></span>
                </div>
            </div>
        </div>
        </div>
    );
};

export default EditProfile;
