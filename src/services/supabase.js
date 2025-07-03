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
        const res = await fetch('/.netlify/functions/supabase?stats=false', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return await res.json();
    },

    async addGame(gameData) {
        const token = await getJWT();
        const res = await fetch('/.netlify/functions/supabase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(gameData),
        });
        return await res.json();
    },

    async updateGame(gameId, updates) {
        const token = await getJWT();
        const res = await fetch('/.netlify/functions/supabase', {
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
        await fetch('/.netlify/functions/supabase', {
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
        const res = await fetch('/.netlify/functions/supabase?stats=true', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return await res.json();
    },
};
