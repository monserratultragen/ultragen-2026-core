import { useEffect, useState } from 'react';
import api from '../services/api';

function Dashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        api.get('/dashboard-stats/')
            .then(res => setStats(res.data))
            .catch(err => console.error(err));
    }, []);

    if (!stats) return <div className="page-container"><div className="content-area">Cargando...</div></div>;

    return (
        <div className="page-container">
            <div className="content-area" style={{ margin: '0 auto' }}>
                <h1 style={{ marginBottom: '20px' }}>Dashboard</h1>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                    <StatCard
                        title="Diarios"
                        count={stats.diarios?.total}
                        details={`${stats.diarios?.tomos} Tomos, ${stats.diarios?.capitulos} Caps, ${stats.diarios?.personajes} Pers`}
                        icon="📖"
                    />
                    <StatCard
                        title="Móvil"
                        count={stats.movil?.total}
                        details={`${stats.movil?.conversaciones} Conv (${stats.movil?.mensajes} Msgs), ${stats.movil?.perfiles} Perfiles (${stats.movil?.posts} Posts)`}
                        icon="📱"
                    />
                    <StatCard
                        title="Expedientes"
                        count={stats.expedientes?.total}
                        details={`${stats.expedientes?.imagenes} Imágenes`}
                        icon="🗂️"
                    />
                    <StatCard
                        title="Tablet"
                        count={stats.tablet?.total}
                        details={`${stats.tablet?.slides} Slides`}
                        icon="💊"
                    />
                    <StatCard
                        title="Tableros"
                        count={stats.pistas?.total}
                        details={`${stats.pistas?.tableros} Tableros`}
                        icon="🧩"
                    />
                    <StatCard
                        title="Laptop"
                        count={stats.laptop?.total}
                        details={`${stats.laptop?.cyborgs} Cyb, ${stats.laptop?.humanos} Hum, ${stats.laptop?.compras} Compras`}
                        icon="💻"
                    />
                    <StatCard
                        title="Pop-Up"
                        count={stats.popup?.total}
                        details={`${stats.popup?.saludos} Ed, ${stats.popup?.recuerdos} Rec, ${stats.popup?.bienvenidas} Sal, ${stats.popup?.visitas} Vis, ${stats.popup?.seguridad} Seg`}
                        icon="💬"
                    />
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, count, details, icon }) {
    return (
        <div className="card" style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '2.5rem' }}>{icon}</div>
            <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0', fontSize: '1.1rem', color: '#aaa' }}>{title}</h3>
                <p style={{ margin: '0', fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>{count}</p>
                {details && <p style={{ margin: '0', fontSize: '0.75rem', color: '#666', lineHeight: '1.2' }}>{details}</p>}
            </div>
        </div>
    );
}

export default Dashboard;
