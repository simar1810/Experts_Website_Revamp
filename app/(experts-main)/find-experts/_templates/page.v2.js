'use client'

import { useState, useEffect, Suspense } from 'react';
import { MapPin, CheckCircle2, MessageSquare, ThumbsUp, ChevronDown } from 'lucide-react';
import { fetchAPI } from '@/lib/api';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { availableCategories } from '@/lib/data/categories';
import SearchFilters from '@/components/SearchFilters';



function ExpertCard({ expert }) {
    const { isAuthenticated, openLoginModal } = useAuth();
    const router = useRouter();

    let specializations_string = ''
    const specs = expert.specializations || expert.expertiseTags || [];
    if (specs.length > 2) {
        specializations_string = specs[0] + ", " + specs[1] + " more..."
    }
    else if (specs.length == 2) {
        specializations_string = specs[0] + ", " + specs[1]
    }
    else if (specs.length == 1) {
        specializations_string = specs[0]
    }

    const handleCardClick = (e) => {
        const id = expert._id || expert.coach?._id || expert.id;
        if (!id) return;

        if (!isAuthenticated) {
            openLoginModal();
        } else {
            router.push(`/experts/${id}`);
        }
    };

    return (
        <div onClick={handleCardClick} className="block cursor-pointer">
            <div className="bg-white border border-gray-100 rounded-[2rem] p-5 sm:p-8 flex flex-col md:flex-row gap-6 sm:gap-10 shadow-sm hover:shadow-xl hover:border-lime-100/50 transition-all duration-500 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-lime-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="relative w-28 h-28 sm:w-40 sm:h-40 shrink-0 mx-auto md:mx-0">
                    <div className="w-full h-full rounded-[2.5rem] border-4 border-[var(--brand-primary)]/10 overflow-hidden shadow-inner group-hover:border-[var(--brand-primary)]/30 transition-colors">
                        <img src={expert.profilePhoto || "/images/coach.png"} alt={expert.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-110" />
                    </div>
                    <div className="absolute -right-1 -bottom-1 bg-white rounded-2xl p-1.5 shadow-xl border border-gray-50">
                        <CheckCircle2 className="w-5 h-5 sm:w-7 sm:h-7 text-[var(--brand-primary)] fill-white" />
                    </div>
                </div>

                <div className="flex-1 space-y-2 text-center md:text-left relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <h3 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight group-hover:text-[var(--brand-primary)] transition-colors">{expert.coach.name}</h3>
                    </div>
                    <p className="text-[var(--brand-primary)] text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">{specializations_string}</p>
                    <p className="text-gray-500 text-xs  font-medium opacity-80">{expert.yearsExperience} years experience overall</p>

                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-900 text-xs sm:text-sm font-bold pt-1">
                        <MapPin className="w-4 h-4 text-gray-300" />
                        <span className="text-gray-700">{expert.city} , {expert.state}</span>
                    </div>
                    <p className="text-gray-400 text-[10px] sm:text-xs font-medium leading-relaxed max-w-md mx-auto md:mx-0 italic">
                        {expert.clinic}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-gray-100 mt-6 gap-6">
                        <div className="flex items-center justify-center md:justify-start gap-6">
                            <div className="flex items-center gap-2 bg-[var(--brand-primary)] text-white px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-black shadow-lg shadow-lime-500/20">
                                <ThumbsUp className="w-3 h-3 fill-current" />
                                <span>{((expert.recommendedScoreFinal) * 100).toPrecision(2)}%</span>
                            </div>
                            <div className="flex items-center gap-1.5 group/stories cursor-pointer">
                                <MessageSquare className="w-4 h-4 text-gray-300" />
                                <span className="text-gray-500 text-[10px] sm:text-xs font-bold border-b-2 border-transparent group-hover:border-lime-500 transition-all tracking-tight">{expert.reviewAgg.totalReviews} reviews </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center md:items-end gap-2 text-right">
                            <p className="text-[var(--brand-primary)] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] leading-none">{expert.responseTime}</p>
                            <button onClick={handleCardClick} className="bg-gray-900 hover:bg-black text-white px-8 sm:px-12 py-3 sm:py-3.5 rounded-2xl font-black text-[10px] sm:text-xs transition-all shadow-xl active:scale-95 uppercase tracking-widest mt-2">
                                Message Coach
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


function ExpertList({ experts }) {
    if (!Array.isArray(experts)) return null;
    return (
        <>
            {experts.map((expert, i) => (
                <ExpertCard key={i} expert={expert} />))}
        </>
    )
}

function Pagination({ totalPages, page, setPage }) {
    if (totalPages == 0) {
        return (<div></div>)
    }
    const incrementPage = () => {
        if (page < totalPages) {
            setPage(page + 1)
        }
    }
    const decrementPage = () => {
        if (page > 1) {
            setPage(page - 1)
        }
    }

    return (
        <div className="flex flex-wrap justify-center items-center gap-2.5 pt-12">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-gray-300 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors"
                onClick={() => setPage(1)}>«</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-gray-300 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors"
                onClick={decrementPage}>‹</button>

            {totalPages > 1 && <button className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-xs sm:text-sm shadow-lg ${page === 1 ? 'bg-[var(--brand-primary)] text-white shadow-lime-500/20' : 'border border-gray-100 text-gray-500 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]'}`}
                onClick={() => setPage(1)}>1</button>}

            {totalPages > 2 && <button className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-xs sm:text-sm shadow-lg ${page === 2 ? 'bg-[var(--brand-primary)] text-white shadow-lime-500/20' : 'border border-gray-100 text-gray-500 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]'}`}
                onClick={() => setPage(2)}>2</button>}

            {totalPages > 3 && <span className="text-gray-300 px-2">...</span>}

            <button className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-xs sm:text-sm shadow-lg ${page === totalPages ? 'bg-[var(--brand-primary)] text-white shadow-lime-500/20' : 'border border-gray-100 text-gray-500 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]'}`}
                onClick={() => setPage(totalPages)}>{totalPages}</button>

            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-gray-400 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors"
                onClick={incrementPage}>›</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-gray-400 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors"
                onClick={() => setPage(totalPages)}>»</button>
        </div>
    )
}

function CategoriesFilter({setFilteredExperts}) {
    const [selectedCategory,setSelectedCategory] = useState('')
    
    const availableCategories = ['yoga','ayurveda','fitness','nutrition','mindfulness','meditation','yoga','ayurveda','fitness','nutrition','mindfulness','meditation'];
    
    return (
        <section className="max-w-7xl mx-auto px-6 mt-15 mb-10">
            <div className="mb-4 text-center sm:text-left">
                <h2 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">Popular Categories</h2>
                <p className="text-gray-400 text-[10px] sm:text-sm mt-1 uppercase tracking-widest font-bold opacity-80">Popular specializations you can choose from</p>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-start gap-2.5 sm:gap-3">
                {availableCategories.map((cat, i) => (
                    <button
                        key={i}
                        className={`px-4 sm:px-7 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest border transition-all ${cat === selectedCategory ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] shadow-lg shadow-lime-500/20' : 'bg-white text-gray-500 border-gray-100 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] hover:shadow-md'}`}
                        onClick={() => setSelectedCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </section>
    )
}

async function searchExperts(locationQuery,selectedSpecialities,consultationType,debouncedDistanceRange,page,setFilteredExperts,setShowPopularExperts){
    try {
        const payload = {
            "city": locationQuery,
            "expertiseTags": selectedSpecialities,
            "consultationMode": consultationType,
            "radiusKm": debouncedDistanceRange,
            "page": page,
        };
        const experts = await fetchAPI(`/experts/listing/search`, payload, "POST");
        setFilteredExperts([...(experts?.free || []), ...(experts?.paid || [])]);
        setShowPopularExperts(false);
    } catch (err) {
        console.error("Search failed:", err);
    }
}

export default function ExpertsPage2() {
    return (
        <Suspense fallback={<div>Loading experts...</div>}>
            <ExpertsPage2Content />
        </Suspense>
    )
}

function ExpertsPage2Content() {
    const [selectedSpecialities, setSelectedSpecialities] = useState([]);
    const [locationQuery, setLocationQuery] = useState('');
    const [filteredExperts, setFilteredExperts] = useState([]);

    // Filter states
    const [consultationType, setConsultationType] = useState('offline');
    const [sortBy, setSortBy] = useState('name-asc');
    const [distanceRange, setDistanceRange] = useState(12); // Default range in KM
    const [debouncedDistanceRange, setDebouncedDistanceRange] = useState(12);
    // location 
    const [coordinateLocation, setCoordinateLocation] = useState(null);
    //page no
    const [page, setPage] = useState(1);

    const [showPopularExperts, setShowPopularExperts] = useState(true);

    // const [availableCategories,setAvailableCategories] = useState(['yoga','ayurveda']);

    // Debounce distanceRange
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedDistanceRange(distanceRange);
        }, 500);

        return () => clearTimeout(handler);
    }, [distanceRange]);


    useEffect(() => {
        if (showPopularExperts) {
            GetPopularCoaches();
        }
        else {
            handleSearch();
        }
    }, [coordinateLocation, consultationType, debouncedDistanceRange, sortBy, page]);


    const handleSearch = async () => {
        if (selectedSpecialities.length > 0 || locationQuery.length > 0) {
            searchExperts();
        }
    }

    const GetPopularCoaches = async () => {
        try {
            const payload = {
                city: '',
                consultationMode: 'both',
                expertiseTags: [],
                languages: [],
                radiusKm: '',
                limit: 10
            };

            // if (coordinateLocation?.latitude && coordinateLocation?.longitude) {
            //     payload.clientLocation = {
            //         type: "Point",
            //         coordinates: [coordinateLocation.longitude, coordinateLocation.latitude]
            //     };
            // }

            const data = await fetchAPI('/experts/listing/top-coaches-block', payload);
            console.log('popular coaches : ', data);

            setFilteredExperts(Array.isArray(data?.items) ? data.items : []);
        } catch (err) {
            console.error("Failed to fetch Popular coaches:", err);
            setFilteredExperts([]);
        }
    }



    const searchParams = useSearchParams();

    useEffect(() => {
        async function loadQueryExperts() {
            const speciality = searchParams.get('speciality');
            const location = searchParams.get('location');
            if (speciality && location) {
                console.log('querysearch')
                setSelectedSpecialities(speciality.split(','));
                setLocationQuery(location);
                setShowPopularExperts(false);
                setConsultationType('both');
                setDistanceRange(10)
            }
        }
        loadQueryExperts();
    }, [searchParams]);

    return (
        <main className="min-h-screen bg-white overflow-x-hidden font-sans">
            {/* Hero Section */}
            <section className="relative w-full h-[320px] md:h-[450px] flex flex-col items-center justify-center text-center px-4">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 overflow-hidden"
                    style={{
                        backgroundImage: "url('/images/gym-bg.png')",
                        filter: "blur(6px) brightness(0.4)"
                    }}
                />

                <div className="relative z-10 max-w-5xl mx-auto space-y-3 sm:space-y-6 pt-6">
                    <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
                        Find the right <span className="text-[var(--brand-primary)]">Expert</span> for your Health
                    </h1>
                    <div className="max-w-4xl mx-auto">
                        <p className="text-white/80 text-[10px] sm:text-sm md:text-base leading-relaxed font-medium max-w-lg mx-auto line-clamp-2 sm:line-clamp-none">
                        "Search from 7,000+ verified wellness experts and connect with the right expert for your health goals."
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative max-w-3xl mx-auto mt-4 md:mt-8">
                        <SearchFilters
                            selectedSpecialities={selectedSpecialities}
                            setSelectedSpecialities={setSelectedSpecialities}
                            locationQuery={locationQuery}
                            setLocationQuery={setLocationQuery}
                            onSearch={handleSearch}
                            coordinateLocation={coordinateLocation}
                            theme="light"
                            containerClassName="bg-white rounded-xl p-1 shadow-2xl w-full border border-white/10"
                            inputWrapperClassName="border-b lg:border-b-0 lg:border-r border-gray-100 py-2 sm:py-3"
                            buttonClassName="bg-[var(--brand-primary)] hover:bg-[#76b813] text-white px-8 py-2.5 rounded-lg font-black text-xs sm:text-sm w-full lg:w-auto"
                            buttonText="Search Experts"
                            specialityIconColor="text-gray-300"
                            locationIconColor="text-gray-300"
                        />
                    </div>
                </div>
            </section>

            {/* categories */}
            <CategoriesFilter setFilteredExperts/>


            {/* Filters Section */}
            <section id="filters" className="max-w-7xl mx-auto px-6 py-4 mb-4 mt-6 sm:mt-10 border-b border-gray-50">
                    <div className="text-center sm:text-left">
                        <h5 className="text-xl font-black text-gray-900 tracking-tight">Filters</h5>
                    </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
                    {/* Left: Consultation Type & Sort By */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-10">
                        {/* Consultation Type */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-900 whitespace-nowrap tracking-tight">Consultation Type</span>
                            <div className="relative group min-w-[140px]">
                                <select
                                    className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-5 py-2.5 text-sm font-bold text-gray-800 focus:outline-none focus:border-[var(--brand-primary)] cursor-pointer transition-all shadow-sm pr-10"
                                    value={consultationType}
                                    onChange={(e) => setConsultationType(e.target.value)}
                                >
                                    <option value="offline">Offline</option>
                                    <option value="online">Online</option>
                                    <option value="both">Both</option>
                                </select>
                                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--brand-primary)] pointer-events-none group-hover:scale-110 transition-transform" />
                            </div>
                        </div>

                        {/* Sort By */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-900 whitespace-nowrap tracking-tight">Sort By</span>
                            <div className="relative group min-w-[170px]">
                                <select
                                    className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-5 py-2.5 text-sm font-bold text-gray-800 focus:outline-none focus:border-[var(--brand-primary)] cursor-pointer transition-all shadow-sm pr-10"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="name-asc">Name (Ascending)</option>
                                    <option value="name-desc">Name (Descending)</option>
                                    <option value="rating">Top Rated</option>
                                    <option value="experience">Experience</option>
                                </select>
                                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--brand-primary)] pointer-events-none group-hover:scale-110 transition-transform" />
                            </div>
                        </div>
                    </div>

                    {/* Right: Distance Range Slider */}
                    <div className="flex items-center gap-3 sm:gap-6 w-full md:w-auto overflow-visible py-2">
                        <span className="text-sm font-bold text-gray-900 whitespace-nowrap tracking-tight">Distance Range</span>
                        <div className="flex-1 md:w-[320px] relative pt-6 pb-2">
                            <div className="relative h-1.5 bg-gray-100 rounded-full overflow-visible">
                                {/* Controlled green bar */}
                                <div
                                    className="absolute left-0 top-0 h-full bg-[var(--brand-primary)] rounded-full transition-all duration-300"
                                    style={{ width: `${distanceRange}%` }}
                                ></div>
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-[var(--brand-primary)] border-4 border-white rounded-full shadow-lg shadow-lime-500/30 cursor-pointer hover:scale-110 transition-all z-10"
                                    style={{ left: `${distanceRange}%` }}
                                ></div>

                                {/* Hidden native slider for touch/mouse interaction */}
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="1"
                                    value={distanceRange}
                                    onChange={(e) => setDistanceRange(parseInt(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                />
                            </div>
                            {/* Labels */}
                            <div className="flex justify-between mt-4">
                                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${distanceRange >= 0 ? 'text-[var(--brand-primary)]' : 'text-gray-300'}`}>0 KM</span>
                                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${distanceRange >= 25 ? 'text-[var(--brand-primary)]' : 'text-gray-300'}`}>25 KM</span>
                                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${distanceRange >= 50 ? 'text-[var(--brand-primary)]' : 'text-gray-300'}`}>50 KM</span>
                                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${distanceRange >= 75 ? 'text-[var(--brand-primary)]' : 'text-gray-300'}`}>75 KM</span>
                                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${distanceRange >= 100 ? 'text-[var(--brand-primary)]' : 'text-gray-300'}`}>100 KM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* Popular Coaches Section */}
            <section className={`max-w-7xl mx-auto px-6 py-6 md:py-8 pb-24 ${showPopularExperts ? 'mt-0' : 'mt-10'}`}>
                <div className="mb-6 sm:mb-10 text-center sm:text-left">
                    <h2 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">{showPopularExperts ? 'Popular Coaches' : 'Expert Coaches'}</h2>
                    <p className="text-gray-400 text-[10px] sm:text-sm mt-1 uppercase tracking-widest font-bold opacity-80">Top rated wellness experts available for you</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mb-30">
                    {/* Coaches List */}
                    <div className="lg:col-span-8 space-y-6">

                        <ExpertList experts={filteredExperts} />

                        {/* Pagination */}
                        <Pagination totalPages={4} page={page} setPage={setPage} />

                    </div>

                    {/* Promo Card Column */}
                    {/* <div className="lg:col-span-4 mt-8 lg:mt-0">
                        <div className="sticky top-28 bg-gradient-to-br from-[var(--brand-primary)] to-[#4d7c0f] rounded-[2.8rem] p-2 relative overflow-hidden h-fit shadow-2xl shadow-lime-900/10">
                            <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-black/10 rounded-full blur-3xl"></div>

                            <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left shadow-inner h-full">
                                <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Special Offer</p>
                                <p className="text-gray-900 text-lg sm:text-xl font-bold mb-3 leading-tight">This World Oral Health Day,</p>

                                <h4 className="text-3xl sm:text-4xl leading-[1.1] font-black text-[#0a4d2e] mb-8 tracking-tighter">
                                    Get a <span className="text-[var(--brand-primary)]">FREE</span> Appointment<span className="text-[var(--brand-primary)] text-xl align-top">*</span> with Top Dentists.
                                </h4>

                                <div className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] px-5 py-2.5 rounded-full text-[10px] sm:text-xs font-black mb-10 uppercase tracking-widest border border-[var(--brand-primary)]/20">
                                    Limited Period Offer
                                </div>

                                <p className="text-[#4d7c0f] font-black text-xl sm:text-2xl mb-10 tracking-tight">
                                    #BeSensitiveToOralHealth
                                </p>

                                <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all mb-6 active:scale-95 shadow-xl">
                                    Claim Now
                                </button>

                                <p className="text-gray-400 text-[9px] font-bold leading-tight mt-auto opacity-60">
                                    *T&C Apply - only consultation fee. Procedures / surgeries not covered.
                                </p>
                            </div>
                        </div>
                    </div> */}
                </div>
            </section>
        </main>
    );
}
