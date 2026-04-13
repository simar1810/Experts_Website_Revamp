import HeroSection from "../_components/browse/HeroSection";
import { TopProgramsSection } from "../_components/browse/TopProgramsSection";

export default function BrowseProgramsPage()
{
    return (
        <main className="min-h-screen bg-white font-lato text-neutral-900">
            <HeroSection/>
            <TopProgramsSection/>
           
        </main>
    )
}