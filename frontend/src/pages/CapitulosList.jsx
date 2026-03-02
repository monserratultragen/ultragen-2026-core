import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import Modal from '../components/Modal';
import { getImageUrl } from '../utils/imageUtils';
import CapituloPromptsModal from '../components/CapituloPromptsModal';

function CapitulosList({ selectedTomoId, onRefresh, capitulos, tomos, diarios }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [newCapitulo, setNewCapitulo] = useState({
        nombre: '', sinopsis: '', tomo: '', orden: 0,
        contenido: '',
        pais: '', ciudad: '', anio: '',
        romance: false, risas: false, lagrimas: false, violencia: false,
        peligro: false, armas: false, sexo: false, eventos: false,
        es_demo: true, is_vip: false,
        is_active: true
    });
    const [imagen, setImagen] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [promptsChapter, setPromptsChapter] = useState(null); // { id, name }



    const handleOpenModal = (cap = null) => {
        if (cap) {
            setEditingId(cap.id);
            setNewCapitulo({
                nombre: cap.nombre, sinopsis: cap.sinopsis, tomo: cap.tomo, orden: cap.orden,
                contenido: cap.contenido || '',
                pais: cap.pais || '', ciudad: cap.ciudad || '', anio: cap.anio || '',
                romance: cap.romance, risas: cap.risas, lagrimas: cap.lagrimas, violencia: cap.violencia,
                peligro: cap.peligro, armas: cap.armas, sexo: cap.sexo, eventos: cap.eventos,
                es_demo: cap.es_demo, is_vip: cap.is_vip,
                is_active: cap.is_active
            });
        } else {
            setEditingId(null);
            // Default orden logic
            const capsInTomo = capitulos.filter(c => c.tomo == selectedTomoId);
            const maxOrden = capsInTomo.length > 0 ? Math.max(...capsInTomo.map(c => c.orden)) : 0;

            setNewCapitulo({
                nombre: '', sinopsis: '', tomo: selectedTomoId || '', orden: maxOrden + 1,
                contenido: '',
                pais: '', ciudad: '', anio: '',
                romance: false, risas: false, lagrimas: false, violencia: false,
                peligro: false, armas: false, sexo: false, eventos: false,
                es_demo: true, is_vip: false,
                is_active: true
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
            peligro: false, armas: false, sexo: false, eventos: false,
            es_demo: true, is_vip: false,
            is_active: true
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
                if (onRefresh) onRefresh();
            })
            .catch(err => console.error(err));
    };

    const handleReorder = (index, direction) => {
        // Reordering within the filtered list
        const filteredCapitulos = selectedTomoId
            ? capitulos.filter(c => c.tomo == selectedTomoId)
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
        // since we use props, we rely on parent update

        // API updates
        Promise.all([
            api.patch(`/capitulos/${currentItem.id}/`, { orden: newCurrentOrden }),
            api.patch(`/capitulos/${otherItem.id}/`, { orden: newOtherOrden })
        ]).then(() => onRefresh && onRefresh())
            .catch(err => {
                console.error(err);
                if (onRefresh) onRefresh();
            });
    };

    const getTomoLabel = (tomo) => {
        const diario = diarios.find(d => d.id == tomo.diario);
        const diarioName = diario ? diario.nombre : 'Unknown';
        return `${diarioName} - ${tomo.nombre}`;
    };

    const getTomoName = (id) => {
        const t = tomos.find(t => t.id == id);
        if (!t) return id || 'Sin Tomo';
        const diario = diarios.find(d => d.id == t.diario);
        const diarioPrefix = diario ? `${diario.nombre} - ` : '';
        return `${diarioPrefix}${t.nombre}`;
    };

    const filteredCapitulos = selectedTomoId
        ? capitulos.filter(c => c.tomo == selectedTomoId)
        : capitulos;

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
                            <th style={{ width: '20px' }}>Ord</th>
                            {!selectedTomoId && <th>Tomo</th>}
                            <th>Nombre</th>
                            <th>Imagen</th>

                            <th title="Demo">Demo</th>
                            <th title="VIP">VIP</th>
                            <th title="Activo">Activo</th>

                            <th style={{ width: '100px' }}>Actualizado</th>
                            <th title="Palabras" style={{ width: '80px' }}>Pals</th>

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
                                {!selectedTomoId && <td>{getTomoName(cap.tomo)}</td>}
                                <td>{cap.nombre}</td>
                                <td>
                                    {cap.ruta_img && (
                                        <img src={getImageUrl(cap.ruta_img)} alt={cap.nombre} style={{ height: '50px', borderRadius: '4px' }} />
                                    )}
                                </td>

                                <td className={`bool-cell ${cap.es_demo ? 'active' : ''}`} style={{ cursor: 'default' }}>{cap.es_demo ? 'YES' : 'NO'}</td>
                                <td className={`bool-cell ${cap.is_vip ? 'active' : ''}`} style={{ cursor: 'default' }}>{cap.is_vip ? 'YES' : 'NO'}</td>
                                <td className={`bool-cell ${cap.is_active ? 'active' : ''}`} style={{ cursor: 'default' }}>{cap.is_active ? 'YES' : 'NO'}</td>

                                <td style={{ fontSize: '0.8rem' }}>
                                    {cap.updated_at ? new Date(cap.updated_at).toLocaleDateString() : '-'}
                                </td>
                                <td style={{ textAlign: 'center', fontSize: '0.8rem' }}>
                                    {cap.palabras || 0}
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
                                        title="Editar"
                                    >
                                        <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
                                    </button>
                                    <button
                                        className="action-btn"
                                        onClick={(e) => { e.stopPropagation(); setPromptsChapter({ id: cap.id, nombre: cap.nombre }); }}
                                        title="Prompts"
                                    >
                                        <svg viewBox="0 0 24 24"><path d="M12 11.55C9.64 9.35 6.48 8 3 8v11c3.48 0 6.64 1.35 9 3.55 2.36-2.2 5.52-3.55 9-3.55V8c-3.48 0-6.64 1.35-9 3.55zM12 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z" /></svg>
                                    </button>
                                    <button
                                        className="action-btn"
                                        onClick={() => handleReorder(index, 'up')}
                                        disabled={index === 0}
                                        title="Subir"
                                    >
                                        <svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" /></svg>
                                    </button>
                                    <button
                                        className="action-btn"
                                        onClick={() => handleReorder(index, 'down')}
                                        disabled={index === filteredCapitulos.length - 1}
                                        title="Bajar"
                                    >
                                        <svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" /></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredCapitulos.length === 0 && (
                            <tr>
                                <td colSpan="19" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                    {selectedTomoId ? "No hay capítulos en este tomo." : "No hay capítulos registrados."}
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

                    <div style={{ margin: '10px 0', display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
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

                    <div style={{ marginBottom: '15px', display: 'flex', gap: '20px', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={newCapitulo.es_demo}
                                onChange={e => setNewCapitulo({ ...newCapitulo, es_demo: e.target.checked })}
                                style={{ width: 'auto' }}
                            />
                            Demo
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={newCapitulo.is_vip}
                                onChange={e => setNewCapitulo({ ...newCapitulo, is_vip: e.target.checked })}
                                style={{ width: 'auto' }}
                            />
                            VIP
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                id="capitulo-active"
                                checked={newCapitulo.is_active}
                                onChange={e => setNewCapitulo({ ...newCapitulo, is_active: e.target.checked })}
                                style={{ width: 'auto' }}
                            />
                            Activo
                        </label>
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

            <CapituloPromptsModal
                isOpen={!!promptsChapter}
                onClose={() => setPromptsChapter(null)}
                capituloId={promptsChapter?.id}
                capituloNombre={promptsChapter?.nombre}
            />
        </div>
    );
}

export default CapitulosList;
