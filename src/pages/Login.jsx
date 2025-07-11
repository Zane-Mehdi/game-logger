// src/pages/Login.jsx
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [loading, setLoading] = useState(false)
    const { signIn, signUp, error, clearError } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Basic validation
        if (!email || !password) {
            alert('Please fill in all fields')
            return
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters')
            return
        }

        setLoading(true)
        clearError()

        try {
            if (isSignUp) {
                const { error } = await signUp(email, password)
                if (!error) {
                    alert('Account created! Please check your email to confirm your account.')
                    setIsSignUp(false)
                }
            } else {
                await signIn(email, password)
            }
        } catch (err) {
            console.error('Auth error:', err)
        } finally {
            setLoading(false)
        }
    }

    const toggleMode = () => {
        setIsSignUp(!isSignUp)
        clearError()
        // Clear form
        setEmail('')
        setPassword('')
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-box">
                    <div className="auth-header">
                        <h1 className="auth-logo">🎮 Game Logger</h1>
                        <h2 className="auth-title">
                            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
                        </h2>
                        <p className="auth-subtitle">
                            {isSignUp
                                ? 'Start tracking your gaming journey'
                                : 'Sign in to access your game library'
                            }
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="form-input"
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
                                required
                                minLength={6}
                                className="form-input"
                                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                            />
                            {isSignUp && (
                                <p className="form-hint">Password must be at least 6 characters</p>
                            )}
                        </div>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-block auth-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="btn-loading">
                  <span className="loading-spinner-small"></span>
                                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </span>
                            ) : (
                                isSignUp ? 'Create Account' : 'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p className="auth-switch-text">
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                            {' '}
                            <button
                                type="button"
                                onClick={toggleMode}
                                className="auth-switch-btn"
                            >
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>
                    </div>
                </div>

                <div className="auth-features">
                    <h3>Why Game Logger?</h3>
                    <ul className="features-list">
                        <li>🎯 Track your gaming progress</li>
                        <li>🏆 Manage your game backlog</li>
                        <li>🔍 Discover new games to play</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Login