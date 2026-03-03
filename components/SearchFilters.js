'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, X, ChevronDown } from 'lucide-react';
import { availableSpecialities } from '@/lib/data/specialities';
import { availableCities } from '@/lib/data/locations';

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

function LocationSelectorDropdown({ coordinateLocation, locationQuery, setLocationQuery, setShowLocationDropdown, theme = 'light' }) {
    const isDark = theme === 'dark';

    const filteredCities = availableCities.filter(city =>
        city.toLowerCase().includes(locationQuery.toLowerCase())
    );

    return (
        <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-xl p-4 z-[999] border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'
            }`}>
            {/* Near me option - Only show if no query or if it matches "Near me" */}
            {(!locationQuery || "near me".includes(locationQuery.toLowerCase())) && (
                <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={async () => {
                        if (coordinateLocation) {
                            const city = await findCityFromCoordinates({ coordinates: coordinateLocation });
                            if (city) setLocationQuery(city);
                        } else {
                            setLocationQuery('Near me');
                        }
                        setShowLocationDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left group ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                        }`}
                >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-gray-800 group-hover:bg-lime-500/20' : 'bg-gray-100 group-hover:bg-lime-100'
                        }`}>
                        <MapPin className={`w-4 h-4 ${isDark ? 'text-gray-400 group-hover:text-lime-500' : 'text-gray-600 group-hover:text-lime-600'
                            }`} />
                    </div>
                    <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Near me</span>
                </button>
            )}

            {filteredCities.length > 0 && (
                <>
                    {/* Popular Cities Header */}
                    <div className="mt-3 mb-2 px-3">
                        <h4 className="text-xs font-medium text-gray-400">
                            {locationQuery ? 'Matching Cities' : 'Popular Cities'}
                        </h4>
                    </div>

                    {/* Divider */}
                    <div className={`border-t mx-3 mb-1 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}></div>

                    {/* City List */}
                    <div className="space-y-0.5">
                        {filteredCities.map((city) => (
                            <button
                                key={city}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                    setLocationQuery(city);
                                    setShowLocationDropdown(false);
                                }}
                                className={`w-full px-3 py-2.5 rounded-lg transition-colors text-left ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                                    }`}
                            >
                                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{city}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}


function SpecialitySelectorDropdown({ specialityQuery, selectedSpecialities, onSelectTag, setShowSpecialityDropdown, theme = 'light' }) {
    const isDark = theme === 'dark';

    const filtered = availableSpecialities.filter(spec =>
        spec.toLowerCase().includes(specialityQuery.toLowerCase()) &&
        !selectedSpecialities.includes(spec)
    );

    if (filtered.length === 0) return null;

    return (
        <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-xl p-4 z-[999] border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'
            }`}>
            <div className="mb-2 px-3">
                <h4 className="text-xs font-medium text-gray-400">Available Specialities</h4>
            </div>
            <div className="space-y-0.5 max-h-48 overflow-y-auto scrollbar-hide">
                {filtered.map((spec) => (
                    <button
                        key={spec}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                            onSelectTag(spec);
                            setShowSpecialityDropdown(false);
                        }}
                        className={`w-full px-3 py-2.5 rounded-lg transition-colors text-left group flex items-center justify-between ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                            }`}
                    >
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-300 group-hover:text-lime-500' : 'text-gray-700 group-hover:text-[#84cc16]'
                            }`}>{spec}</span>
                        <ChevronDown className={`w-3 h-3 -rotate-90 transition-colors ${isDark ? 'text-gray-500 group-hover:text-lime-500' : 'text-gray-300 group-hover:text-[#84cc16]'
                            }`} />
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function SearchFilters({
    selectedSpecialities,
    setSelectedSpecialities,
    locationQuery,
    setLocationQuery,
    onSearch,
    coordinateLocation = null,
    theme = 'light',
    containerClassName = '',
    inputWrapperClassName = '',
    buttonClassName = '',
    buttonText = 'Search Experts',
    specialityIconColor = 'text-gray-300',
    locationIconColor = 'text-gray-300',
    placeholderSpeciality = 'Speciality',
    placeholderLocation = 'Location'
}) {
    const [specialityQuery, setSpecialityQuery] = useState('');
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showSpecialityDropdown, setShowSpecialityDropdown] = useState(false);

    const isDark = theme === 'dark';

    const addSpeciality = (spec) => {
        if (!selectedSpecialities.includes(spec)) {
            setSelectedSpecialities([...selectedSpecialities, spec]);
        }
        setSpecialityQuery('');
    };

    const removeSpeciality = (spec) => {
        setSelectedSpecialities(selectedSpecialities.filter(s => s !== spec));
    };

    return (
        <div className={`flex flex-col lg:flex-row items-stretch gap-1 ${containerClassName}`} style={{ position: 'relative', zIndex: 10 }}>
            {/* Speciality Input */}
            <div className={`flex items-center flex-1 px-3 py-1 min-w-0 ${inputWrapperClassName}`} style={{ position: 'relative' }}>
                <Search className={`w-4 h-4 shrink-0 mr-2 ${specialityIconColor}`} />
                <div className="flex flex-wrap gap-1.5 flex-1 items-center min-w-0">
                    {selectedSpecialities.map(spec => (
                        <span key={spec} className="bg-lime-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                            {spec}
                            <X className="w-2.5 h-2.5 cursor-pointer hover:text-red-200 transition-colors" onClick={() => removeSpeciality(spec)} />
                        </span>
                    ))}
                    <input
                        type="text"
                        placeholder={selectedSpecialities.length === 0 ? placeholderSpeciality : ""}
                        value={specialityQuery}
                        onChange={(e) => {
                            setSpecialityQuery(e.target.value);
                            setShowSpecialityDropdown(true);
                        }}
                        onFocus={() => setShowSpecialityDropdown(true)}
                        onClick={() => setShowSpecialityDropdown(true)}
                        onBlur={() => setTimeout(() => setShowSpecialityDropdown(false), 200)}
                        className={`bg-transparent border-none outline-none text-sm flex-1 min-w-[80px] ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-700 placeholder-gray-400'
                            }`}
                    />
                </div>
                {showSpecialityDropdown && (
                    <SpecialitySelectorDropdown
                        specialityQuery={specialityQuery}
                        selectedSpecialities={selectedSpecialities}
                        onSelectTag={addSpeciality}
                        setShowSpecialityDropdown={setShowSpecialityDropdown}
                        theme={theme}
                    />
                )}
            </div>

            {/* Location Input */}
            <div className={`flex items-center flex-1 px-3 py-1 min-w-0 ${inputWrapperClassName}`} style={{ position: 'relative' }}>
                <MapPin className={`w-4 h-4 shrink-0 mr-2 ${locationIconColor}`} />
                <input
                    type="text"
                    placeholder={placeholderLocation}
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    onFocus={() => setShowLocationDropdown(true)}
                    onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
                    className={`bg-transparent border-none outline-none w-full text-sm min-w-0 ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-700 placeholder-gray-400'
                        }`}
                />
                {showLocationDropdown && (
                    <LocationSelectorDropdown
                        coordinateLocation={coordinateLocation}
                        locationQuery={locationQuery}
                        setLocationQuery={setLocationQuery}
                        setShowLocationDropdown={setShowLocationDropdown}
                        theme={theme}
                    />
                )}

            </div>

            {/* Search Button */}
            <button
                onClick={onSearch}
                className={`transition-all active:scale-[0.98] whitespace-nowrap ${buttonClassName}`}
            >
                {buttonText === 'Search' && <Search className="w-4 h-4 inline-block mr-2" />}
                {buttonText}
            </button>
        </div>
    );
}
