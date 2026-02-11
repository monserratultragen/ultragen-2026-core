import { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';

function RecuerdosLeticiaList() {
    const [recuerdos, setRecuerdos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newRecuerdo, setNewRecuerdo] = useState({
        orden: 0,
        titulo: '',
        contenido: '',
        fecha: '',
        firma: ''
    });
    const [imagen, setImagen] = useState(null);

    useEffect(() => {
        fetchRecuerdos();
    }, []);

    const fetchRecuerdos = () => {
        api.get('/recuerdos-leticia/')
            .then(res => setRecuerdos(res.data))
            .catch(err => console.error(err));
    };

    const handleOpenModal = (r = null) => {
        if (r) {
            setEditingId(r.id);
            setNewRecuerdo({
                orden: r.orden,
                titulo: r.titulo,
                contenido: r.contenido,
                fecha: r.fecha ? r.fecha.split('T')[0] : '', // Format for date input
                firma: r.firma || ''
            });
        } else {
            setEditingId(null);
            setNewRecuerdo({
                orden: recuerdos.length + 1,
                titulo: '',
                contenido: '',
                fecha: '',
                firma: ''
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
        formData.append('orden', newRecuerdo.orden);
        formData.append('titulo', newRecuerdo.titulo);
        formData.append('contenido', newRecuerdo.contenido);
        if (newRecuerdo.fecha) formData.append('fecha', newRecuerdo.fecha);
        formData.append('firma', newRecuerdo.firma);
        if (imagen) {
            formData.append('imagen', imagen);
        }

        const request = editingId
            ? api.patch(`/recuerdos-leticia/${editingId}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            : api.post('/recuerdos-leticia/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

        request
            .then(() => {
                handleCloseModal();
                fetchRecuerdos();
            })
            .catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Eliminar recuerdo?")) {
            api.delete(`/recuerdos-leticia/${id}/`)
                .then(() => fetchRecuerdos())
                .catch(err => console.error(err));
        }
    };

    return (
        <div className="page-container">
            <div className="content-area" style={{ margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>Recuerdos de Leticia</h1>
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>Nuevo Recuerdo</button>
                </div>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {recuerdos.map(r => (
                        <div key={r.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ height: '200px', backgroundColor: '#333', position: 'relative' }}>
                                {r.imagen ? (
                                    <img src={r.imagen} alt={r.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                                        Sin Imagen
                                    </div>
                                )}
                                <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.9rem' }}>
                                    #{r.orden}
                                </div>
                            </div>
                            <div style={{ padding: '15px' }}>
                                <h3 style={{ marginTop: '0', marginBottom: '10px' }}>{r.titulo}</h3>
                                <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '10px', whiteSpace: 'pre-wrap' }}>{r.contenido}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#888', marginBottom: '15px' }}>
                                    <span>{r.fecha ? new Date(r.fecha).toLocaleDateString() : 'Sin fecha'}</span>
                                    <span style={{ fontStyle: 'italic' }}>{r.firma}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                    <button className="btn btn-sm btn-outline" onClick={() => handleOpenModal(r)}>Editar</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.id)}>Eliminar</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingId ? "Editar Recuerdo" : "Nuevo Recuerdo"}
                >
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Orden</label>
                            <input
                                type="number"
                                value={newRecuerdo.orden}
                                onChange={e => setNewRecuerdo({ ...newRecuerdo, orden: parseInt(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Título</label>
                            <input
                                type="text"
                                value={newRecuerdo.titulo}
                                onChange={e => setNewRecuerdo({ ...newRecuerdo, titulo: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Contenido</label>
                            <textarea
                                value={newRecuerdo.contenido}
                                onChange={e => setNewRecuerdo({ ...newRecuerdo, contenido: e.target.value })}
                                rows="5"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Fecha</label>
                            <input
                                type="date"
                                value={newRecuerdo.fecha}
                                onChange={e => setNewRecuerdo({ ...newRecuerdo, fecha: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Firma</label>
                            <input
                                type="text"
                                value={newRecuerdo.firma}
                                onChange={e => setNewRecuerdo({ ...newRecuerdo, firma: e.target.value })}
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

export default RecuerdosLeticiaList;
