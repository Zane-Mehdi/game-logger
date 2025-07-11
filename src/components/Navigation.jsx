import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import ThemeToggle from './ThemeToggle'
import {getLogoByTheme} from "../utils/getImage.jsx";

const Navigation = () => {
    const { user, signOut } = useAuth()
    const { theme } = useTheme()

    const logoSrc = getLogoByTheme(theme)


    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-brand">
                    <img src={logoSrc} width={50} height={50} alt="Game Logger Logo" />
                    <h1 className="logo">Game Logger</h1>
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
