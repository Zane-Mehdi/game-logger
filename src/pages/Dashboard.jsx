// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import GameSearch from '../components/GameSearch';
import AIRecommendations from '../components/AIRecommendations';
import Library from "../components/Library.jsx";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('library'); // or 'recommendations'

    const renderContent = () => {
        switch (activeTab) {
            case 'library':
                return <Library />;
            case 'search':
                return <GameSearch />;
            case 'recommendations':
                return <AIRecommendations />;
            default:
                return <Library />;
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'library' ? 'active' : ''}`}
                        onClick={() => setActiveTab('library')}
                    >
                        My Library
                    </button>
                    <button
                        className={`tab ${activeTab === 'search' ? 'active' : ''}`}
                        onClick={() => setActiveTab('search')}
                    >
                        Search Games
                    </button>
                    <button
                        className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
                        onClick={() => setActiveTab('recommendations')}
                    >
                        AI Recommendations
                    </button>
                </div>
            </div>
            <div className="dashboard-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default Dashboard;