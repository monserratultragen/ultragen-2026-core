import { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';

function PromptAIManager() {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ titulo: '', prompt: '', notas: '', categoria: 'variados' });

    const CATEGORIAS = [
        { id: 'perfil-sl', label: 'Perfil SL' },
        { id: 'personajes', label: 'Personajes' },
        { id: 'bienvenidas', label: 'Bienvenidas' },
        { id: 'book-fotos', label: 'Book de Fotos' },
        { id: 'utilidades', label: 'Utilidades' },
        { id: 'variados', label: 'Variados' },
        { id: 'modelo-prompt', label: 'Modelo de Prompt' },
    ];

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        api.get('/prompts-ai/')
            .then(res => setItems(res.data))
            .catch(err => console.error(err));
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingId(item.id);
            setForm({
                titulo: item.titulo,
                prompt: item.prompt,
                notas: item.notas || '',
                categoria: item.categoria || 'variados'
            });
        } else {
            setEditingId(null);
            setForm({ titulo: '', prompt: '', notas: '', categoria: 'variados' });
        }
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const request = editingId
            ? api.patch(`/prompts-ai/${editingId}/`, form)
            : api.post('/prompts-ai/', form);

        request.then(() => {
            setIsModalOpen(false);
            fetchItems();
        }).catch(err => {
            console.error(err);
            alert("Error al guardar: " + (err.response?.data?.detail || err.message));
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Eliminar este prompt?")) {
            api.delete(`/prompts-ai/${id}/`).then(fetchItems);
        }
    };

    const getCategoryLabel = (catId) => {
        const cat = CATEGORIAS.find(c => c.id === catId);
        return cat ? cat.label : catId;
    };

    return (
        <div className="page-container">
            <div className="content-area">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>Prompts AI Destacados</h1>
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>+ Nuevo Prompt</button>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Título</th>
                                <th>Categoría</th>
                                <th>Prompt</th>
                                <th>Notas</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.titulo}</td>
                                    <td>
                                        <span className="badge" style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                            {getCategoryLabel(item.categoria)}
                                        </span>
                                    </td>
                                    <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {item.prompt}
                                    </td>
                                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {item.notas}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => {
                                                navigator.clipboard.writeText(item.prompt)
                                                    .catch(err => {
                                                        console.error(err);
                                                        alert('Error al copiar el prompt');
                                                    });
                                            }}
                                            style={{ marginRight: '5px' }}
                                        >
                                            Copiar Prompt
                                        </button>
                                        <button className="btn btn-sm btn-outline" onClick={() => handleOpenModal(item)} style={{ marginRight: '5px' }}>Editar</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                        No hay prompts registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Editar Prompt" : "Nuevo Prompt"}>
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
                            <label>Categoría</label>
                            <select
                                value={form.categoria}
                                onChange={e => setForm({ ...form, categoria: e.target.value })}
                                required
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', backgroundColor: '#222', color: '#fff', border: '1px solid #444' }}
                            >
                                {CATEGORIAS.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Prompt (Texto Copiado)</label>
                            <textarea
                                value={form.prompt}
                                onChange={e => setForm({ ...form, prompt: e.target.value })}
                                rows="6"
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
                        <button type="submit" className="btn btn-primary">Guardar</button>
                    </form>
                </Modal>
            </div>
        </div>
    );
}

export default PromptAIManager;
