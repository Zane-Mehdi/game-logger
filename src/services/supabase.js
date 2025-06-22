// src/services/supabase.js

// src/services/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Game-related database operations
export const gameService = {
    // Fetch all games for the current user
    async getUserGames(userId) {
        const { data, error } = await supabase
            .from('games')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    },

    // Add a game to user's library
    async addGame(gameData) {
        const { data, error } = await supabase
            .from('games')
            .insert([gameData])
            .select()

        if (error) throw error
        return data[0]
    },

    // Update game details (ratings, status, notes)
    async updateGame(gameId, updates) {
        const { data, error } = await supabase
            .from('games')
            .update(updates)
            .eq('id', gameId)
            .select()

        if (error) throw error
        return data[0]
    },

    // Remove a game from library
    async deleteGame(gameId) {
        const { error } = await supabase
            .from('games')
            .delete()
            .eq('id', gameId)

        if (error) throw error
    },

    // Check if a game is already in user's library
    async checkGameExists(userId, rawgId) {
        const { data, error } = await supabase
            .from('games')
            .select('id')
            .eq('user_id', userId)
            .eq('rawg_id', rawgId)
            .single()

        if (error && error.code !== 'PGRST116') throw error
        return !!data
    },

    // Get user's library stats
    async getUserStats(userId) {
        const { data, error } = await supabase
            .from('games')
            .select('status')
            .eq('user_id', userId)

        if (error) throw error

        const stats = {
            total: data.length,
            completed: data.filter(g => g.status === 'completed').length,
            playing: data.filter(g => g.status === 'playing').length,
            backlog: data.filter(g => g.status === 'backlog').length,
            dropped: data.filter(g => g.status === 'dropped').length,
            wishlist: data.filter(g => g.status === 'wishlist').length
        }

        return stats
    }
}