import { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';

function DesktopList() {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ nombre: '', tooltip: '' });
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        api.get('/desktop/')
            .then(res => setItems(res.data))
            .catch(err => console.error(err));
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingId(item.id);
            setForm({ nombre: item.nombre, tooltip: item.tooltip || '' });
        } else {
            setEditingId(null);
            setForm({ nombre: '', tooltip: '' });
        }
        setImage(null);
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nombre', form.nombre);
        formData.append('tooltip', form.tooltip);
        if (image) formData.append('imagen', image);

        const request = editingId
            ? api.patch(`/desktop/${editingId}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            : api.post('/desktop/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

        request.then(() => {
            setIsModalOpen(false);
            fetchItems();
        }).catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Eliminar elemento del Desktop?")) {
            api.delete(`/desktop/${id}/`).then(fetchItems);
        }
    };

    return (
        <div className="page-container">
            <div className="content-area" style={{ margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>Desktop</h1>
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>+ Nuevo Elemento</button>
                </div>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                    {items.map(item => (
                        <div key={item.id} className="card" style={{ overflow: 'hidden' }}>
                            <div style={{ height: '150px', backgroundColor: '#333' }}>
                                {item.imagen ? (
                                    <img src={item.imagen} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>Sin Imagen</div>
                                )}
                            </div>
                            <div style={{ padding: '15px' }}>
                                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{item.nombre}</h3>
                                {item.tooltip && <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#aaa' }}>{item.tooltip}</p>}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                    <button className="btn btn-sm btn-outline" onClick={() => handleOpenModal(item)}>Editar</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>Eliminar</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Editar Elemento" : "Nuevo Elemento"}>
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Nombre *</label>
                            <input
                                type="text"
                                value={form.nombre}
                                onChange={e => setForm({ ...form, nombre: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Tooltip</label>
                            <textarea
                                value={form.tooltip}
                                onChange={e => setForm({ ...form, tooltip: e.target.value })}
                                rows="2"
                            />
                        </div>
                        <div className="form-group">
                            <label>Imagen {editingId ? '(Opcional)' : '*'}</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setImage(e.target.files[0])}
                                required={!editingId}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Guardar</button>
                    </form>
                </Modal>
            </div>
        </div>
    );
}

export default DesktopList;
