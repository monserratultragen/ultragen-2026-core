import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Modal from '../components/Modal';

function ExperientesList() {
    const navigate = useNavigate();
    const [experientes, setExperientes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newExperiente, setNewExperiente] = useState({
        titulo: '',
        descripcion: '',
        orden: 0
    });

    useEffect(() => {
        fetchExperientes();
    }, []);

    const fetchExperientes = () => {
        api.get('/experientes/')
            .then(res => setExperientes(res.data))
            .catch(err => console.error(err));
    };

    const handleCreate = (e) => {
        e.preventDefault();
        api.post('/experientes/', newExperiente)
            .then(() => {
                setIsModalOpen(false);
                fetchExperientes();
                setNewExperiente({ titulo: '', descripcion: '', orden: 0 });
            })
            .catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Eliminar experiente?")) {
            api.delete(`/experientes/${id}/`)
                .then(() => fetchExperientes())
                .catch(err => console.error(err));
        }
    };

    return (
        <div className="page-container">
            <div className="content-area" style={{ margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>Experientes</h1>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Nuevo Experiente</button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>Ord</th>
                                <th>Título</th>
                                <th>Descripción</th>
                                <th style={{ width: '150px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {experientes.map(exp => (
                                <tr key={exp.id}>
                                    <td style={{ textAlign: 'center' }}>{exp.orden}</td>
                                    <td>{exp.titulo}</td>
                                    <td>{exp.descripcion}</td>
                                    <td>
                                        <button
                                            className="action-btn"
                                            onClick={() => navigate(`/experientes/${exp.id}`)}
                                            title="Escritor"
                                            style={{ marginRight: '10px' }}
                                        >
                                            ✎ Escritor
                                        </button>
                                        <button
                                            className="action-btn"
                                            onClick={() => handleDelete(exp.id)}
                                            title="Eliminar"
                                            style={{ color: '#ff4444' }}
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {experientes.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                        No hay experientes registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Experiente">
                    <form onSubmit={handleCreate}>
                        <div className="form-group">
                            <label>Título</label>
                            <input
                                type="text"
                                value={newExperiente.titulo}
                                onChange={e => setNewExperiente({ ...newExperiente, titulo: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Orden</label>
                            <input
                                type="number"
                                value={newExperiente.orden}
                                onChange={e => setNewExperiente({ ...newExperiente, orden: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Descripción</label>
                            <textarea
                                value={newExperiente.descripcion}
                                onChange={e => setNewExperiente({ ...newExperiente, descripcion: e.target.value })}
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

export default ExperientesList;
