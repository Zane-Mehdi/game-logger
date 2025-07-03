export const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
    };

    console.log("Method received:", event.httpMethod);

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        const { games } = JSON.parse(event.body);

        if (!Array.isArray(games) || games.length === 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Games list is required' }),
            };
        }

        const gameNames = games.map(g => g.name || g.title).filter(Boolean).join(', ');
        const prompt = `You are a game recommendation assistant. Based on the following list of games: ${gameNames}, suggest 15 similar games. Return ONLY a JSON array like ["Game A", "Game B", "Game C", "Game D", "Game E".... etc etc]. RAWGAPI exact Specific Names. Do not explain or add anything else. NOT JSON`;

        console.log("Gemini prompt:\n", prompt);

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 200, temperature: 0.7 }
        };

        const response = await fetch(apiUrl, {
            skip: true,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.error) {
            console.error('Gemini API Error:', result.error.message);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Failed to get a response from the recommendation engine.' }),
            };
        }

        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        console.log("Gemini raw response:", text);

        if (!text) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Recommendation engine returned an empty response.' }),
            };
        }

        let recommendations = [];
        try {
            let cleaned = text.trim();

            // Remove code block markers if present
            if (cleaned.startsWith("```")) {
                cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
            }

            recommendations = JSON.parse(cleaned);

            if (!Array.isArray(recommendations)) throw new Error("Not a valid array");
        } catch (err) {
            console.error("Failed to parse Gemini response:", text);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Invalid format from Gemini response.',
                    rawResponse: text
                }),
            };
        }



        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ recommendations }),
        };

    } catch (error) {
        console.error('Gemini game recommender error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
