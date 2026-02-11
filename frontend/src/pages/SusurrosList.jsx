import { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';

function SusurrosList() {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ seccion: 'paginabase', duracion: '', susurro: '', activado: true });

    const [filterSeccion, setFilterSeccion] = useState(null);

    const SECCIONES = [
        { value: 'paginabase', label: 'Página Base' },
        { value: 'autenticacion', label: 'Autenticación' },
        { value: 'bienvenida', label: 'Bienvenida' },
        { value: 'desktop', label: 'Desktop' },
        { value: 'diarios', label: 'Diarios' },
        { value: 'movil', label: 'Móvil' },
        { value: 'expedientes', label: 'Expedientes' },
        { value: 'tablet', label: 'Tablet' },
        { value: 'pistas', label: 'Pistas' },
        { value: 'laptop', label: 'Laptop' },
        { value: 'tomos', 'label': 'Tomos' },
        { value: 'whatsapp', 'label': 'WhatsApp' },
        { value: 'instagram', 'label': 'Instagram' },
        { value: 'darkweb', 'label': 'Dark Web' },
        { value: 'cyborgs', 'label': 'Cyborgs' },
        { value: 'ordenes', 'label': 'Órdenes' },
        { value: 'humanas', 'label': 'Humanas' },
        { value: 'linea_temporal', 'label': 'Línea Temporal' },
        { value: 'murales', 'label': 'Murales' },
    ];

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        api.get('/susurros/')
            .then(res => setItems(res.data))
            .catch(err => console.error(err));
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingId(item.id);
            setForm({ seccion: item.seccion, duracion: item.duracion, susurro: item.susurro, activado: item.activado });
        } else {
            setEditingId(null);
            setForm({ seccion: 'paginabase', duracion: '', susurro: '', activado: true });
        }
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const request = editingId
            ? api.patch(`/susurros/${editingId}/`, form)
            : api.post('/susurros/', form);

        request.then(() => {
            setIsModalOpen(false);
            fetchItems();
        }).catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Eliminar susurro?")) {
            api.delete(`/susurros/${id}/`).then(fetchItems);
        }
    };

    return (
        <div className="page-container">
            <div className="content-area">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>Susurros</h1>
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>+ Nuevo Susurro</button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                    <button
                        onClick={() => setFilterSeccion(null)}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            border: '1px solid #444',
                            background: filterSeccion === null ? '#e6007e' : 'rgba(255,255,255,0.05)',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            transition: 'all 0.2s ease'
                        }}
                        className="filter-tag"
                    >
                        Todos
                    </button>
                    {SECCIONES.map(seccion => (
                        <button
                            key={seccion.value}
                            onClick={() => setFilterSeccion(filterSeccion === seccion.value ? null : seccion.value)}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '20px',
                                border: '1px solid #444',
                                background: filterSeccion === seccion.value ? '#e6007e' : 'rgba(255,255,255,0.05)',
                                color: '#fff',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                transition: 'all 0.2s ease'
                            }}
                            className="filter-tag"
                        >
                            {seccion.label}
                        </button>
                    ))}
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Sección</th>
                            <th>Duración</th>
                            <th>Susurro</th>
                            <th>Activado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items
                            .filter(item => !filterSeccion || item.seccion === filterSeccion)
                            .map(item => (
                                <tr key={item.id}>
                                    <td>{SECCIONES.find(s => s.value === item.seccion)?.label || item.seccion}</td>
                                    <td>{item.duracion}</td>
                                    <td>{item.susurro}</td>
                                    <td>{item.activado ? 'Sí' : 'No'}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline" onClick={() => handleOpenModal(item)} style={{ marginRight: '5px' }}>Editar</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Editar Susurro" : "Nuevo Susurro"}>
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Sección</label>
                            <select
                                value={form.seccion}
                                onChange={e => setForm({ ...form, seccion: e.target.value })}
                                required
                            >
                                {SECCIONES.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Duración</label>
                            <input
                                type="number"
                                value={form.duracion}
                                onChange={e => setForm({ ...form, duracion: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Susurro</label>
                            <textarea
                                value={form.susurro}
                                onChange={e => setForm({ ...form, susurro: e.target.value })}
                                rows="3"
                                required
                            />
                        </div>
                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                id="activado"
                                checked={form.activado}
                                onChange={e => setForm({ ...form, activado: e.target.checked })}
                                style={{ width: 'auto', margin: 0 }}
                            />
                            <label htmlFor="activado" style={{ margin: 0 }}>Activado</label>
                        </div>
                        <button type="submit" className="btn btn-primary">Guardar</button>
                    </form>
                </Modal>
            </div>
        </div>
    );
}

export default SusurrosList;
