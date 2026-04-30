'use client'

import { useState, useEffect, Suspense } from 'react';
import { MapPin, CheckCircle2, MessageSquare, ThumbsUp, ChevronDown, Check, Languages, Filter, X } from 'lucide-react';
import { fetchAPI } from '@/lib/api';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import SearchFilters from '@/components/SearchFilters';
import { getFilteredExperts } from '@/lib/experts_fetch';
import { useValues } from '@/context/valuesContext';

export default function ExpertsPage() {
    const [selectedSpecialities, setSelectedSpecialities] = useState([]);
    const [locationQuery, setLocationQuery] = useState('');
    const [filteredExperts, setFilteredExperts] = useState([]);
    const [page, setPage] = useState(1);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);


    const handleSearch = async () => {
        setPage(1);
        const experts = await getFilteredExperts({ city: locationQuery, expertiseTags: selectedSpecialities });
        setFilteredExperts(experts);
    }

    useEffect(() => {
        handleSearch();
    }, []);

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

            <CategoriesFilter setFilteredExperts={setFilteredExperts} setSelectedSpecialities={setSelectedSpecialities} />

            {/* Results Section */}
            <section className="max-w-7xl mx-auto px-6 py-6 md:py-12 pb-24">
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-6">
                    <button
                        onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                        className="w-full flex items-center justify-between bg-white border border-gray-100 p-4 rounded-[1.5rem] shadow-sm active:scale-95 transition-transform"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[var(--brand-primary)] rounded-xl flex items-center justify-center shadow-lg shadow-lime-500/20">
                                <Filter className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <h4 className="text-sm font-black text-gray-900 leading-none">Search Filters</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Adjust criteria</p>
                            </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isMobileFiltersOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Sidebar */}
                    <aside className={`w-full lg:w-[320px] shrink-0 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
                        <Filters
                            filteredExperts={filteredExperts}
                            setFilteredExperts={setFilteredExperts}
                            filteredExpertsCount={filteredExperts.length}
                            selectedSpecialities={selectedSpecialities}
                            locationQuery={locationQuery}
                            onClose={() => setIsMobileFiltersOpen(false)}
                        />
                    </aside>

                    {/* Right Results */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="mb-10 lg:mb-12">
                            <h2 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
                                {filteredExperts.length > 0 ? "Expert Coaches" : "No Experts Found"}
                            </h2>
                            <p className="text-gray-400 text-[10px] sm:text-sm mt-1 uppercase tracking-widest font-bold opacity-80">
                                Top rated wellness experts available for you
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            <ExpertList experts={filteredExperts} />
                        </div>
                    </div>
                </div>
            </section>


        </main>
    );
}


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
                        <h3 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight group-hover:text-[var(--brand-primary)] transition-colors">
                            {expert.name || expert.coach?.name || "Expert"}
                        </h3>
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

function CategoriesFilter({ setFilteredExperts, setSelectedSpecialities }) {
    const [selectedCategory, setSelectedCategory] = useState('')
    const { values } = useValues();
    const availableCategories = values.expertise_categories;

    const handleSelect = async (category) => {
        if (category === selectedCategory) {
            setSelectedCategory('');
            setSelectedSpecialities([]);
            const data = await getFilteredExperts({})
            setFilteredExperts(data);
            return;
        }
        setSelectedCategory(category);
        setSelectedSpecialities([category]);
        const data = await getFilteredExperts({
            expertiseTags: [category],
        })
        console.log("Filtered by category: ", category, data);
        setFilteredExperts(data);
    }

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
                        onClick={() => handleSelect(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </section>
    )
}


function Filters({ filteredExperts, setFilteredExperts, filteredExpertsCount, selectedSpecialities, locationQuery, onClose }) {
    const [openSections, setOpenSections] = useState({
        clients: true,
        languages: true,
        distance: true,
    });

    const { values } = useValues();
    const consultation_modes = ['online', 'offline', 'both'];
    const clients_options = ["0-100", "100-200", "200-300", "300-400", "400-500", "500+"];
    const distance_options = ["Under 10", "Under 20", "Under 30", "Under 40", "Under 50"];

    const [allExperts, setAllExperts] = useState([]);
    const [filterInputs, setFilterInputs] = useState({
        Languages: {},
        Consultation: {},
        Distance: {},
        Clients_no: {}
    });
    const [wzAssured, setWzAssured] = useState(false);

    // ✅ Fetch ONLY once and initialize filters
    useEffect(() => {
        async function fetchData() {
            // Get selected distance radius
            const activeDistance = Object.keys(filterInputs.Distance).find(d => filterInputs.Distance[d]);
            const radiusKm = activeDistance ? parseInt(activeDistance.replace(/\D/g, '')) : '';

            const experts = await getFilteredExperts({
                city: locationQuery,
                expertiseTags: selectedSpecialities,
                radiusKm: radiusKm
            });

            setAllExperts(experts);

            // Re-initialize other filter types if first load, but preserve current state if it's a radius change
            // Actually, if radius changes, we just want to update allExperts. 
            // The local filters (Languages, Consultation, Clients) should stay as they are.
        }

        fetchData();
    }, [locationQuery, selectedSpecialities, filterInputs.Distance]);

    // Initialize ONLY ONCE or when values change
    useEffect(() => {
        const initialLanguages = {};
        (values?.languages || []).forEach((l) => initialLanguages[l] = false);

        const initialConsultation = {};
        consultation_modes.forEach((c) => initialConsultation[c] = false);

        const initialDistance = {};
        distance_options.forEach((d) => initialDistance[d] = false);

        const initialClients = {};
        clients_options.forEach((c) => initialClients[c] = false);

        setFilterInputs({
            Languages: initialLanguages,
            Consultation: initialConsultation,
            Distance: initialDistance,
            Clients_no: initialClients,
        });
        setWzAssured(false);
    }, [values]);

    // ✅ Handle checkbox change
    const handleFilterChange = (category, name) => {
        setFilterInputs((prev) => {
            if (category === 'Distance') {
                // For distance, only one can be selected
                const newDistance = { ...prev.Distance };
                Object.keys(newDistance).forEach(k => newDistance[k] = false);
                newDistance[name] = !prev.Distance[name];
                return { ...prev, Distance: newDistance };
            }
            return {
                ...prev,
                [category]: {
                    ...prev[category],
                    [name]: !prev[category][name]
                }
            };
        });
    };

    const handleClearFilters = () => {
        const initialLanguages = {};
        (values?.languages || []).forEach((l) => initialLanguages[l] = false);

        const initialConsultation = {};
        consultation_modes.forEach((c) => initialConsultation[c] = false);

        const initialDistance = {};
        distance_options.forEach((d) => initialDistance[d] = false);

        const initialClients = {};
        clients_options.forEach((c) => initialClients[c] = false);

        setFilterInputs({
            Languages: initialLanguages,
            Consultation: initialConsultation,
            Distance: initialDistance,
            Clients_no: initialClients,
        });
        setWzAssured(false);
    };

    // ✅ Apply filter (runs automatically)
    useEffect(() => {
        if (!allExperts.length) return;

        let result = [...allExperts];

        const activeLanguages = Object.keys(filterInputs.Languages).filter((l) => filterInputs.Languages[l]);
        if (activeLanguages.length > 0) {
            result = result.filter((expert) =>
                expert.languages && expert.languages.some((lang) => activeLanguages.includes(lang))
            );
        }

        const activeConsultation = Object.keys(filterInputs.Consultation).filter((c) => filterInputs.Consultation[c]);
        if (activeConsultation.length > 0) {
            result = result.filter((expert) => {
                const mode = (expert.consultationMode || expert.consultation_mode || "").toLowerCase();
                return activeConsultation.includes(mode) || activeConsultation.includes('both');
            });
        }

        const activeClientsOptions = Object.keys(filterInputs.Clients_no).filter(c => filterInputs.Clients_no[c]);
        if (activeClientsOptions.length > 0) {
            result = result.filter((expert) => {
                const trained = parseInt(expert.clientsTrained) || 0;
                return activeClientsOptions.some(option => {
                    if (option.includes('+')) {
                        const min = parseInt(option);
                        return trained >= min;
                    }
                    const [min, max] = option.split('-').map(n => parseInt(n));
                    return trained >= min && trained <= max;
                });
            });
        }

        if (wzAssured) {
            result = result.filter(expert => expert.wzAssured); // Assumes field exists, safely filters out if undefined
        }

        setFilteredExperts(result);
    }, [filterInputs, wzAssured, allExperts]);

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <div className="flex flex-col w-full bg-white rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm sticky top-24">
            {/* Theme Matched Header */}
            <div className="bg-white border-b border-gray-50 p-6 lg:p-7 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--brand-primary)]"></div>
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg lg:text-xl font-black text-gray-900 tracking-tight">
                        Filters
                    </h4>
                    <button
                        onClick={handleClearFilters}
                        className="text-[var(--brand-primary)] hover:text-[#76b813] text-[10px] font-black uppercase tracking-widest transition-colors"
                    >
                        Clear All
                    </button>
                </div>
                <p className="text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                    {filteredExpertsCount} Experts Found
                </p>
            </div>

            <div className="p-6 lg:p-8 space-y-7 lg:space-y-9">
                {/* WZ Assured - Modern Toggle */}
                <div className="p-4 bg-lime-50/50 rounded-2xl border border-lime-100/50">
                    <label className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[var(--brand-primary)] rounded-lg flex items-center justify-center shadow-md shadow-lime-500/10">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-black text-gray-900 tracking-tight italic">WZ Assured</span>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={wzAssured}
                                onChange={() => setWzAssured(!wzAssured)}
                                className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
                        </div>
                    </label>
                </div>

                {/* Consultation Mode */}
                <div className="space-y-5">
                    <h6 className="text-sm font-black text-gray-900 tracking-tight uppercase border-l-2 border-[var(--brand-primary)] pl-3">Consultation Mode</h6>
                    <div className="space-y-3 pl-1">
                        {consultation_modes.map((mode) => (
                            <label key={mode} className="flex items-center gap-4 group cursor-pointer">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={filterInputs.Consultation[mode] || false}
                                        onChange={() => handleFilterChange('Consultation', mode)}
                                        className="w-5 h-5 cursor-pointer accent-[var(--brand-primary)] rounded border-gray-300"
                                    />
                                </div>
                                <span className={`text-sm font-bold transition-colors ${filterInputs.Consultation[mode] ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-500'} capitalize`}>
                                    {mode}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Collapsible: No. of Clients */}
                <div className="space-y-5 border-t border-gray-50 pt-5">
                    <button onClick={() => toggleSection('clients')} className="flex items-center justify-between w-full text-left">
                        <span className="text-sm font-black text-gray-900 tracking-tight uppercase border-l-2 border-[var(--brand-primary)] pl-3">No. of Clients</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.clients ? '' : 'rotate-180'}`} />
                    </button>
                    {openSections.clients && Object.keys(filterInputs.Clients_no).length > 0 && (
                        <div className="grid grid-cols-1 gap-3 pl-1 pb-2">
                            {Object.keys(filterInputs.Clients_no).map((item) => (
                                <label key={item} className="flex items-center gap-4 group cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filterInputs.Clients_no[item] || false}
                                        onChange={() => handleFilterChange('Clients_no', item)}
                                        className="w-5 h-5 cursor-pointer accent-[var(--brand-primary)]"
                                    />
                                    <span className={`text-sm font-bold transition-colors ${filterInputs.Clients_no[item] ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-500'}`}>{item}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Collapsible: Languages */}
                <div className="space-y-5 border-t border-gray-50 pt-5">
                    <button onClick={() => toggleSection('languages')} className="flex items-center justify-between w-full text-left">
                        <span className="text-sm font-black text-gray-900 tracking-tight uppercase border-l-2 border-[var(--brand-primary)] pl-3">Languages</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.languages ? '' : 'rotate-180'}`} />
                    </button>
                    {openSections.languages && Object.keys(filterInputs.Languages).length > 0 && (
                        <div className="grid grid-cols-1 gap-3 pl-1 pb-2">
                            {Object.keys(filterInputs.Languages).map((item) => (
                                <label key={item} className="flex items-center gap-4 group cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name={item}
                                        checked={filterInputs.Languages[item] || false}
                                        onChange={() => handleFilterChange('Languages', item)}
                                        className="w-5 h-5 cursor-pointer accent-[var(--brand-primary)]"
                                    />
                                    <span className={`text-sm font-bold transition-colors ${filterInputs.Languages[item] ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-500'}`}>{item}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Collapsible: Distance Range */}
                <div className="space-y-5 border-t border-gray-50 pt-5 pb-4">
                    <button onClick={() => toggleSection('distance')} className="flex items-center justify-between w-full text-left">
                        <div className="flex items-baseline gap-1 border-l-2 border-[var(--brand-primary)] pl-3">
                            <span className="text-sm font-black text-gray-900 tracking-tight uppercase">Distance Range</span>
                            <span className="text-[9px] font-black text-gray-400 lowercase italic">(km)</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.distance ? '' : 'rotate-180'}`} />
                    </button>
                    {openSections.distance && Object.keys(filterInputs.Distance).length > 0 && (
                        <div className="grid grid-cols-1 gap-3 pl-1">
                            {Object.keys(filterInputs.Distance).map((item) => (
                                <label key={item} className="flex items-center gap-4 group cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filterInputs.Distance[item] || false}
                                        onChange={() => handleFilterChange('Distance', item)}
                                        className="w-5 h-5 cursor-pointer accent-[var(--brand-primary)]"
                                    />
                                    <span className={`text-sm font-bold transition-colors ${filterInputs.Distance[item] ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-500'}`}>{item}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Close/Apply Button for Mobile */}
                {onClose && (
                    <div className="lg:hidden pt-4 pb-2">
                        <button
                            onClick={onClose}
                            className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95"
                        >
                            Apply Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}