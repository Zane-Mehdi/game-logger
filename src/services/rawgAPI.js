export const rawgAPI = {
    async searchGames(query) {
        const res = await fetch(`/.netlify/functions/rawg?type=search&search=${encodeURIComponent(query)}`);
        const data = await res.json();
        return data;
    },

    async getGameDetails(id) {
        const res = await fetch(`/.netlify/functions/rawg?type=details&id=${id}`);
        const data = await res.json();
        return data;
    },

    async getGameScreenshots(id) {
        const res = await fetch(`/.netlify/functions/rawg?type=screenshots&id=${id}`);
        const data = await res.json();
        return data;
    },

    async getSimilarGames(id) {
        const res = await fetch(`/.netlify/functions/rawg?type=series&id=${id}`);
        const data = await res.json();
        return data;
    },

    async getGenres() {
        const res = await fetch(`/.netlify/functions/rawg?type=genres`);
        const data = await res.json();
        return data;
    },

    async getPlatforms() {
        const res = await fetch(`/.netlify/functions/rawg?type=platforms`);
        const data = await res.json();
        return data;
    }
};
