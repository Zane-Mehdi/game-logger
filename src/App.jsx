import React from 'react'
import { useAuth, AuthProvider } from './context/AuthContext'
import Navigation from './components/Navigation'
import GameSearch from './components/GameSearch'
import Library from './components/Library'
import Login from './components/Login'

const InnerApp = () => {
    const { user, loading } = useAuth()

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', color: '#e0e0e0' }}>
            <Navigation />
            {user ? (
                <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
                    <GameSearch />
                    <Library />
                </div>
            ) : (
                <Login />
            )}
        </div>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <InnerApp />
        </AuthProvider>
    )
}
