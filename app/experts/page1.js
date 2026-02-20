'use client'
import { Search, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchAPI } from '@/lib/api';

function ExpertCard({ expert }) {
    let specializations_string = ''
    if (expert.specializations.length > 2) {
        specializations_string = expert.specializations[0] + ", " + expert.specializations[1] +  " more..."
    }
    else if (expert.specializations.length == 2){
        specializations_string = expert.specializations[0] + ", " + expert.specializations[1]

    }
    else{
        specializations_string = expert.specializations[0]
    }

    return (
        <div className="flex flex-col items-center sm:items-start group cursor-pointer text-center sm:text-left">
            <div className="w-full aspect-square bg-gray-100 rounded-[28px] overflow-hidden mb-4 relative shadow-sm group-hover:shadow-md transition-all duration-500">
                <img
                    src={expert.profilePhoto}
                    alt={expert.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
            </div>
            <h3 className="font-black text-gray-900 text-sm sm:text-lg leading-tight">{expert.coach}</h3>
            <p className="text-gray-400 text-[9px] sm:text-xs font-black uppercase tracking-widest mt-1.5">{specializations_string}</p>
        </div>
    )
}
function ExpertList({ experts }) {
    console.log('experts', experts);
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 sm:gap-x-6 gap-y-10 mb-16">
            {experts.map((expert, i) => (
                <ExpertCard key={i} expert={expert} />
            ))}
        </div>
    )
}
function LocationSelectorDropdown({ setLocationQuery, setShowLocationDropdown }) {
    return (
        <div className="absolute right-[-10px] md:right-auto md:left-1/2 md:-translate-x-1/4 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-[999]">
            {/* Near me option */}
            <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                    setLocationQuery('Near me');
                    setShowLocationDropdown(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left group"
            >
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-lime-100 transition-colors">
                    <MapPin className="w-4 h-4 text-gray-600 group-hover:text-lime-600" />
                </div>
                <span className="text-sm font-semibold text-gray-900">Near me</span>
            </button>

            {/* Popular Cities Header */}
            <div className="mt-3 mb-2 px-3">
                <h4 className="text-xs font-medium text-gray-400">Popular Cities</h4>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 mx-3 mb-1"></div>

            {/* City List */}
            <div className="space-y-0.5">
                {['Delhi', 'Bengaluru', 'Mumbai'].map((city) => (
                    <button
                        key={city}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                            setLocationQuery(city);
                            setShowLocationDropdown(false);
                        }}
                        className="w-full px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                        <span className="text-sm font-medium text-gray-700">{city}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default function ExpertsPage1() {
    

    return (
        <main className="min-h-screen bg-white font-sans selection:bg-lime-200">
            {/* Search Section */}
            <section className="pt-10 md:pt-12 pb-8 px-6">
                <div className="max-w-4xl mx-auto relative">
                    <div className="bg-gray-50 rounded-2xl p-1.5 sm:p-2 flex flex-col md:flex-row items-center border border-gray-100 shadow-sm relative z-10 overflow-visible">
                        <div className="flex-1 flex items-center px-4 w-full md:w-auto mb-1 md:mb-0">
                            <Search className="text-gray-400 w-4 h-4 md:w-5 md:h-5 mr-3 shrink-0" />
                            <input
                                type="text"
                                placeholder="Speciality"
                                value={specialityQuery}
                                onChange={(e) => setSpecialityQuery(e.target.value)}
                                className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-400 py-2 sm:py-3 text-xs sm:text-sm"
                            />
                        </div>
                        <div className="hidden md:block w-px h-8 bg-gray-200 mx-2"></div>
                        <div className="flex-1 flex items-center px-4 w-full md:w-auto mb-3 md:mb-0 border-t md:border-t-0 border-gray-100 pt-2 md:pt-0">
                            <MapPin className="text-gray-400 w-4 h-4 md:w-5 md:h-5 mr-3 shrink-0" />
                            <input
                                type="text"
                                placeholder="Location"
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                                onFocus={() => setShowLocationDropdown(true)}
                                onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
                                className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-400 py-2 sm:py-3 text-xs sm:text-sm"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="bg-[#65a30d] hover:bg-[#4d7c0f] text-white font-black text-[10px] sm:text-xs px-8 py-3 rounded-xl transition-all w-full md:w-auto shadow-lg shadow-lime-600/20 whitespace-nowrap active:scale-95 uppercase tracking-widest"
                        >
                            Search Experts
                        </button>
                    </div>

                    {/* Location Selector Dropdown - outside the search bar */}
                    {showLocationDropdown && (
                        <LocationSelectorDropdown setLocationQuery={setLocationQuery} setShowLocationDropdown={setShowLocationDropdown} />
                    )}
                </div>
            </section>

            {/* Categories */}
            <section className="px-6 pb-12 overflow-x-auto scrollbar-hide">
                <div className="flex justify-start md:justify-center min-w-max gap-2.5 pb-4">
                    <button className="px-6 py-2 rounded-full bg-[#65a30d] text-white font-black shadow-md shadow-lime-600/20 text-xs transition-all hover:scale-105 active:scale-95 uppercase tracking-widest">All</button>
                    {categories.map((cat, i) => (
                        <button key={i} className="px-6 py-2 rounded-full bg-white text-gray-400 font-bold border border-gray-200 hover:border-[#65a30d] hover:text-[#65a30d] transition-all text-xs whitespace-nowrap uppercase tracking-widest">
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* Experts Grid */}
            <section className="px-6 pb-24 max-w-7xl mx-auto">
                <ExpertList experts={filteredExperts} />
                <div className="flex justify-center text-center">
                    <button className="bg-gray-50 border border-gray-100 hover:bg-[#65a30d] hover:text-white text-[#65a30d] font-black py-4 px-10 rounded-2xl transition-all text-xs uppercase tracking-widest shadow-sm active:scale-95">
                        View all Experts
                    </button>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="bg-[#5c9609] py-16 md:py-24 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-6 mb-12 sm:mb-16 text-center text-white">
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-4 tracking-tight">Our Reviews Speaks for Itself</h2>
                    <p className="text-lime-100 text-[10px] sm:text-sm max-w-2xl mx-auto opacity-70 font-medium tracking-wide leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                {/* Review Cards - Row 1 */}
                <div className="flex justify-start sm:justify-center gap-4 sm:gap-6 px-6 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide pb-4 md:pb-0">
                    <ReviewCard />
                    <ReviewCard />
                    <ReviewCard />
                    <ReviewCard />
                    <ReviewCard />
                </div>
                {/* Review Cards - Row 2 */}
                <div className="flex justify-start sm:justify-center gap-4 sm:gap-6 px-6 overflow-x-auto scrollbar-hide pb-4 md:pb-0">
                    <ReviewCard opacity="opacity-40" />
                    <ReviewCard />
                    <ReviewCard />
                    <ReviewCard />
                    <ReviewCard opacity="opacity-40" />
                </div>
            </section>
        </main>
    );
}

function ReviewCard({ opacity = "" }) {
    return (
        <div className={`bg-[#6aa810] p-6 rounded-2xl w-72 shrink-0 border border-white/10 ${opacity}`}>
            <div className="w-10 h-10 bg-white/20 rounded-lg mb-4"></div>
            <p className="text-white font-medium text-sm leading-relaxed">
                Lorem ipsum dolor sit amet
            </p>
        </div>
    )
}
