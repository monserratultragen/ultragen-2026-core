import { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';

function PersonajesList() {
    const [personajes, setPersonajes] = useState([]);
    const [diarios, setDiarios] = useState([]);
    const [selectedDiarioId, setSelectedDiarioId] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newPersonaje, setNewPersonaje] = useState({
        nombre: '',
        descripcion: '',
        diario: '',
        prioridad: 0
    });
    const [imagen, setImagen] = useState(null);

    useEffect(() => {
        fetchDiarios();
        fetchPersonajes();
    }, []);

    const fetchDiarios = () => {
        api.get('/diarios/')
            .then(res => setDiarios(res.data))
            .catch(err => console.error(err));
    };

    const fetchPersonajes = () => {
        api.get('/personajes/')
            .then(res => setPersonajes(res.data))
            .catch(err => console.error(err));
    };

    const handleOpenModal = (p = null) => {
        if (p) {
            setEditingId(p.id);
            setNewPersonaje({
                nombre: p.nombre,
                descripcion: p.descripcion || '',
                diario: p.diario,
                prioridad: p.prioridad || 0
            });
        } else {
            setEditingId(null);
            setNewPersonaje({
                nombre: '',
                descripcion: '',
                diario: selectedDiarioId || '',
                prioridad: 0
            });
        }
        setImagen(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setImagen(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in newPersonaje) {
            formData.append(key, newPersonaje[key]);
        }
        if (imagen) {
            formData.append('ruta_img', imagen);
        }

        const request = editingId
            ? api.patch(`/personajes/${editingId}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            : api.post('/personajes/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

        request
            .then(() => {
                handleCloseModal();
                fetchPersonajes();
            })
            .catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Seguro que quieres eliminar este personaje?")) {
            api.delete(`/personajes/${id}/`)
                .then(() => fetchPersonajes())
                .catch(err => console.error(err));
        }
    };

    const filteredPersonajes = selectedDiarioId
        ? personajes.filter(p => p.diario === selectedDiarioId)
        : personajes;

    return (
        <div style={{ display: 'flex', width: '100%', height: 'calc(100vh - 100px)' }}>
            <div className="sidebar">
                <div className="sidebar-header">
                    <h3>Diarios</h3>
                </div>
                <div className="sidebar-content">
                    <div
                        className={`sidebar-item ${!selectedDiarioId ? 'active' : ''}`}
                        onClick={() => setSelectedDiarioId(null)}
                    >
                        Todos
                    </div>
                    {diarios.map(d => (
                        <div
                            key={d.id}
                            className={`sidebar-item ${selectedDiarioId === d.id ? 'active' : ''}`}
                            onClick={() => setSelectedDiarioId(d.id)}
                        >
                            {d.nombre}
                        </div>
                    ))}
                </div>
            </div>

            <div className="content-area">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>Personajes</h1>
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>Nuevo Personaje</button>
                </div>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                    {filteredPersonajes.map(p => (
                        <div key={p.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ height: '200px', backgroundColor: '#333', overflow: 'hidden' }}>
                                {p.ruta_img ? (
                                    <img src={p.ruta_img} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                                        Sin Imagen
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: '15px' }}>
                                <h3 style={{ margin: '0 0 5px 0' }}>{p.nombre}</h3>
                                <p style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '10px' }}>
                                    {diarios.find(d => d.id === p.diario)?.nombre || 'Sin Diario'}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <button className="btn btn-sm btn-outline" onClick={() => handleOpenModal(p)}>Editar</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Eliminar</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingId ? "Editar Personaje" : "Nuevo Personaje"}
                >
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                value={newPersonaje.nombre}
                                onChange={e => setNewPersonaje({ ...newPersonaje, nombre: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Diario</label>
                            <select
                                value={newPersonaje.diario}
                                onChange={e => setNewPersonaje({ ...newPersonaje, diario: e.target.value })}
                                required
                            >
                                <option value="">Selecciona un Diario</option>
                                {diarios.map(d => (
                                    <option key={d.id} value={d.id}>{d.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Prioridad</label>
                            <input
                                type="number"
                                value={newPersonaje.prioridad}
                                onChange={e => setNewPersonaje({ ...newPersonaje, prioridad: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Descripción</label>
                            <textarea
                                value={newPersonaje.descripcion}
                                onChange={e => setNewPersonaje({ ...newPersonaje, descripcion: e.target.value })}
                                rows="3"
                            />
                        </div>
                        <div className="form-group">
                            <label>Imagen</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setImagen(e.target.files[0])}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Guardar</button>
                    </form>
                </Modal>
            </div>
        </div>
    );
}

export default PersonajesList;
