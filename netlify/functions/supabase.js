// netlify/functions/supabase.js

export const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    const { createClient } = await import('@supabase/supabase-js');

    const authHeader = event.headers?.authorization || '';
    const jwt = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            },
        }
    );

    // 🧠 Extract user from JWT
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Unauthorised' }),
        };
    }

    const userId = user.id;
    const { httpMethod, body, queryStringParameters } = event;

    try {
        switch (httpMethod) {
            case 'GET': {
                if (queryStringParameters?.stats === 'true') {
                    const { data, error } = await supabase
                        .from('games')
                        .select('status')
                        .eq('user_id', userId);

                    if (error) throw error;

                    const stats = {
                        total: data.length,
                        completed: data.filter(g => g.status === 'completed').length,
                        playing: data.filter(g => g.status === 'playing').length,
                        backlog: data.filter(g => g.status === 'backlog').length,
                        dropped: data.filter(g => g.status === 'dropped').length,
                        wishlist: data.filter(g => g.status === 'wishlist').length,
                    };

                    return { statusCode: 200, headers, body: JSON.stringify(stats) };
                } else {
                    const { data, error } = await supabase
                        .from('games')
                        .select('*')
                        .eq('user_id', userId)
                        .order('created_at', { ascending: false });

                    if (error) throw error;
                    return { statusCode: 200, headers, body: JSON.stringify(data) };
                }
            }

            case 'POST': {
                const parsed = JSON.parse(body);
                parsed.user_id = userId;

                const { data, error } = await supabase
                    .from('games')
                    .insert([parsed])
                    .select();

                if (error) throw error;
                return { statusCode: 200, headers, body: JSON.stringify(data[0]) };
            }

            case 'PUT': {
                const parsed = JSON.parse(body);
                const { gameId, updates } = parsed;
                const { data, error } = await supabase
                    .from('games')
                    .update(updates)
                    .eq('id', gameId)
                    .eq('user_id', userId)
                    .select();

                if (error) throw error;
                return { statusCode: 200, headers, body: JSON.stringify(data[0]) };
            }

            case 'DELETE': {
                const parsed = JSON.parse(body);
                const { gameId } = parsed;
                const { error } = await supabase
                    .from('games')
                    .delete()
                    .eq('id', gameId)
                    .eq('user_id', userId);

                if (error) throw error;
                return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
            }

            default:
                return { statusCode: 405, headers, body: 'Method Not Allowed' };
        }
    } catch (error) {
        console.error('Supabase function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal Supabase server error' }),
        };
    }
};