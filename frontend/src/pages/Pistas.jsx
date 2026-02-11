import { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';

function Pistas() {
    const [tableros, setTableros] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newTablero, setNewTablero] = useState({
        orden: 0,
        titulo: '',
        descripcion: '',
        notas: ''
    });
    const [imagen, setImagen] = useState(null);

    useEffect(() => {
        fetchTableros();
    }, []);

    const fetchTableros = () => {
        api.get('/tableros/')
            .then(res => setTableros(res.data))
            .catch(err => console.error(err));
    };

    const handleOpenModal = (t = null) => {
        if (t) {
            setEditingId(t.id);
            setNewTablero({
                orden: t.orden,
                titulo: t.titulo,
                descripcion: t.descripcion || '',
                notas: t.notas || ''
            });
        } else {
            setEditingId(null);
            setNewTablero({
                orden: tableros.length + 1,
                titulo: '',
                descripcion: '',
                notas: ''
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
        formData.append('orden', newTablero.orden);
        formData.append('titulo', newTablero.titulo);
        formData.append('descripcion', newTablero.descripcion);
        formData.append('notas', newTablero.notas);
        if (imagen) {
            formData.append('imagen', imagen);
        }

        const request = editingId
            ? api.patch(`/tableros/${editingId}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            : api.post('/tableros/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

        request
            .then(() => {
                handleCloseModal();
                fetchTableros();
            })
            .catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Eliminar tablero?")) {
            api.delete(`/tableros/${id}/`)
                .then(() => fetchTableros())
                .catch(err => console.error(err));
        }
    };

    return (
        <div className="page-container">
            <div className="content-area" style={{ margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>TABLEROS</h1>
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>Nuevo Tablero</button>
                </div>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {tableros.map(t => (
                        <div key={t.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ height: '200px', backgroundColor: '#333', position: 'relative' }}>
                                {t.imagen ? (
                                    <img src={t.imagen} alt={t.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                                        Sin Imagen
                                    </div>
                                )}
                                <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.9rem' }}>
                                    #{t.orden}
                                </div>
                            </div>
                            <div style={{ padding: '15px' }}>
                                <h3 style={{ marginTop: '0', marginBottom: '10px' }}>{t.titulo}</h3>
                                <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '10px' }}>{t.descripcion}</p>
                                <div style={{ backgroundColor: '#2a2a2a', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '0.85rem', color: '#aaa' }}>
                                    <strong>Notas:</strong><br />
                                    {t.notas}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                    <button className="btn btn-sm btn-outline" onClick={() => handleOpenModal(t)}>Editar</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t.id)}>Eliminar</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingId ? "Editar Tablero" : "Nuevo Tablero"}
                >
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Orden</label>
                            <input
                                type="number"
                                value={newTablero.orden}
                                onChange={e => setNewTablero({ ...newTablero, orden: parseInt(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Título</label>
                            <input
                                type="text"
                                value={newTablero.titulo}
                                onChange={e => setNewTablero({ ...newTablero, titulo: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Descripción</label>
                            <textarea
                                value={newTablero.descripcion}
                                onChange={e => setNewTablero({ ...newTablero, descripcion: e.target.value })}
                                rows="3"
                            />
                        </div>
                        <div className="form-group">
                            <label>Notas</label>
                            <textarea
                                value={newTablero.notas}
                                onChange={e => setNewTablero({ ...newTablero, notas: e.target.value })}
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

export default Pistas;
