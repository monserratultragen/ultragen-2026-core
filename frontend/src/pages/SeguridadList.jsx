import { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';

function SeguridadList() {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ santo: '', sena: '' });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        api.get('/seguridad/')
            .then(res => setItems(res.data))
            .catch(err => console.error(err));
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingId(item.id);
            setForm({ santo: item.santo, sena: item.sena });
        } else {
            setEditingId(null);
            setForm({ santo: '', sena: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('santo', form.santo);
        formData.append('sena', form.sena);

        const request = editingId
            ? api.patch(`/seguridad/${editingId}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            : api.post('/seguridad/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

        request.then(() => {
            setIsModalOpen(false);
            fetchItems();
        }).catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Eliminar registro de seguridad?")) {
            api.delete(`/seguridad/${id}/`).then(fetchItems);
        }
    };

    return (
        <div className="page-container">
            <div className="content-area" style={{ margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>Seguridad</h1>
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>+ Nuevo Registro</button>
                </div>

                <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '20px' }}>
                    {items.map(item => (
                        <div key={item.id} className="card" style={{ display: 'flex', overflow: 'hidden' }}>
                            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <h4 style={{ color: '#aaa', marginBottom: '5px' }}>Santo:</h4>
                                    <p style={{ whiteSpace: 'pre-wrap', fontSize: '1rem', color: '#ddd', marginBottom: '15px' }}>{item.santo}</p>
                                    <h4 style={{ color: '#aaa', marginBottom: '5px' }}>Seña:</h4>
                                    <p style={{ whiteSpace: 'pre-wrap', fontSize: '1rem', color: '#ddd' }}>{item.sena}</p>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                    <button className="btn btn-sm btn-outline" onClick={() => handleOpenModal(item)}>Editar</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>Eliminar</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Editar Seguridad" : "Nuevo Registro Seguridad"}>
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Santo</label>
                            <textarea
                                value={form.santo}
                                onChange={e => setForm({ ...form, santo: e.target.value })}
                                rows="4"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Seña</label>
                            <textarea
                                value={form.sena}
                                onChange={e => setForm({ ...form, sena: e.target.value })}
                                rows="4"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Guardar</button>
                    </form>
                </Modal>
            </div>
        </div>
    );
}

export default SeguridadList;
