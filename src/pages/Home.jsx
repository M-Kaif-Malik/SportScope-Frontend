import React from 'react';
import { Header } from '../components/layout/Header';
import { SecondaryNavbar } from '../components/layout/SecondaryNavbar';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/hero/HeroSection';
import { MatchSection } from '../components/matches/MatchSection';
import { FeaturedSeries } from '../components/series/FeaturedSeries';
import { FeaturedPlayers } from '../components/players/FeaturedPlayers';
import { MaterialIcon } from '../components/ui/MaterialIcon';

export default function SportsScope() {
    return (
        <div className="bg-[var(--color-surface)] min-h-screen text-[var(--color-on-surface)] font-manrope">
            <Header />
            <SecondaryNavbar />
            <main className="pt-[112px] pb-12">
                <HeroSection />
                <MatchSection />
                <FeaturedSeries />
                <FeaturedPlayers />
            </main>
            <Footer />
            {/* FAB for mobile */}
            <button
                className="md:hidden fixed bottom-6 right-6 flex items-center justify-center shadow-lg hover:scale-110 transition-transform w-14 h-14 rounded-full bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] border-none cursor-pointer z-50"
            >
                <MaterialIcon name="search" />
            </button>
        </div>
    );
}
