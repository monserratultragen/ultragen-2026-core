import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function ExperienteEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [experiente, setExperiente] = useState(null);
    const [contenido, setContenido] = useState('');
    const [imagenes, setImagenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const textareaRef = useRef(null);
    const [viewImage, setViewImage] = useState(null);

    useEffect(() => {
        fetchExperiente();
        fetchImagenes();
    }, [id]);

    const fetchExperiente = () => {
        api.get(`/experientes/${id}/`)
            .then(res => {
                setExperiente(res.data);
                setContenido(res.data.contenido || '');
                setLoading(false);
            })
            .catch(err => console.error(err));
    };

    const fetchImagenes = () => {
        api.get(`/experiente-imagenes/?experiente=${id}`)
            .then(res => setImagenes(res.data))
            .catch(err => console.error(err));
    };

    const handleSave = () => {
        api.patch(`/experientes/${id}/`, { contenido })
            .then(() => alert('Guardado correctamente'))
            .catch(err => console.error(err));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('experiente', id);
        formData.append('ruta', file);
        formData.append('tag', file.name);

        api.post('/experiente-imagenes/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(res => {
                setImagenes(prev => [...prev, res.data]);
                e.target.value = null;
            })
            .catch(err => alert("Error al subir imagen"));
    };

    const handleDeleteImage = (imageId) => {
        if (!window.confirm("¿Eliminar imagen?")) return;
        api.delete(`/experiente-imagenes/${imageId}/`)
            .then(() => setImagenes(prev => prev.filter(img => img.id !== imageId)))
            .catch(err => alert("Error al eliminar imagen"));
    };

    const insertImageTag = (ruta) => {
        let relativePath = ruta;
        try {
            const url = new URL(ruta);
            relativePath = url.pathname;
        } catch (e) { }

        const tag = `[img: ${relativePath}]`;
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newContenido = contenido.substring(0, start) + tag + contenido.substring(end);
            setContenido(newContenido);
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="writer-container">
            <div className="writer-top-bar">
                <div className="writer-info">
                    <h2>{experiente?.titulo}</h2>
                </div>
                <div className="writer-tools">
                    <label className="btn btn-sm btn-outline">
                        📷 Subir Imagen
                        <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
                    </label>
                </div>
                <div className="writer-actions">
                    <button className="btn btn-secondary" onClick={() => navigate('/experientes')}>Volver</button>
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
                        placeholder="Escribe aquí el contenido del experiente..."
                    />
                </div>

                <div className="writer-gallery-area">
                    <h3>Galería</h3>
                    <div className="gallery-grid">
                        {imagenes.map(img => (
                            <div key={img.id} className="gallery-item">
                                <img src={img.ruta} alt={img.tag} />
                                <div className="gallery-actions">
                                    <button className="gallery-btn" onClick={() => insertImageTag(img.ruta)} title="Insertar">📝</button>
                                    <button className="gallery-btn" onClick={() => setViewImage(img.ruta)} title="Ver">👁️</button>
                                    <button className="gallery-btn" onClick={() => handleDeleteImage(img.id)} title="Eliminar" style={{ color: '#ff4444' }}>🗑️</button>
                                </div>
                            </div>
                        ))}
                        {imagenes.length === 0 && <p style={{ color: '#666', fontSize: '0.8rem' }}>No hay imágenes.</p>}
                    </div>
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
        </div>
    );
}

export default ExperienteEditor;
