import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DiariosList from './DiariosList';
import TomosList from './TomosList';
import CapitulosList from './CapitulosList';
import PersonajesList from './PersonajesList';
import api from '../services/api';

function DiariosView() {
    const location = useLocation();

    // Initialize state from location.state if available, otherwise default
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'diarios');
    const [selectedDiarioId, setSelectedDiarioId] = useState(location.state?.selectedDiarioId || null);
    const [selectedTomoId, setSelectedTomoId] = useState(location.state?.selectedTomoId || null);
    const [expandedDiarios, setExpandedDiarios] = useState(location.state?.expandedDiarios || {});

    // Sidebar Data
    const [diarios, setDiarios] = useState([]);
    const [tomos, setTomos] = useState([]);
    const [capitulos, setCapitulos] = useState([]);

    useEffect(() => {
        fetchSidebarData();
    }, []);

    const fetchSidebarData = () => {
        Promise.all([
            api.get('/diarios/'),
            api.get('/tomos/'),
            api.get('/capitulos/')
        ]).then(([resDiarios, resTomos, resCapitulos]) => {
            setDiarios(resDiarios.data.sort((a, b) => a.orden - b.orden));
            setTomos(resTomos.data);
            setCapitulos(resCapitulos.data);
        }).catch(err => console.error("Error fetching sidebar data:", err));
    };

    const handleDiarioSelect = (diarioId) => {
        setSelectedDiarioId(diarioId);
        setActiveTab('tomos');
        setExpandedDiarios(prev => ({ ...prev, [diarioId]: true }));
    };

    const handleTomoSelect = (tomoId) => {
        setSelectedTomoId(tomoId);
        setActiveTab('capitulos');
        // Find diario for this tomo to expand it
        const tomo = tomos.find(t => t.id === tomoId);
        if (tomo) {
            setExpandedDiarios(prev => ({ ...prev, [tomo.diario]: true }));
            setSelectedDiarioId(tomo.diario);
        }
    };

    const toggleDiario = (diarioId) => {
        setExpandedDiarios(prev => ({ ...prev, [diarioId]: !prev[diarioId] }));
    };

    // Group Tomos by Diario for Sidebar
    const tomosByDiario = tomos.reduce((acc, tomo) => {
        if (!acc[tomo.diario]) acc[tomo.diario] = [];
        acc[tomo.diario].push(tomo);
        return acc;
    }, {});

    const getBreadcrumbs = () => {
        const items = [{ label: 'Diarios', tab: 'diarios', id: null }];

        if (selectedDiarioId) {
            const diario = diarios.find(d => d.id === selectedDiarioId);
            if (diario) {
                items.push({ label: diario.nombre, tab: 'tomos', id: diario.id });
            }
        }

        if (selectedTomoId) {
            const tomo = tomos.find(t => t.id === selectedTomoId);
            if (tomo) {
                items.push({ label: tomo.nombre, tab: 'capitulos', id: tomo.id });
            }
        }

        return items;
    };

    const handleBreadcrumbClick = (item) => {
        if (item.tab === 'diarios') {
            setSelectedDiarioId(null);
            setSelectedTomoId(null);
            setActiveTab('diarios');
            setExpandedDiarios({}); // Optional: collapse all? Or keep expanded? User didn't specify.
        } else if (item.tab === 'tomos') {
            setSelectedTomoId(null);
            setActiveTab('tomos');
        } else {
            setActiveTab(item.tab);
        }
    };

    return (
        <div className="page-container">
            {/* Persistent Sidebar - Hidden for Personajes */}
            {activeTab !== 'personajes' && (
                <div className="sidebar">
                    <div className="sidebar-header">
                        <h3>Navegación</h3>
                    </div>
                    <div className="sidebar-content">
                        {diarios.map(diario => {
                            const diarioTomos = tomosByDiario[diario.id] || [];
                            const diarioTomosCount = diarioTomos.length;
                            const isExpanded = expandedDiarios[diario.id];

                            return (
                                <div key={diario.id} className="nested-group">
                                    <div
                                        className={`nested-header ${isExpanded ? 'expanded' : ''} ${selectedDiarioId === diario.id ? 'active-diario' : ''}`}
                                        onClick={() => toggleDiario(diario.id)}
                                    >
                                        <span onClick={(e) => { e.stopPropagation(); handleDiarioSelect(diario.id); }}>
                                            {diario.nombre}
                                        </span>
                                        <span className="sidebar-count">{diarioTomosCount}</span>
                                    </div>
                                    <div className={`nested-items ${isExpanded ? 'show' : ''}`}>
                                        {diarioTomos.map(tomo => {
                                            const capCount = capitulos.filter(c => c.tomo === tomo.id).length;
                                            return (
                                                <div
                                                    key={tomo.id}
                                                    className={`nested-item ${selectedTomoId === tomo.id ? 'active' : ''}`}
                                                    onClick={() => handleTomoSelect(tomo.id)}
                                                >
                                                    <span>{tomo.nombre}</span>
                                                    <span className="sidebar-count">{capCount}</span>
                                                </div>
                                            );
                                        })}
                                        {diarioTomos.length === 0 && (
                                            <div className="nested-item" style={{ fontStyle: 'italic', color: '#666' }}>
                                                Sin tomos
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="content-area" style={{ width: '100%' }}>
                <div style={{ marginBottom: '20px' }}>
                    {/* Breadcrumbs */}
                    {activeTab !== 'personajes' && (
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.2rem', marginBottom: '10px', color: '#888' }}>
                            {getBreadcrumbs().map((item, index, arr) => (
                                <span key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                    <span
                                        onClick={() => handleBreadcrumbClick(item)}
                                        style={{
                                            cursor: 'pointer',
                                            color: index === arr.length - 1 ? '#fff' : '#888',
                                            fontWeight: index === arr.length - 1 ? 'bold' : 'normal',
                                            textDecoration: index !== arr.length - 1 ? 'underline' : 'none'
                                        }}
                                    >
                                        {item.label}
                                    </span>
                                    {index < arr.length - 1 && <span style={{ margin: '0 10px' }}>/</span>}
                                </span>
                            ))}
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {['diarios', 'tomos', 'capitulos', 'personajes'].map(tab => (
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
                </div>

                {activeTab === 'diarios' && (
                    <DiariosList onDiarioSelect={handleDiarioSelect} />
                )}
                {activeTab === 'tomos' && (
                    <TomosList
                        selectedDiarioId={selectedDiarioId}
                        onTomoSelect={handleTomoSelect}
                    />
                )}
                {activeTab === 'capitulos' && (
                    <CapitulosList selectedTomoId={selectedTomoId} />
                )}
                {activeTab === 'personajes' && <PersonajesList />}
            </div>
        </div>
    );
}

export default DiariosView;
