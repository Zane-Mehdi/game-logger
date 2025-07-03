// src/components/Navigation.jsx
import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from './ThemeToggle'

const Navigation = () => {
    const { user, signOut } = useAuth()

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-brand">
                    <h1 className="logo">🎮 Game Logger</h1>
                </div>

                <div className="nav-links">
                    <ThemeToggle />
                    {user && (
                        <>
                            <div className="user-info">
                                <span className="user-email">{user.email}</span>
                            </div>
                            <button
                                onClick={signOut}
                                className="btn btn-secondary"
                            >
                                Sign Out
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navigation