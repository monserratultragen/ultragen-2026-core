import { useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import { getImageUrl } from '../utils/imageUtils';

function TomosList({ selectedDiarioId, onTomoSelect, onRefresh, tomos, diarios }) {
    const [newTomo, setNewTomo] = useState({ nombre: '', sinopsis: '', diario: '', orden: 0, is_active: true });
    const [imagen, setImagen] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);


    const handleOpenModal = (tomo = null) => {
        if (tomo) {
            setEditingId(tomo.id);
            setNewTomo({ nombre: tomo.nombre, sinopsis: tomo.sinopsis, diario: tomo.diario, orden: tomo.orden, is_active: tomo.is_active });
        } else {
            setEditingId(null);
            // Default orden to last + 1 in the selected diario
            setNewTomo({ nombre: '', sinopsis: '', diario: selectedDiarioId || '', orden: maxOrden + 1, is_active: true });
        }
        setImagen(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setNewTomo({ nombre: '', sinopsis: '', diario: '', orden: 0, is_active: true });
        setImagen(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newTomo.diario) {
            alert("Selecciona un diario");
            return;
        }

        const formData = new FormData();
        formData.append('nombre', newTomo.nombre);
        formData.append('sinopsis', newTomo.sinopsis);
        formData.append('diario', newTomo.diario);
        formData.append('orden', newTomo.orden);
        formData.append('is_active', newTomo.is_active);
        if (imagen) {
            formData.append('ruta_img', imagen);
        }

        const request = editingId
            ? api.patch(`/tomos/${editingId}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            : api.post('/tomos/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

        request
            .then(() => {
                handleCloseModal();
                if (onRefresh) onRefresh();
            })
            .catch(err => console.error(err));
    };

    const handleReorder = (index, direction) => {
        // Reordering within the filtered list
        const filteredTomos = tomos.filter(t => t.diario == selectedDiarioId);

        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === filteredTomos.length - 1) return;

        const otherIndex = direction === 'up' ? index - 1 : index + 1;
        const currentItem = filteredTomos[index];
        const otherItem = filteredTomos[otherIndex];

        // Calculate new orden values
        let newCurrentOrden = otherItem.orden;
        let newOtherOrden = currentItem.orden;

        if (currentItem.orden === otherItem.orden) {
            newCurrentOrden = otherIndex + 1;
            newOtherOrden = index + 1;
        }

        // Optimistic update (update the main list)
        const newTomos = tomos.map(t => {
            if (t.id === currentItem.id) return { ...t, orden: newCurrentOrden };
            if (t.id === otherItem.id) return { ...t, orden: newOtherOrden };
            return t;
        });
        // Re-sort the whole list just in case, though we only care about the filtered view for display
        // Since we are moving to props, we'll let the parent handle the final state

        // API updates
        Promise.all([
            api.patch(`/tomos/${currentItem.id}/`, { orden: newCurrentOrden }),
            api.patch(`/tomos/${otherItem.id}/`, { orden: newOtherOrden })
        ]).then(() => onRefresh && onRefresh())
            .catch(err => {
                console.error(err);
                if (onRefresh) onRefresh(); // Revert or refresh on error
            });
    };

    const filteredTomos = selectedDiarioId
        ? tomos.filter(t => t.diario == selectedDiarioId)
        : tomos;

    const getDiarioName = (id) => {
        const d = diarios.find(d => d.id === id);
        return d ? d.nombre : 'Desconocido';
    };

    return (
        <div className="page-container">
            {/* Sidebar removed as requested, using parent navigation */}

            <div className="content-area" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>Tomos {selectedDiarioId ? `- ${getDiarioName(selectedDiarioId)}` : ''}</h1>
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>Nuevo Tomo</button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>Orden</th>
                                {!selectedDiarioId && <th>Diario</th>}
                                <th>Nombre</th>
                                <th>Sinopsis</th>
                                <th>Imagen</th>
                                <th style={{ width: '150px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTomos.map((tomo, index) => (
                                <tr
                                    key={tomo.id}
                                    onClick={() => onTomoSelect && onTomoSelect(tomo.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td style={{ textAlign: 'center' }}>{tomo.orden}</td>
                                    {!selectedDiarioId && <td>{getDiarioName(tomo.diario)}</td>}
                                    <td>{tomo.nombre}</td>
                                    <td>{tomo.sinopsis}</td>
                                    <td>
                                        {tomo.ruta_img && (
                                            <img src={getImageUrl(tomo.ruta_img)} alt={tomo.nombre} style={{ height: '50px', borderRadius: '4px' }} />
                                        )}
                                    </td>
                                    <td onClick={(e) => e.stopPropagation()}>
                                        <button
                                            className="action-btn"
                                            onClick={() => handleOpenModal(tomo)}
                                            title="Editar"
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
                                            disabled={index === filteredTomos.length - 1}
                                        >
                                            ▼
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredTomos.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                        {selectedDiarioId ? "No hay tomos en este diario." : "No hay tomos registrados."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? "Editar Tomo" : "Nuevo Tomo"}
            >
                <form onSubmit={handleSubmit}>
                    <select
                        value={newTomo.diario}
                        onChange={e => setNewTomo({ ...newTomo, diario: e.target.value })}
                        required
                        disabled={!editingId && selectedDiarioId} // If creating new and diario selected, lock it? Or just pre-select.
                    >
                        <option value="">Selecciona un Diario</option>
                        {diarios.map(d => (
                            <option key={d.id} value={d.id}>{d.nombre}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Nombre del Tomo"
                        value={newTomo.nombre}
                        onChange={e => setNewTomo({ ...newTomo, nombre: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Orden"
                        value={newTomo.orden}
                        onChange={e => setNewTomo({ ...newTomo, orden: parseInt(e.target.value) })}
                    />
                    <textarea
                        placeholder="Sinopsis"
                        value={newTomo.sinopsis}
                        onChange={e => setNewTomo({ ...newTomo, sinopsis: e.target.value })}
                        rows="4"
                    />
                    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input
                            type="checkbox"
                            id="tomo-active"
                            checked={newTomo.is_active}
                            onChange={e => setNewTomo({ ...newTomo, is_active: e.target.checked })}
                            style={{ width: 'auto' }}
                        />
                        <label htmlFor="tomo-active">Activo</label>
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

export default TomosList;
