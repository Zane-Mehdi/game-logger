import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { rawgAPI } from '../services/rawgAPI'
import { gameService } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext'
const GameDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isInLibrary, setIsInLibrary] = useState(false)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true)
      setError(null)
      try {
        if (!id) {
          setError('Invalid game ID.')
          return
        }
        const data = await rawgAPI.getGameDetails(id)
        setGame(data)

        if (user) {
          const exists = await gameService.checkGameExists(user.id, String(id))
          setIsInLibrary(exists)
        }
      } catch (err) {
        setError('Failed to load game details.')
      } finally {
        setLoading(false)
      }
    }
    fetchGame()
  }, [id, user])

  const handleAddToLibrary = async () => {
    if (!user || !game) return
    setAdding(true)
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
      setIsInLibrary(true)
      alert(`${game.name} added to your library!`)
    } catch (error) {
      console.error('Error adding game:', error)
      alert('Failed to add game.')
    } finally {
      setAdding(false)
    }
  }

  return (
      <div className="game-detail">
        <div style={{ marginBottom: '1rem' }}>
          <button
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '8px' }}
          >
            ← Back
          </button>
        </div>

        {loading && <div className="game-detail-loading">Loading...</div>}
        {error && <div className="game-detail-error">{error}</div>}
        {!loading && !error && !game && <div className="game-detail-empty">Game not found.</div>}

        {!loading && !error && game && (
            <>
              <h2>{game.name}</h2>
              <img src={game.background_image} alt={game.name} className="game-detail-image" />
              <div className="game-detail-meta">
                <p><strong>Released:</strong> {game.released}</p>
                <p><strong>Genres:</strong> {Array.isArray(game.genres) ? game.genres.map(g => g.name).join(', ') : game.genres}</p>
                <p><strong>Platforms:</strong> {Array.isArray(game.platforms) ? game.platforms.map(p => p.platform.name).join(', ') : game.platforms}</p>
                {game.metacritic && <p><strong>Metacritic:</strong> {game.metacritic}</p>}
                {game.rating && <p><strong>Rating:</strong> ⭐ {game.rating}/5</p>}
                {game.developers && <p><strong>Developer:</strong> {game.developers.map(d => d.name).join(', ')}</p>}
                {game.publishers && <p><strong>Publisher:</strong> {game.publishers.map(p => p.name).join(', ')}</p>}
              </div>

              {game.screenshots && (
                  <div style={{ display: 'flex', overflowX: 'auto', gap: '1rem', marginBottom: '1rem' }}>
                    {game.screenshots.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`Screenshot ${index + 1}`}
                            style={{ maxHeight: '200px', borderRadius: '8px' }}
                        />
                    ))}
                  </div>
              )}

              {!isInLibrary && (
                  <button
                      className="btn btn-primary"
                      onClick={handleAddToLibrary}
                      disabled={adding}
                  >
                    {adding ? 'Adding...' : 'Add to Library'}
                  </button>
              )}

              {game.description && (
                  <div className="game-detail-description" dangerouslySetInnerHTML={{ __html: game.description }} />
              )}
            </>
        )}
      </div>
  )
}

export default GameDetail