import Hero from '../../components/Hero';
import Stats from '../../components/Stats';
import ExpertCategories from '../../components/ExpertCategories';
import FeaturedExperts from '../../components/FeaturedExperts';
import PromoSection from '../../components/PromoSection';
import LatestArticles from '../../components/LatestArticles';
import PaymentsSection from '../../components/PaymentsSection';
import AsSeenIn from '../../components/AsSeenIn';


export default function Home() {
    return (
        <main className="min-h-screen bg-white text-gray-900 font-sans">
            <Hero />
            <Stats />
            <ExpertCategories />
            <FeaturedExperts />
            <PromoSection />
            <LatestArticles />
            <PaymentsSection />
            {/* <AsSeenIn /> */}
        </main>
    );
}
