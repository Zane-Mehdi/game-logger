export const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    const API_KEY = process.env.RAWG_API_KEY;
    const BASE_URL = 'https://api.rawg.io/api';

    const axios = await import('axios').then(mod => mod.default);

    const rawgClient = axios.create({
        baseURL: BASE_URL,
        params: { key: API_KEY },
    });

    try {
        const { type, id, search, page = 1, pageSize = 20 } = event.queryStringParameters || {};

        if (!API_KEY) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Missing RAWG API key' }),
            };
        }

        let response;

        switch (type) {
            case 'search':
                response = await rawgClient.get('/games', {
                    params: {
                        search,
                        search_precise: true,
                        search_exact: true,
                        page,
                        page_size: pageSize
                    }
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
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid or missing type parameter' }),
                };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(response.data),
        };
    } catch (error) {
        console.error('RAWG function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal RAWG server error' }),
        };
    }
};