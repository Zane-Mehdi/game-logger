const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

router.use(async (req, res, next) => {
    req.supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY,
        {
            global: {
                headers: {
                    Authorization: req.headers.authorization || '',
                },
            },
        }
    );

    const {
        data: { user },
        error
    } = await req.supabase.auth.getUser();

    if (error || !user) {
        return res.status(401).json({ error: 'Unauthorised' });
    }

    req.userId = user.id;
    next();
});

router.get('/', async (req, res) => {
    try {
        const { stats } = req.query;
        const supabase = req.supabase;

        if (stats === 'true') {
            const { data, error } = await supabase
                .from('games')
                .select('status')
                .eq('user_id', req.userId);

            if (error) throw error;

            const statsResult = {
                total: data.length,
                completed: data.filter(g => g.status === 'completed').length,
                playing: data.filter(g => g.status === 'playing').length,
                backlog: data.filter(g => g.status === 'backlog').length,
                dropped: data.filter(g => g.status === 'dropped').length,
                wishlist: data.filter(g => g.status === 'wishlist').length,
            };

            return res.json(statsResult);
        } else {
            const { data, error } = await supabase
                .from('games')
                .select('*')
                .eq('user_id', req.userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return res.json(data);
        }
    } catch (err) {
        console.error('Supabase GET error:', err);
        res.status(500).json({ error: 'Internal Supabase server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const parsed = { ...req.body, user_id: req.userId };
        const { data, error } = await req.supabase
            .from('games')
            .insert([parsed])
            .select();

        if (error) throw error;
        res.json(data[0]);
    } catch (err) {
        console.error('Supabase POST error:', err);
        res.status(500).json({ error: 'Error saving game' });
    }
});

router.put('/', async (req, res) => {
    try {
        const { gameId, updates } = req.body;
        const { data, error } = await req.supabase
            .from('games')
            .update(updates)
            .eq('id', gameId)
            .eq('user_id', req.userId)
            .select();

        if (error) throw error;
        res.json(data[0]);
    } catch (err) {
        console.error('Supabase PUT error:', err);
        res.status(500).json({ error: 'Error updating game' });
    }
});

router.delete('/', async (req, res) => {
    try {
        const { gameId } = req.body;
        const { error } = await req.supabase
            .from('games')
            .delete()
            .eq('id', gameId)
            .eq('user_id', req.userId);

        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        console.error('Supabase DELETE error:', err);
        res.status(500).json({ error: 'Error deleting game' });
    }
});

module.exports = router;
