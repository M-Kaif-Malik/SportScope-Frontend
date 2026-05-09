import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { SecondaryNavbar } from '../components/layout/SecondaryNavbar';
import { Footer } from '../components/layout/Footer';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { seriesData } from '../constants/seriesData';

export default function SeriesPage() {
    const [activeSeries, setActiveSeries] = useState(seriesData[0]);

    const handleSeriesClick = (series) => {
        setActiveSeries(series);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const otherSeries = seriesData.filter(s => s.id !== activeSeries.id);

    return (
        <div className="bg-[var(--color-surface)] min-h-screen text-[var(--color-on-surface)] font-manrope">
            <Header />
            <SecondaryNavbar />
            
            <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-12 pt-[112px] pb-12 mt-6">
                
                {/* Page Title */}
                <div className="mb-12 border-b border-[var(--color-outline-variant)]/20 pb-6">
                    <h1 className="font-manrope text-[48px] font-extrabold tracking-[-0.02em] leading-[1.1] text-[var(--color-primary)]">International Cricket Series</h1>
                    <p className="font-manrope text-[18px] leading-[1.6] text-[var(--color-on-surface-variant)] mt-2">Comprehensive coverage of ongoing and upcoming global tournaments.</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Sidebar: Navigation & Filters */}
                    <aside className="lg:col-span-3 space-y-6">
                        <div className="bg-[var(--color-surface-container-low)] p-6 rounded-xl border border-[var(--color-outline-variant)]/10">
                            <h3 className="font-inter text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--color-on-surface-variant)] mb-2">FILTER BY FORMAT</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-full font-inter text-[10px] font-semibold tracking-[0.08em] uppercase cursor-pointer">ALL</span>
                                <span className="px-3 py-1 bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] rounded-full font-inter text-[10px] font-semibold tracking-[0.08em] uppercase cursor-pointer hover:bg-[var(--color-secondary-container)] transition-colors">TEST</span>
                                <span className="px-3 py-1 bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] rounded-full font-inter text-[10px] font-semibold tracking-[0.08em] uppercase cursor-pointer hover:bg-[var(--color-secondary-container)] transition-colors">ODI</span>
                                <span className="px-3 py-1 bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] rounded-full font-inter text-[10px] font-semibold tracking-[0.08em] uppercase cursor-pointer hover:bg-[var(--color-secondary-container)] transition-colors">T20I</span>
                            </div>
                        </div>

                        <div className="bg-[var(--color-surface-container-low)] p-6 rounded-xl border border-[var(--color-outline-variant)]/10">
                            <h3 className="font-inter text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--color-on-surface-variant)] mb-2">FEATURED SERIES</h3>
                            <ul className="space-y-2">
                                {seriesData.map(series => (
                                    <li key={series.id}>
                                        <button 
                                            onClick={() => handleSeriesClick(series)}
                                            className={`font-manrope text-[16px] leading-[1.6] text-left w-full hover:text-[var(--color-secondary)] transition-colors cursor-pointer border-none bg-transparent ${activeSeries.id === series.id ? 'font-bold text-[var(--color-secondary)]' : 'text-[var(--color-on-surface)]'}`}
                                        >
                                            {series.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Main Content: Series List / Details View */}
                    <div className="lg:col-span-9 space-y-12">
                        
                        {/* Current Active Series Highlight */}
                        <section className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/10 rounded-xl overflow-hidden shadow-sm">
                            <div className="relative h-48 md:h-64 overflow-hidden">
                                <img 
                                    alt="Cricket Stadium" 
                                    className="w-full h-full object-cover" 
                                    src={activeSeries.image} 
                                />
                                <div className="absolute inset-0 flex items-end p-6 md:p-12" style={{ background: 'linear-gradient(to top, rgba(33,16,0,0.9) 0%, transparent 100%)' }}>
                                    <div>
                                        <span className="bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] px-3 py-1 rounded-full font-inter text-[11px] font-semibold tracking-[0.08em] uppercase mb-2 inline-block">
                                            {activeSeries.status}
                                        </span>
                                        <h2 className="font-manrope text-[32px] font-bold tracking-[-0.01em] leading-none text-[var(--color-on-primary)] mb-2">
                                            {activeSeries.title}
                                        </h2>
                                        <p className="text-[var(--color-on-primary)]/80 font-manrope text-[16px] leading-[1.6]">
                                            {activeSeries.startDate} - {activeSeries.endDate} • {activeSeries.matchSummary}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 md:p-12 pt-6 md:pt-6">
                                <div className="flex items-center justify-between mb-6 border-b border-[var(--color-outline-variant)]/10 pb-2">
                                    <h3 className="font-manrope text-[24px] font-semibold text-[var(--color-primary)]">Series Schedule</h3>
                                    <button className="font-inter text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--color-secondary)] flex items-center gap-1 hover:underline cursor-pointer bg-transparent border-none">
                                        <MaterialIcon name="calendar_month" className="text-[18px]" /> SYNC TO CALENDAR
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {activeSeries.matches.map(match => (
                                        <div key={match.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[var(--color-surface)] rounded-lg hover:bg-[var(--color-secondary)]/5 transition-colors group cursor-pointer">
                                            <div className="flex items-center gap-6 mb-2 md:mb-0">
                                                <div className="text-center w-16 border-r border-[var(--color-outline-variant)]/20 pr-6">
                                                    <div className="font-inter text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--color-on-surface-variant)]">{match.month}</div>
                                                    <div className="font-manrope text-[20px] font-bold tracking-[-0.01em] leading-none text-[var(--color-primary)]">{match.day}</div>
                                                </div>
                                                <div>
                                                    <div className="font-inter text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--color-secondary)]">{match.title} • {match.venue}</div>
                                                    <div className="font-manrope text-[16px] leading-[1.6] font-bold text-[var(--color-on-surface)] mt-1">{match.teams}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between md:justify-end gap-12">
                                                <span className="font-inter text-[14px] font-medium text-[var(--color-on-surface-variant)]">{match.time}</span>
                                                <button className="bg-[var(--color-primary)] text-[var(--color-on-primary)] px-4 py-2 rounded-lg font-inter text-[10px] font-semibold tracking-[0.08em] uppercase border-none cursor-pointer group-hover:bg-[var(--color-secondary)] transition-colors">
                                                    MATCH CENTER
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Other Series List */}
                        {otherSeries.length > 0 && (
                            <section>
                                <h3 className="font-manrope text-[24px] font-semibold text-[var(--color-primary)] mb-6">Other Series</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {otherSeries.map((series) => (
                                        <div 
                                            key={series.id} 
                                            onClick={() => handleSeriesClick(series)}
                                            className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/10 p-6 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="bg-[var(--color-tertiary-fixed)] text-[var(--color-on-tertiary-fixed)] px-2 py-0.5 rounded font-inter text-[9px] font-semibold tracking-[0.08em] uppercase">{series.type}</span>
                                                <span className="font-inter text-[12px] font-medium text-[var(--color-on-surface-variant)]">Starts {series.startDate}</span>
                                            </div>
                                            <h4 className="font-manrope text-[20px] font-semibold text-[var(--color-primary)] mb-1">{series.title}</h4>
                                            <p className="text-[var(--color-on-surface-variant)] font-manrope text-[14px] leading-[1.6] mb-4">{series.matchSummary}</p>
                                            <div className="flex gap-2">
                                                <span className="bg-[var(--color-surface-variant)] px-2 py-1 rounded text-[10px] font-inter font-semibold tracking-[0.08em] uppercase">{series.format}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
