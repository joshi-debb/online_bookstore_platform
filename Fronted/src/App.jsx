import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// index.js o App.js


import Login from './pages/Login';
import Register from './pages/Register';
import Autores from './pages/autores';
import AutorBooks from './pages/autorbocks';
import Topbooks from './pages/topbooks';
import HistorialAdmin from './pages/historialadmin';
import MainUser from './pages/MainUser';
import LibroSeleccionado from './pages/libroSeleccionado';
import HistorialUsuario from './pages/historialusuario';
import EditProfile from './pages/editProfile';
import Cart from './pages/carrito';
import Checkout from './pages/check';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/autores' element={<Autores />} />
          <Route path='/autorbooks' element={<AutorBooks />} />
          <Route path='/main' element={<MainUser />} />
          <Route path='/topbooks' element={<Topbooks />} />
          <Route path='/historialadmin' element={<HistorialAdmin />} />
          <Route path='/libroseleccionado' element={<LibroSeleccionado />} />
          <Route path='/historialusuario' element={<HistorialUsuario />} />
          <Route path='/editprofile' element={<EditProfile />} />
          <Route path='/carrito' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />

        </Routes>
      </Router>
    </>
  )
}

export default App;