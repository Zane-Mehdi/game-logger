// src/App.jsx
import React from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Navigation from './components/Navigation'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import GameDetail from './pages/GameDetail'
import { Routes, Route } from 'react-router-dom'
import './styles/index.css'

const AppContent = () => {
    const { user, loading } = useAuth()

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
            <Routes>
                {user ? (
                    <>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/games/:id" element={<GameDetail />} />
                    </>
                ) : (
                    <Route path="/*" element={<Login />} />
                )}
            </Routes>
        </div>
    )
}

const App = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App