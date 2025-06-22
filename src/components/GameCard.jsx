// src/components/GameCard.jsx
import React, { useState } from 'react'
import { GAME_STATUS } from '../utils/constants'
import { Link } from 'react-router-dom'

const GameCard = ({ game, onAdd, onRemove, onUpdate, isInLibrary, libraryView = false }) => {
    const [isLoading, setIsLoading] = useState(false)

    // Format genres and platforms for display
    console.log(game)
    const genres = Array.isArray(game.genres)
        ? game.genres.map(g => g.name).join(', ')
        : game.genres || 'N/A'
    const platforms =
        Array.isArray(game.platforms) ?
            game.platforms?.map(p => p.platform.name).slice(0, 3).join(', '): game.platforms || 'N/A'

    const handleAction = async () => {
        setIsLoading(true)
        try {
            if (libraryView && onRemove) {
                await onRemove(game.id)
            } else if (!isInLibrary && onAdd) {
                await onAdd(game)
            }
        } catch (error) {
            console.error('Error performing action:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value
        if (onUpdate) {
            await onUpdate(game.id, { status: newStatus })
        }
    }

    return (
        <div className="game-card">
            <div className="game-card-image-container">
                <Link to={`/games/${game.rawg_id}`}>
                    <img
                        src={game.background_image || game.cover_url || '/placeholder-game.jpg'}
                        alt={game.name || game.title}
                        className="game-card-image"
                        loading="lazy"
                    />
                </Link>
                {game.metacritic && (
                    <div className="game-metacritic">
                        {game.metacritic}
                    </div>
                )}
            </div>

            <div className="game-card-content">
                <h3 className="game-card-title">
                    <Link to={`/games/${game.id}`}>{game.name || game.title}</Link>
                </h3>

                <div className="game-card-meta">
                    <p className="game-meta-item">
                        <span className="meta-label">Released:</span> {game.released || game.release_date || 'TBA'}
                    </p>
                    <p className="game-meta-item">
                        <span className="meta-label">Genres:</span> {genres}
                    </p>
                    <p className="game-meta-item">
                        <span className="meta-label">Platforms:</span> {platforms}
                    </p>
                    {game.rating && (
                        <p className="game-meta-item">
                            <span className="meta-label">Rating:</span> ⭐ {game.rating}/5
                        </p>
                    )}
                </div>

                {libraryView && game.status && (
                    <div className="game-status-container">
                        <select
                            value={game.status}
                            onChange={handleStatusChange}
                            className="game-status-select"
                        >
                            {Object.entries(GAME_STATUS).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                    </div>
                )}

                <button
                    onClick={handleAction}
                    disabled={isLoading || (!libraryView && isInLibrary)}
                    className={`btn ${libraryView ? 'btn-danger' : isInLibrary ? 'btn-secondary' : 'btn-primary'} btn-block`}
                >
                    {isLoading ? (
                        'Loading...'
                    ) : libraryView ? (
                        'Remove from Library'
                    ) : isInLibrary ? (
                        'In Library ✓'
                    ) : (
                        'Add to Library'
                    )}
                </button>
            </div>
        </div>
    )
}

export default GameCard