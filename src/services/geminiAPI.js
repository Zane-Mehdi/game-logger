// src/services/geminiAPI.js
const mockRecommendedGames = [
    {
        id: 5286,
        name: "Celeste",
        background_image: "https://media.rawg.io/media/games/5a4/5a44112251d70a25291cc33757220fce.jpg",
        released: "2018-01-25",
        rating: 4.5,
        metacritic: 94,
        genres: [{ id: 51, name: "Indie" }, { id: 83, name: "Platformer" }],
    },
    {
        id: 278,
        name: "BIOSCHOCK",
        background_image: "https://media.rawg.io/media/games/253/2534a46f3033d457597155824944c6a8.jpg",
        released: "2007-08-21",
        rating: 4.36,
        metacritic: 96,
        genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }],
    },
    {
        id: 13536,
        name: "Hollow Knight",
        background_image: "https://media.rawg.io/media/games/4cf/4cfc6b7f1850590a4634b08bfab308ab.jpg",
        released: "2017-02-24",
        rating: 4.5,
        metacritic: 87,
        genres: [{ id: 4, name: "Action" }, { id: 51, name: "Indie" }],
    }
];

import { rawgAPI } from './rawgAPI';

export const geminiAPI = {
    async getRecommendations(userGames) {
        console.log(userGames)
        const response = await fetch('/api/game-recommender', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ games: userGames })
        });

        console.log(response)

        const data = await response.json();

        if (!Array.isArray(data.recommendations)) {
            console.warn("Invalid response from Gemini function.");
            return { results: [], rawTitles: [] };
        }

        const rawTitles = data.recommendations;

        // Fetch RAWG data for each recommended title
        const results = [];
        for (const title of data.recommendations) {
            const searchRes = await rawgAPI.searchGames(title);
            const bestMatch = searchRes.results?.[0];
            if (
                bestMatch &&
                bestMatch.slug.toLowerCase().trim() !== "fire-out-of-control"
            ) {
                results.push(bestMatch);
            }
        }

        return { results, rawTitles };
    }
};

