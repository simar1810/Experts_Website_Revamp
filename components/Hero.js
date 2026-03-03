'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Star, X, ChevronDown } from 'lucide-react';
import { availableSpecialities } from '@/lib/data/specialities';
import { availableCities } from '@/lib/data/locations';
import { toast } from 'react-hot-toast';

async function findCityFromCoordinates({ coordinates }) {
    if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
        return null;
    }
    try {
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`);
        const data = await res.json();
        return data.city;
    } catch (error) {
        return null;
    }
}

function LocationSelectorDropdown({ coordinateLocation, setLocationQuery, setShowLocationDropdown }) {
    return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-4 z-[999]">
            <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={async () => {
                    if (coordinateLocation) {
                        const city = await findCityFromCoordinates({ coordinates: coordinateLocation });
                        if (city) setLocationQuery(city);
                    }
                    setShowLocationDropdown(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-800 rounded-lg transition-colors text-left group"
            >
                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-lime-500/20 transition-colors">
                    <MapPin className="w-4 h-4 text-gray-400 group-hover:text-lime-500" />
                </div>
                <span className="text-sm font-semibold text-white">Near me</span>
            </button>
            <div className="mt-3 mb-2 px-3">
                <h4 className="text-xs font-medium text-gray-500">Popular Cities</h4>
            </div>
            <div className="border-t border-gray-800 mx-3 mb-1"></div>
            <div className="space-y-0.5">
                {availableCities.map((city) => (
                    <button
                        key={city}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                            setLocationQuery(city);
                            setShowLocationDropdown(false);
                        }}
                        className="w-full px-3 py-2.5 hover:bg-gray-800 rounded-lg transition-colors text-left"
                    >
                        <span className="text-sm font-medium text-gray-300">{city}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

function SpecialitySelectorDropdown({ specialityQuery, availableSpecialities, selectedSpecialities, onSelectTag, setShowSpecialityDropdown }) {
    const filtered = availableSpecialities.filter(spec =>
        spec.toLowerCase().includes(specialityQuery.toLowerCase()) &&
        !selectedSpecialities.includes(spec)
    );
    if (filtered.length === 0) return null;
    return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-4 z-[999]">
            <div className="mb-2 px-3">
                <h4 className="text-xs font-medium text-gray-500">Available Specialities</h4>
            </div>
            <div className="space-y-0.5 max-h-48 overflow-y-auto">
                {filtered.map((spec) => (
                    <button
                        key={spec}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                            onSelectTag(spec);
                            setShowSpecialityDropdown(false);
                        }}
                        className="w-full px-3 py-2.5 hover:bg-gray-800 rounded-lg transition-colors text-left group flex items-center justify-between"
                    >
                        <span className="text-sm font-medium text-gray-300 group-hover:text-lime-500">{spec}</span>
                        <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-lime-500 -rotate-90" />
                    </button>
                ))}
            </div>
        </div>
    )
}

export default function Hero() {
    const router = useRouter();
    const [specialityQuery, setSpecialityQuery] = useState('');
    const [selectedSpecialities, setSelectedSpecialities] = useState([]);
    const [locationQuery, setLocationQuery] = useState('');
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showSpecialityDropdown, setShowSpecialityDropdown] = useState(false);
    const [coordinateLocation, setCoordinateLocation] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCoordinateLocation({ latitude, longitude });
                }
            );
        }
    }, []);

    const addSpeciality = (spec) => {
        if (!selectedSpecialities.includes(spec)) {
            setSelectedSpecialities([...selectedSpecialities, spec]);
        }
        setSpecialityQuery('');
    };

    const removeSpeciality = (spec) => {
        setSelectedSpecialities(selectedSpecialities.filter(s => s !== spec));
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (selectedSpecialities.length > 0 && locationQuery.length > 0) {
            params.set('speciality', selectedSpecialities.join(','));
            params.set('location', locationQuery);
            router.push(`/experts?${params.toString()}`);
        }
        else {
            if (selectedSpecialities.length === 0) {
                toast.error("Please select at least one speciality");
            }
            if (locationQuery.length === 0) {
                toast.error("Please enter a location");
            }
        }
    };

    return (
        <section className="relative bg-gray-900 text-white">
            {/* Background Image Overlay - Simulated */}
            <div className="absolute inset-0 bg-black/60 z-0"></div>

            {/* Content Container */}
            <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-24 grid md:grid-cols-2 gap-10 md:gap-12 items-center">
                {/* Left Column: Text & Search */}
                <div className="space-y-6 md:space-y-8 text-center md:text-left">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight">
                        The Best online <span className="text-lime-500">Marketplace</span> for <br className="hidden md:block" />
                        Wellness Experts
                    </h1>
                    <p className="text-gray-400 text-sm md:text-lg max-w-md mx-auto md:mx-0">
                        For Individuals seeking to improve their fitness
                        level and creators of lifestyle & wellness seeking
                        to grow their business with us. Get started today!
                    </p>

                    {/* Search Bar */}
                    <div className="bg-gray-800/80 p-1.5 md:p-2 rounded-xl flex flex-col md:flex-row gap-0.5 max-w-xl mx-auto md:mx-0 border border-gray-700 relative">
                        <div className="flex items-center flex-1 px-3 border-b md:border-b-0 md:border-r border-gray-700/50 relative">
                            <Search className="w-3.5 h-3.5 md:w-5 md:h-5 text-gray-400 mr-2 shrink-0" />
                            <div className="flex flex-wrap gap-1.5 flex-1 items-center py-1">
                                {selectedSpecialities.map(spec => (
                                    <span key={spec} className="bg-lime-500 text-white text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 group/tag">
                                        {spec}
                                        <X className="w-2.5 h-2.5 cursor-pointer hover:text-red-200 transition-colors" onClick={() => removeSpeciality(spec)} />
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    placeholder={selectedSpecialities.length === 0 ? "Speciality" : ""}
                                    value={specialityQuery}
                                    onChange={(e) => {
                                        setSpecialityQuery(e.target.value);
                                        setShowSpecialityDropdown(true);
                                    }}
                                    onFocus={() => setShowSpecialityDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowSpecialityDropdown(false), 200)}
                                    className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500 py-2.5 text-xs md:text-base min-w-[100px] flex-1"
                                />
                            </div>
                            {showSpecialityDropdown && (
                                <SpecialitySelectorDropdown
                                    specialityQuery={specialityQuery}
                                    availableSpecialities={availableSpecialities}
                                    selectedSpecialities={selectedSpecialities}
                                    onSelectTag={addSpeciality}
                                    setShowSpecialityDropdown={setShowSpecialityDropdown}
                                />
                            )}
                        </div>
                        <div className="flex items-center flex-1 px-3 relative">
                            <MapPin className="w-3.5 h-3.5 md:w-5 md:h-5 text-gray-400 mr-2 shrink-0" />
                            <input
                                type="text"
                                placeholder="Location"
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                                onFocus={() => setShowLocationDropdown(true)}
                                onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
                                className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500 py-2.5 text-xs md:text-base"
                            />
                            {showLocationDropdown && (
                                <LocationSelectorDropdown
                                    coordinateLocation={coordinateLocation}
                                    setLocationQuery={setLocationQuery}
                                    setShowLocationDropdown={setShowLocationDropdown}
                                />
                            )}
                        </div>
                        <button
                            onClick={handleSearch}
                            className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2.5 rounded-lg md:rounded-xl shadow-lg font-bold transition-all active:scale-[0.98] text-xs md:text-base whitespace-nowrap"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Right Column: Hero Image & Overlay Card */}
                <div className="relative h-full min-h-[300px] md:min-h-[400px] flex justify-center items-center mt-6 md:mt-0">
                    {/* Placeholder for Hero Image */}
                    <div className="bg-gray-800 rounded-2xl md:rounded-3xl w-full h-[300px] md:h-[500px] object-cover relative overflow-hidden shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" alt="Hero" className="w-full h-full object-cover opacity-70" />
                    </div>

                    {/* Success Story Card Overlay */}
                    <div className="absolute -bottom-4 md:-bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-[-40px] bg-white/10 backdrop-blur-xl border border-white/20 p-3 md:p-5 rounded-xl md:rounded-3xl w-[92%] sm:w-auto max-w-[260px] md:max-w-sm shadow-2xl z-20">
                        <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4">
                            <div className="w-8 h-8 md:w-12 md:h-12 bg-gray-300 rounded-lg md:rounded-2xl overflow-hidden shrink-0 border border-white/20">
                                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Simarpreet Singh" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <h4 className="font-bold text-white text-[12px] md:text-base leading-tight">Simarpreet Singh</h4>
                                <span className="text-gray-400 text-[9px] md:text-xs">Wellness Coach</span>
                            </div>
                            <div className="ml-auto flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-2.5 h-2.5 md:w-4 md:h-4 text-lime-400 fill-current" />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-1 md:space-y-2">
                            <h5 className="font-bold text-white text-[11px] md:text-lg leading-tight">Great platform for experts</h5>
                            <p className="text-[9px] md:text-xs text-gray-300 leading-relaxed opacity-80">
                                This platform helped me reach more clients than ever before. Highly recommended!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

