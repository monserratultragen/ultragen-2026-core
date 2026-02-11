import { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';

function BienvenidasList() {
    const [bienvenidas, setBienvenidas] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ contenido: '', tipo_usuario: 'Invitado' });
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchBienvenidas();
    }, []);

    const fetchBienvenidas = () => {
        api.get('/bienvenidas/')
            .then(res => setBienvenidas(res.data))
            .catch(err => console.error(err));
    };

    const handleOpenModal = (b = null) => {
        if (b) {
            setEditingId(b.id);
            setForm({ contenido: b.contenido, tipo_usuario: b.tipo_usuario || 'Invitado' });
        } else {
            setEditingId(null);
            setForm({ contenido: '', tipo_usuario: 'Invitado' });
        }
        setImage(null);
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('contenido', form.contenido);
        formData.append('tipo_usuario', form.tipo_usuario);
        if (image) formData.append('imagen', image);

        const request = editingId
            ? api.patch(`/bienvenidas/${editingId}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            : api.post('/bienvenidas/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

        request.then(() => {
            setIsModalOpen(false);
            fetchBienvenidas();
        }).catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Eliminar saludo?")) {
            api.delete(`/bienvenidas/${id}/`).then(fetchBienvenidas);
        }
    };

    return (
        <div className="page-container">
            <div className="content-area" style={{ margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>Saludos</h1>
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>+ Nuevo Saludo</button>
                </div>

                <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '20px' }}>
                    {bienvenidas.map(b => (
                        <div key={b.id} className="card" style={{ display: 'flex', overflow: 'hidden' }}>
                            <div style={{ width: '200px', minWidth: '200px', backgroundColor: '#333' }}>
                                {b.imagen ? (
                                    <img src={b.imagen} alt="Bienvenida" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>Sin Imagen</div>
                                )}
                            </div>
                            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <span style={{
                                        backgroundColor: b.tipo_usuario === 'Master' ? 'var(--accent-color)' : '#666',
                                        color: '#fff',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        marginBottom: '10px',
                                        display: 'inline-block'
                                    }}>
                                        {b.tipo_usuario || 'Invitado'}
                                    </span>
                                    <p style={{ whiteSpace: 'pre-wrap', fontSize: '1.1rem', color: '#ddd' }}>{b.contenido}</p>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                    <button className="btn btn-sm btn-outline" onClick={() => handleOpenModal(b)}>Editar</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(b.id)}>Eliminar</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Editar Saludo" : "Nuevo Saludo"}>
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Contenido</label>
                            <textarea
                                value={form.contenido}
                                onChange={e => setForm({ ...form, contenido: e.target.value })}
                                rows="6"
                                required
                                style={{ fontSize: '1rem' }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Tipo de Usuario</label>
                            <div style={{ display: 'flex', gap: '20px', marginTop: '5px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="tipo_usuario"
                                        value="Invitado"
                                        checked={form.tipo_usuario === 'Invitado'}
                                        onChange={e => setForm({ ...form, tipo_usuario: e.target.value })}
                                    />
                                    Invitado
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="tipo_usuario"
                                        value="Master"
                                        checked={form.tipo_usuario === 'Master'}
                                        onChange={e => setForm({ ...form, tipo_usuario: e.target.value })}
                                    />
                                    Master
                                </label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Imagen</label>
                            <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
                        </div>
                        <button type="submit" className="btn btn-primary">Guardar</button>
                    </form>
                </Modal>
            </div>
        </div>
    );
}

export default BienvenidasList;
