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
        </div>
    );
}
