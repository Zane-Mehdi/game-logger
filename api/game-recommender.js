const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // Make sure to install node-fetch

router.post('/', async (req, res) => {
    const headers = { 'Content-Type': 'application/json' };

    try {
        const { games } = req.body;

        if (!Array.isArray(games) || games.length === 0) {
            return res.status(400).json({ error: 'Games list is required' });
        }

        const gameNames = games.map(g => g.name || g.title).filter(Boolean).join(', ');
        const prompt = `You are a game recommendation assistant. Based on the following list of games: ${gameNames}, suggest 15 similar games. Return ONLY a JSON array like ["Game A", "Game B", "Game C".... etc]. RAWGAPI exact Specific Names. No explanation.`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 200, temperature: 0.7 }
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

        if (!rawText) return res.status(500).json({ error: 'Empty response from Gemini' });

        let recommendations = [];
        try {
            let cleaned = rawText;
            if (cleaned.startsWith("```")) {
                cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
            }
            recommendations = JSON.parse(cleaned);
            if (!Array.isArray(recommendations)) throw new Error();
        } catch (err) {
            return res.status(500).json({ error: 'Invalid format from Gemini', rawResponse: rawText });
        }

        res.json({ recommendations });

    } catch (err) {
        console.error('Gemini error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
