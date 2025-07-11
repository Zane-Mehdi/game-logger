const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const rawgRoutes = require('./api/rawg.js');
const supabaseRoutes = require('./api/supabase.js');
const geminiRoutes = require('./api/game-recommender.js');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/rawg', rawgRoutes);
app.use('/api/supabase', supabaseRoutes);
app.use('/api/game-recommender', geminiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



