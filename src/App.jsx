// src/App.jsx
import React from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navigation from './components/Navigation'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './styles/index.css'

const AppContent = () => {
    const { user, loading } = useAuth()
    console.log("hello")

    if (loading) {
        return (
            <div className="app-loading">
                <div className="loading-spinner"></div>
                <p>Loading Game Logger...</p>
            </div>
        )
    }

    return (
        <div className="app">
            <Navigation />
            {user ? <Dashboard /> : <Login />}
        </div>
    )
}

const App = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    )
}

export default App