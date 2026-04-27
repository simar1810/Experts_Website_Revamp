'use client';

import CoachHero from '@/components/coach_profile/hero';
import AboutMe from '@/components/coach_profile/AboutMe';
import ServicesOffered from '@/components/coach_profile/ServicesOffered';
import TransformativePrograms from '@/components/coach_profile/TransformativePrograms';
import PatientStories from '@/components/coach_profile/PatientStories';
import LocationBlock from '@/components/coach_profile/LocationBlock';

export default function CoachProfilePage() {
    const scrollToLocation = () => {
        document.getElementById('coach-location')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <main className="min-h-screen bg-white font-sans">

            {/* Hero */}
            <CoachHero
                coachData={null}          /* pass real coachData here when ready */
                onBookConsultation={scrollToLocation}
            />

            <AboutMe coachData={null} />
            <ServicesOffered coachData={null} />
            <TransformativePrograms coachData={null} />
            <PatientStories coachData={null} />
            <LocationBlock coachData={null} />
        </main>
    );
}
