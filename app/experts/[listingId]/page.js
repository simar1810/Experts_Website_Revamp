'use client';

import { Search, MapPin, ThumbsUp, CheckCircle2, Star, ChevronDown, Bell, User, X, Globe, Trophy, GraduationCap, Users } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import { fetchAPI, sendData } from '@/lib/api';
import { useState, use, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { availableSpecialities } from '@/lib/data/specialities';
import { availableCities } from '@/lib/data/locations';

function EnquiryBox({ listingId }) {
    const { isAuthenticated, openLoginModal } = useAuth();
    const [message, setMessage] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        if (!isAuthenticated) {
            openLoginModal();
            return;
        }

        try {
            const success = await fetchAPI('/experts/inquiry/create', {
                listingId: listingId,
                message: message,
                consultationMode: "online"
            });
            console.log(success)
            if (success) {
                toast.success('Enquiry sent successfully');
                setMessage('');
            }
        } catch (error) {
            console.error(error);
            toast.error('Enquiry failed: ' + (error.message || 'Unknown error'));
        }
    }

    return (
        <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 sm:ml-4">Your Enquiry Here</h3>
                <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-[2rem] p-4 sm:p-5 shadow-sm">
                    <form onSubmit={handleSubmit}>
                        <textarea
                            placeholder="Write your Message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full h-40 bg-[#fdfdfd] rounded-xl p-4 text-sm text-gray-700 outline-none resize-none border-none placeholder-gray-300 shadow-inner"
                        ></textarea>
                        <button className="w-full bg-[#84cc16] hover:bg-[#76b813] text-white py-4 rounded-xl font-bold text-sm mt-8 transition-colors shadow-lg shadow-lime-500/20">
                            Send Enquiry
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

function ReviewModal({ isOpen, onClose, userName, listingId }) {
    const [ratings, setRatings] = useState({
        knowledge: 1,
        results: 1,
        communication: 1,
        punctuality: 1,
        workoutQuality: 1,
    });
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showError, setShowError] = useState(false);

    const categories = [
        { id: 'Knowledge', key: 'knowledge' },
        { id: 'Results', key: 'results' },
        { id: 'Communication', key: 'communication' },
        { id: 'Punctuality', key: 'punctuality' },
        { id: 'Work Quality', key: 'workoutQuality' },
    ];

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!message.trim()) {
            setShowError(true);
            return;
        }
        setIsSubmitting(true);
        try {
            const payload = {
                listingId: listingId,
                text: message,
                ratings: ratings
            };
            const response = await fetchAPI('/experts/review/create', payload, 'POST');
            if (response) {
                toast.success('Review added successfully');
                onClose();
            }
        } catch (error) {
            console.error('Failed to add review:', error);
            toast.error(error.message || 'Failed to add review');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-lg rounded-[2rem] p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto scrollbar-hide">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Write a Review</h2>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-900" />
                    </button>
                </div>

                <div className="space-y-5">
                    {/* User Info */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <span className="text-lg font-bold text-gray-900">{userName || 'User'}</span>
                    </div>

                    {/* Detailed Ratings */}
                    <div className="space-y-3 bg-gray-50/50 p-5 rounded-[1.5rem] shadow-inner">
                        {categories.map((cat) => (
                            <div key={cat.id} className="flex items-center justify-between gap-4">
                                <span className="text-xs sm:text-sm font-bold text-gray-700">{cat.id}</span>
                                <div className="flex gap-1 shrink-0">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                            key={s}
                                            onClick={() => setRatings(prev => ({ ...prev, [cat.key]: s }))}
                                            className={`w-4 h-4 sm:w-5 sm:h-5 cursor-pointer transition-all ${s <= ratings[cat.key] ? 'fill-[#84cc16] text-[#84cc16]' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Textarea */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-sm font-bold text-gray-700">Your Experience</label>
                            {showError && <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">(required)</span>}
                        </div>
                        <textarea
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                                if (e.target.value.trim()) setShowError(false);
                            }}
                            placeholder="Write your review experience here..."
                            className={`w-full h-28 sm:h-32 bg-gray-50/50 rounded-[1.5rem] p-5 sm:p-6 text-gray-700 outline-none resize-none placeholder-gray-400 text-sm italic leading-relaxed shadow-inner transition-all border ${showError ? 'border-red-500 bg-red-50/10' : 'border-transparent'}`}
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full bg-[#71b111] hover:bg-[#639b0f] disabled:opacity-50 text-white py-3.5 sm:py-4 rounded-[1.2rem] font-bold text-sm sm:text-base transition-all shadow-xl shadow-lime-900/10 active:scale-95 flex items-center justify-center"
                    >
                        {isSubmitting ? 'Adding...' : 'Add Review'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function LocationSelectorDropdown({ setLocationQuery, setShowLocationDropdown }) {
    return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-[999]">
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

function SpecialitySelectorDropdown({ specialityQuery, availableSpecialities, selectedSpecialities, onSelectTag, setShowSpecialityDropdown }) {
    const filtered = availableSpecialities.filter(spec =>
        spec.toLowerCase().includes(specialityQuery.toLowerCase()) &&
        !selectedSpecialities.includes(spec)
    );

    if (filtered.length === 0) return null;

    return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-[999]">
            <div className="mb-2 px-3">
                <h4 className="text-xs font-medium text-gray-400">Available Specialities</h4>
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
                        className="w-full px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left group flex items-center justify-between"
                    >
                        <span className="text-sm font-medium text-gray-700 group-hover:text-[#84cc16]">{spec}</span>
                        <ChevronDown className="w-3 h-3 text-gray-300 group-hover:text-[#84cc16] -rotate-90" />
                    </button>
                ))}
            </div>
        </div>
    )
}


export default function CoachProfilePage({ params }) {
    const { listingId } = use(params)
    const [specialityQuery, setSpecialityQuery] = useState('');
    const [selectedSpecialities, setSelectedSpecialities] = useState([]);
    const [locationQuery, setLocationQuery] = useState('');
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showSpecialityDropdown, setShowSpecialityDropdown] = useState(false);
    const [coachData, setCoachData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const { user, isAuthenticated, openLoginModal } = useAuth();
    const [reviews, setReviews] = useState([]);

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
        const queryParams = new URLSearchParams();
        if (selectedSpecialities.length > 0) {
            queryParams.set('speciality', selectedSpecialities.join(','));
        }
        if (locationQuery) {
            queryParams.set('location', locationQuery);
        }
        window.location.href = `/experts?${queryParams.toString()}`;
    };

    useEffect(() => {
        const getCoachDetails = async () => {
            try {
                setIsLoading(true);
                const data = await fetchAPI(`/experts/listing/public/details`, {
                    listingId: listingId
                });
                console.log("Coach details:", data);
                setCoachData(data);
                setReviews(data.reviews);
            } catch (err) {
                console.error("Failed to fetch coach details:", err);
            } finally {
                setIsLoading(false);
            }
        };
        getCoachDetails();
    }, []);

    const coachInfo = coachData?.coach;
    const details = coachData?.expertDetails;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
            </div>
        );
    }

    if (!coachData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 font-bold">Coach not found.</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white font-sans mb-30">
            <div className="h-[72px]"></div>

            {/* Breadcrumb & Search Section */}
            <section className="bg-white px-4 sm:px-6 py-4 max-w-7xl mx-auto">
                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                    <Search className="w-3 h-3" />
                    <span>Search / </span>
                    <span className="text-[#84cc16] font-medium font-bold">Coach Profile</span>
                </div>

                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="flex-1 flex items-center gap-3 bg-[#f8f9fa] rounded-lg px-3 sm:px-4 py-2.5 border border-gray-100 relative min-w-0">
                        <Search className="w-5 h-5 text-blue-500 shrink-0" />
                        <div className="flex flex-wrap gap-1.5 flex-1 items-center">
                            {selectedSpecialities.map(spec => (
                                <span key={spec} className="bg-lime-100 text-[#84cc16] text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 group/tag">
                                    {spec}
                                    <X className="w-2.5 h-2.5 cursor-pointer hover:text-red-500 transition-colors" onClick={() => removeSpeciality(spec)} />
                                </span>
                            ))}
                            <input
                                type="text"
                                placeholder={selectedSpecialities.length === 0 ? "Ex. Doctor, Hospital" : ""}
                                value={specialityQuery}
                                onChange={(e) => {
                                    setSpecialityQuery(e.target.value);
                                    setShowSpecialityDropdown(true);
                                }}
                                onFocus={() => setShowSpecialityDropdown(true)}
                                onClick={() => setShowSpecialityDropdown(true)}
                                onBlur={() => setTimeout(() => setShowSpecialityDropdown(false), 200)}
                                className="bg-transparent outline-none text-gray-700 text-sm flex-1 min-w-[100px]"
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
                    <div className="flex-1 flex items-center gap-3 bg-[#f8f9fa] rounded-lg px-3 sm:px-4 py-2.5 border border-gray-200 relative min-w-0">
                        <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                        <input
                            type="text"
                            placeholder="Set your location"
                            value={locationQuery}
                            onChange={(e) => setLocationQuery(e.target.value)}
                            onFocus={() => setShowLocationDropdown(true)}
                            onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
                            className="bg-transparent w-full outline-none text-gray-800 text-sm min-w-0 placeholder-gray-400"
                        />
                        {showLocationDropdown && (
                            <LocationSelectorDropdown setLocationQuery={setLocationQuery} setShowLocationDropdown={setShowLocationDropdown} />
                        )}
                    </div>
                    <button onClick={handleSearch} className="w-full md:w-auto bg-[#84cc16] hover:bg-[#76b813] text-white px-10 py-3 sm:py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-lime-500/20">
                        <Search className="w-4 h-4" />
                        Search
                    </button>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
                    {/* Left Column: Profile Card & Tabs */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Profile Overview Card */}
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0 mx-auto md:mx-0">
                                    <div className="w-full h-full rounded-full border-[3px] border-[#84cc16] overflow-hidden p-1">
                                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-50">
                                            <img
                                                src={coachInfo?.profilePhoto || details?.profilePhoto || "/images/coach.png"}
                                                alt={coachInfo?.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => e.target.src = "/images/coach.png"}
                                            />
                                        </div>
                                    </div>
                                    {details?.isVerified && (
                                        <div className="absolute right-2 bottom-4 bg-white rounded-full p-0.5 shadow-sm">
                                            <CheckCircle2 className="w-7 h-7 text-[#84cc16] fill-white" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-2 text-center md:text-left">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{coachInfo?.name}</h1>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                        {details?.specializations?.map((spec, i) => (
                                            <p key={i} className="text-gray-500 text-[10px] sm:text-xs font-black uppercase tracking-widest border border-gray-200 rounded-full px-3 py-1 bg-gray-50/50">
                                                {spec}
                                            </p>
                                        ))}
                                    </div>

                                    {details?.yearsExperience && (
                                        <p className="text-gray-600 text-sm font-medium">{details.yearsExperience} years experience overall</p>
                                    )}

                                    <div className="flex items-center justify-center md:justify-start gap-1.5 text-gray-900 text-sm font-bold pt-1">
                                        <MapPin className="w-4 h-4 text-[#84cc16]" />
                                        <span>{[details?.city, details?.state, details?.country].filter(Boolean).join(', ')}</span>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-3">
                                        {(details?.offersOnline || details?.offersInPerson) && (
                                            <div className="flex items-center gap-2 font-bold">
                                                <span className="text-[#84cc16] text-xs">AVAILABLE for</span>
                                                <span className="text-gray-500 text-[10px] uppercase tracking-wider">
                                                    {[details.offersOnline && 'Online', details.offersInPerson && 'In-Person'].filter(Boolean).join(' / ')}
                                                </span>
                                            </div>
                                        )}

                                        {details?.clientsTrained > 0 && (
                                            <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold">
                                                <Users className="w-3.5 h-3.5 text-lime-500" />
                                                <span>{details.clientsTrained}+ Clients Trained</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                                        <div className="flex items-center gap-1.5 bg-[#84cc16] text-white px-3 py-1.5 rounded text-sm font-bold shadow-lg shadow-lime-500/20">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span>{details?.ratingAgg?.overall?.avg?.toFixed(1) || "5.0"}</span>
                                        </div>
                                        <span className="text-gray-400 text-sm font-medium border-b border-gray-100 pb-0.5">
                                            {details?.reviewAgg?.totalReviews || 0} Patient Stories
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {details?.bio && (
                                <p className="text-gray-600 text-sm leading-[1.8] font-medium text-justify italic">
                                    "{details.bio}"
                                </p>
                            )}
                        </div>

                        {/* Tabs Container */}
                        <div>
                            <div className="flex items-center gap-2 sm:gap-8 border-b border-gray-100 pb-px mb-8 overflow-x-auto scrollbar-hide -mx-1 px-1">
                                {['Info', 'Stories', 'Services'].map((tab, i) => (
                                    <button
                                        key={tab}
                                        className={`shrink-0 pb-4 text-xs sm:text-sm font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${i === 0 ? 'text-white bg-[#84cc16] px-6 sm:px-10 py-3 rounded-t-lg' : 'text-gray-500 px-4 sm:px-6 hover:text-gray-700'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Services & Details Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-12">
                                {/* Specializations & Languages */}
                                <div className="space-y-10">
                                    {details?.specializations?.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-lime-50 flex items-center justify-center">
                                                    <Trophy className="w-4 h-4 text-[#84cc16]" />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Specializations</h3>
                                            </div>
                                            <ul className="space-y-3 pl-11">
                                                {details.specializations.map((spec, i) => (
                                                    <li key={i} className="text-gray-600 text-sm flex items-center gap-2 font-medium">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16]"></span>
                                                        {spec}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {details?.languages?.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                                    <Globe className="w-4 h-4 text-blue-500" />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Languages</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-2 pl-11">
                                                {details.languages.map((lang, i) => (
                                                    <span key={i} className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
                                                        {lang}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Certifications */}
                                <div className="space-y-10">
                                    {details?.certifications?.names?.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                                                    <GraduationCap className="w-4 h-4 text-orange-500" />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Certifications</h3>
                                            </div>
                                            <ul className="space-y-4 pl-11">
                                                {details.certifications.names.map((cert, i) => (
                                                    <li key={i} className="text-gray-500 text-sm leading-relaxed flex items-start gap-2 font-medium">
                                                        <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                                                        {cert}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {details?.institute && (
                                        <div className="space-y-2 pl-11">
                                            <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Educated at</h4>
                                            <p className="text-gray-800 font-bold">{details.institute}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-10 shadow-sm space-y-8 mt-12">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Reviews</h3>
                                <button
                                    onClick={() => {
                                        if (isAuthenticated) {
                                            setIsReviewModalOpen(true);
                                        } else {
                                            openLoginModal();
                                        }
                                    }}
                                    className="flex items-center gap-2 bg-[#84cc16] hover:bg-[#76b813] text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg shadow-lime-500/20 active:scale-95"
                                >
                                    <X className="w-4 h-4 rotate-45" />
                                    Write a Review
                                </button>
                            </div>

                            <div className="space-y-8">
                                {reviews.map((review, i) => (
                                    <div key={i} className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                                                <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                                            </div>
                                            <span className="text-sm sm:text-base font-bold text-gray-900">{review.clientName}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
                                            {review.text}
                                        </p>
                                        <div className="border-b border-gray-50 pt-4"></div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center pt-4">
                                <button className="text-[#84cc16] hover:text-[#76b813] font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 mx-auto">
                                    See All
                                    <span className="text-lg">»»»</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <EnquiryBox listingId={listingId} />

                </div>
            </section>

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                userName={user?.name}
                listingId={listingId}
            />
        </main>
    );
}
