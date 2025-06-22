// src/components/Library.jsx
import React, { useState, useEffect } from 'react'
import { gameService } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext'
import GameCard from './GameCard'
import { GAME_STATUS } from '../utils/constants'

const Library = () => {
    const [games, setGames] = useState([])
    const [filteredGames, setFilteredGames] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState('all')
    const [stats, setStats] = useState(null)
    const { user } = useAuth()

    useEffect(() => {
        if (user) {
            fetchGames()
            fetchStats()
        }
    }, [user])

    useEffect(() => {
        filterGames()
    }, [games, filter])

    const fetchGames = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await gameService.getUserGames(user.id)
            setGames(data)
        } catch (error) {
            console.error('Error fetching games:', error)
            setError('Failed to load your library')
        } finally {
            setLoading(false)
        }
    }

    const fetchStats = async () => {
        try {
            const userStats = await gameService.getUserStats(user.id)
            setStats(userStats)
        } catch (error) {
            console.error('Error fetching stats:', error)
        }
    }

    const filterGames = () => {
        if (filter === 'all') {
            setFilteredGames(games)
        } else {
            setFilteredGames(games.filter(game => game.status === filter))
        }
    }

    const handleRemoveGame = async (gameId) => {
        if (!window.confirm('Are you sure you want to remove this game from your library?')) {
            return
        }

        try {
            await gameService.deleteGame(gameId)
            setGames(games.filter(g => g.id !== gameId))
            fetchStats() // Update stats after removal
        } catch (error) {
            console.error('Error removing game:', error)
            alert('Failed to remove game. Please try again.')
        }
    }

    const handleUpdateGame = async (gameId, updates) => {
        try {
            const updatedGame = await gameService.updateGame(gameId, updates)
            setGames(games.map(g => g.id === gameId ? { ...g, ...updatedGame } : g))
            fetchStats() // Update stats after status change
        } catch (error) {
            console.error('Error updating game:', error)
            alert('Failed to update game. Please try again.')
        }
    }

    if (loading) {
        return (
            <div className="library-loading">
                <div className="loading-spinner"></div>
                <p>Loading your library...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={fetchGames} className="btn btn-primary">
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <div className="library">
            <div className="library-header">
                <h2>My Library</h2>
                {stats && (
                    <div className="library-stats">
                        <span className="stat-item">Total: {stats.total}</span>
                        <span className="stat-item">Playing: {stats.playing}</span>
                        <span className="stat-item">Completed: {stats.completed}</span>
                        <span className="stat-item">Backlog: {stats.backlog}</span>
                    </div>
                )}
            </div>

            <div className="library-filters">
                <button
                    onClick={() => setFilter('all')}
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                >
                    All ({games.length})
                </button>
                {Object.entries(GAME_STATUS).map(([key, value]) => {
                    const count = games.filter(g => g.status === key).length
                    return (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`filter-btn ${filter === key ? 'active' : ''}`}
                        >
                            {value} ({count})
                        </button>
                    )
                })}
            </div>

            {filteredGames.length === 0 ? (
                <div className="empty-library">
                    <p className="empty-message">
                        {filter === 'all'
                            ? "Your library is empty. Start by searching for games to add!"
                            : `No games with status "${GAME_STATUS[filter]}" in your library.`
                        }
                    </p>
                </div>
            ) : (
                <div className="games-grid">
                    {filteredGames.map(game => (
                        <GameCard
                            key={game.id}
                            game={game}
                            onRemove={handleRemoveGame}
                            onUpdate={handleUpdateGame}
                            libraryView={true}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Library