import React from 'react';

export const MatchCard = ({ status, tournament, venue, team1, score1, overs1, team2, score2, overs2, summary, team2Winner }) => (
    <div className="rounded-xl p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 bg-[var(--color-surface-container-lowest)] border border-[var(--color-primary)]/10 min-w-[350px] md:min-w-[400px]">
        <div className="flex justify-between items-start mb-6">
            <span className={`font-inter text-[10px] font-semibold tracking-[0.08em] flex items-center gap-1 uppercase ${status === 'LIVE' ? 'text-[var(--color-error)]' : 'text-[var(--color-on-surface-variant)]'}`}>
                {status === "LIVE" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-error)] inline-block animate-pulse" />
                )}
                {status === "LIVE" ? "LIVE • " : "FINISHED • "}{tournament}
            </span>
            <span className="font-inter text-[12px] font-semibold tracking-[0.08em] text-[var(--color-on-surface-variant)] truncate max-w-[150px]">
                {venue}
            </span>
        </div>

        <div className="flex flex-col gap-4">
            {[
                { name: team1, score: score1, overs: overs1, winner: !team2Winner, bgColor: 'var(--color-primary-fixed)' },
                { name: team2, score: score2, overs: overs2, winner: team2Winner, bgColor: 'var(--color-tertiary-fixed)' },
            ].map(({ name, score, overs, winner, bgColor }) => (
                <div
                    key={name}
                    className="flex justify-between items-center"
                    style={{ opacity: !winner && status === "FINISHED" ? 0.8 : 1 }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] text-[var(--color-on-primary-fixed)]"
                            style={{ backgroundColor: bgColor }}
                        >
                            {name.slice(0, 3).toUpperCase()}
                        </div>
                        <span className={`font-manrope text-[24px] font-semibold ${winner && status === 'FINISHED' ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface)]'}`}>
                            {name}
                        </span>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <div className={`font-manrope text-[32px] font-bold tracking-[-0.01em] leading-none ${winner && status === 'FINISHED' ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface)]'}`}>
                            {score}
                        </div>
                        <div className="font-inter text-[14px] font-medium text-[var(--color-on-surface-variant)]">
                            ({overs})
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-8 pt-4 text-center border-t border-[var(--color-outline-variant)]/10">
            <p className={`font-inter text-[12px] font-semibold tracking-[0.08em] uppercase ${status === 'LIVE' ? 'text-[var(--color-secondary)]' : 'text-[var(--color-on-surface-variant)]'}`}>
                {summary}
            </p>
        </div>
    </div>
);
