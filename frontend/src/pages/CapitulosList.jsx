import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import Modal from '../components/Modal';

function CapitulosList({ selectedTomoId }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [capitulos, setCapitulos] = useState([]);
    const [tomos, setTomos] = useState([]);
    const [diarios, setDiarios] = useState([]);
    const [newCapitulo, setNewCapitulo] = useState({
        nombre: '', sinopsis: '', tomo: '', orden: 0,
        contenido: '',
        pais: '', ciudad: '', anio: '',
        romance: false, risas: false, lagrimas: false, violencia: false,
        peligro: false, armas: false, sexo: false, eventos: false
    });
    const [imagen, setImagen] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchCapitulos();
        fetchTomos();
        fetchDiarios();
    }, []);

    const fetchCapitulos = () => {
        api.get('/capitulos/')
            .then(res => {
                // Sort by orden
                const sorted = res.data.sort((a, b) => a.orden - b.orden);
                setCapitulos(sorted);
            })
            .catch(err => console.error(err));
    };

    const fetchTomos = () => {
        api.get('/tomos/')
            .then(res => setTomos(res.data))
            .catch(err => console.error(err));
    };

    const fetchDiarios = () => {
        api.get('/diarios/')
            .then(res => setDiarios(res.data))
            .catch(err => console.error(err));
    };

    const handleOpenModal = (cap = null) => {
        if (cap) {
            setEditingId(cap.id);
            setNewCapitulo({
                nombre: cap.nombre, sinopsis: cap.sinopsis, tomo: cap.tomo, orden: cap.orden,
                contenido: cap.contenido || '',
                pais: cap.pais || '', ciudad: cap.ciudad || '', anio: cap.anio || '',
                romance: cap.romance, risas: cap.risas, lagrimas: cap.lagrimas, violencia: cap.violencia,
                peligro: cap.peligro, armas: cap.armas, sexo: cap.sexo, eventos: cap.eventos
            });
        } else {
            setEditingId(null);
            // Default orden logic
            const capsInTomo = capitulos.filter(c => c.tomo === selectedTomoId);
            const maxOrden = capsInTomo.length > 0 ? Math.max(...capsInTomo.map(c => c.orden)) : 0;

            setNewCapitulo({
                nombre: '', sinopsis: '', tomo: selectedTomoId || '', orden: maxOrden + 1,
                contenido: '',
                pais: '', ciudad: '', anio: '',
                romance: false, risas: false, lagrimas: false, violencia: false,
                peligro: false, armas: false, sexo: false, eventos: false
            });
        }
        setImagen(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setNewCapitulo({
            nombre: '', sinopsis: '', tomo: '', orden: 0,
            contenido: '',
            pais: '', ciudad: '', anio: '',
            romance: false, risas: false, lagrimas: false, violencia: false,
            peligro: false, armas: false, sexo: false, eventos: false
        });
        setImagen(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newCapitulo.tomo) {
            alert("Selecciona un tomo");
            return;
        }

        const formData = new FormData();
        for (const key in newCapitulo) {
            formData.append(key, newCapitulo[key]);
        }
        if (imagen) {
            formData.append('ruta_img', imagen);
        }

        const request = editingId
            ? api.patch(`/capitulos/${editingId}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            : api.post('/capitulos/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

        request
            .then(() => {
                handleCloseModal();
                fetchCapitulos();
            })
            .catch(err => console.error(err));
    };

    const handleReorder = (index, direction) => {
        // Reordering within the filtered list
        const filteredCapitulos = selectedTomoId
            ? capitulos.filter(c => c.tomo === selectedTomoId)
            : [];

        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === filteredCapitulos.length - 1) return;

        const otherIndex = direction === 'up' ? index - 1 : index + 1;
        const currentItem = filteredCapitulos[index];
        const otherItem = filteredCapitulos[otherIndex];

        // Calculate new orden values
        let newCurrentOrden = otherItem.orden;
        let newOtherOrden = currentItem.orden;

        if (currentItem.orden === otherItem.orden) {
            newCurrentOrden = otherIndex + 1;
            newOtherOrden = index + 1;
        }

        // Optimistic update
        const newCapitulos = capitulos.map(c => {
            if (c.id === currentItem.id) return { ...c, orden: newCurrentOrden };
            if (c.id === otherItem.id) return { ...c, orden: newOtherOrden };
            return c;
        });
        newCapitulos.sort((a, b) => a.orden - b.orden);
        setCapitulos(newCapitulos);

        // API updates
        Promise.all([
            api.patch(`/capitulos/${currentItem.id}/`, { orden: newCurrentOrden }),
            api.patch(`/capitulos/${otherItem.id}/`, { orden: newOtherOrden })
        ]).then(() => fetchCapitulos())
            .catch(err => {
                console.error(err);
                fetchCapitulos(); // Revert on error
            });
    };

    const getTomoLabel = (tomo) => {
        const diario = diarios.find(d => d.id === tomo.diario);
        const diarioName = diario ? diario.nombre : 'Unknown';
        return `${diarioName} - ${tomo.nombre}`;
    };

    const getTomoName = (id) => {
        const t = tomos.find(t => t.id === id);
        return t ? t.nombre : id;
    };

    const filteredCapitulos = selectedTomoId
        ? capitulos.filter(c => c.tomo === selectedTomoId)
        : [];

    return (
        <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Capítulos {selectedTomoId ? `- ${getTomoName(selectedTomoId)}` : ''}</h1>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>Nuevo Capítulo</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: '50px' }}>Ord</th>
                            <th>Nombre</th>
                            <th>Sinopsis</th>
                            <th>Imagen</th>
                            <th style={{ width: '100px' }}>Actualizado</th>

                            {/* Contexto */}
                            <th title="País">🏳️</th>
                            <th title="Ciudad">🏙️</th>
                            <th title="Año">📅</th>

                            {/* Booleans */}
                            <th title="Romance">❤️</th>
                            <th title="Risas">😂</th>
                            <th title="Lágrimas">😭</th>
                            <th title="Violencia">⚔️</th>
                            <th title="Peligro">⚠️</th>
                            <th title="Armas">🔫</th>
                            <th title="Sexo">🔞</th>
                            <th title="Eventos">🎉</th>

                            <th style={{ width: '100px' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCapitulos.map((cap, index) => (
                            <tr key={cap.id} onClick={() => navigate(`/writer/${cap.id}`)}>
                                <td style={{ textAlign: 'center' }}>{cap.orden}</td>
                                <td>{cap.nombre}</td>
                                <td style={{ fontSize: '0.8rem', color: '#888' }}>
                                    {cap.sinopsis ? (cap.sinopsis.length > 50 ? cap.sinopsis.substring(0, 50) + '...' : cap.sinopsis) : '-'}
                                </td>
                                <td>
                                    {cap.ruta_img && (
                                        <img src={cap.ruta_img} alt={cap.nombre} style={{ height: '50px', borderRadius: '4px' }} />
                                    )}
                                </td>
                                <td style={{ fontSize: '0.8rem' }}>
                                    {cap.updated_at ? new Date(cap.updated_at).toLocaleDateString() : '-'}
                                </td>

                                {/* Contexto */}
                                <td className="context-cell">{cap.pais ? '✓' : '✗'}</td>
                                <td className="context-cell">{cap.ciudad ? '✓' : '✗'}</td>
                                <td className="context-cell">{cap.anio ? '✓' : '✗'}</td>

                                {/* Booleans */}
                                <td className={`bool-cell ${cap.romance ? 'active' : ''}`}>{cap.romance ? '•' : ''}</td>
                                <td className={`bool-cell ${cap.risas ? 'active' : ''}`}>{cap.risas ? '•' : ''}</td>
                                <td className={`bool-cell ${cap.lagrimas ? 'active' : ''}`}>{cap.lagrimas ? '•' : ''}</td>
                                <td className={`bool-cell ${cap.violencia ? 'active' : ''}`}>{cap.violencia ? '•' : ''}</td>
                                <td className={`bool-cell ${cap.peligro ? 'active' : ''}`}>{cap.peligro ? '•' : ''}</td>
                                <td className={`bool-cell ${cap.armas ? 'active' : ''}`}>{cap.armas ? '•' : ''}</td>
                                <td className={`bool-cell ${cap.sexo ? 'active' : ''}`}>{cap.sexo ? '•' : ''}</td>
                                <td className={`bool-cell ${cap.eventos ? 'active' : ''}`}>{cap.eventos ? '•' : ''}</td>

                                <td onClick={(e) => e.stopPropagation()}>
                                    <button
                                        className="action-btn"
                                        onClick={(e) => { e.stopPropagation(); handleOpenModal(cap); }}
                                        title="Escritor"
                                        style={{ marginRight: '5px' }}
                                    >
                                        ✎
                                    </button>
                                    <button
                                        className="action-btn"
                                        onClick={() => handleReorder(index, 'up')}
                                        disabled={index === 0}
                                    >
                                        ▲
                                    </button>
                                    <button
                                        className="action-btn"
                                        onClick={() => handleReorder(index, 'down')}
                                        disabled={index === filteredCapitulos.length - 1}
                                    >
                                        ▼
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredCapitulos.length === 0 && (
                            <tr>
                                <td colSpan="17" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                    {selectedTomoId ? "No hay capítulos en este tomo." : "Selecciona un tomo para ver sus capítulos."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? "Editar Capítulo" : "Nuevo Capítulo"}
            >
                <form onSubmit={handleSubmit}>
                    <select
                        value={newCapitulo.tomo}
                        onChange={e => setNewCapitulo({ ...newCapitulo, tomo: e.target.value })}
                        required
                        disabled={!editingId && selectedTomoId}
                    >
                        <option value="">Selecciona un Tomo</option>
                        {tomos.map(t => (
                            <option key={t.id} value={t.id}>{getTomoLabel(t)}</option>
                        ))}
                    </select>

                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        <input
                            type="text"
                            placeholder="Nombre del Capítulo"
                            value={newCapitulo.nombre}
                            onChange={e => setNewCapitulo({ ...newCapitulo, nombre: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Orden"
                            value={newCapitulo.orden}
                            onChange={e => setNewCapitulo({ ...newCapitulo, orden: parseInt(e.target.value) })}
                        />
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                        <input type="text" placeholder="País" value={newCapitulo.pais} onChange={e => setNewCapitulo({ ...newCapitulo, pais: e.target.value })} />
                        <input type="text" placeholder="Ciudad" value={newCapitulo.ciudad} onChange={e => setNewCapitulo({ ...newCapitulo, ciudad: e.target.value })} />
                        <input type="text" placeholder="Año" value={newCapitulo.anio} onChange={e => setNewCapitulo({ ...newCapitulo, anio: e.target.value })} />
                    </div>

                    <textarea
                        placeholder="Sinopsis"
                        value={newCapitulo.sinopsis}
                        onChange={e => setNewCapitulo({ ...newCapitulo, sinopsis: e.target.value })}
                        rows="2"
                    />

                    <textarea
                        placeholder="Contenido del Capítulo"
                        value={newCapitulo.contenido}
                        onChange={e => setNewCapitulo({ ...newCapitulo, contenido: e.target.value })}
                        rows="5"
                    />

                    <div style={{ margin: '10px 0', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {['romance', 'risas', 'lagrimas', 'violencia', 'peligro', 'armas', 'sexo', 'eventos'].map(tag => (
                            <label key={tag} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', textTransform: 'capitalize' }}>
                                <input
                                    type="checkbox"
                                    checked={newCapitulo[tag]}
                                    onChange={e => setNewCapitulo({ ...newCapitulo, [tag]: e.target.checked })}
                                    style={{ width: 'auto' }}
                                />
                                {tag}
                            </label>
                        ))}
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Imagen de Portada:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setImagen(e.target.files[0])}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        {editingId ? "Guardar Cambios" : "Crear"}
                    </button>
                </form>
            </Modal>
        </div>
    );
}

export default CapitulosList;
