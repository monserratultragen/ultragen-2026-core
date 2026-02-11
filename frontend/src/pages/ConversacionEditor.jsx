import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function ConversacionEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [conversacion, setConversacion] = useState(null);
    const [mensajes, setMensajes] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [senderId, setSenderId] = useState('');
    const [simulatedDate, setSimulatedDate] = useState('');
    const [simulatedTime, setSimulatedTime] = useState('');
    const [image, setImage] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversacion();
        fetchMensajes();
    }, [id]);

    useEffect(() => {
        scrollToBottom();
    }, [mensajes]);

    const fetchConversacion = () => {
        api.get(`/conversaciones/${id}/`)
            .then(res => {
                setConversacion(res.data);
                if (res.data.personajes.length > 0) {
                    setSenderId(res.data.personajes[0].id);
                }
            })
            .catch(err => console.error(err));
    };

    const fetchMensajes = () => {
        api.get(`/mensajes/?conversacion=${id}&ordering=orden`)
            .then(res => setMensajes(res.data))
            .catch(err => console.error(err));
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage && !image) return;

        const formData = new FormData();
        formData.append('conversacion', id);
        formData.append('personaje', senderId);
        if (newMessage) formData.append('mensaje', newMessage);
        if (image) formData.append('ruta_img', image);
        if (simulatedDate) formData.append('fecha_simulada', simulatedDate);
        if (simulatedTime) formData.append('hora_simulada', simulatedTime);

        // Auto-increment order
        const maxOrder = mensajes.length > 0 ? Math.max(...mensajes.map(m => m.orden)) : 0;
        formData.append('orden', maxOrder + 1);

        api.post('/mensajes/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(res => {
                setMensajes([...mensajes, res.data]);
                setNewMessage('');
                setImage(null);
            })
            .catch(err => console.error(err));
    };

    const handleDeleteMessage = (msgId) => {
        if (window.confirm("¿Eliminar mensaje?")) {
            api.delete(`/mensajes/${msgId}/`)
                .then(() => setMensajes(mensajes.filter(m => m.id !== msgId)))
                .catch(err => console.error(err));
        }
    };

    if (!conversacion) return <div>Cargando...</div>;

    const p1 = conversacion.personajes[0];
    const p2 = conversacion.personajes[1];

    return (
        <div className="chat-container" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 40px)', maxWidth: '600px', margin: '0 auto', border: '1px solid #333', borderRadius: '10px', overflow: 'hidden' }}>
            {/* Header */}
            <div className="chat-header" style={{ padding: '15px', backgroundColor: '#222', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button onClick={() => navigate('/conversaciones')} style={{ marginRight: '10px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>←</button>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1rem' }}>
                            {p1?.nombre} & {p2?.nombre}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#0d0d0d', backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundBlendMode: 'soft-light' }}>
                {mensajes.map(msg => {
                    const isP1 = msg.personaje === p1?.id;
                    return (
                        <div
                            key={msg.id}
                            style={{
                                display: 'flex',
                                justifyContent: isP1 ? 'flex-start' : 'flex-end',
                                marginBottom: '10px'
                            }}
                        >
                            <div
                                style={{
                                    maxWidth: '70%',
                                    padding: '10px',
                                    borderRadius: '10px',
                                    backgroundColor: isP1 ? '#202c33' : '#005c4b',
                                    color: '#e9edef',
                                    position: 'relative'
                                }}
                            >
                                {msg.ruta_img && (
                                    <img src={msg.ruta_img} alt="MMS" style={{ maxWidth: '100%', borderRadius: '5px', marginBottom: '5px' }} />
                                )}
                                <div style={{ fontSize: '0.95rem' }}>{msg.mensaje}</div>
                                <div style={{ fontSize: '0.7rem', color: '#8696a0', textAlign: 'right', marginTop: '5px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '5px' }}>
                                    {msg.hora_simulada || msg.fecha_simulada}
                                    <button
                                        onClick={() => handleDeleteMessage(msg.id)}
                                        style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', padding: 0, fontSize: '0.7rem' }}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="chat-input" style={{ padding: '15px', backgroundColor: '#202c33', borderTop: '1px solid #333' }}>
                <form onSubmit={handleSend}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <select
                            value={senderId}
                            onChange={e => setSenderId(parseInt(e.target.value))}
                            style={{ flex: 1, padding: '5px', borderRadius: '5px', backgroundColor: '#2a3942', color: '#fff', border: 'none' }}
                        >
                            {conversacion.personajes.map(p => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                        </select>
                        <input
                            type="date"
                            value={simulatedDate}
                            onChange={e => setSimulatedDate(e.target.value)}
                            style={{ padding: '5px', borderRadius: '5px', backgroundColor: '#2a3942', color: '#fff', border: 'none' }}
                        />
                        <input
                            type="time"
                            value={simulatedTime}
                            onChange={e => setSimulatedTime(e.target.value)}
                            style={{ padding: '5px', borderRadius: '5px', backgroundColor: '#2a3942', color: '#fff', border: 'none' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <label className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 10px' }}>
                            📷
                            <input type="file" hidden onChange={e => setImage(e.target.files[0])} accept="image/*" />
                        </label>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            placeholder="Escribe un mensaje..."
                            style={{ flex: 1, padding: '10px', borderRadius: '20px', backgroundColor: '#2a3942', color: '#fff', border: 'none' }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➤</button>
                    </div>
                    {image && <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '5px' }}>Imagen seleccionada: {image.name}</div>}
                </form>
            </div>
        </div>
    );
}

export default ConversacionEditor;
