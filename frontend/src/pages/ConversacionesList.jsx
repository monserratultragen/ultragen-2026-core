import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Modal from '../components/Modal';

function ConversacionesList() {
    const navigate = useNavigate();
    const [conversaciones, setConversaciones] = useState([]);
    const [personajes, setPersonajes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newConv, setNewConv] = useState({ p1: '', p2: '' });

    useEffect(() => {
        fetchConversaciones();
        fetchPersonajes();
    }, []);

    const fetchConversaciones = () => {
        api.get('/conversaciones/')
            .then(res => setConversaciones(res.data))
            .catch(err => console.error(err));
    };

    const fetchPersonajes = () => {
        api.get('/personajes/')
            .then(res => setPersonajes(res.data))
            .catch(err => console.error(err));
    };

    const handleCreate = (e) => {
        e.preventDefault();
        if (newConv.p1 === newConv.p2) {
            alert("Selecciona dos personajes diferentes");
            return;
        }
        api.post('/conversaciones/', { personajes: [newConv.p1, newConv.p2] })
            .then(() => {
                setIsModalOpen(false);
                fetchConversaciones();
                setNewConv({ p1: '', p2: '' });
            })
            .catch(err => alert("Error al crear conversación"));
    };

    const getOtherPersonaje = (conv) => {
        // Logic to determine who is the "other" person. 
        // For now, just pick the first one, or if we had a logged-in user context, we'd pick the other.
        // Let's just show both names for clarity in this admin view.
        if (!conv.personajes || conv.personajes.length < 2) return { nombre: 'Desconocido', img: null };

        return {
            nombre: `${conv.personajes[0].nombre} & ${conv.personajes[1].nombre}`,
            img: conv.personajes[0].ruta_img // Just show one image for now
        };
    };

    const formatTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="page-container">
            <div className="content-area" style={{ margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>Conversaciones (WhatsApp)</h1>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Nueva Conversación</button>
                </div>

                <div className="conversation-list">
                    {conversaciones.map(conv => {
                        const displayInfo = getOtherPersonaje(conv);
                        const lastMsg = conv.last_message;

                        return (
                            <div
                                key={conv.id}
                                className="conversation-item"
                                onClick={() => navigate(`/conversaciones/${conv.id}`)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '15px',
                                    borderBottom: '1px solid #333',
                                    cursor: 'pointer',
                                    backgroundColor: '#1a1a1a',
                                    marginBottom: '1px'
                                }}
                            >
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', marginRight: '15px', backgroundColor: '#444' }}>
                                    {displayInfo.img && <img src={displayInfo.img} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h4 style={{ margin: 0, color: '#fff' }}>{displayInfo.nombre}</h4>
                                        <span style={{ fontSize: '0.8rem', color: '#888' }}>
                                            {lastMsg ? (lastMsg.hora_simulada || formatTime(lastMsg.fecha_simulada)) : ''}
                                        </span>
                                    </div>
                                    <p style={{ margin: '5px 0 0 0', color: '#aaa', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {lastMsg ? (lastMsg.mensaje || '📷 Imagen') : 'Sin mensajes'}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva Conversación">
                    <form onSubmit={handleCreate}>
                        <div className="form-group">
                            <label>Personaje 1</label>
                            <select
                                value={newConv.p1}
                                onChange={e => setNewConv({ ...newConv, p1: e.target.value })}
                                required
                            >
                                <option value="">Seleccionar...</option>
                                {personajes.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Personaje 2</label>
                            <select
                                value={newConv.p2}
                                onChange={e => setNewConv({ ...newConv, p2: e.target.value })}
                                required
                            >
                                <option value="">Seleccionar...</option>
                                {personajes.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">Crear Chat</button>
                    </form>
                </Modal>
            </div>
        </div>
    );
}

export default ConversacionesList;
