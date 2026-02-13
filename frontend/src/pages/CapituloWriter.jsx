import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Modal from '../components/Modal';

function CapituloWriter() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [capitulo, setCapitulo] = useState(null);
    const [contenido, setContenido] = useState('');
    const [imagenes, setImagenes] = useState([]);
    const [slaps, setSlaps] = useState([]);
    const [pistas, setPistas] = useState([]);
    const [loading, setLoading] = useState(true);
    const textareaRef = useRef(null);

    const [activeTab, setActiveTab] = useState('imagenes'); // 'imagenes', 'slaps', 'pistas'
    const [viewImage, setViewImage] = useState(null);
    const [editingImage, setEditingImage] = useState(null);

    // Form states
    const [newPista, setNewPista] = useState({ titulo: '', contenido: '' });

    // Slap states
    const [pendingSlapFile, setPendingSlapFile] = useState(null);
    const [slapLevel, setSlapLevel] = useState(1);
    const [editingSlap, setEditingSlap] = useState(null);


    useEffect(() => {
        fetchCapitulo();
        fetchImagenes();
        fetchSlaps();
        fetchPistas();
    }, [id]);

    const fetchCapitulo = () => {
        api.get(`/capitulos/${id}/`)
            .then(res => {
                setCapitulo(res.data);
                setContenido(res.data.contenido || '');
                setLoading(false);
            })
            .catch(err => console.error(err));
    };

    const fetchImagenes = () => {
        api.get(`/capitulo-imagenes/?capitulo=${id}`)
            .then(res => setImagenes(res.data))
            .catch(err => {
                console.error("Error fetching images", err);
                setImagenes([]);
            });
    };

    const fetchSlaps = () => {
        api.get(`/capitulo-slaps/?capitulo=${id}`)
            .then(res => setSlaps(res.data))
            .catch(err => {
                console.error("Error fetching slaps", err);
                setSlaps([]);
            });
    };

    const fetchPistas = () => {
        api.get(`/capitulo-pistas/?capitulo=${id}`)
            .then(res => setPistas(res.data))
            .catch(err => {
                console.error("Error fetching pistas", err);
                setPistas([]);
            });
    };

    const handleSave = () => {
        const originalText = "Guardar";
        const btn = document.querySelector('.writer-actions .btn-primary');
        if (btn) {
            btn.disabled = true;
            btn.innerText = "Guardando...";
        }

        api.patch(`/capitulos/${id}/`, { contenido })
            .then(() => {
                alert('Guardado correctamente');
            })
            .catch(err => {
                console.error(err);
                alert('Error al guardar: ' + (err.response?.data?.detail || err.message));
            })
            .finally(() => {
                if (btn) {
                    btn.disabled = false;
                    btn.innerText = originalText;
                }
            });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('capitulo', id);
        formData.append('ruta', file);
        formData.append('tag', file.name);
        formData.append('es_demo', 'true');

        api.post('/capitulo-imagenes/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(res => {
                const newImage = res.data;
                setImagenes(prev => [...prev, newImage]);
                // Auto-insert removed as per request
                // insertImageTag(newImage.ruta);
                // Clear input
                e.target.value = null;
            })
            .catch(err => {
                console.error("Upload failed", err);
                alert("Error al subir imagen: " + (err.response?.data?.detail || err.message));
            });
    };

    const handleDeleteImage = (imageId) => {
        if (!window.confirm("¿Estás seguro de eliminar esta imagen?")) return;

        api.delete(`/capitulo-imagenes/${imageId}/`)
            .then(() => {
                setImagenes(prev => prev.filter(img => img.id !== imageId));
            })
            .catch(err => {
                console.error("Delete failed", err);
                alert("Error al eliminar imagen");
            });
    };

    // Slap Handlers
    const handleSlapUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPendingSlapFile(file);
        setSlapLevel(1); // Reset to default
        e.target.value = null;
    };

    const confirmSlapUpload = () => {
        if (!pendingSlapFile) return;

        const formData = new FormData();
        formData.append('capitulo', id);
        formData.append('ruta', pendingSlapFile);
        formData.append('nivel', slapLevel);

        api.post('/capitulo-slaps/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(res => {
                setSlaps(prev => [...prev, res.data]);
                setPendingSlapFile(null);
            })
            .catch(err => {
                console.error("Upload failed", err);
                alert("Error al subir slap");
            });
    };

    const handleUpdateSlap = () => {
        if (!editingSlap) return;
        api.patch(`/capitulo-slaps/${editingSlap.id}/`, { nivel: editingSlap.nivel })
            .then(res => {
                setSlaps(prev => prev.map(s => s.id === res.data.id ? res.data : s));
                setEditingSlap(null);
            })
            .catch(err => alert("Error al actualizar slap"));
    };

    const handleDeleteSlap = (slapId) => {
        if (!window.confirm("¿Eliminar slap?")) return;
        api.delete(`/capitulo-slaps/${slapId}/`)
            .then(() => setSlaps(prev => prev.filter(s => s.id !== slapId)))
            .catch(err => alert("Error al eliminar slap"));
    };

    // Pista Handlers
    const handleCreatePista = () => {
        if (!newPista.contenido) return alert("El contenido es obligatorio");

        api.post('/capitulo-pistas/', { ...newPista, capitulo: id })
            .then(res => {
                setPistas(prev => [...prev, res.data]);
                setNewPista({ titulo: '', contenido: '' });
            })
            .catch(err => alert("Error al crear pista"));
    };

    const handleDeletePista = (pistaId) => {
        if (!window.confirm("¿Eliminar pista?")) return;
        api.delete(`/capitulo-pistas/${pistaId}/`)
            .then(() => setPistas(prev => prev.filter(p => p.id !== pistaId)))
            .catch(err => alert("Error al eliminar pista"));
    };

    const handleUpdateImage = () => {
        if (!editingImage) return;
        api.patch(`/capitulo-imagenes/${editingImage.id}/`, { es_demo: editingImage.es_demo })
            .then(res => {
                setImagenes(prev => prev.map(img => img.id === res.data.id ? res.data : img));
                setEditingImage(null);
            })
            .catch(err => {
                console.error("Update failed", err);
                alert("Error al actualizar imagen");
            });
    };

    const insertTag = (tag) => {
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newContenido = contenido.substring(0, start) + tag + contenido.substring(end);
            setContenido(newContenido);
        }
    };

    const insertImageTag = (ruta) => {
        // Ensure we use a relative path or clean format if it's a full URL
        let relativePath = ruta;
        try {
            const url = new URL(ruta);
            relativePath = url.pathname;
        } catch (e) {
            // Not a full URL, keep as is
        }
        insertTag(`[img: ${relativePath}]`);
    };

    const insertSlapTag = (ruta) => {
        let relativePath = ruta;
        try {
            const url = new URL(ruta);
            relativePath = url.pathname;
        } catch (e) { }
        insertTag(`[slap: ${relativePath}]`);
    };

    const insertPistaTag = (contenido) => {
        insertTag(`[pista: ${contenido}]`);
    };

    if (loading) return <div className="p-4">Cargando...</div>;

    return (
        <div className="writer-container">
            <div className="writer-top-bar">
                <div className="writer-info">
                    <h2>
                        <span style={{ fontSize: '0.9rem', color: '#888' }}>
                            <span
                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                onClick={() => navigate('/diarios-main', {
                                    state: {
                                        activeTab: 'tomos',
                                        selectedDiarioId: capitulo?.diario_id,
                                        expandedDiarios: { [capitulo?.diario_id]: true }
                                    }
                                })}
                            >
                                {capitulo?.diario_nombre} ({capitulo?.diario_orden})
                            </span>
                            {' > '}
                            <span
                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                onClick={() => navigate('/diarios-main', {
                                    state: {
                                        activeTab: 'capitulos',
                                        selectedDiarioId: capitulo?.diario_id,
                                        selectedTomoId: capitulo?.tomo,
                                        expandedDiarios: { [capitulo?.diario_id]: true }
                                    }
                                })}
                            >
                                {capitulo?.tomo_nombre} ({capitulo?.tomo_orden})
                            </span>
                            {' > '}
                        </span>
                        <br />
                        {capitulo?.nombre}
                    </h2>
                </div>
                <div className="writer-tools">
                    <label className="btn btn-sm btn-outline">
                        📷 Subir Imagen
                        <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
                    </label>
                    {/* Add more tools here */}
                </div>
                <div className="writer-actions">
                    <button className="btn btn-secondary" onClick={() => navigate('/diarios-main', {
                        state: {
                            activeTab: 'capitulos',
                            selectedDiarioId: capitulo?.diario_id,
                            selectedTomoId: capitulo?.tomo,
                            expandedDiarios: { [capitulo?.diario_id]: true }
                        }
                    })}>Volver</button>
                    <button className="btn btn-primary" onClick={handleSave} style={{ marginLeft: '10px' }}>Guardar</button>
                </div>
            </div>

            <div className="writer-content-grid">
                <div className="writer-editor-area">
                    <textarea
                        ref={textareaRef}
                        className="editor-textarea"
                        value={contenido}
                        onChange={e => setContenido(e.target.value)}
                        placeholder="Escribe aquí el contenido del capítulo..."
                    />
                </div>

                <div className="writer-gallery-area">
                    <div className="gallery-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                        <button
                            className={`btn btn-sm ${activeTab === 'imagenes' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setActiveTab('imagenes')}
                        >
                            Imágenes
                        </button>
                        <button
                            className={`btn btn-sm ${activeTab === 'slaps' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setActiveTab('slaps')}
                        >
                            Slaps
                        </button>
                        <button
                            className={`btn btn-sm ${activeTab === 'pistas' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setActiveTab('pistas')}
                        >
                            Pistas
                        </button>
                    </div>

                    {activeTab === 'imagenes' && (
                        <>
                            <h3>Galería</h3>
                            <div className="gallery-grid">
                                {imagenes.map(img => (
                                    <div key={img.id} className={`gallery-item ${img.es_demo ? 'is-demo' : ''}`}>
                                        <img src={img.ruta} alt={img.tag || 'Imagen'} />
                                        <div className="gallery-actions">
                                            <button
                                                className="gallery-btn"
                                                onClick={() => insertImageTag(img.ruta)}
                                                title="Insertar en texto"
                                            >
                                                ⤵️
                                            </button>
                                            <button
                                                className="gallery-btn"
                                                onClick={() => setEditingImage(img)}
                                                title="Editar"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="gallery-btn"
                                                onClick={() => setViewImage(img.ruta)}
                                                title="Ver imagen"
                                            >
                                                👁️
                                            </button>
                                            <button
                                                className="gallery-btn"
                                                onClick={() => handleDeleteImage(img.id)}
                                                title="Eliminar imagen"
                                                style={{ color: '#ff4444' }}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {imagenes.length === 0 && <p style={{ color: '#666', fontSize: '0.8rem' }}>No hay imágenes.</p>}
                            </div>
                        </>
                    )}

                    {activeTab === 'slaps' && (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h3>Slaps</h3>
                                <label className="btn btn-sm btn-outline">
                                    + Subir
                                    <input type="file" hidden onChange={handleSlapUpload} accept="image/*" />
                                </label>
                            </div>
                            <div className="gallery-grid">
                                {slaps.map(slap => (
                                    <div key={slap.id} className="gallery-item">
                                        <div className="slap-badge">Nivel: {slap.nivel}</div>
                                        <img src={slap.ruta} alt={`Slap ${slap.nivel}`} />
                                        <div className="gallery-actions">
                                            <button
                                                className="gallery-btn"
                                                onClick={() => insertSlapTag(slap.ruta)}
                                                title="Insertar"
                                            >
                                                ⤵️
                                            </button>
                                            <button
                                                className="gallery-btn"
                                                onClick={() => setEditingSlap(slap)}
                                                title="Editar Nivel"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="gallery-btn"
                                                onClick={() => setViewImage(slap.ruta)}
                                                title="Ver"
                                            >
                                                👁️
                                            </button>
                                            <button
                                                className="gallery-btn"
                                                onClick={() => handleDeleteSlap(slap.id)}
                                                title="Eliminar"
                                                style={{ color: '#ff4444' }}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {slaps.length === 0 && <p style={{ color: '#666', fontSize: '0.8rem' }}>No hay slaps.</p>}
                            </div>
                        </>
                    )}

                    {activeTab === 'pistas' && (
                        <>
                            <h3>Pistas</h3>
                            <div className="pista-form" style={{ marginBottom: '20px', padding: '10px', background: '#1a1a1a', borderRadius: '4px' }}>
                                <input
                                    type="text"
                                    placeholder="Título (opcional)"
                                    value={newPista.titulo}
                                    onChange={e => setNewPista({ ...newPista, titulo: e.target.value })}
                                    style={{ marginBottom: '5px' }}
                                />
                                <textarea
                                    placeholder="Contenido de la pista..."
                                    value={newPista.contenido}
                                    onChange={e => setNewPista({ ...newPista, contenido: e.target.value })}
                                    style={{ minHeight: '60px', marginBottom: '5px' }}
                                />
                                <button className="btn btn-sm btn-primary" onClick={handleCreatePista} style={{ width: '100%' }}>Agregar Pista</button>
                            </div>
                            <div className="pistas-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {pistas.map(pista => (
                                    <div key={pista.id} className="pista-item" style={{ background: '#111', padding: '10px', borderRadius: '4px', border: '1px solid #333' }}>
                                        <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '5px' }}>{pista.titulo || 'Sin título'}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '10px', maxHeight: '50px', overflow: 'hidden' }}>{pista.contenido}</div>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button className="btn btn-xs btn-outline" onClick={() => insertPistaTag(pista.contenido)}>⤵️ Insertar</button>
                                            <button className="btn btn-xs btn-outline" onClick={() => handleDeletePista(pista.id)} style={{ color: '#ff4444', borderColor: '#ff4444' }}>🗑️</button>
                                        </div>
                                    </div>
                                ))}
                                {pistas.length === 0 && <p style={{ color: '#666', fontSize: '0.8rem' }}>No hay pistas.</p>}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {viewImage && (
                <div className="image-viewer-overlay" onClick={() => setViewImage(null)}>
                    <div className="image-viewer-content" onClick={e => e.stopPropagation()}>
                        <img src={viewImage} alt="Vista previa" />
                        <button className="close-viewer-btn" onClick={() => setViewImage(null)}>×</button>
                    </div>
                </div>
            )}

            <Modal
                isOpen={!!editingImage}
                onClose={() => setEditingImage(null)}
                title="Editar Imagen"
            >
                {editingImage && (
                    <div className="edit-image-form">
                        <div className="form-group">
                            <label>ID:</label>
                            <input type="text" value={editingImage.id} disabled />
                        </div>
                        <div className="form-group">
                            <label>Tag:</label>
                            <input type="text" value={editingImage.tag} disabled />
                        </div>
                        <div className="form-group">
                            <label>Ruta:</label>
                            <input type="text" value={editingImage.ruta} disabled />
                        </div>
                        <div className="form-group">
                            <label>Creado:</label>
                            <input type="text" value={new Date(editingImage.created_at).toLocaleString()} disabled />
                        </div>
                        <div className="form-group">
                            <label>Actualizado:</label>
                            <input type="text" value={new Date(editingImage.updated_at).toLocaleString()} disabled />
                        </div>
                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                checked={editingImage.es_demo}
                                onChange={e => setEditingImage({ ...editingImage, es_demo: e.target.checked })}
                                style={{ width: 'auto', margin: 0 }}
                            />
                            <label style={{ margin: 0, cursor: 'pointer' }} onClick={() => setEditingImage({ ...editingImage, es_demo: !editingImage.es_demo })}>
                                Es Demo
                            </label>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button className="btn btn-secondary" onClick={() => setEditingImage(null)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={handleUpdateImage}>Guardar</button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal
                isOpen={!!pendingSlapFile}
                onClose={() => setPendingSlapFile(null)}
                title="Subir Slap"
            >
                <div className="form-group">
                    <label>Nivel (Obligatorio):</label>
                    <input
                        type="number"
                        value={slapLevel}
                        onChange={e => setSlapLevel(parseInt(e.target.value) || 0)}
                        min="0"
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                    <button className="btn btn-secondary" onClick={() => setPendingSlapFile(null)}>Cancelar</button>
                    <button className="btn btn-primary" onClick={confirmSlapUpload}>Subir</button>
                </div>
            </Modal>

            <Modal
                isOpen={!!editingSlap}
                onClose={() => setEditingSlap(null)}
                title="Editar Slap"
            >
                {editingSlap && (
                    <div className="form-group">
                        <label>Nivel:</label>
                        <input
                            type="number"
                            value={editingSlap.nivel}
                            onChange={e => setEditingSlap({ ...editingSlap, nivel: parseInt(e.target.value) || 0 })}
                            min="0"
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button className="btn btn-secondary" onClick={() => setEditingSlap(null)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={handleUpdateSlap}>Guardar</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default CapituloWriter;
