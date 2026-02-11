import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Modal from '../components/Modal';

function PresentacionEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [presentacion, setPresentacion] = useState(null);
    const [slides, setSlides] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlideId, setEditingSlideId] = useState(null);
    const [newSlide, setNewSlide] = useState({
        contenido: '',
        orden: 0
    });
    const [imagen, setImagen] = useState(null);

    useEffect(() => {
        fetchPresentacion();
        fetchSlides();
    }, [id]);

    const fetchPresentacion = () => {
        api.get(`/presentaciones/${id}/`)
            .then(res => setPresentacion(res.data))
            .catch(err => console.error(err));
    };

    const fetchSlides = () => {
        api.get(`/slides/?presentacion=${id}`)
            .then(res => setSlides(res.data.sort((a, b) => a.orden - b.orden)))
            .catch(err => console.error(err));
    };

    const handleOpenModal = (s = null) => {
        if (s) {
            setEditingSlideId(s.id);
            setNewSlide({
                contenido: s.contenido || '',
                orden: s.orden
            });
        } else {
            setEditingSlideId(null);
            setNewSlide({
                contenido: '',
                orden: slides.length + 1
            });
        }
        setImagen(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSlideId(null);
        setImagen(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('presentacion', id);
        formData.append('contenido', newSlide.contenido);
        formData.append('orden', newSlide.orden);
        if (imagen) {
            formData.append('imagen', imagen);
        }

        const request = editingSlideId
            ? api.patch(`/slides/${editingSlideId}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            : api.post('/slides/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

        request
            .then(() => {
                handleCloseModal();
                fetchSlides();
            })
            .catch(err => console.error(err));
    };

    const handleDelete = (slideId) => {
        if (window.confirm("¿Eliminar slide?")) {
            api.delete(`/slides/${slideId}/`)
                .then(() => fetchSlides())
                .catch(err => console.error(err));
        }
    };

    if (!presentacion) return <div>Cargando...</div>;

    return (
        <div className="page-container">
            <div className="content-area" style={{ margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <button onClick={() => navigate('/presentaciones')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', marginRight: '10px' }}>←</button>
                        <h1 style={{ display: 'inline' }}>{presentacion.titulo}</h1>
                    </div>
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>Nuevo Slide</button>
                </div>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                    {slides.map(s => (
                        <div key={s.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ height: '150px', backgroundColor: '#333', position: 'relative' }}>
                                {s.imagen ? (
                                    <img src={s.imagen} alt="Slide" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                                        Sin Imagen
                                    </div>
                                )}
                                <div style={{ position: 'absolute', top: '5px', left: '5px', backgroundColor: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>
                                    #{s.orden}
                                </div>
                            </div>
                            <div style={{ padding: '15px' }}>
                                <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '10px', height: '40px', overflow: 'hidden' }}>
                                    {s.contenido}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                    title={editingSlideId ? "Editar Slide" : "Nuevo Slide"}
                >
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Orden</label>
                            <input
                                type="number"
                                value={newSlide.orden}
                                onChange={e => setNewSlide({ ...newSlide, orden: parseInt(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Contenido</label>
                            <textarea
                                value={newSlide.contenido}
                                onChange={e => setNewSlide({ ...newSlide, contenido: e.target.value })}
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

export default PresentacionEditor;
