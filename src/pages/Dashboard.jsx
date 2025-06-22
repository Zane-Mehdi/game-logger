// src/pages/Dashboard.jsx
import React, { useState } from 'react'
import GameSearch from '../components/GameSearch'
import Library from '../components/Library'

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('search')

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="tabs">
                    <button
                        onClick={() => setActiveTab('search')}
                        className={`tab ${activeTab === 'search' ? 'active' : ''}`}
                    >
                        🔍 Search Games
                    </button>
                    <button
                        onClick={() => setActiveTab('library')}
                        className={`tab ${activeTab === 'library' ? 'active' : ''}`}
                    >
                        📚 My Library
                    </button>
                </div>
            </div>

            <div className="dashboard-content">
                {activeTab === 'search' ? <GameSearch /> : <Library />}
            </div>
        </div>
    )
}

export default Dashboard