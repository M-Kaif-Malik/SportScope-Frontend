import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlayerCard } from './PlayerCard';

export const FeaturedPlayers = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedPlayers = async () => {
            setLoading(true);
            try {
                // Fetch elite players defined in the DB (f_players collection)
                const res = await fetch('http://localhost:5000/api/players/featured');
                const data = await res.json();

                let fetchedPlayers = [];
                if (data.players && data.players.length > 0) {
                    fetchedPlayers = data.players.map(p => ({
                        playerId: p.playerId,
                        name: p.name?.full || 'Unknown Player',
                        role: `${p.country?.name || 'Unknown'} • ${p.position || 'Player'}`,
                        img: p.image || 'https://via.placeholder.com/150'
                    }));
                }

                // If the DB doesn't have elite players yet, fetch a default list of 7 players
                if (fetchedPlayers.length === 0) {
                    const fallbackRes = await fetch('http://localhost:5000/api/players?limit=7');
                    const fallbackData = await fallbackRes.json();
                    if (fallbackData.players) {
                        fetchedPlayers = fallbackData.players.map(p => ({
                            playerId: p.playerId,
                            name: p.name?.full || 'Unknown Player',
                            role: `${p.country?.name || 'Unknown'} • ${p.position || 'Player'}`,
                            img: p.image || 'https://via.placeholder.com/150'
                        }));
                    }
                }

                setPlayers(fetchedPlayers);
            } catch (err) {
                console.error("Failed to fetch featured players:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedPlayers();
    }, []);

    return (
        <section className="w-full px-4 md:px-12 max-w-[1280px] mx-auto mt-16">
            <h2 className="text-center mb-10 font-manrope text-[32px] font-bold tracking-[-0.01em] text-[var(--color-primary)]">
                Featured Players
            </h2>
            {loading ? (
                <div className="flex justify-center py-10">
                    <span className="animate-pulse font-inter text-[var(--color-on-surface-variant)]">Loading elite performers...</span>
                </div>
            ) : (
                <div className="flex flex-wrap justify-center gap-8 md:gap-6">
                    {players.map((player) => (
                        <Link
                            to={`/player/${player.playerId}`}
                            key={player.playerId || player.name}
                            className="w-[calc(50%-16px)] md:w-[calc(25%-18px)] flex-shrink-0 no-underline"
                        >
                            <PlayerCard {...player} />
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
};
