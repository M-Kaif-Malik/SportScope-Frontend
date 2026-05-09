import React, { useState } from 'react';

export const MatchFilterTabs = () => {
    const [active, setActive] = useState("All Matches");
    const tabs = ["All Matches", "T20 International", "ODI Series", "Test Championship"];

    return (
        <section className="w-full px-4 md:px-12 max-w-[1280px] mx-auto mt-12">
            <div className="flex items-center gap-6 pb-2 border-b border-[var(--color-outline-variant)]/20">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActive(tab)}
                        className={`font-inter text-[12px] font-semibold tracking-[0.08em] uppercase pb-2 bg-transparent border-none cursor-pointer transition-colors ${
                            active === tab
                                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                                : "text-[var(--color-on-surface-variant)] border-b-2 border-transparent hover:text-[var(--color-primary)]"
                        }`}
                        style={{
                            borderBottom: active === tab ? '2px solid var(--color-primary)' : '2px solid transparent'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </section>
    );
};
