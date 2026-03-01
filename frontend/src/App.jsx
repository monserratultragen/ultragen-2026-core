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
import PromptAIManager from './pages/PromptAIManager';
import ImagenAIBaseManager from './pages/ImagenAIBaseManager';

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
        <div className="container nav-content" style={{ flexWrap: 'wrap', gap: '5px' }}>
          <Link to="/" className="nav-logo" style={{ marginRight: '15px' }}>ULTRAGEN</Link>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <Link to="/" className="btn btn-sm">Dashboard</Link>
            <Link to="/desktop" className="btn btn-sm">Desktop</Link>
            <Link to="/susurros" className="btn btn-sm">Susurros</Link>
            <Link to="/diarios-main" className="btn btn-sm">Diarios</Link>
            <Link to="/movil" className="btn btn-sm">Movil</Link>
            <Link to="/expedientes" className="btn btn-sm">Expedientes</Link>
            <Link to="/tablet" className="btn btn-sm">Tablet</Link>
            <Link to="/tableros" className="btn btn-sm">TABLEROS</Link>
            <Link to="/laptop" className="btn btn-sm">Laptop</Link>
            <Link to="/popup" className="btn btn-sm">Pop-Up</Link>
            <Link to="/universal-loader" className="btn btn-sm">Data</Link>
            <Link to="/prompts-ai" className="btn btn-sm">Prompts AI</Link>
            <Link to="/imagenes-ai" className="btn btn-sm">Img AI Base</Link>
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
          <Route path="/prompts-ai" element={<PromptAIManager />} />
          <Route path="/imagenes-ai" element={<ImagenAIBaseManager />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
