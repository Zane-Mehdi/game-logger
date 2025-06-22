// src/services/rawgAPI.js
import axios from 'axios'

const API_KEY = "" // Intentionally empty to use mock data
const BASE_URL = 'https://api.rawg.io/api'

if (!API_KEY) {
    console.warn('Missing RAWG API key - using mock data')
}

// Create axios instance with default config
const rawgClient = axios.create({
    baseURL: BASE_URL,
    params: {
        key: API_KEY
    }
})

// Mock data for development
const mockGames = [
    {
        id: 3498,
        name: "Grand Theft Auto V",
        background_image: "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
        released: "2013-09-17",
        rating: 4.47,
        metacritic: 97,
        genres: [{ id: 4, name: "Action" }, { id: 3, name: "Adventure" }],
        platforms: [
            { platform: { id: 187, name: "PlayStation 5" } },
            { platform: { id: 4, name: "PC" } }
        ],
        stores: [
            { store: { id: 1, name: "Steam" } },
            { store: { id: 3, name: "PlayStation Store" } }
        ],
        description: "<p><strong>Grand Theft Auto V</strong> is an open world action-adventure game developed by Rockstar North. Players freely roam the open countryside and the fictional city of Los Santos, based on Los Angeles.</p>",
        developers: [ { name: "Rockstar North" } ],
        publishers: [ { name: "Rockstar Games" } ],
        screenshots: [
            "https://media.rawg.io/media/screenshots/1a1/1a1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e.jpg",
            "https://media.rawg.io/media/screenshots/2b2/2b2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e.jpg"
        ]
    },
    {
        id: 3328,
        name: "The Witcher 3: Wild Hunt",
        background_image: "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
        released: "2015-05-19",
        rating: 4.66,
        metacritic: 92,
        genres: [{ id: 4, name: "Action" }, { id: 5, name: "RPG" }],
        platforms: [
            { platform: { id: 18, name: "PlayStation 4" } },
            { platform: { id: 4, name: "PC" } }
        ],
        description: "<p><strong>The Witcher 3: Wild Hunt</strong> is a story-driven, open world RPG set in a visually stunning fantasy universe full of meaningful choices and impactful consequences.</p>",
        developers: [ { name: "CD Projekt Red" } ],
        publishers: [ { name: "CD Projekt" } ],
        screenshots: [
            "https://media.rawg.io/media/screenshots/3c3/3c3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e.jpg",
            "https://media.rawg.io/media/screenshots/4d4/4d4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e.jpg"
        ]
    },
    {
        id: 1030,
        name: "Limbo",
        background_image: "https://media.rawg.io/media/games/942/9424d6bb763dc38d9378b488603c87fa.jpg",
        released: "2010-07-21",
        rating: 4.15,
        metacritic: 88,
        genres: [{ id: 7, name: "Puzzle" }, { id: 51, name: "Indie" }],
        platforms: [
            { platform: { id: 4, name: "PC" } },
            { platform: { id: 1, name: "Xbox One" } }
        ],
        description: "<p><strong>Limbo</strong> is a puzzle-platform video game developed by independent studio Playdead. The game is presented in black-and-white tones, using lighting, film grain effects and minimal ambient sounds to create an eerie atmosphere.</p>",
        developers: [ { name: "Playdead" } ],
        publishers: [ { name: "Playdead" } ],
        screenshots: [
            "https://media.rawg.io/media/screenshots/5e5/5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e.jpg"
        ]
    },
    {
        id: 4200,
        name: "Portal 2",
        background_image: "https://media.rawg.io/media/games/328/3283617cb7d75d67257fc58339188742.jpg",
        released: "2011-04-19",
        rating: 4.61,
        metacritic: 95,
        genres: [{ id: 7, name: "Puzzle" }, { id: 2, name: "Shooter" }],
        platforms: [
            { platform: { id: 4, name: "PC" } },
            { platform: { id: 16, name: "PlayStation 3" } }
        ],
        description: "<p><strong>Portal 2</strong> is a first-person puzzle-platform video game developed and published by Valve. The game features a series of puzzles that must be solved by teleporting the player's character and simple objects using the portal gun.</p>",
        developers: [ { name: "Valve" } ],
        publishers: [ { name: "Valve" } ],
        screenshots: [
            "https://media.rawg.io/media/screenshots/6f6/6f6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e.jpg"
        ]
    }
]

export const rawgAPI = {
    // Search for games
    async searchGames(query, options = {}) {
        try {
            // Use mock data if no API key
            if (!API_KEY) {
                return {
                    results: mockGames.filter(g =>
                        g.name.toLowerCase().includes(query.toLowerCase())
                    )
                }
            }

            const response = await rawgClient.get('/games', {
                params: {
                    search: query,
                    page_size: options.pageSize || 20,
                    page: options.page || 1,
                    ordering: options.ordering || '-rating',
                    ...options.filters
                }
            })

            return response.data
        } catch (error) {
            console.error('Error searching games:', error)
            throw error
        }
    },

    // Get detailed game information
    async getGameDetails(id) {
        try {
            console.log(id)
            console.log(mockGames.find(g => g.id === id))
            if (!API_KEY) {
                return mockGames.find(g => String(g.id) === String(id)) || null
            }

            const response = await rawgClient.get(`/games/${id}`)
            return response.data
        } catch (error) {
            console.error('Error fetching game details:', error)
            throw error
        }
    },

    // Get game screenshots
    async getGameScreenshots(id) {
        try {
            if (!API_KEY) {
                return { results: [] }
            }

            const response = await rawgClient.get(`/games/${id}/screenshots`)
            return response.data
        } catch (error) {
            console.error('Error fetching screenshots:', error)
            throw error
        }
    },

    // Get similar games
    async getSimilarGames(id) {
        try {
            if (!API_KEY) {
                return { results: mockGames.filter(g => g.id !== id).slice(0, 3) }
            }

            const response = await rawgClient.get(`/games/${id}/game-series`)
            return response.data
        } catch (error) {
            console.error('Error fetching similar games:', error)
            throw error
        }
    },

    // Get genres list
    async getGenres() {
        try {
            if (!API_KEY) {
                return {
                    results: [
                        { id: 4, name: "Action" },
                        { id: 51, name: "Indie" },
                        { id: 3, name: "Adventure" },
                        { id: 5, name: "RPG" },
                        { id: 2, name: "Shooter" },
                        { id: 7, name: "Puzzle" }
                    ]
                }
            }

            const response = await rawgClient.get('/genres')
            return response.data
        } catch (error) {
            console.error('Error fetching genres:', error)
            throw error
        }
    },

    // Get platforms list
    async getPlatforms() {
        try {
            if (!API_KEY) {
                return {
                    results: [
                        { id: 4, name: "PC" },
                        { id: 187, name: "PlayStation 5" },
                        { id: 1, name: "Xbox One" },
                        { id: 7, name: "Nintendo Switch" }
                    ]
                }
            }

            const response = await rawgClient.get('/platforms')
            return response.data
        } catch (error) {
            console.error('Error fetching platforms:', error)
            throw error
        }
    }
}