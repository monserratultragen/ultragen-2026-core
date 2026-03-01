import { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import { getImageUrl } from '../utils/imageUtils';

function ImagenAIBaseManager() {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ titulo: '', notas: '' });
    const [imagen, setImagen] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        api.get('/imagenes-ai-base/')
            .then(res => setItems(res.data))
            .catch(err => console.error(err));
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingId(item.id);
            setForm({ titulo: item.titulo, notas: item.notas || '' });
        } else {
            setEditingId(null);
            setForm({ titulo: '', notas: '' });
        }
        setImagen(null);
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('titulo', form.titulo);
        if (form.notas) formData.append('notas', form.notas);
        if (imagen) formData.append('imagen', imagen);

        const request = editingId
            ? api.patch(`/imagenes-ai-base/${editingId}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            : api.post('/imagenes-ai-base/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

        request.then(() => {
            setIsModalOpen(false);
            fetchItems();
        }).catch(err => {
            console.error(err);
            alert("Error al guardar: " + (err.response?.data?.detail || err.message));
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Eliminar esta imagen base?")) {
            api.delete(`/imagenes-ai-base/${id}/`).then(fetchItems);
        }
    };

    const handleCopyImage = async (imageUrl) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            await navigator.clipboard.write([
                new ClipboardItem({ [blob.type]: blob })
            ]);
        } catch (err) {
            console.error("Error al copiar imagen:", err);
            alert("Ocurrió un error al intentar copiar la imagen. Es posible que tu navegador o la configuración de CORS no lo permitan.");
        }
    };

    return (
        <div className="page-container">
            <div className="content-area">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>Imágenes AI Base</h1>
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>+ Nueva Imagen Base</button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    {items.map(item => (
                        <div key={item.id} className="card" style={{ width: '180px', padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <div style={{ width: '180px', height: '270px', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {item.imagen ? (
                                    <img
                                        src={getImageUrl(item.imagen)}
                                        alt={item.titulo}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <span style={{ color: '#666', fontSize: '0.8rem' }}>Sin Imagen</span>
                                )}
                            </div>
                            <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.titulo}</h3>
                                {item.notas && (
                                    <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: '#aaa', flexGrow: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                        {item.notas}
                                    </p>
                                )}
                                <div style={{ display: 'flex', gap: '4px', marginTop: 'auto', flexWrap: 'wrap' }}>
                                    {item.imagen && (
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => handleCopyImage(getImageUrl(item.imagen))}
                                            style={{ flex: '1 1 100%', padding: '4px' }}
                                            title="Copiar Imagen"
                                        >
                                            Copiar
                                        </button>
                                    )}
                                    <button className="btn btn-sm btn-outline" onClick={() => handleOpenModal(item)} style={{ flex: '1 1 calc(50% - 2px)', padding: '4px' }}>Editar</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)} style={{ flex: '1 1 calc(50% - 2px)', padding: '4px' }}>Del</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
                            No hay imágenes registradas.
                        </div>
                    )}
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Editar Imagen Base" : "Nueva Imagen Base"}>
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Título</label>
                            <input
                                type="text"
                                value={form.titulo}
                                onChange={e => setForm({ ...form, titulo: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Notas (Opcional)</label>
                            <textarea
                                value={form.notas}
                                onChange={e => setForm({ ...form, notas: e.target.value })}
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

export default ImagenAIBaseManager;
