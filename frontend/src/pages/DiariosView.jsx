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
    const [personajes, setPersonajes] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        fetchSidebarData();
    }, []);

    const fetchSidebarData = () => {
        setLoadingData(true);
        Promise.all([
            api.get('/diarios/'),
            api.get('/tomos/'),
            api.get('/capitulos/'),
            api.get('/personajes/')
        ]).then(([resDiarios, resTomos, resCapitulos, resPersonajes]) => {
            setDiarios(resDiarios.data.sort((a, b) => (a.orden - b.orden) || (b.id - a.id)));
            setTomos(resTomos.data.sort((a, b) => (a.orden - b.orden) || (b.id - a.id)));
            setCapitulos(resCapitulos.data.sort((a, b) => (a.orden - b.orden) || (b.id - a.id)));
            setPersonajes(resPersonajes.data.sort((a, b) => b.id - a.id));
            setLoadingData(false);
        }).catch(err => {
            console.error("Error fetching data:", err);
            setLoadingData(false);
        });
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
        const tomo = tomos.find(t => t.id == tomoId);
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
            const diario = diarios.find(d => d.id == selectedDiarioId);
            if (diario) {
                items.push({ label: diario.nombre, tab: 'tomos', id: diario.id });
            }
        }

        if (selectedTomoId) {
            const tomo = tomos.find(t => t.id == selectedTomoId);
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
        } else if (item.tab === 'tomos') {
            setSelectedTomoId(null);
            setActiveTab('tomos');
        } else {
            setActiveTab(item.tab);
        }
    };

    if (loadingData && diarios.length === 0) {
        return <div className="page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>Cargando datos...</div>;
    }

    return (
        <div className="page-container">
            {/* Persistent Sidebar - Hidden for Personajes */}
            {activeTab !== 'personajes' && (
                <div className="sidebar">
                    <div className="sidebar-header">
                        <h3>Navegación</h3>
                        {loadingData && <span style={{ fontSize: '0.7rem', color: '#ffaa00' }}>Actualizando...</span>}
                    </div>
                    <div className="sidebar-content">
                        {diarios.map(diario => {
                            const diarioTomos = tomosByDiario[diario.id] || [];
                            const diarioTomosCount = diarioTomos.length;
                            const isExpanded = expandedDiarios[diario.id];

                            return (
                                <div key={diario.id} className="nested-group">
                                    <div
                                        className={`nested-header ${isExpanded ? 'expanded' : ''} ${selectedDiarioId == diario.id ? 'active-diario' : ''}`}
                                        onClick={() => toggleDiario(diario.id)}
                                    >
                                        <span onClick={(e) => { e.stopPropagation(); handleDiarioSelect(diario.id); }}>
                                            {diario.nombre}
                                        </span>
                                        <span className="sidebar-count">{diarioTomosCount}</span>
                                    </div>
                                    <div className={`nested-items ${isExpanded ? 'show' : ''}`}>
                                        {diarioTomos.map(tomo => {
                                            const capCount = capitulos.filter(c => c.tomo == tomo.id).length;
                                            return (
                                                <div
                                                    key={tomo.id}
                                                    className={`nested-item ${selectedTomoId == tomo.id ? 'active' : ''}`}
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
                    <DiariosList diarios={diarios} onRefresh={fetchSidebarData} onDiarioSelect={handleDiarioSelect} />
                )}
                {activeTab === 'tomos' && (
                    <TomosList
                        diarios={diarios}
                        tomos={tomos}
                        selectedDiarioId={selectedDiarioId}
                        onTomoSelect={handleTomoSelect}
                        onRefresh={fetchSidebarData}
                    />
                )}
                {activeTab === 'capitulos' && (
                    <CapitulosList
                        diarios={diarios}
                        tomos={tomos}
                        capitulos={capitulos}
                        selectedTomoId={selectedTomoId}
                        onRefresh={fetchSidebarData}
                    />
                )}
                {activeTab === 'personajes' && (
                    <PersonajesList
                        diarios={diarios}
                        personajes={personajes}
                        onRefresh={fetchSidebarData}
                    />
                )}
            </div>
        </div>
    );
}

export default DiariosView;
