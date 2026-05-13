import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { SecondaryNavbar } from '../components/layout/SecondaryNavbar';
import { Footer } from '../components/layout/Footer';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { fetchCricketTopTeams, fetchCricketRecentMatches, fetchCricketPlayersByCountry } from '../services/analyticsApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';

export default function CricketAnalytics() {
    const [topTeams, setTopTeams] = useState([]);
    const [recentMatches, setRecentMatches] = useState([]);
    const [playersByCountry, setPlayersByCountry] = useState([]);
    const [loading, setLoading] = useState(true);

    const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71'];

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [teamsRes, matchesRes, playersRes] = await Promise.all([
                    fetchCricketTopTeams(10),
                    fetchCricketRecentMatches(5),
                    fetchCricketPlayersByCountry(8)
                ]);
                
                if (teamsRes.success) setTopTeams(teamsRes.teams.map(t => ({ name: t._id, matches: t.matchCount })));
                if (matchesRes.success) setRecentMatches(matchesRes.matches);
                if (playersRes.success) setPlayersByCountry(playersRes.countries.map(c => ({ name: c.countryName || c._id, count: c.playerCount })));
            } catch (err) {
                console.error("Failed to fetch analytics data", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] p-3 rounded-lg shadow-lg">
                    <p className="font-inter text-[14px] font-bold text-[var(--color-on-surface)] mb-1">{label}</p>
                    <p className="font-inter text-[13px] text-[var(--color-primary)]">
                        {`${payload[0].name}: ${payload[0].value}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-[var(--color-surface)] min-h-screen text-[var(--color-on-surface)] font-manrope">
            <Header />
            <SecondaryNavbar />
            <main className="pt-[144px] pb-12 px-4 md:px-12 max-w-[1280px] mx-auto">
                <div className="mb-8">
                    <h1 className="font-manrope text-[32px] md:text-[40px] font-extrabold tracking-tight text-[var(--color-on-surface)] m-0 flex items-center gap-3">
                        <MaterialIcon name="analytics" className="text-[var(--color-primary)] text-[36px]" />
                        Cricket Analytics
                    </h1>
                    <p className="font-inter text-[16px] text-[var(--color-on-surface-variant)] mt-2">
                        Insights and statistics from recent matches and player distributions.
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-[400px] bg-[var(--color-surface-container-high)] animate-pulse rounded-xl border border-[var(--color-outline-variant)]/10 ${i === 3 ? 'lg:col-span-2' : ''}`}></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Top Teams Chart */}
                        <div className="bg-[var(--color-surface-container-low)] p-6 rounded-xl border border-[var(--color-outline-variant)]/20 shadow-sm">
                            <h2 className="font-manrope text-[20px] font-bold mb-6 flex items-center gap-2">
                                <MaterialIcon name="leaderboard" className="text-[var(--color-secondary)]" />
                                Most Active Teams
                            </h2>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topTeams} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-outline-variant)" opacity={0.3} />
                                        <XAxis type="number" stroke="var(--color-on-surface-variant)" fontSize={12} />
                                        <YAxis dataKey="name" type="category" width={100} stroke="var(--color-on-surface-variant)" fontSize={12} fontWeight="bold" />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="matches" name="Matches Played" fill="var(--color-primary)" radius={[0, 4, 4, 0]}>
                                            {topTeams.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Players by Country */}
                        <div className="bg-[var(--color-surface-container-low)] p-6 rounded-xl border border-[var(--color-outline-variant)]/20 shadow-sm">
                            <h2 className="font-manrope text-[20px] font-bold mb-6 flex items-center gap-2">
                                <MaterialIcon name="public" className="text-[var(--color-secondary)]" />
                                Player Distribution by Country
                            </h2>
                            <div className="h-[300px] flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={playersByCountry}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={110}
                                            paddingAngle={5}
                                            dataKey="count"
                                            nameKey="name"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {playersByCountry.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Matches */}
                        <div className="lg:col-span-2 bg-[var(--color-surface-container-low)] p-6 rounded-xl border border-[var(--color-outline-variant)]/20 shadow-sm">
                            <h2 className="font-manrope text-[20px] font-bold mb-6 flex items-center gap-2">
                                <MaterialIcon name="history" className="text-[var(--color-secondary)]" />
                                Recent Completed Matches
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[var(--color-outline-variant)]/30 text-[var(--color-on-surface-variant)] text-[13px] uppercase tracking-wider font-inter">
                                            <th className="py-3 px-4">Date</th>
                                            <th className="py-3 px-4">Match</th>
                                            <th className="py-3 px-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentMatches.map((match, idx) => (
                                            <tr key={match.matchId || idx} className="border-b border-[var(--color-outline-variant)]/10 hover:bg-[var(--color-surface-variant)]/30 transition-colors">
                                                <td className="py-4 px-4 font-inter text-[14px] text-[var(--color-on-surface-variant)] whitespace-nowrap">
                                                    {match.date ? format(new Date(match.date), 'MMM dd, yyyy') : 'N/A'}
                                                </td>
                                                <td className="py-4 px-4 font-manrope text-[15px] font-semibold">
                                                    {match.name || `${match.teamA?.name} vs ${match.teamB?.name}`}
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <span className="inline-flex items-center justify-center bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider font-inter">
                                                        Completed
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {recentMatches.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="py-8 text-center text-[var(--color-on-surface-variant)] font-inter text-[14px]">
                                                    No recent matches found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
