import React from 'react';

const formatMatchDate = (dateStr) => {
    if (!dateStr) return 'TBD';
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

export const TennisMatchCard = ({ match, onClick }) => {
    if (!match) return null;

    const isLive = match.live === 1 || match.status?.toLowerCase() === 'live';
    const isFinished = match.complete === 1 || match.status?.toLowerCase() === 'finished';
    const isUpcoming = !isLive && !isFinished;

    const tournamentName = match.tournament?.name || 'Tournament';
    const roundName = match.round?.name || '';
    const formatText = [tournamentName, roundName].filter(Boolean).join(' • ');

    const player1Name = match.player1?.name || 'Player 1';
    const player2Name = match.player2?.name || 'Player 2';
    
    const p1Image = match.player1?.image || '';
    const p2Image = match.player2?.image || '';

    // Tennis scores usually look like "6-4, 3-6, 6-2" in 'result'
    // Split the result to get individual sets if needed, but for the card we can just display the raw string
    const resultString = match.result || '---';

    if (isUpcoming) {
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
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-center gap-2 max-w-[100px]">
                                {p1Image ? (
                                    <img src={p1Image} alt={player1Name} className="w-14 h-14 object-cover rounded-full shadow-sm border border-[var(--color-outline-variant)]/20" />
                                ) : (
                                    <div className="w-14 h-14 bg-[var(--color-surface-variant)] rounded-full shadow-sm flex items-center justify-center text-[10px] font-bold text-[var(--color-on-surface-variant)]">P1</div>
                                )}
                                <span className="font-manrope text-[14px] font-semibold text-[var(--color-primary)] text-center line-clamp-2">{player1Name}</span>
                            </div>
                            <span className="font-manrope text-[24px] font-extrabold text-[var(--color-outline-variant)] italic">VS</span>
                            <div className="flex flex-col items-center gap-2 max-w-[100px]">
                                {p2Image ? (
                                    <img src={p2Image} alt={player2Name} className="w-14 h-14 object-cover rounded-full shadow-sm border border-[var(--color-outline-variant)]/20" />
                                ) : (
                                    <div className="w-14 h-14 bg-[var(--color-surface-variant)] rounded-full shadow-sm flex items-center justify-center text-[10px] font-bold text-[var(--color-on-surface-variant)]">P2</div>
                                )}
                                <span className="font-manrope text-[14px] font-semibold text-[var(--color-primary)] text-center line-clamp-2">{player2Name}</span>
                            </div>
                        </div>
                        <div className="text-center space-y-1 pt-4 w-full px-2">
                            <p className="font-manrope text-[18px] font-semibold text-[var(--color-secondary)] truncate">
                                {formatMatchDate(match.date || match.timeGame)}
                            </p>
                            <p className="font-inter text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--color-on-surface-variant)] truncate">
                                {match.tournament?.city || 'Venue TBD'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Live or Completed
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
                            {p1Image ? (
                                <img src={p1Image} alt={player1Name} className="w-8 h-8 object-cover rounded-full" />
                            ) : (
                                <div className="w-8 h-8 bg-[var(--color-surface-variant)] rounded-full"></div>
                            )}
                            <span className={`font-manrope text-[18px] sm:text-[20px] font-semibold text-[var(--color-primary)]`}>{player1Name}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between opacity-80">
                        <div className="flex items-center gap-3">
                            {p2Image ? (
                                <img src={p2Image} alt={player2Name} className="w-8 h-8 object-cover rounded-full" />
                            ) : (
                                <div className="w-8 h-8 bg-[var(--color-surface-variant)] rounded-full"></div>
                            )}
                            <span className={`font-manrope text-[18px] sm:text-[20px] font-semibold text-[var(--color-secondary)]`}>{player2Name}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-[var(--color-outline-variant)]/10 flex justify-between items-end">
                <p className="font-manrope text-[16px] text-[var(--color-secondary)] font-medium italic">{match.status || (isLive ? 'Match in progress' : 'Completed')}</p>
                <div className="font-manrope text-[20px] font-bold tracking-tight text-[var(--color-on-surface)] bg-[var(--color-surface-container)] px-3 py-1 rounded">
                    {resultString}
                </div>
            </div>
        </div>
    );
};
