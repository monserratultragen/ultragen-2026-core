import { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from './Modal';

function CapituloPromptsModal({ isOpen, onClose, capituloId, capituloNombre }) {
    const [prompts, setPrompts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ titulo: '', prompt: '', notas: '' });

    useEffect(() => {
        if (isOpen && capituloId) {
            fetchPrompts();
            resetForm();
        }
    }, [isOpen, capituloId]);

    const fetchPrompts = () => {
        setIsLoading(true);
        api.get(`/capitulo-prompts/?capitulo=${capituloId}`)
            .then(res => setPrompts(res.data))
            .catch(err => console.error("Error fetching prompts:", err))
            .finally(() => setIsLoading(false));
    };

    const resetForm = () => {
        setEditingId(null);
        setForm({ titulo: '', prompt: '', notas: '' });
    };

    const handleEdit = (prompt) => {
        setEditingId(prompt.id);
        setForm({ titulo: prompt.titulo, prompt: prompt.prompt, notas: prompt.notas || '' });
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este prompt?")) {
            api.delete(`/capitulo-prompts/${id}/`)
                .then(() => fetchPrompts())
                .catch(err => console.error("Error deleting prompt:", err));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...form, capitulo: capituloId };

        const request = editingId
            ? api.patch(`/capitulo-prompts/${editingId}/`, form)
            : api.post('/capitulo-prompts/', payload);

        request
            .then(() => {
                fetchPrompts();
                resetForm();
            })
            .catch(err => {
                console.error("Error saving prompt:", err);
                alert("Error al guardar el prompt");
            });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Prompts del Capítulo: ${capituloNombre || ''}`}>
            {isLoading ? (
                <p>Cargando prompts...</p>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr',
                    gap: '24px',
                    minWidth: '900px',
                    maxHeight: '600px',
                    padding: '0'
                }}>
                    {/* Left Column: Simple Title List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', borderRight: '1px solid #444', paddingRight: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>Prompts Registrados</h4>
                            <button className="btn btn-sm btn-outline" onClick={resetForm} title="Nuevo Prompt">➕</button>
                        </div>

                        <div className="table-container" style={{ overflowY: 'auto', flex: 1, maxHeight: '500px' }}>
                            <table className="table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 4px' }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '10px', fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.6 }}>Título</th>
                                        <th style={{ textAlign: 'right', padding: '10px', width: '100px' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prompts.length === 0 ? (
                                        <tr>
                                            <td colSpan="2" style={{ textAlign: 'center', padding: '30px', opacity: 0.5 }}>No hay datos.</td>
                                        </tr>
                                    ) : (
                                        prompts.map(p => (
                                            <tr key={p.id} style={{
                                                background: editingId === p.id ? 'rgba(255,165,0,0.1)' : 'rgba(255,255,255,0.02)',
                                                borderRadius: '4px',
                                                transition: 'all 0.2s'
                                            }}>
                                                <td style={{
                                                    padding: '10px',
                                                    fontSize: '0.95rem',
                                                    fontWeight: editingId === p.id ? '600' : '400',
                                                    color: editingId === p.id ? '#ffa500' : '#ddd'
                                                }}>
                                                    {p.titulo}
                                                </td>
                                                <td style={{ padding: '10px', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                                        <button
                                                            className="action-btn"
                                                            style={{ padding: '4px' }}
                                                            onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(p.prompt); }}
                                                            title="Copiar prompt"
                                                        >
                                                            <span style={{ fontSize: '1.2rem' }}>📋</span>
                                                        </button>
                                                        <button
                                                            className="action-btn"
                                                            style={{ padding: '4px' }}
                                                            onClick={(e) => { e.stopPropagation(); handleEdit(p); }}
                                                            title="Editar"
                                                        >
                                                            <span style={{ fontSize: '1.2rem' }}>✏️</span>
                                                        </button>
                                                        <button
                                                            className="action-btn"
                                                            style={{ padding: '4px', color: '#ff4444' }}
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                                                            title="Eliminar"
                                                        >
                                                            <span style={{ fontSize: '1.2rem' }}>🗑️</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Column: Form Editor */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#aaa' }}>Título</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Portrait Cinematográfico 2026..."
                                        value={form.titulo}
                                        onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)' }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#aaa' }}>Prompt (Texto para IA)</label>
                                    <textarea
                                        placeholder="Pega aquí el prompt que ha dado buenos resultados..."
                                        value={form.prompt}
                                        onChange={(e) => setForm({ ...form, prompt: e.target.value })}
                                        rows="10"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            background: 'rgba(0,0,0,0.3)',
                                            fontFamily: 'monospace',
                                            fontSize: '0.9rem',
                                            lineHeight: '1.4',
                                            color: '#00ffcc',
                                            border: '1px solid rgba(0,255,204,0.1)'
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#aaa' }}>Notas Adicionales</label>
                                    <textarea
                                        placeholder="Parámetros extra, modelo usado, fecha..."
                                        value={form.notas}
                                        onChange={(e) => setForm({ ...form, notas: e.target.value })}
                                        rows="3"
                                        style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '12px', fontSize: '1rem' }}>
                                        {editingId ? "Actualizar Registro" : "Registrar Prompt"}
                                    </button>
                                    {editingId && (
                                        <button type="button" className="btn btn-secondary" onClick={resetForm} style={{ flex: 1 }}>
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
}

export default CapituloPromptsModal;
