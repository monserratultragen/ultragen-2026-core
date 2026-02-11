import { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';

function LibroVisitasList() {
    const [visitas, setVisitas] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newVisita, setNewVisita] = useState({
        nombre: '',
        mensaje: '',
        correo: '',
        fecha: ''
    });

    useEffect(() => {
        fetchVisitas();
    }, []);

    const fetchVisitas = () => {
        api.get('/libro-visitas/')
            .then(res => setVisitas(res.data))
            .catch(err => console.error(err));
    };

    const handleCreate = (e) => {
        e.preventDefault();
        api.post('/libro-visitas/', newVisita)
            .then(() => {
                setIsModalOpen(false);
                fetchVisitas();
                setNewVisita({ nombre: '', mensaje: '', correo: '', fecha: '' });
            })
            .catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Eliminar visita?")) {
            api.delete(`/libro-visitas/${id}/`)
                .then(() => fetchVisitas())
                .catch(err => console.error(err));
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Libro de Visitas</h2>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Nueva Visita</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Mensaje</th>
                            <th style={{ width: '100px' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visitas.map(v => (
                            <tr key={v.id}>
                                <td>{v.fecha}</td>
                                <td>{v.nombre}</td>
                                <td>{v.correo}</td>
                                <td>{v.mensaje}</td>
                                <td>
                                    <button
                                        className="action-btn"
                                        onClick={() => handleDelete(v.id)}
                                        title="Eliminar"
                                        style={{ color: '#ff4444' }}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {visitas.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                    No hay visitas registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva Visita">
                <form onSubmit={handleCreate}>
                    <div className="form-group">
                        <label>Fecha</label>
                        <input
                            type="text"
                            placeholder="Ej: 20/08/2023 14:32"
                            value={newVisita.fecha}
                            onChange={e => setNewVisita({ ...newVisita, fecha: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input
                            type="text"
                            value={newVisita.nombre}
                            onChange={e => setNewVisita({ ...newVisita, nombre: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Correo</label>
                        <input
                            type="email"
                            value={newVisita.correo}
                            onChange={e => setNewVisita({ ...newVisita, correo: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Mensaje</label>
                        <textarea
                            value={newVisita.mensaje}
                            onChange={e => setNewVisita({ ...newVisita, mensaje: e.target.value })}
                            rows="4"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Guardar</button>
                </form>
            </Modal>
        </div>
    );
}

export default LibroVisitasList;
