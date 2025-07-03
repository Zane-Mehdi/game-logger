// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import {supabase} from "../services/authclient.js";

const AuthContext = createContext({})

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Check active sessions and sets the user
        checkUser()

        // Listen for changes on auth state (sign in, sign out, etc.)
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null)
            setLoading(false)
        })

        return () => data.subscription.unsubscribe()
    }, [])

    const checkUser = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user || null)
        } catch (error) {
            console.error('Error checking user session:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const signUp = async (email, password) => {
        try {
            setError(null)
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: window.location.origin
                }
            })
            if (error) throw error
            return { data, error: null }
        } catch (error) {
            setError(error.message)
            return { data: null, error: error.message }
        }
    }

    const signIn = async (email, password) => {
        try {
            setError(null)
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })
            if (error) throw error
            return { data, error: null }
        } catch (error) {
            setError(error.message)
            return { data: null, error: error.message }
        }
    }

    const signOut = async () => {
        try {
            setError(null)
            const { error } = await supabase.auth.signOut()
            if (error) throw error
        } catch (error) {
            setError(error.message)
            console.error('Error signing out:', error)
        }
    }

    const value = {
        user,
        loading,
        error,
        signUp,
        signIn,
        signOut,
        clearError: () => setError(null)
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}