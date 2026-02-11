import { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';

function DiariosList({ onDiarioSelect }) {
    const [diarios, setDiarios] = useState([]);
    const [newDiario, setNewDiario] = useState({ nombre: '', sinopsis: '', orden: 0 });
    const [imagen, setImagen] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchDiarios();
    }, []);

    const fetchDiarios = () => {
        api.get('/diarios/')
            .then(res => {
                // Ensure sorted by orden
                const sorted = res.data.sort((a, b) => a.orden - b.orden);
                setDiarios(sorted);
            })
            .catch(err => console.error(err));
    };

    const handleOpenModal = (diario = null) => {
        if (diario) {
            setEditingId(diario.id);
            setNewDiario({ nombre: diario.nombre, sinopsis: diario.sinopsis, orden: diario.orden });
        } else {
            setEditingId(null);
            // Default orden to last + 1
            const maxOrden = diarios.length > 0 ? Math.max(...diarios.map(d => d.orden)) : 0;
            setNewDiario({ nombre: '', sinopsis: '', orden: maxOrden + 1 });
        }
        setImagen(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setNewDiario({ nombre: '', sinopsis: '', orden: 0 });
        setImagen(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nombre', newDiario.nombre);
        formData.append('sinopsis', newDiario.sinopsis);
        formData.append('orden', newDiario.orden);
        if (imagen) {
            formData.append('ruta_img', imagen);
        }

        const request = editingId
            ? api.patch(`/diarios/${editingId}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            : api.post('/diarios/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

        request
            .then(() => {
                handleCloseModal();
                fetchDiarios();
            })
            .catch(err => console.error(err));
    };

    const handleReorder = (index, direction) => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === diarios.length - 1) return;

        const otherIndex = direction === 'up' ? index - 1 : index + 1;
        const currentItem = diarios[index];
        const otherItem = diarios[otherIndex];

        // Calculate new orden values
        let newCurrentOrden = otherItem.orden;
        let newOtherOrden = currentItem.orden;

        if (currentItem.orden === otherItem.orden) {
            // Collision detected, fallback to index-based normalization
            newCurrentOrden = otherIndex + 1;
            newOtherOrden = index + 1;
        }

        // Optimistic update
        const newDiarios = [...diarios];
        newDiarios[index] = { ...currentItem, orden: newCurrentOrden };
        newDiarios[otherIndex] = { ...otherItem, orden: newOtherOrden };
        newDiarios.sort((a, b) => a.orden - b.orden);
        setDiarios(newDiarios);

        // API updates
        Promise.all([
            api.patch(`/diarios/${currentItem.id}/`, { orden: newCurrentOrden }),
            api.patch(`/diarios/${otherItem.id}/`, { orden: newOtherOrden })
        ]).then(() => fetchDiarios())
            .catch(err => {
                console.error(err);
                fetchDiarios(); // Revert on error
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
                        {diarios.map((diario, index) => (
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
                                        <img src={diario.ruta_img} alt={diario.nombre} style={{ height: '50px', borderRadius: '4px' }} />
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
                            onChange={e => setNewDiario({ ...newDiario, orden: parseInt(e.target.value) })}
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
