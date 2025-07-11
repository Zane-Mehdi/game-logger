import {supabase} from "./authclient.js";

async function getJWT() {
    const {
        data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token;
}

export const gameService = {
    async getUserGames() {
        const token = await getJWT();
        const res = await fetch('/api/supabase?stats=false', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return await res.json();
    },

    async addGame(gameData) {
        const token = await getJWT();
        const res = await fetch('/api/supabase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(gameData),
        });
        return await res.json();
    },

    async checkGameExists(rawgId) {
        const games = await this.getUserGames(); // gets current user's games
        console.log(games)
        console.log(rawgId)
        return games.some(g => g.rawg_id === Number(rawgId));
    },

    async updateGame(gameId, updates) {
        const token = await getJWT();
        const res = await fetch('/api/supabase', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ gameId, updates }),
        });
        return await res.json();
    },

    async deleteGame(gameId) {
        const token = await getJWT();
        await fetch('/api/supabase', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ gameId }),
        });
    },

    async getUserStats() {
        const token = await getJWT();
        const res = await fetch('/api/supabase?stats=true', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return await res.json();
    },
};
