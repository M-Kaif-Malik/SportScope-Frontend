import React, { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { TennisSecondaryNavbar } from '../../components/layout/TennisSecondaryNavbar';
import { Footer } from '../../components/layout/Footer';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { fetchTennisTopRanked, fetchTennisTopTournaments } from '../../services/analyticsApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export default function TennisAnalytics() {
    const [topRanked, setTopRanked] = useState([]);
    const [tournaments, setTournaments] = useState([]);
    const [rankType, setRankType] = useState('atp'); // 'atp' or 'wta'
    const [loadingRanked, setLoadingRanked] = useState(true);
    const [loadingTournaments, setLoadingTournaments] = useState(true);

    const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71'];

    useEffect(() => {
        const loadRanked = async () => {
            setLoadingRanked(true);
            try {
                const res = await fetchTennisTopRanked(rankType, 10);
                if (res.success && res.rankings && Array.isArray(res.rankings.data)) {
                    // Map and sort the rankings data
                    setTopRanked(res.rankings.data.map(r => ({
                        name: r.player?.name || '',
                        points: r.points ? parseInt(r.points) : 0,
                        rank: r.rank || r.currentRank || ''
                    })).sort((a, b) => b.points - a.points));
                } else {
                    setTopRanked([]);
                }
            } catch (err) {
                console.error("Failed to fetch top ranked", err);
                setTopRanked([]);
            } finally {
                setLoadingRanked(false);
            }
        };
        loadRanked();
    }, [rankType]);

    useEffect(() => {
        const loadTournaments = async () => {
            setLoadingTournaments(true);
            try {
                const res = await fetchTennisTopTournaments(10);
                if (res.success) {
                    setTournaments(res.tournaments);
                }
            } catch (err) {
                console.error("Failed to fetch tournaments", err);
            } finally {
                setLoadingTournaments(false);
            }
        };
        loadTournaments();
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] p-3 rounded-lg shadow-lg">
                    <p className="font-inter text-[14px] font-bold text-[var(--color-on-surface)] mb-1">{label}</p>
                    <p className="font-inter text-[13px] text-[var(--color-primary)]">
                        {`Points: ${payload[0].value}`}
                    </p>
                    <p className="font-inter text-[12px] text-[var(--color-on-surface-variant)] mt-1">
                        {`Rank: #${payload[0].payload.rank}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-[var(--color-surface)] min-h-screen text-[var(--color-on-surface)] font-manrope">
            <Header />
            <TennisSecondaryNavbar />
            <main className="pt-[144px] pb-12 px-4 md:px-12 max-w-[1280px] mx-auto">
                <div className="mb-8">
                    <h1 className="font-manrope text-[32px] md:text-[40px] font-extrabold tracking-tight text-[var(--color-on-surface)] m-0 flex items-center gap-3">
                        <MaterialIcon name="sports_tennis" className="text-[var(--color-primary)] text-[36px]" />
                        Tennis Analytics
                    </h1>
                    <p className="font-inter text-[16px] text-[var(--color-on-surface-variant)] mt-2">
                        Insights into top-tier players and premier global tournaments.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Ranked Players */}
                    <div className="bg-[var(--color-surface-container-low)] p-6 rounded-xl border border-[var(--color-outline-variant)]/20 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-manrope text-[20px] font-bold flex items-center gap-2">
                                <MaterialIcon name="workspace_premium" className="text-[var(--color-secondary)]" />
                                Top Ranked Players
                            </h2>
                            <div className="flex bg-[var(--color-surface-variant)] rounded-lg p-1">
                                <button
                                    onClick={() => setRankType('atp')}
                                    className={`px-4 py-1.5 rounded-md font-inter text-[13px] font-bold tracking-wide uppercase transition-colors border-none cursor-pointer ${rankType === 'atp' ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm' : 'bg-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
                                >
                                    ATP
                                </button>
                                <button
                                    onClick={() => setRankType('wta')}
                                    className={`px-4 py-1.5 rounded-md font-inter text-[13px] font-bold tracking-wide uppercase transition-colors border-none cursor-pointer ${rankType === 'wta' ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm' : 'bg-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
                                >
                                    WTA
                                </button>
                            </div>
                        </div>

                        {loadingRanked ? (
                            <div className="h-[350px] bg-[var(--color-surface-container-high)] animate-pulse rounded-lg"></div>
                        ) : (
                            <div className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topRanked} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-outline-variant)" opacity={0.3} />
                                        <XAxis type="number" stroke="var(--color-on-surface-variant)" fontSize={12} />
                                        <YAxis dataKey="name" type="category" width={110} stroke="var(--color-on-surface-variant)" fontSize={12} fontWeight="bold" />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="points" name="Points" radius={[0, 4, 4, 0]}>
                                            {topRanked.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* Top Tournaments */}
                    <div className="bg-[var(--color-surface-container-low)] p-6 rounded-xl border border-[var(--color-outline-variant)]/20 shadow-sm">
                        <h2 className="font-manrope text-[20px] font-bold mb-6 flex items-center gap-2">
                            <MaterialIcon name="emoji_events" className="text-[var(--color-secondary)]" />
                            Premier Tournaments
                        </h2>

                        {loadingTournaments ? (
                            <div className="h-[350px] bg-[var(--color-surface-container-high)] animate-pulse rounded-lg"></div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[var(--color-outline-variant)]/30 text-[var(--color-on-surface-variant)] text-[13px] uppercase tracking-wider font-inter">
                                            <th className="py-3 px-4">Tournament</th>
                                            <th className="py-3 px-4 text-right">Matches Played</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tournaments.map((tournament, idx) => (
                                            <tr key={tournament.id || idx} className="border-b border-[var(--color-outline-variant)]/10 hover:bg-[var(--color-surface-variant)]/30 transition-colors">
                                                <td className="py-4 px-4 font-manrope text-[15px] font-semibold text-[var(--color-on-surface)]">
                                                    {tournament._id}
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <span className="inline-flex items-center justify-center bg-[var(--color-surface-variant)] text-[var(--color-on-surface)] px-3 py-1 rounded-full text-[12px] font-bold tracking-wider font-inter">
                                                        {tournament.matchCount} Matches
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {tournaments.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="py-8 text-center text-[var(--color-on-surface-variant)] font-inter text-[14px]">
                                                    No tournaments found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
