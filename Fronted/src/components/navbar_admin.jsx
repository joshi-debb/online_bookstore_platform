import { Navbar, Nav, Container } from 'react-bootstrap';
import '../styles/navbar_admin.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const NavigationBar = () => {
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
                        <Nav.Link className='navbar-items' onClick={() => navigateTo('/Autores')}>Autores</Nav.Link>
                        <Nav.Link className='navbar-items' onClick={() => navigateTo('/HistorialAdmin')}>Historial</Nav.Link>
                        <Nav.Link className='navbar-items' onClick={() => navigateTo('/topbooks')}>Reportes</Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        <Nav.Link className='navbar-items' onClick={() => navigateTo('/')}>Cerrar Sesión</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavigationBar;