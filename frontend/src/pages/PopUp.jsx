import { useState } from 'react';
import SaludosList from './SaludosList';
import RecuerdosLeticiaList from './RecuerdosLeticiaList';
import BienvenidasList from './BienvenidasList';
import LibroVisitasList from './LibroVisitasList';
import SeguridadList from './SeguridadList';

function PopUp() {
    const [activeTab, setActiveTab] = useState('editora'); // 'editora', 'recuerdos', 'saludos', 'libro-visitas', 'seguridad'

    return (
        <div className="page-container">
            <div className="content-area" style={{ margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>Pop-Up</h1>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {['editora', 'recuerdos', 'saludos', 'libro-visitas', 'seguridad'].map(tab => (
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

                {activeTab === 'editora' && <SaludosList />}
                {activeTab === 'recuerdos' && <RecuerdosLeticiaList />}
                {activeTab === 'saludos' && <BienvenidasList />}
                {activeTab === 'libro-visitas' && <LibroVisitasList />}
                {activeTab === 'seguridad' && <SeguridadList />}
            </div>
        </div>
    );
}

export default PopUp;
