import React, {useEffect, useState} from 'react';
import {useAuth} from '../contexts/AuthContext';
import {gameService} from '../services/supabase';
import {geminiAPI} from '../services/geminiAPI.js';
import GameCard from './GameCard';

const AIRecommendations = () => {
    const { user } = useAuth();
    const [recommendations, setRecommendations] = useState([]);
    const [allRecommendations, setAllRecommendations] = useState([]);
    const [visibleCount, setVisibleCount] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userHasGames, setUserHasGames] = useState(false);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!user) return;

            try {
                setLoading(true);
                const userGames = await gameService.getUserGames(user.id);
                setUserHasGames(userGames.length > 0);

                if (userGames.length > 0) {
                    const recommendedData = await geminiAPI.getRecommendations(userGames);
                    const geminiTitles = recommendedData.rawTitles?.map(title => title.toLowerCase()) || [];

                    const filtered = recommendedData.results?.filter(g => {
                        return !userGames.some(ug => ug.title.toLowerCase() === g.name.toLowerCase());
                    }) || [];


                    setAllRecommendations(filtered);
                    setRecommendations(filtered.slice(0, visibleCount));
                }
            } catch (err) {
                console.error("Error fetching AI recommendations:", err);
                setError("Sorry, we couldn't fetch recommendations at this time.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [user]);

    const handleLoadMore = () => {
        const next = allRecommendations.slice(0, visibleCount + 3);
        setRecommendations(next);
        setVisibleCount(next.length);
    };

    return (
        <div className="ai-recommendations">
            <div className="recommendations-header">
                <h2>✨ AI Recommendations</h2>
                <p>Based on your library, here are some games you might enjoy!</p>
            </div>

            {loading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Analyzing your library and finding hidden gems...</p>
                </div>
            )}

            {!loading && error && (
                <div className="error-container">
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && !userHasGames && (
                <div className="empty-recommendations">
                    <h3>Start Your Journey</h3>
                    <p>Add some games to your library first, and our AI will generate personalized recommendations for you here.</p>
                </div>
            )}

            {!loading && !error && userHasGames && recommendations.length > 0 && (
                <>
                    <div className="games-grid">
                        {recommendations.map(game => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </div>

                    {recommendations.length < allRecommendations.length && (
                        <div className="load-more-container">
                            <button onClick={handleLoadMore} className="btn btn-primary">
                                Load More
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AIRecommendations;
