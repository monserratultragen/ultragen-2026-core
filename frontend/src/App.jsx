import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DiariosList from './pages/DiariosList';
import TomosList from './pages/TomosList';
import CapitulosList from './pages/CapitulosList';
import CapituloWriter from './pages/CapituloWriter';
import PersonajesList from './pages/PersonajesList';
import ConversacionesList from './pages/ConversacionesList';
import ConversacionEditor from './pages/ConversacionEditor';
import './index.css';

import ExpedientesList from './pages/ExpedientesList';
import ExpedienteEditor from './pages/ExpedienteEditor';
import SaludosList from './pages/SaludosList';
import PresentacionEditor from './pages/PresentacionEditor';
import RecuerdosLeticiaList from './pages/RecuerdosLeticiaList';
import InstagramManager from './pages/InstagramManager';
import BienvenidasList from './pages/BienvenidasList';

import DesktopList from './pages/DesktopList';
import SusurrosList from './pages/SusurrosList';

// New Views
import DiariosView from './pages/DiariosView';
import Movil from './pages/Movil';
import Laptop from './pages/Laptop';
import Pistas from './pages/Pistas';
import Tablet from './pages/Tablet';
import PopUp from './pages/PopUp';
import UniversalLoader from './pages/UniversalLoader';

function App() {
  return (
    <Router>
      <div className="navbar">
        <div className="container nav-content">
          <Link to="/" className="nav-logo">ULTRAGEN</Link>
          <div>
            <Link to="/" className="btn">Dashboard</Link>
            <Link to="/desktop" className="btn" style={{ marginLeft: '10px' }}>Desktop</Link>
            <Link to="/susurros" className="btn" style={{ marginLeft: '10px' }}>Susurros</Link>
            <Link to="/diarios-main" className="btn" style={{ marginLeft: '10px' }}>Diarios</Link>
            <Link to="/movil" className="btn" style={{ marginLeft: '10px' }}>Movil</Link>
            <Link to="/expedientes" className="btn" style={{ marginLeft: '10px' }}>Expedientes</Link>
            <Link to="/tablet" className="btn" style={{ marginLeft: '10px' }}>Tablet</Link>
            <Link to="/tableros" className="btn" style={{ marginLeft: '10px' }}>TABLEROS</Link>
            <Link to="/laptop" className="btn" style={{ marginLeft: '10px' }}>Laptop</Link>
            <Link to="/popup" className="btn" style={{ marginLeft: '10px' }}>Pop-Up</Link>
            <Link to="/universal-loader" className="btn" style={{ marginLeft: '10px' }}>Data</Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '20px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/desktop" element={<DesktopList />} />
          <Route path="/susurros" element={<SusurrosList />} />
          <Route path="/diarios-main" element={<DiariosView />} />
          <Route path="/movil" element={<Movil />} />
          <Route path="/diarios" element={<DiariosList />} />
          <Route path="/tomos" element={<TomosList />} />
          <Route path="/capitulos" element={<CapitulosList />} />
          <Route path="/writer/:id" element={<CapituloWriter />} />
          <Route path="/personajes" element={<PersonajesList />} />
          <Route path="/conversaciones" element={<ConversacionesList />} />
          <Route path="/conversaciones/:id" element={<ConversacionEditor />} />
          <Route path="/expedientes" element={<ExpedientesList />} />
          <Route path="/expedientes/:id" element={<ExpedienteEditor />} />
          <Route path="/saludos" element={<SaludosList />} />
          <Route path="/tablet" element={<Tablet />} />
          <Route path="/presentaciones" element={<Tablet />} /> {/* Alias */}
          <Route path="/presentaciones/:id" element={<PresentacionEditor />} />
          <Route path="/pistas" element={<Pistas />} />
          <Route path="/tableros" element={<Pistas />} /> {/* Alias */}
          <Route path="/recuerdos-leticia" element={<RecuerdosLeticiaList />} />
          <Route path="/instagram" element={<InstagramManager />} />
          <Route path="/laptop" element={<Laptop />} />
          <Route path="/mercadoumbral" element={<Laptop />} /> {/* Alias */}
          <Route path="/bienvenidas" element={<BienvenidasList />} />
          <Route path="/popup" element={<PopUp />} />
          <Route path="/universal-loader" element={<UniversalLoader />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
