import { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';

function Laptop() {
    const [activeTab, setActiveTab] = useState('noticias'); // 'noticias', 'compras', 'cyborgs', 'humanos'
    const [noticias, setNoticias] = useState([]);
    const [compras, setCompras] = useState([]);
    const [cyborgs, setCyborgs] = useState([]);
    const [humanos, setHumanos] = useState([]);

    // Modals
    const [isNoticiaModalOpen, setIsNoticiaModalOpen] = useState(false);
    const [isCompraModalOpen, setIsCompraModalOpen] = useState(false);
    const [isCyborgModalOpen, setIsCyborgModalOpen] = useState(false);
    const [isHumanoModalOpen, setIsHumanoModalOpen] = useState(false);

    // Forms
    const [editingId, setEditingId] = useState(null);
    const [noticiaForm, setNoticiaForm] = useState({ titulo: '', descripcion: '', fecha: '' });
    const [compraForm, setCompraForm] = useState({ nombre: '', codigo: '', itemid: '', precio: '', fecha: '' });
    const [compraImage, setCompraImage] = useState(null);

    const [cyborgForm, setCyborgForm] = useState({
        codigo: '', humano: false, disponible: true, nacionalidad: '', stock: 0, material_construccion: '',
        densidad_cabello: '', nombre: '', edad: 0, precio: '',
        piel_sintetica: '', chip_version: '', descripcion: ''
    });
    const [cyborgImage, setCyborgImage] = useState(null);

    const [humanoForm, setHumanoForm] = useState({
        codigo: '', humano: true, nacionalidad: '', buscada: false, nombre: '',
        edad: 0, estado: '', precio: '', descripcion: ''
    });
    const [humanoImage, setHumanoImage] = useState(null);
    const [humanoGallery, setHumanoGallery] = useState([]); // Array of existing images
    const [newGalleryImages, setNewGalleryImages] = useState([]); // Array of new files to upload

    useEffect(() => {
        fetchNoticias();
        fetchCompras();
        fetchCyborgs();
        fetchHumanos();
    }, []);

    const fetchNoticias = () => api.get('/mercadoumbral-noticias/').then(res => { console.log('Noticias:', res.data); setNoticias(res.data); }).catch(console.error);
    const fetchCompras = () => api.get('/mercadoumbral-compras/').then(res => setCompras(res.data)).catch(console.error);
    const fetchCyborgs = () => api.get('/mercadoumbral-cyborgs/').then(res => setCyborgs(res.data)).catch(console.error);
    const fetchHumanos = () => api.get('/mercadoumbral-humanos/').then(res => { console.log('Humanos:', res.data); setHumanos(res.data); }).catch(console.error);

    // --- Noticias Handlers ---
    const handleOpenNoticiaModal = (n = null) => {
        if (n) {
            setEditingId(n.id);
            setNoticiaForm({ titulo: n.titulo, descripcion: n.descripcion, fecha: n.fecha || '' });
        } else {
            setEditingId(null);
            setNoticiaForm({ titulo: '', descripcion: '', fecha: '' });
        }
        setIsNoticiaModalOpen(true);
    };

    const handleSaveNoticia = (e) => {
        e.preventDefault();
        const request = editingId
            ? api.patch(`/mercadoumbral-noticias/${editingId}/`, noticiaForm)
            : api.post('/mercadoumbral-noticias/', noticiaForm);
        request.then(() => { setIsNoticiaModalOpen(false); fetchNoticias(); }).catch(console.error);
    };

    const handleDeleteNoticia = (id) => {
        if (window.confirm("¿Eliminar noticia?")) api.delete(`/mercadoumbral-noticias/${id}/`).then(fetchNoticias);
    };

    // --- Compras Handlers ---
    const handleOpenCompraModal = (c = null) => {
        if (c) {
            setEditingId(c.id);
            setCompraForm({ nombre: c.nombre, codigo: c.codigo, itemid: c.itemid, precio: c.precio, fecha: c.fecha || '' });
        } else {
            setEditingId(null);
            setCompraForm({ nombre: '', codigo: '', itemid: '', precio: '', fecha: '' });
        }
        setCompraImage(null);
        setIsCompraModalOpen(true);
    };

    const handleSaveCompra = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(compraForm).forEach(key => formData.append(key, compraForm[key]));
        if (compraImage) formData.append('imagen', compraImage);

        const request = editingId
            ? api.patch(`/mercadoumbral-compras/${editingId}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            : api.post('/mercadoumbral-compras/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        request.then(() => { setIsCompraModalOpen(false); fetchCompras(); }).catch(console.error);
    };

    const handleDeleteCompra = (id) => {
        if (window.confirm("¿Eliminar compra?")) api.delete(`/mercadoumbral-compras/${id}/`).then(fetchCompras);
    };

    // --- Cyborgs Handlers ---
    const handleOpenCyborgModal = (c = null) => {
        if (c) {
            setEditingId(c.id);
            setCyborgForm({
                codigo: c.codigo, humano: c.humano, disponible: c.disponible, nacionalidad: c.nacionalidad, stock: c.stock,
                material_construccion: c.material_construccion, densidad_cabello: c.densidad_cabello,
                nombre: c.nombre, edad: c.edad, precio: c.precio,
                piel_sintetica: c.piel_sintetica || '', chip_version: c.chip_version, descripcion: c.descripcion
            });
        } else {
            setEditingId(null);
            setCyborgForm({
                codigo: '', humano: false, disponible: true, nacionalidad: '', stock: 0, material_construccion: '',
                densidad_cabello: '', nombre: '', edad: 0, precio: '',
                piel_sintetica: '', chip_version: '', descripcion: ''
            });
        }
        setCyborgImage(null);
        setIsCyborgModalOpen(true);
    };

    const handleSaveCyborg = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(cyborgForm).forEach(key => formData.append(key, cyborgForm[key]));
        if (cyborgImage) formData.append('imagen', cyborgImage);

        const request = editingId
            ? api.patch(`/mercadoumbral-cyborgs/${editingId}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            : api.post('/mercadoumbral-cyborgs/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        request.then(() => { setIsCyborgModalOpen(false); fetchCyborgs(); }).catch(console.error);
    };

    const handleDeleteCyborg = (id) => {
        if (window.confirm("¿Eliminar cyborg?")) api.delete(`/mercadoumbral-cyborgs/${id}/`).then(fetchCyborgs);
    };

    // --- Humanos Handlers ---
    const handleOpenHumanoModal = (h = null) => {
        if (h) {
            setEditingId(h.id);
            setHumanoForm({
                codigo: h.codigo, humano: h.humano, nacionalidad: h.nacionalidad, buscada: h.buscada,
                nombre: h.nombre, edad: h.edad, estado: h.estado, precio: h.precio, descripcion: h.descripcion
            });
            setHumanoGallery(h.imagenes || []);
        } else {
            setEditingId(null);
            setHumanoForm({
                codigo: '', humano: true, nacionalidad: '', buscada: false, nombre: '',
                edad: 0, estado: '', precio: '', descripcion: ''
            });
            setHumanoGallery([]);
        }
        setHumanoImage(null);
        setNewGalleryImages([]);
        setIsHumanoModalOpen(true);
    };

    const handleSaveHumano = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(humanoForm).forEach(key => formData.append(key, humanoForm[key]));
        if (humanoImage) formData.append('imagen', humanoImage);

        try {
            let humanoId = editingId;
            if (editingId) {
                await api.patch(`/mercadoumbral-humanos/${editingId}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                const res = await api.post('/mercadoumbral-humanos/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                humanoId = res.data.id;
            }

            // Upload Gallery Images
            if (newGalleryImages.length > 0 && humanoId) {
                const uploadPromises = Array.from(newGalleryImages).map(file => {
                    const galleryData = new FormData();
                    galleryData.append('humano', humanoId);
                    galleryData.append('imagen', file);
                    return api.post('/mercadoumbral-humanos-imagenes/', galleryData, { headers: { 'Content-Type': 'multipart/form-data' } });
                });
                await Promise.all(uploadPromises);
            }

            setIsHumanoModalOpen(false);
            fetchHumanos();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteHumano = (id) => {
        if (window.confirm("¿Eliminar humano?")) api.delete(`/mercadoumbral-humanos/${id}/`).then(fetchHumanos);
    };

    const handleDeleteGalleryImage = (imgId) => {
        if (window.confirm("¿Eliminar imagen de la galería?")) {
            api.delete(`/mercadoumbral-humanos-imagenes/${imgId}/`)
                .then(() => {
                    setHumanoGallery(humanoGallery.filter(img => img.id !== imgId));
                    fetchHumanos(); // Refresh main list to update state there too
                })
                .catch(console.error);
        }
    };

    return (
        <div className="page-container">
            <div className="content-area" style={{ margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>Laptop</h1>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {['noticias', 'compras', 'cyborgs', 'humanos'].map(tab => (
                            <button
                                key={tab}
                                className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setActiveTab(tab)}
                                style={{ textTransform: 'capitalize' }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- NOTICIAS TAB --- */}
                {activeTab === 'noticias' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                            <button className="btn btn-primary" onClick={() => handleOpenNoticiaModal()}>+ Nueva Noticia</button>
                        </div>
                        <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '15px' }}>
                            {noticias.length === 0 && <p style={{ color: 'white' }}>No se encontraron noticias. (Check console for 'Noticias:')</p>}
                            {noticias.map(n => (
                                <div key={n.id} className="card" style={{ padding: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h3>{n.titulo}</h3>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>{n.fecha}</div>
                                    </div>
                                    <p style={{ whiteSpace: 'pre-wrap', color: '#ccc' }}>{n.descripcion}</p>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        <button className="btn btn-sm btn-outline" onClick={() => handleOpenNoticiaModal(n)}>Editar</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteNoticia(n.id)}>Eliminar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- COMPRAS TAB --- */}
                {activeTab === 'compras' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                            <button className="btn btn-primary" onClick={() => handleOpenCompraModal()}>+ Registrar Compra</button>
                        </div>
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                            {compras.map(c => (
                                <div key={c.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                                    <div style={{ height: '150px', backgroundColor: '#333' }}>
                                        {c.imagen ? <img src={c.imagen} alt={c.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                                    </div>
                                    <div style={{ padding: '15px' }}>
                                        <h4 style={{ margin: '0 0 5px 0' }}>{c.nombre}</h4>
                                        <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Code: {c.codigo} | ID: {c.itemid}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                            <span style={{ color: '#4caf50' }}>${c.precio}</span>
                                            <span style={{ fontSize: '0.8rem', color: '#888' }}>{c.fecha}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                            <button className="btn btn-sm btn-outline" onClick={() => handleOpenCompraModal(c)}>Editar</button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteCompra(c.id)}>Eliminar</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- CYBORGS TAB --- */}
                {activeTab === 'cyborgs' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                            <button className="btn btn-primary" onClick={() => handleOpenCyborgModal()}>+ Nuevo Cyborg</button>
                        </div>
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {cyborgs.map(c => (
                                <div key={c.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                                    <div style={{ height: '200px', backgroundColor: '#333' }}>
                                        {c.imagen ? <img src={c.imagen} alt={c.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                                    </div>
                                    <div style={{ padding: '15px' }}>
                                        <h3 style={{ margin: '0 0 5px 0' }}>{c.nombre} <span style={{ fontSize: '0.8rem', color: '#888' }}>({c.codigo})</span></h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '0.85rem', color: '#ccc', marginBottom: '10px' }}>
                                            <div>Edad: {c.edad}</div>
                                            <div>Nac: {c.nacionalidad}</div>
                                            <div>Stock: {c.stock}</div>
                                            <div>Chip: {c.chip_version}</div>
                                            <div>Piel: {c.piel_sintetica}</div>
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: '#aaa' }}>{c.descripcion}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                            <span style={{ color: '#4caf50', fontWeight: 'bold', fontSize: '1.2rem' }}>${c.precio}</span>
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <button className="btn btn-sm btn-outline" onClick={() => handleOpenCyborgModal(c)}>Editar</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteCyborg(c.id)}>Eliminar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- HUMANOS TAB --- */}
                {activeTab === 'humanos' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                            <button className="btn btn-primary" onClick={() => handleOpenHumanoModal()}>+ Nuevo Humano</button>
                        </div>
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {humanos.length === 0 && <p style={{ color: 'white' }}>No se encontraron humanos. (Check console for 'Humanos:')</p>}
                            {humanos.map(h => (
                                <div key={h.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                                    <div style={{ height: '200px', backgroundColor: '#333', position: 'relative' }}>
                                        {h.imagen ? <img src={h.imagen} alt={h.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                                        {h.imagenes && h.imagenes.length > 0 && (
                                            <div style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>
                                                +{h.imagenes.length} fotos
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: '15px' }}>
                                        <h3 style={{ margin: '0 0 5px 0' }}>{h.nombre} <span style={{ fontSize: '0.8rem', color: '#888' }}>({h.codigo})</span></h3>
                                        {h.buscada && <div style={{ color: 'red', fontWeight: 'bold', marginBottom: '5px' }}>⚠️ BUSCADA</div>}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '0.85rem', color: '#ccc', marginBottom: '10px' }}>
                                            <div>Edad: {h.edad}</div>
                                            <div>Nac: {h.nacionalidad}</div>
                                            <div>Estado: {h.estado}</div>
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: '#aaa' }}>{h.descripcion}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                            <span style={{ color: '#4caf50', fontWeight: 'bold', fontSize: '1.2rem' }}>${h.precio}</span>
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <button className="btn btn-sm btn-outline" onClick={() => handleOpenHumanoModal(h)}>Editar</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteHumano(h.id)}>Eliminar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- MODALS --- */}
                <Modal isOpen={isNoticiaModalOpen} onClose={() => setIsNoticiaModalOpen(false)} title="Noticia">
                    <form onSubmit={handleSaveNoticia}>
                        <div className="form-group"><label>Título</label><input type="text" value={noticiaForm.titulo} onChange={e => setNoticiaForm({ ...noticiaForm, titulo: e.target.value })} required /></div>
                        <div className="form-group"><label>Descripción</label><textarea value={noticiaForm.descripcion} onChange={e => setNoticiaForm({ ...noticiaForm, descripcion: e.target.value })} rows="4" required /></div>
                        <div className="form-group"><label>Fecha</label><input type="date" value={noticiaForm.fecha} onChange={e => setNoticiaForm({ ...noticiaForm, fecha: e.target.value })} /></div>
                        <button type="submit" className="btn btn-primary">Guardar</button>
                    </form>
                </Modal>

                <Modal isOpen={isCompraModalOpen} onClose={() => setIsCompraModalOpen(false)} title="Compra">
                    <form onSubmit={handleSaveCompra}>
                        <div className="form-group"><label>Nombre</label><input type="text" value={compraForm.nombre} onChange={e => setCompraForm({ ...compraForm, nombre: e.target.value })} required /></div>
                        <div style={{ display: 'flex', gap: '10px' }}><div className="form-group" style={{ flex: 1 }}><label>Código</label><input type="text" value={compraForm.codigo} onChange={e => setCompraForm({ ...compraForm, codigo: e.target.value })} required /></div><div className="form-group" style={{ flex: 1 }}><label>Item ID</label><input type="text" value={compraForm.itemid} onChange={e => setCompraForm({ ...compraForm, itemid: e.target.value })} required /></div></div>
                        <div style={{ display: 'flex', gap: '10px' }}><div className="form-group" style={{ flex: 1 }}><label>Precio</label><input type="number" step="0.01" value={compraForm.precio} onChange={e => setCompraForm({ ...compraForm, precio: e.target.value })} required /></div><div className="form-group" style={{ flex: 1 }}><label>Fecha</label><input type="date" value={compraForm.fecha} onChange={e => setCompraForm({ ...compraForm, fecha: e.target.value })} /></div></div>
                        <div className="form-group"><label>Imagen</label><input type="file" onChange={e => setCompraImage(e.target.files[0])} /></div>
                        <button type="submit" className="btn btn-primary">Guardar</button>
                    </form>
                </Modal>

                <Modal isOpen={isCyborgModalOpen} onClose={() => setIsCyborgModalOpen(false)} title="Cyborg">
                    <form onSubmit={handleSaveCyborg}>
                        <div className="form-group"><label>Nombre</label><input type="text" value={cyborgForm.nombre} onChange={e => setCyborgForm({ ...cyborgForm, nombre: e.target.value })} required /></div>
                        <div style={{ display: 'flex', gap: '10px' }}><div className="form-group" style={{ flex: 1 }}><label>Código</label><input type="text" value={cyborgForm.codigo} onChange={e => setCyborgForm({ ...cyborgForm, codigo: e.target.value })} required /></div><div className="form-group" style={{ flex: 1 }}><label>Nacionalidad</label><input type="text" value={cyborgForm.nacionalidad} onChange={e => setCyborgForm({ ...cyborgForm, nacionalidad: e.target.value })} /></div></div>
                        <div style={{ display: 'flex', gap: '10px' }}><div className="form-group" style={{ flex: 1 }}><label>Edad</label><input type="number" value={cyborgForm.edad} onChange={e => setCyborgForm({ ...cyborgForm, edad: parseInt(e.target.value) })} /></div><div className="form-group" style={{ flex: 1 }}><label>Stock</label><input type="number" value={cyborgForm.stock} onChange={e => setCyborgForm({ ...cyborgForm, stock: parseInt(e.target.value) })} /></div></div>
                        <div style={{ display: 'flex', gap: '10px' }}><div className="form-group" style={{ flex: 1 }}><label>Material</label><input type="text" value={cyborgForm.material_construccion} onChange={e => setCyborgForm({ ...cyborgForm, material_construccion: e.target.value })} /></div><div className="form-group" style={{ flex: 1 }}><label>Densidad Cabello</label><input type="text" value={cyborgForm.densidad_cabello} onChange={e => setCyborgForm({ ...cyborgForm, densidad_cabello: e.target.value })} /></div></div>
                        <div style={{ display: 'flex', gap: '10px' }}><div className="form-group" style={{ flex: 1 }}><label>Chip Version</label><input type="text" value={cyborgForm.chip_version} onChange={e => setCyborgForm({ ...cyborgForm, chip_version: e.target.value })} /></div><div className="form-group" style={{ flex: 1 }}><label>Precio</label><input type="number" step="0.01" value={cyborgForm.precio} onChange={e => setCyborgForm({ ...cyborgForm, precio: e.target.value })} /></div></div>
                        <div className="form-group"><label>Descripción</label><textarea value={cyborgForm.descripcion} onChange={e => setCyborgForm({ ...cyborgForm, descripcion: e.target.value })} rows="3" /></div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div className="form-group"><label><input type="checkbox" checked={cyborgForm.humano} onChange={e => setCyborgForm({ ...cyborgForm, humano: e.target.checked })} /> Humano</label></div>
                            <div className="form-group"><label><input type="checkbox" checked={cyborgForm.disponible} onChange={e => setCyborgForm({ ...cyborgForm, disponible: e.target.checked })} /> Disponible</label></div>
                            <div className="form-group" style={{ flex: 1 }}><label>Piel Sintética</label><input type="text" value={cyborgForm.piel_sintetica} onChange={e => setCyborgForm({ ...cyborgForm, piel_sintetica: e.target.value })} /></div>
                        </div>
                        <div className="form-group"><label>Imagen</label><input type="file" onChange={e => setCyborgImage(e.target.files[0])} /></div>
                        <button type="submit" className="btn btn-primary">Guardar</button>
                    </form>
                </Modal>

                <Modal isOpen={isHumanoModalOpen} onClose={() => setIsHumanoModalOpen(false)} title="Humano">
                    <form onSubmit={handleSaveHumano}>
                        <div className="form-group"><label>Nombre</label><input type="text" value={humanoForm.nombre} onChange={e => setHumanoForm({ ...humanoForm, nombre: e.target.value })} required /></div>
                        <div style={{ display: 'flex', gap: '10px' }}><div className="form-group" style={{ flex: 1 }}><label>Código</label><input type="text" value={humanoForm.codigo} onChange={e => setHumanoForm({ ...humanoForm, codigo: e.target.value })} required /></div><div className="form-group" style={{ flex: 1 }}><label>Nacionalidad</label><input type="text" value={humanoForm.nacionalidad} onChange={e => setHumanoForm({ ...humanoForm, nacionalidad: e.target.value })} /></div></div>
                        <div style={{ display: 'flex', gap: '10px' }}><div className="form-group" style={{ flex: 1 }}><label>Edad</label><input type="number" value={humanoForm.edad} onChange={e => setHumanoForm({ ...humanoForm, edad: parseInt(e.target.value) })} /></div><div className="form-group" style={{ flex: 1 }}><label>Precio</label><input type="number" step="0.01" value={humanoForm.precio} onChange={e => setHumanoForm({ ...humanoForm, precio: e.target.value })} /></div></div>
                        <div className="form-group"><label>Estado</label><input type="text" value={humanoForm.estado} onChange={e => setHumanoForm({ ...humanoForm, estado: e.target.value })} /></div>
                        <div className="form-group"><label>Descripción</label><textarea value={humanoForm.descripcion} onChange={e => setHumanoForm({ ...humanoForm, descripcion: e.target.value })} rows="3" /></div>
                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                id="buscada"
                                checked={humanoForm.buscada}
                                onChange={e => setHumanoForm({ ...humanoForm, buscada: e.target.checked })}
                                style={{ width: 'auto', margin: 0 }}
                            />
                            <label htmlFor="buscada" style={{ margin: 0 }}>Buscada</label>
                        </div>
                        <div className="form-group"><label>Imagen Principal</label><input type="file" onChange={e => setHumanoImage(e.target.files[0])} /></div>

                        {/* Gallery Section */}
                        <div className="form-group">
                            <label>Galería de Imágenes</label>
                            <input type="file" multiple onChange={e => setNewGalleryImages(e.target.files)} />
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                                {humanoGallery.map(img => (
                                    <div key={img.id} style={{ position: 'relative', width: '80px', height: '80px' }}>
                                        <img src={img.imagen} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                        <button
                                            type="button"
                                            style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            onClick={() => handleDeleteGalleryImage(img.id)}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">Guardar</button>
                    </form>
                </Modal>
            </div>
        </div>
    );
}

export default Laptop;
