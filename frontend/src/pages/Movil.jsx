import { useState } from 'react';

import ConversacionesList from './ConversacionesList';
import InstagramManager from './InstagramManager';

function Movil() {
    const [activeTab, setActiveTab] = useState('conversaciones'); // 'conversaciones', 'instagram'

    return (
        <div className="page-container">
            <div className="content-area" style={{ margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>Movil</h1>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {['conversaciones', 'instagram'].map(tab => (
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

                {activeTab === 'conversaciones' && <ConversacionesList />}
                {activeTab === 'instagram' && <InstagramManager />}
            </div>
        </div>
    );
}

export default Movil;
