import { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';

function SaludosList() {
    const [saludos, setSaludos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newSaludo, setNewSaludo] = useState({
        contenido: '',
        url_librovisitas: ''
    });
    const [imagen, setImagen] = useState(null);

    useEffect(() => {
        fetchSaludos();
    }, []);

    const fetchSaludos = () => {
        api.get('/saludos-editora/')
            .then(res => setSaludos(res.data))
            .catch(err => console.error(err));
    };

    const handleOpenModal = (s = null) => {
        if (s) {
            setEditingId(s.id);
            setNewSaludo({
                contenido: s.contenido,
                url_librovisitas: s.url_librovisitas || ''
            });
        } else {
            setEditingId(null);
            setNewSaludo({
                contenido: '',
                url_librovisitas: ''
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
        formData.append('contenido', newSaludo.contenido);
        formData.append('url_librovisitas', newSaludo.url_librovisitas);
        if (imagen) {
            formData.append('imagen', imagen);
        }

        const request = editingId
            ? api.patch(`/saludos-editora/${editingId}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            : api.post('/saludos-editora/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

        request
            .then(() => {
                handleCloseModal();
                fetchSaludos();
            })
            .catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Eliminar saludo?")) {
            api.delete(`/saludos-editora/${id}/`)
                .then(() => fetchSaludos())
                .catch(err => console.error(err));
        }
    };

    return (
        <div className="page-container">
            <div className="content-area" style={{ margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>Saludos Editora</h1>
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>Nuevo Saludo</button>
                </div>

                <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '20px' }}>
                    {saludos.map(s => (
                        <div key={s.id} className="card" style={{ display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
                            <div style={{ width: '150px', backgroundColor: '#333' }}>
                                {s.imagen ? (
                                    <img src={s.imagen} alt="Saludo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                                        Sin Imagen
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: '15px', flex: 1 }}>
                                <div style={{ marginBottom: '10px', whiteSpace: 'pre-wrap' }}>{s.contenido}</div>
                                {s.url_librovisitas && (
                                    <div style={{ marginBottom: '10px' }}>
                                        <a href={s.url_librovisitas} target="_blank" rel="noopener noreferrer" style={{ color: '#00bcd4' }}>
                                            Libro de Visitas
                                        </a>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                    <button className="btn btn-sm btn-outline" onClick={() => handleOpenModal(s)}>Editar</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id)}>Eliminar</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingId ? "Editar Saludo" : "Nuevo Saludo"}
                >
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Contenido</label>
                            <textarea
                                value={newSaludo.contenido}
                                onChange={e => setNewSaludo({ ...newSaludo, contenido: e.target.value })}
                                rows="5"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>URL Libro de Visitas</label>
                            <input
                                type="url"
                                value={newSaludo.url_librovisitas}
                                onChange={e => setNewSaludo({ ...newSaludo, url_librovisitas: e.target.value })}
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

export default SaludosList;
