// src/components/GameSearch.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { rawgAPI } from '../services/rawgAPI'
import { gameService } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext'
import GameCard from './GameCard'

const GameSearch = () => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [libraryGames, setLibraryGames] = useState(new Set())
    const { user } = useAuth()

    // Fetch user's library to check which games are already added
    useEffect(() => {
        if (user) {
            fetchUserLibrary()
        }
    }, [user])

    const fetchUserLibrary = async () => {
        try {
            const games = await gameService.getUserGames(user.id)
            const gameIds = new Set(games.map(g => g.rawg_id))
            setLibraryGames(gameIds)
        } catch (error) {
            console.error('Error fetching library:', error)
        }
    }

    // Debounced search function
    const searchGames = useCallback(async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([])
            return
        }

        setLoading(true)
        setError(null)

        try {
            const data = await rawgAPI.searchGames(searchQuery)
            setResults(data.results || [])
        } catch (error) {
            console.error('Error searching games:', error)
            setError('Failed to search games. Please try again.')
            setResults([])
        } finally {
            setLoading(false)
        }
    }, [])

    // Handle search input change with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (query) {
                searchGames(query)
            } else {
                setResults([])
            }
        }, 500) // 500ms debounce

        return () => clearTimeout(timeoutId)
    }, [query, searchGames])

    const handleAddGame = async (game) => {
        try {
            const gameData = {
                user_id: user.id,
                rawg_id: game.id,
                title: game.name,
                cover_url: game.background_image,
                genres: game.genres?.map(g => g.name).join(', '),
                platforms: game.platforms?.map(p => p.platform.name).join(', '),
                release_date: game.released,
                metacritic: game.metacritic,
                rating: game.rating,
                status: 'backlog'
            }

            await gameService.addGame(gameData)

            // Update local state to reflect the addition
            setLibraryGames(prev => new Set([...prev, game.id]))

            // Show success message (you could use a toast library here)
            alert(`${game.name} has been added to your library!`)
        } catch (error) {
            console.error('Error adding game:', error)
            if (error.message.includes('duplicate')) {
                alert('This game is already in your library!')
            } else {
                alert('Failed to add game. Please try again.')
            }
        }
    }

    const handleClearSearch = () => {
        setQuery('')
        setResults([])
        setError(null)
    }

    return (
        <div className="game-search">
            <div className="search-header">
                <h2>Search Games</h2>
                <p className="search-subtitle">Find and add games to your personal library</p>
            </div>

            <div className="search-input-container">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for games..."
                    className="search-input"
                    autoFocus
                />
                {query && (
                    <button
                        onClick={handleClearSearch}
                        className="search-clear-btn"
                        aria-label="Clear search"
                    >
                        ✕
                    </button>
                )}
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {loading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Searching for games...</p>
                </div>
            )}

            {!loading && results.length > 0 && (
                <div className="search-results">
                    <p className="results-count">Found {results.length} games</p>
                    <div className="games-grid">
                        {results.map(game => (
                            <GameCard
                                key={game.id}
                                game={game}
                                onAdd={handleAddGame}
                                isInLibrary={libraryGames.has(game.id)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {!loading && query && results.length === 0 && (
                <div className="no-results">
                    <p>No games found for "{query}"</p>
                    <p className="no-results-hint">Try searching with different keywords</p>
                </div>
            )}
        </div>
    )
}

export default GameSearch