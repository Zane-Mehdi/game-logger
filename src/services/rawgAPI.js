export const rawgAPI = {
    async searchGames(query) {
        const res = await fetch(`/api/rawg?type=search&search=${encodeURIComponent(query)}`);
        const data = await res.json();
        return data;
    },

    async getGameDetails(id) {
        const res = await fetch(`/apis/rawg?type=details&id=${id}`);
        const data = await res.json();
        return data;
    },

    async getGameScreenshots(id) {
        const res = await fetch(`/apis/rawg?type=screenshots&id=${id}`);
        const data = await res.json();
        return data;
    },

    async getSimilarGames(id) {
        const res = await fetch(`/apis/rawg?type=series&id=${id}`);
        const data = await res.json();
        return data;
    },

    async getGenres() {
        const res = await fetch(`/apis/rawg?type=genres`);
        const data = await res.json();
        return data;
    },

    async getPlatforms() {
        const res = await fetch(`/apis/rawg?type=platforms`);
        const data = await res.json();
        return data;
    }
};
