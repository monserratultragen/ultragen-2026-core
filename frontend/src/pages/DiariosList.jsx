import { useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import { getImageUrl } from '../utils/imageUtils';

function DiariosList({ onDiarioSelect, onRefresh, diarios }) {
    const [newDiario, setNewDiario] = useState({ nombre: '', sinopsis: '', orden: 0, is_active: true });
    const [imagen, setImagen] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleOpenModal = (diario = null) => {
        if (diario) {
            setEditingId(diario.id);
            setNewDiario({ nombre: diario.nombre, sinopsis: diario.sinopsis, orden: diario.orden, is_active: diario.is_active });
        } else {
            setEditingId(null);
            const maxOrden = diarios && diarios.length > 0 ? Math.max(...diarios.map(d => d.orden || 0)) : 0;
            setNewDiario({ nombre: '', sinopsis: '', orden: maxOrden + 1, is_active: true });
        }
        setImagen(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setNewDiario({ nombre: '', sinopsis: '', orden: 0, is_active: true });
        setImagen(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nombre', newDiario.nombre || '');
        formData.append('sinopsis', newDiario.sinopsis || '');
        formData.append('orden', newDiario.orden || 0);
        formData.append('is_active', newDiario.is_active);
        if (imagen) {
            formData.append('ruta_img', imagen);
        }

        const request = editingId
            ? api.patch(`/diarios/${editingId}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            : api.post('/diarios/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

        request
            .then(() => {
                handleCloseModal();
                if (onRefresh) onRefresh();
            })
            .catch(err => {
                console.error(err);
                alert("Error al guardar: " + (err.response?.data?.detail || err.message));
            });
    };

    const handleReorder = (index, direction) => {
        if (!diarios) return;
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === diarios.length - 1) return;

        const otherIndex = direction === 'up' ? index - 1 : index + 1;
        const currentItem = diarios[index];
        const otherItem = diarios[otherIndex];

        let newCurrentOrden = otherItem.orden || 0;
        let newOtherOrden = currentItem.orden || 0;

        if (newCurrentOrden === newOtherOrden) {
            newCurrentOrden = otherIndex + 1;
            newOtherOrden = index + 1;
        }

        Promise.all([
            api.patch(`/diarios/${currentItem.id}/`, { orden: newCurrentOrden }),
            api.patch(`/diarios/${otherItem.id}/`, { orden: newOtherOrden })
        ]).then(() => onRefresh && onRefresh())
            .catch(err => {
                console.error(err);
                if (onRefresh) onRefresh();
            });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Diarios</h1>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>Nuevo Diario</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: '80px' }}>Orden</th>
                            <th>Nombre</th>
                            <th>Sinopsis</th>
                            <th>Imagen</th>
                            <th style={{ width: '150px' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {diarios && diarios.map((diario, index) => (
                            <tr
                                key={diario.id}
                                onClick={() => onDiarioSelect && onDiarioSelect(diario.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td style={{ textAlign: 'center' }}>{diario.orden}</td>
                                <td>{diario.nombre}</td>
                                <td>{diario.sinopsis}</td>
                                <td>
                                    {diario.ruta_img && (
                                        <img src={getImageUrl(diario.ruta_img)} alt={diario.nombre} style={{ height: '50px', borderRadius: '4px' }} />
                                    )}
                                </td>
                                <td onClick={(e) => e.stopPropagation()}>
                                    <button
                                        className="action-btn"
                                        onClick={() => handleOpenModal(diario)}
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
                                        disabled={index === diarios.length - 1}
                                    >
                                        ▼
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {(!diarios || diarios.length === 0) && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                    No hay diarios registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? "Editar Diario" : "Nuevo Diario"}
            >
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            type="text"
                            placeholder="Nombre del Diario"
                            value={newDiario.nombre}
                            onChange={e => setNewDiario({ ...newDiario, nombre: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            type="number"
                            placeholder="Orden"
                            value={newDiario.orden}
                            onChange={e => setNewDiario({ ...newDiario, orden: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <textarea
                            placeholder="Sinopsis"
                            value={newDiario.sinopsis}
                            onChange={e => setNewDiario({ ...newDiario, sinopsis: e.target.value })}
                            rows="4"
                        />
                    </div>
                    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input
                            type="checkbox"
                            id="diario-active"
                            checked={newDiario.is_active}
                            onChange={e => setNewDiario({ ...newDiario, is_active: e.target.checked })}
                            style={{ width: 'auto' }}
                        />
                        <label htmlFor="diario-active">Activo</label>
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

export default DiariosList;
