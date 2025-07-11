const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
    const API_KEY = process.env.RAWG_API_KEY;
    const BASE_URL = 'https://api.rawg.io/api';

    const { type, id, search, page = 1, pageSize = 20 } = req.query;

    if (!API_KEY) return res.status(500).json({ error: 'Missing RAWG API key' });

    const rawgClient = axios.create({
        baseURL: BASE_URL,
        params: { key: API_KEY },
    });

    try {
        let response;

        switch (type) {
            case 'search':
                response = await rawgClient.get('/games', {
                    params: { search, search_precise: false, page, page_size: pageSize },
                });
                break;
            case 'details':
                response = await rawgClient.get(`/games/${id}`);
                break;
            case 'screenshots':
                response = await rawgClient.get(`/games/${id}/screenshots`);
                break;
            case 'series':
                response = await rawgClient.get(`/games/${id}/game-series`);
                break;
            case 'genres':
                response = await rawgClient.get('/genres');
                break;
            case 'platforms':
                response = await rawgClient.get('/platforms');
                break;
            default:
                return res.status(400).json({ error: 'Invalid or missing type parameter' });
        }

        return res.json(response.data);
    } catch (err) {
        console.error('RAWG API error:', err);
        return res.status(500).json({ error: 'Internal RAWG server error' });
    }
});

module.exports = router;
