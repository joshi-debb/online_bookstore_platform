import { Navbar, Nav, Container } from 'react-bootstrap';
import '../styles/Navbar_usuario.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar_usuario = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    const navigateTo = (path) => {
        navigate(path);
    }

    return(
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container fluid>
                <img src='./src/assets/react.svg' className='navbar-logo' />
                <Navbar.Brand className='ml-0 text-title'>BookStore</Navbar.Brand>
                <Navbar.Toggle onClick={toggleMenu} aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className={isOpen ? "is-active" : ""}>
                    <Nav className="me-auto">
                        <Nav.Link className='navbar-items' onClick={() => navigateTo('/main')}>Catalogo</Nav.Link>
                        <Nav.Link className='navbar-items' onClick={() => navigateTo('/Carrito')}>Mi carrito</Nav.Link>
                        <Nav.Link className='navbar-items' onClick={() => navigateTo('/historialusuario')}>Mis Pedidos</Nav.Link>
                        <Nav.Link className='navbar-items' onClick={() => navigateTo('/editprofile')}>Mi perfil</Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        <Nav.Link className='navbar-items' onClick={() => navigateTo('/')}>Cerrar Sesión</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navbar_usuario;
