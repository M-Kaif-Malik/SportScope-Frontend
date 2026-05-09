import React from 'react';

const formatUpcomingDate = (dateStr, rawStatus) => {
    if (!dateStr) return rawStatus || 'Upcoming';
    const d = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (d.toDateString() === today.toDateString()) {
        return `Today, ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    } else if (d.toDateString() === tomorrow.toDateString()) {
        return `Tomorrow, ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
};

export const MatchCard = ({ match, onClick }) => {
    if (!match) return null;

    const displayFormat = match.format && match.format.toLowerCase() !== 'unknown' ? match.format : '';
    const formatText = [displayFormat, match.series || match.name].filter(Boolean).join(' • ');

    if (match._type === 'upcoming') {
        return (
            <div onClick={onClick} className="group h-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/10 p-6 rounded-lg hover:border-[var(--color-secondary)]/20 transition-all duration-300 flex flex-col justify-between cursor-pointer w-full">
                <div>
                    <div className="flex justify-between items-start mb-6">
                        {formatText && (
                            <span className="font-inter text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--color-on-surface-variant)] truncate max-w-[200px]">
                                {formatText}
                            </span>
                        )}
                        <span className={`font-inter text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--color-on-tertiary-container)] shrink-0 ml-2 ${!formatText ? 'ml-auto' : ''}`}>Upcoming</span>
                    </div>
                    <div className="flex flex-col items-center py-4 space-y-4">
                        <div className="flex items-center gap-8">
                            <div className="flex flex-col items-center gap-2">
                                {match.teamA?.logo ? (
                                    <img src={match.teamA.logo} alt={match.teamA.name} className="w-12 h-12 object-contain rounded shadow-sm bg-[var(--color-surface-container-lowest)] p-1" />
                                ) : (
                                    <div className="w-12 h-12 bg-[var(--color-surface-variant)] rounded shadow-sm"></div>
                                )}
                                <span className="font-manrope text-[24px] font-semibold text-[var(--color-primary)]">{match.teamA?.short || 'T1'}</span>
                            </div>
                            <span className="font-manrope text-[32px] font-extrabold text-[var(--color-outline-variant)] italic">VS</span>
                            <div className="flex flex-col items-center gap-2">
                                {match.teamB?.logo ? (
                                    <img src={match.teamB.logo} alt={match.teamB.name} className="w-12 h-12 object-contain rounded shadow-sm bg-[var(--color-surface-container-lowest)] p-1" />
                                ) : (
                                    <div className="w-12 h-12 bg-[var(--color-surface-variant)] rounded shadow-sm"></div>
                                )}
                                <span className="font-manrope text-[24px] font-semibold text-[var(--color-primary)]">{match.teamB?.short || 'T2'}</span>
                            </div>
                        </div>
                        <div className="text-center space-y-1 pt-4 w-full px-2">
                            <p className="font-manrope text-[20px] font-semibold text-[var(--color-secondary)] truncate">
                                {formatUpcomingDate(match.date, match.rawStatus)}
                            </p>
                            <p className="font-inter text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--color-on-surface-variant)] truncate">
                                {match.venue || 'Venue TBD'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // For LIVE or COMPLETED
    const t1Score = match.score && match.score[0] ? `${match.score[0].runs}/${match.score[0].wickets}` : '---';
    const t1Overs = match.score && match.score[0] && match.score[0].overs ? `(${match.score[0].overs})` : '';
    const t2Score = match.score && match.score[1] ? `${match.score[1].runs}/${match.score[1].wickets}` : '---';
    const t2Overs = match.score && match.score[1] && match.score[1].overs ? `(${match.score[1].overs})` : '';

    const isLive = match._type === 'live';

    return (
        <div onClick={onClick} className="group h-full bg-[var(--color-surface-container-lowest)] border border-[var(--color-primary)]/10 p-6 rounded-lg shadow-[rgba(56,36,13,0.04)_0px_8px_24px] hover:shadow-[rgba(56,36,13,0.08)_0px_12px_32px] transition-all duration-300 flex flex-col justify-between cursor-pointer w-full">
            <div>
                <div className="flex justify-between items-start mb-6">
                    {formatText && (
                        <span className="font-inter text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--color-secondary-container)] bg-[var(--color-primary-container)] px-2 py-0.5 rounded truncate max-w-[200px]">
                            {formatText}
                        </span>
                    )}
                    <div className={`flex items-center gap-1.5 shrink-0 ml-2 ${!formatText ? 'ml-auto' : ''}`}>
                        {isLive && <span className="w-2 h-2 rounded-full bg-[var(--color-error)] animate-pulse"></span>}
                        <span className={`font-inter text-[10px] font-bold uppercase tracking-[0.08em] ${isLive ? 'text-[var(--color-error)]' : 'text-[var(--color-on-surface-variant)]'}`}>
                            {isLive ? 'Live' : 'Finished'}
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {match.teamA?.logo ? (
                                <img src={match.teamA.logo} alt={match.teamA.name} className="w-8 h-8 object-contain rounded-sm" />
                            ) : (
                                <div className="w-8 h-8 bg-[var(--color-surface-variant)] rounded-sm"></div>
                            )}
                            <span className={`font-manrope text-[24px] font-semibold ${!isLive && match.team2Winner === false ? 'text-[var(--color-on-surface-variant)]' : 'text-[var(--color-primary)]'}`}>{match.teamA?.short || match.teamA?.name || 'T1'}</span>
                        </div>
                        <span className={`font-manrope text-[32px] font-extrabold ${!isLive && match.team2Winner === false ? 'text-[var(--color-on-surface-variant)]' : 'text-[var(--color-primary)]'}`}>
                            {t1Score} <span className="text-[var(--color-on-surface-variant)] text-[16px] font-normal">{t1Overs}</span>
                        </span>
                    </div>
                    <div className="flex items-center justify-between opacity-80">
                        <div className="flex items-center gap-3">
                            {match.teamB?.logo ? (
                                <img src={match.teamB.logo} alt={match.teamB.name} className="w-8 h-8 object-contain rounded-sm" />
                            ) : (
                                <div className="w-8 h-8 bg-[var(--color-surface-variant)] rounded-sm"></div>
                            )}
                            <span className={`font-manrope text-[24px] font-semibold ${!isLive && match.team2Winner === true ? 'text-[var(--color-on-surface-variant)]' : 'text-[var(--color-secondary)]'}`}>{match.teamB?.short || match.teamB?.name || 'T2'}</span>
                        </div>
                        <span className={`font-manrope text-[32px] font-extrabold ${!isLive && match.team2Winner === true ? 'text-[var(--color-on-surface-variant)]' : 'text-[var(--color-secondary)]'}`}>
                            {t2Score} <span className="text-[var(--color-on-surface-variant)] text-[16px] font-normal">{t2Overs}</span>
                        </span>
                    </div>
                </div>
            </div>
            <div className="mt-8 pt-4 border-t border-[var(--color-outline-variant)]/10">
                <p className="font-manrope text-[16px] text-[var(--color-secondary)] font-medium italic">{match.status || match.rawStatus || (isLive ? 'Match in progress' : 'Completed')}</p>
            </div>
        </div>
    );
};
