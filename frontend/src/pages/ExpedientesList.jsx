import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Modal from '../components/Modal';

function ExpedientesList() {
    const navigate = useNavigate();
    const [expedientes, setExpedientes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newExpediente, setNewExpediente] = useState({
        titulo: '',
        descripcion: '',
        orden: 0
    });
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchExpedientes();
    }, []);

    const fetchExpedientes = () => {
        api.get('/expedientes/')
            .then(res => setExpedientes(res.data))
            .catch(err => console.error(err));
    };

    const handleCreate = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('titulo', newExpediente.titulo);
        formData.append('descripcion', newExpediente.descripcion);
        formData.append('orden', newExpediente.orden);
        if (image) formData.append('imagen', image);

        api.post('/expedientes/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(() => {
                setIsModalOpen(false);
                fetchExpedientes();
                setNewExpediente({ titulo: '', descripcion: '', orden: 0 });
                setImage(null);
            })
            .catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Eliminar expediente?")) {
            api.delete(`/expedientes/${id}/`)
                .then(() => fetchExpedientes())
                .catch(err => console.error(err));
        }
    };

    return (
        <div className="page-container">
            <div className="content-area" style={{ margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>Expedientes</h1>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Nuevo Expediente</button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>Ord</th>
                                <th style={{ width: '80px' }}>Img</th>
                                <th>Título</th>
                                <th>Descripción</th>
                                <th style={{ width: '150px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expedientes.map(exp => (
                                <tr key={exp.id}>
                                    <td style={{ textAlign: 'center' }}>{exp.orden}</td>
                                    <td>
                                        {exp.imagen && (
                                            <img src={exp.imagen} alt="Expediente" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                        )}
                                    </td>
                                    <td>{exp.titulo}</td>
                                    <td>{exp.descripcion}</td>
                                    <td>
                                        <button
                                            className="action-btn"
                                            onClick={() => navigate(`/expedientes/${exp.id}`)}
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
                            {expedientes.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                        No hay expedientes registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Expediente">
                    <form onSubmit={handleCreate}>
                        <div className="form-group">
                            <label>Título</label>
                            <input
                                type="text"
                                value={newExpediente.titulo}
                                onChange={e => setNewExpediente({ ...newExpediente, titulo: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Orden</label>
                            <input
                                type="number"
                                value={newExpediente.orden}
                                onChange={e => setNewExpediente({ ...newExpediente, orden: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Descripción</label>
                            <textarea
                                value={newExpediente.descripcion}
                                onChange={e => setNewExpediente({ ...newExpediente, descripcion: e.target.value })}
                                rows="3"
                            />
                        </div>
                        <div className="form-group">
                            <label>Imagen</label>
                            <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
                        </div>
                        <button type="submit" className="btn btn-primary">Crear</button>
                    </form>
                </Modal>
            </div>
        </div>
    );
}

export default ExpedientesList;
