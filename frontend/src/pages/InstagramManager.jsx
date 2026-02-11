import { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';

function InstagramManager() {
    const [perfil, setPerfil] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [editingPostId, setEditingPostId] = useState(null);

    // Profile Form State
    const [profileForm, setProfileForm] = useState({
        nombre_usuario: '',
        followers: 0,
        following: 0,
        ocupacion: '',
        descripcion1: '',
        descripcion2: ''
    });
    const [profileImage, setProfileImage] = useState(null);

    // Post Form State
    const [postForm, setPostForm] = useState({
        me_gusta: 0,
        fecha: ''
    });
    const [postImage, setPostImage] = useState(null);

    useEffect(() => {
        fetchPerfil();
    }, []);

    const fetchPerfil = () => {
        api.get('/instagram-perfil/')
            .then(res => {
                if (res.data.length > 0) {
                    const p = res.data[0];
                    setPerfil(p);
                    setPosts(p.posts || []);
                    setProfileForm({
                        nombre_usuario: p.nombre_usuario,
                        followers: p.followers,
                        following: p.following,
                        ocupacion: p.ocupacion || '',
                        descripcion1: p.descripcion1 || '',
                        descripcion2: p.descripcion2 || ''
                    });
                }
            })
            .catch(err => console.error(err));
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(profileForm).forEach(key => formData.append(key, profileForm[key]));
        if (profileImage) formData.append('imagen_perfil', profileImage);

        const request = perfil
            ? api.patch(`/instagram-perfil/${perfil.id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            : api.post('/instagram-perfil/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

        request.then(() => {
            setIsProfileModalOpen(false);
            fetchPerfil();
        }).catch(err => console.error(err));
    };

    const handleOpenPostModal = (post = null) => {
        if (post) {
            setEditingPostId(post.id);
            setPostForm({
                me_gusta: post.me_gusta,
                fecha: post.fecha ? post.fecha.split('T')[0] : ''
            });
        } else {
            setEditingPostId(null);
            setPostForm({ me_gusta: 0, fecha: '' });
        }
        setPostImage(null);
        setIsPostModalOpen(true);
    };

    const handleSavePost = (e) => {
        e.preventDefault();
        if (!perfil) return alert("Primero debes crear un perfil.");

        const formData = new FormData();
        formData.append('perfil', perfil.id);
        formData.append('me_gusta', postForm.me_gusta);
        if (postForm.fecha) formData.append('fecha', postForm.fecha);
        if (postImage) formData.append('imagen', postImage);

        const request = editingPostId
            ? api.patch(`/instagram-posts/${editingPostId}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            : api.post('/instagram-posts/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

        request.then(() => {
            setIsPostModalOpen(false);
            fetchPerfil(); // Refresh to get updated posts list
        }).catch(err => console.error(err));
    };

    const handleDeletePost = (id) => {
        if (window.confirm("¿Eliminar post?")) {
            api.delete(`/instagram-posts/${id}/`)
                .then(() => fetchPerfil())
                .catch(err => console.error(err));
        }
    };

    return (
        <div className="page-container">
            <div className="content-area" style={{ margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>Instagram Ficticio</h1>
                    <button className="btn btn-primary" onClick={() => setIsProfileModalOpen(true)}>
                        {perfil ? 'Editar Perfil' : 'Crear Perfil'}
                    </button>
                </div>

                {perfil && (
                    <div className="card" style={{ marginBottom: '30px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #e1306c' }}>
                            {perfil.imagen_perfil ? (
                                <img src={perfil.imagen_perfil} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', backgroundColor: '#333' }} />
                            )}
                        </div>
                        <div>
                            <h2 style={{ margin: '0 0 5px 0' }}>{perfil.nombre_usuario}</h2>
                            <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', color: '#ccc' }}>
                                <span><strong>{posts.length}</strong> posts</span>
                                <span><strong>{perfil.followers}</strong> followers</span>
                                <span><strong>{perfil.following}</strong> following</span>
                            </div>
                            <p style={{ margin: '10px 0 5px 0', fontWeight: 'bold' }}>{perfil.ocupacion}</p>
                            <p style={{ margin: '0', fontSize: '0.9rem' }}>{perfil.descripcion1}</p>
                            <p style={{ margin: '0', fontSize: '0.9rem' }}>{perfil.descripcion2}</p>
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h2>Posts</h2>
                    {perfil && <button className="btn btn-sm btn-outline" onClick={() => handleOpenPostModal()}>+ Nuevo Post</button>}
                </div>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                    {posts.map(post => (
                        <div key={post.id} className="card" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
                            <div style={{ height: '200px', backgroundColor: '#222' }}>
                                {post.imagen && <img src={post.imagen} alt="Post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                            </div>
                            <div style={{ padding: '10px', fontSize: '0.8rem' }}>
                                <div>❤️ {post.me_gusta}</div>
                                <div style={{ color: '#888' }}>{post.fecha ? new Date(post.fecha).toLocaleDateString() : 'Sin fecha'}</div>
                            </div>
                            <div style={{ position: 'absolute', top: '5px', right: '5px', display: 'flex', gap: '5px' }}>
                                <button className="btn btn-sm" style={{ padding: '2px 5px', background: 'rgba(0,0,0,0.5)' }} onClick={() => handleOpenPostModal(post)}>✎</button>
                                <button className="btn btn-sm" style={{ padding: '2px 5px', background: 'rgba(255,0,0,0.5)' }} onClick={() => handleDeletePost(post.id)}>🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Profile Modal */}
                <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title={perfil ? "Editar Perfil" : "Crear Perfil"}>
                    <form onSubmit={handleSaveProfile}>
                        <div className="form-group">
                            <label>Usuario</label>
                            <input type="text" value={profileForm.nombre_usuario} onChange={e => setProfileForm({ ...profileForm, nombre_usuario: e.target.value })} required />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Followers</label>
                                <input type="number" value={profileForm.followers} onChange={e => setProfileForm({ ...profileForm, followers: parseInt(e.target.value) })} />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Following</label>
                                <input type="number" value={profileForm.following} onChange={e => setProfileForm({ ...profileForm, following: parseInt(e.target.value) })} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Ocupación</label>
                            <input type="text" value={profileForm.ocupacion} onChange={e => setProfileForm({ ...profileForm, ocupacion: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Descripción 1</label>
                            <textarea value={profileForm.descripcion1} onChange={e => setProfileForm({ ...profileForm, descripcion1: e.target.value })} rows="2" />
                        </div>
                        <div className="form-group">
                            <label>Descripción 2</label>
                            <textarea value={profileForm.descripcion2} onChange={e => setProfileForm({ ...profileForm, descripcion2: e.target.value })} rows="2" />
                        </div>
                        <div className="form-group">
                            <label>Imagen de Perfil</label>
                            <input type="file" accept="image/*" onChange={e => setProfileImage(e.target.files[0])} />
                        </div>
                        <button type="submit" className="btn btn-primary">Guardar Perfil</button>
                    </form>
                </Modal>

                {/* Post Modal */}
                <Modal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} title={editingPostId ? "Editar Post" : "Nuevo Post"}>
                    <form onSubmit={handleSavePost}>
                        <div className="form-group">
                            <label>Me Gusta</label>
                            <input type="number" value={postForm.me_gusta} onChange={e => setPostForm({ ...postForm, me_gusta: parseInt(e.target.value) })} />
                        </div>
                        <div className="form-group">
                            <label>Fecha</label>
                            <input type="date" value={postForm.fecha} onChange={e => setPostForm({ ...postForm, fecha: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Imagen</label>
                            <input type="file" accept="image/*" onChange={e => setPostImage(e.target.files[0])} />
                        </div>
                        <button type="submit" className="btn btn-primary">Guardar Post</button>
                    </form>
                </Modal>
            </div>
        </div>
    );
}

export default InstagramManager;
