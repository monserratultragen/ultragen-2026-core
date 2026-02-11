import { useState, useEffect } from 'react';
import api from '../services/api';

function UniversalLoader() {
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);

    useEffect(() => {
        fetchModels();
    }, []);

    useEffect(() => {
        if (selectedModel) {
            fetchData(selectedModel);
        } else {
            setData([]);
            setColumns([]);
        }
    }, [selectedModel]);

    const fetchModels = () => {
        api.get('/universal-loader/')
            .then(res => setModels(res.data))
            .catch(err => console.error("Error fetching models:", err));
    };

    const fetchData = (modelName) => {
        setLoading(true);
        setError(null);
        api.get(`/universal-loader/data/${modelName}/`)
            .then(res => {
                setData(res.data);
                if (res.data.length > 0) {
                    setColumns(Object.keys(res.data[0]));
                } else {
                    setColumns([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setError("Error al cargar datos.");
                setLoading(false);
            });
    };

    const handleDownloadTemplate = () => {
        if (!selectedModel) return;
        // Trigger download directly via browser
        window.open(`${api.defaults.baseURL}/universal-loader/template/${selectedModel}/`, '_blank');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file || !selectedModel) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploadStatus("Subiendo...");
        api.post(`/universal-loader/import/${selectedModel}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(res => {
                setUploadStatus(`Carga completada: ${res.data.rows_created} registros creados.`);
                fetchData(selectedModel); // Refresh data
                setTimeout(() => setUploadStatus(null), 5000);
            })
            .catch(err => {
                console.error("Error uploading file:", err);
                setUploadStatus("Error en la carga.");
            });
    };

    return (
        <div className="page-container">
            <div className="content-area" style={{ margin: '0 auto', padding: '20px' }}>
                <h1>Universal Data Manager</h1>

                {/* Model Selector */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ marginRight: '10px' }}>Seleccionar Tabla (Modelo):</label>
                    <select
                        value={selectedModel}
                        onChange={e => setSelectedModel(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px' }}
                    >
                        <option value="">-- Seleccione --</option>
                        {models.map(m => (
                            <option key={m.name} value={m.name}>{m.verbose_name} ({m.name})</option>
                        ))}
                    </select>
                </div>

                {/* Toolbar */}
                <div style={{
                    display: 'flex',
                    gap: '15px',
                    padding: '15px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    alignItems: 'center',
                    border: '1px solid #ddd'
                }}>
                    <button className="btn btn-primary" disabled={!selectedModel} onClick={() => alert("Funcionalidad de agregar individualmente pendiente.")}>
                        + Nuevo Registro
                    </button>

                    <div style={{ height: '20px', width: '1px', backgroundColor: '#ccc' }}></div>

                    <button className="btn btn-outline" disabled={!selectedModel} onClick={handleDownloadTemplate}>
                        📥 Descargar Plantilla .xlsx
                    </button>

                    <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                        <button className="btn btn-outline" disabled={!selectedModel}>
                            📤 Cargar Excel
                        </button>
                        <input
                            type="file"
                            accept=".xlsx"
                            onChange={handleFileUpload}
                            disabled={!selectedModel}
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                opacity: 0,
                                width: '100%',
                                height: '100%',
                                cursor: 'pointer'
                            }}
                        />
                    </div>

                    {uploadStatus && <span style={{ marginLeft: '10px', fontWeight: 'bold', color: '#333' }}>{uploadStatus}</span>}
                </div>

                {/* Data Table */}
                {loading && <p>Cargando datos...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {!loading && !error && selectedModel && (
                    <div className="table-container" style={{ overflowX: 'auto' }}>
                        {data.length === 0 ? (
                            <p style={{ color: '#666', fontStyle: 'italic' }}>No hay registros en esta tabla.</p>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#eee', textAlign: 'left' }}>
                                        {columns.map(col => (
                                            <th key={col} style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                            {columns.map(col => (
                                                <td key={`${idx}-${col}`} style={{ padding: '8px' }}>
                                                    {typeof row[col] === 'object' && row[col] !== null ? JSON.stringify(row[col]) : String(row[col])}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UniversalLoader;
