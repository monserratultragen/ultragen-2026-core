import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Modal from '../components/Modal';

function Tablet() {
    const navigate = useNavigate();
    const [presentaciones, setPresentaciones] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPresentacion, setNewPresentacion] = useState({
        titulo: '',
        descripcion: ''
    });

    useEffect(() => {
        fetchPresentaciones();
    }, []);

    const fetchPresentaciones = () => {
        api.get('/presentaciones/')
            .then(res => setPresentaciones(res.data))
            .catch(err => console.error(err));
    };

    const handleCreate = (e) => {
        e.preventDefault();
        api.post('/presentaciones/', newPresentacion)
            .then(() => {
                setIsModalOpen(false);
                fetchPresentaciones();
                setNewPresentacion({ titulo: '', descripcion: '' });
            })
            .catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Eliminar presentación?")) {
            api.delete(`/presentaciones/${id}/`)
                .then(() => fetchPresentaciones())
                .catch(err => console.error(err));
        }
    };

    return (
        <div className="page-container">
            <div className="content-area" style={{ margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>Tablet</h1>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Nueva Presentación</button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Descripción</th>
                                <th style={{ width: '150px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {presentaciones.map(p => (
                                <tr key={p.id}>
                                    <td>{p.titulo}</td>
                                    <td>{p.descripcion}</td>
                                    <td>
                                        <button
                                            className="action-btn"
                                            onClick={() => navigate(`/presentaciones/${p.id}`)}
                                            title="Editar Slides"
                                            style={{ marginRight: '10px' }}
                                        >
                                            ✎ Slides
                                        </button>
                                        <button
                                            className="action-btn"
                                            onClick={() => handleDelete(p.id)}
                                            title="Eliminar"
                                            style={{ color: '#ff4444' }}
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {presentaciones.length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                        No hay presentaciones registradas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva Presentación">
                    <form onSubmit={handleCreate}>
                        <div className="form-group">
                            <label>Título</label>
                            <input
                                type="text"
                                value={newPresentacion.titulo}
                                onChange={e => setNewPresentacion({ ...newPresentacion, titulo: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Descripción</label>
                            <textarea
                                value={newPresentacion.descripcion}
                                onChange={e => setNewPresentacion({ ...newPresentacion, descripcion: e.target.value })}
                                rows="3"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Crear</button>
                    </form>
                </Modal>
            </div>
        </div>
    );
}

export default Tablet;
