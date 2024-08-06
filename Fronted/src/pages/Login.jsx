import { useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    localStorage.clear()
    e.preventDefault();

    try {
      if(formData.email === "admin" && formData.password === "admin"){
        navigate('/autores');
        swal("Exito", "Admin Logeado", "success");
        return;
      }
      const response = await axios.post('http://localhost:3000/api/users/login', formData);
      console.log('Respuesta del servidor:', response.data);
      if(response.status === 200){
        //ir a pantalla de usuarios
        // navigate('/autores');
        localStorage.setItem('iduser' , response.data.user._id)
        localStorage.setItem('nameuser' , response.data.user.nombre)
        navigate('/main')
        swal("Exito", "Usuario Logeado", "success");
      }
        
    
    } catch (error) {
      swal("Error", "No se pudo iniciar sesión", "error");
    }
  };

  return (
    <div className="container-login2">
      <div className="screen">
        <div className="screen__content">
          <form className="login" onSubmit={handleSubmit}>
            <h1>BookStore Usac</h1>
            <div className="login__field">
              <i className="login__icon fas fa-user"></i>
              <input
                type="text"
                className="login__input"
                placeholder="correo"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="login__field">
              <i className="login__icon fas fa-lock"></i>
              <input
                type="password"
                className="login__input"
                placeholder="Contraseña"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="button login__submit">
              <span className="button__text">Ingresar</span>
              <i className="button__icon fas fa-chevron-right"></i>
            </button>
          </form>
         <div className="login__field">
            <br /><Link to="/register">Crea tu cuenta</Link>
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

export default Login;