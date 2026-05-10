import React, { useState } from 'react';
import { MaterialIcon } from '../ui/MaterialIcon';
import { getPastChampions } from '../../services/tennisApi';

export const TournamentCard = ({ tournament, tourType }) => {
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [champions, setChampions] = useState(null);

    if (!tournament) return null;

    const name = tournament.name || 'Unknown Tournament';
    const countryName = tournament.coutry?.name || tournament.country?.name || '';
    const surface = tournament.court?.name || 'Unknown Surface';
    const tier = tournament.tier || '';
    
    const startDate = tournament.date ? new Date(tournament.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '';

    const handleExpand = async () => {
        if (!expanded && !champions) {
            setLoading(true);
            try {
                const res = await getPastChampions(tournament.id, tourType || 'atp');
                setChampions(res?.champions || { singles: [], doubles: [] });
            } catch (err) {
                console.error("Failed to load champions", err);
                setChampions({ singles: [], doubles: [] });
            } finally {
                setLoading(false);
            }
        }
        setExpanded(!expanded);
    };

    return (
        <div 
            onClick={handleExpand}
            className="group h-full bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/10 p-5 rounded-lg hover:border-[var(--color-primary)]/30 hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer w-full"
        >
            <div className="flex-grow flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        {tier && (
                            <span className="font-inter text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--color-primary-container)] bg-[var(--color-on-primary-container)] px-2 py-0.5 rounded truncate max-w-[150px]">
                                {tier}
                            </span>
                        )}
                        <span className="font-inter text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--color-on-surface-variant)] shrink-0 ml-auto flex items-center gap-1">
                            <MaterialIcon name="calendar_today" className="text-[12px]" />
                            {startDate}
                        </span>
                    </div>
                    
                    <h4 className="font-manrope text-[18px] md:text-[20px] font-bold text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] transition-colors line-clamp-2 m-0 mb-2">
                        {name}
                    </h4>
                    
                    <p className="font-inter text-[12px] font-medium text-[var(--color-on-surface-variant)] m-0 flex items-center gap-1">
                        <MaterialIcon name="location_on" className="text-[14px]" />
                        {countryName || 'Location TBD'}
                    </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-[var(--color-outline-variant)]/10 flex justify-between items-center">
                    <span className="font-inter text-[12px] font-bold tracking-[0.05em] uppercase text-[var(--color-surface-tint)]">
                        {surface}
                    </span>
                    <MaterialIcon name={expanded ? "expand_less" : "expand_more"} className="text-[var(--color-outline)] group-hover:text-[var(--color-primary)] transition-colors text-[24px]" />
                </div>
            </div>

            {expanded && (
                <div className="mt-4 pt-4 border-t border-[var(--color-outline-variant)]/20 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                    {loading ? (
                        <div className="flex justify-center p-4">
                            <MaterialIcon name="autorenew" className="animate-spin text-[var(--color-primary)] text-[24px]" />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {champions?.singles?.length > 0 ? (
                                <div>
                                    <h5 className="font-inter text-[11px] uppercase font-bold tracking-wider text-[var(--color-on-surface-variant)] mb-2">Singles Champions</h5>
                                    <div className="flex flex-col gap-2">
                                        {champions.singles.slice(0, 3).map((match) => (
                                            <div key={match.id} className="bg-[var(--color-surface-container)] rounded p-2 text-[12px] font-manrope">
                                                <div className="font-bold text-[var(--color-on-surface)]">{match.player1?.name || 'Unknown'}</div>
                                                <div className="text-[var(--color-on-surface-variant)] text-[10px]">def. {match.player2?.name || 'Unknown'}</div>
                                                <div className="text-[var(--color-primary)] font-semibold mt-1">{match.result}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                            
                            {(!champions?.singles?.length && !champions?.doubles?.length) && (
                                <p className="font-inter text-[12px] text-[var(--color-on-surface-variant)] italic">No champions data available.</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
