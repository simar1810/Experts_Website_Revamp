'use client'

import { Search, MapPin, ThumbsUp, CheckCircle2, Star, ChevronDown, Bell, User, X } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import { fetchAPI, sendData } from '@/lib/api';
import { useState, use, useEffect } from 'react';


function EnquiryBox({ listingId }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const success = await sendData('/experts/inquiry/create',
                {
                    "listingId": listingId,
                    "name": name,
                    "email": email,
                    "phone": phone,
                    "message": message,
                    "consultationMode": "online"

                });
            if (success) {
                alert('Enquiry sent successfully');
                setName('');
                setEmail('');
                setPhone('');
                setMessage('');
            }
        } catch (error) {
            console.error(error);
            alert('Enquiry failed: ' + (error.message || 'Unknown error'));
        }
    }

    return (
        <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
                <h3 className="text-lg font-bold text-gray-900 ml-4">Your Enquiry Here</h3>
                <div className="bg-white border border-gray-100 rounded-[2rem] p-5 shadow-sm">
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4 mb-4">
                            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#fdfdfd] rounded-xl p-4 text-sm text-gray-700 outline-none resize-none border-none placeholder-gray-300 shadow-inner" />
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#fdfdfd] rounded-xl p-4 text-sm text-gray-700 outline-none resize-none border-none placeholder-gray-300 shadow-inner" />
                            <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[#fdfdfd] rounded-xl p-4 text-sm text-gray-700 outline-none resize-none border-none placeholder-gray-300 shadow-inner" />
                        </div>
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
    const availableSpecialities = [
        'Fat Loss',
        'Sports Nutrition',
        'Muscle Gain',
        'Yoga',
        'Dietician',
        'Physiotherapy',
        'Mental Health',
        'Functional Training',
        'CrossFit',
        'Pilates'
    ];

    const [specialityQuery, setSpecialityQuery] = useState('');
    const [selectedSpecialities, setSelectedSpecialities] = useState([]);
    const [locationQuery, setLocationQuery] = useState('');
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showSpecialityDropdown, setShowSpecialityDropdown] = useState(false);

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
        // Implement search logic if needed, or redirect to experts page with queries
        const queryParams = new URLSearchParams();
        if (selectedSpecialities.length > 0) {
            queryParams.set('speciality', selectedSpecialities.join(','));
        }
        if (locationQuery) {
            queryParams.set('location', locationQuery);
        }
        window.location.href = `/experts?${queryParams.toString()}`;
    };
    const specializations = ['Orthodontist', 'Cosmetic/Aesthetic Dentist', 'Dentofacial Orthopedist', 'Implantologist', 'Dentist'];
    const awards = ['Recognized by Dental Council of India as an Inspector for inspect dental college - 2012'];
    const education = ['BDS - MSS Ambedkar Dental College and Hospital, 1993', 'MDS - Orthodontics - Bangalore University, 1998'];
    const memberships = ['Indian Dental Association', 'Indian Orthodontic Society'];

    useEffect(() => {
        const getCoachDetails = async () => {
            try {
                const data = await fetchAPI(`/experts/listing/details/${listingId}`, null, 'GET');
                console.log('Coach details:', data)
            } catch (err) {
                console.error("Failed to fetch coach details:", err);
            }
        };
        if (listingId) {
            getCoachDetails();
        }
    }, [listingId]);
    return (
        <main className="min-h-screen bg-white font-sans mb-30">
            {/* Navbar is already global via layout.js, but let's ensure it's here if layout doesn't cover dynamic routes or needs specific props */}
            {/* Actually layout.js has it, but I'll add a spacer for fixed navbar if needed */}
            <div className="h-[72px]"></div>

            {/* Breadcrumb & Search Section */}
            <section className="bg-white px-6 py-4 max-w-7xl mx-auto">
                <div className="flex items-center gap-1 text-sm text-gray-400 mb-6">
                    <Search className="w-3 h-3" />
                    <span>Search / </span>
                    <span className="text-[#84cc16] font-medium font-bold">Coach Profile</span>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                    <div className="flex-1 flex items-center gap-3 bg-[#f8f9fa] rounded-lg px-4 py-2.5 border border-gray-100 relative">
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
                    <div className="flex-1 flex items-center gap-3 bg-[#f8f9fa] rounded-lg px-4 py-2.5 border border-gray-100 relative">
                        <MapPin className="w-5 h-5 text-gray-300 shrink-0" />
                        <input
                            type="text"
                            placeholder="Set your location"
                            value={locationQuery}
                            onChange={(e) => setLocationQuery(e.target.value)}
                            onFocus={() => setShowLocationDropdown(true)}
                            onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
                            className="bg-transparent w-full outline-none text-gray-700 text-sm"
                        />
                        {showLocationDropdown && (
                            <LocationSelectorDropdown setLocationQuery={setLocationQuery} setShowLocationDropdown={setShowLocationDropdown} />
                        )}
                    </div>
                    <button onClick={handleSearch} className="bg-[#84cc16] hover:bg-[#76b813] text-white px-10 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-lime-500/20">
                        <Search className="w-4 h-4" />
                        Search
                    </button>
                </div>

                {/* <div className="flex items-center gap-6 text-xs font-medium text-gray-500 border-b border-gray-50 pb-6">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
                        Availability <ChevronDown className="w-4 h-4 text-[#84cc16]" />
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
                        Filter <ChevronDown className="w-4 h-4 text-[#84cc16]" />
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        Sort By
                        <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-md">
                            Relevance <ChevronDown className="w-4 h-4 text-[#84cc16]" />
                        </div>
                    </div>
                </div> */}
            </section>

            {/* Main Content Area */}
            <section className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Profile Card & Tabs */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Profile Overview Card */}
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="relative w-40 h-40 shrink-0">
                                    <div className="w-full h-full rounded-full border-[3px] border-[#84cc16] overflow-hidden p-1">
                                        <div className="w-full h-full rounded-full overflow-hidden">
                                            <img src="/images/coach.png" alt="Dr. Shantanu Jambhekar" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                    <div className="absolute right-2 bottom-4 bg-white rounded-full p-0.5 shadow-sm">
                                        <CheckCircle2 className="w-7 h-7 text-[#84cc16] fill-white" />
                                    </div>
                                </div>

                                <div className="flex-1 space-y-2">
                                    <h1 className="text-3xl font-bold text-gray-900">Dr. Shantanu Jambhekar</h1>
                                    <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Dentist</p>
                                    <p className="text-gray-500 text-base font-medium">15 years experience overall</p>
                                    <div className="flex items-center gap-1.5 text-gray-900 text-base font-bold pt-1">
                                        <span>Peru, Mumbai</span>
                                    </div>
                                    <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                                        Smilessence Center for Advanced Dentistry + 1 more
                                    </p>
                                    <div className="flex items-center gap-2 pt-1 font-bold">
                                        <span className="text-[#84cc16] text-xs">FREE</span>
                                        <span className="text-gray-400 text-xs">Video Consultation fee at clinic</span>
                                    </div>

                                    <div className="flex items-center gap-4 pt-4">
                                        <div className="flex items-center gap-1.5 bg-[#84cc16] text-white px-3 py-1.5 rounded text-sm font-bold">
                                            <ThumbsUp className="w-4 h-4 fill-current" />
                                            <span>99%</span>
                                        </div>
                                        <span className="text-gray-400 text-sm font-medium border-b border-gray-300 pb-0.5">93 Patient Stories</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-500 text-sm leading-[1.8] font-medium text-justify">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </div>

                        {/* Tabs Container */}
                        <div>
                            <div className="flex items-center gap-8 border-b border-gray-100 pb-px mb-8">
                                {['Info', 'Stories', 'Services', "FAQ's"].map((tab, i) => (
                                    <button
                                        key={tab}
                                        className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors ${i === 0 ? 'text-white bg-[#84cc16] px-10 py-3 rounded-t-lg' : 'text-gray-400 px-6'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Info Tab Content */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-12">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-900">All Care Dental Centre</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                    </p>

                                    <div className="pt-6 space-y-4">
                                        <h3 className="text-lg font-bold text-gray-900">Address</h3>
                                        <p className="text-gray-500 text-[11px] leading-relaxed">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
                                        </p>
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[#84cc16] text-xl font-bold">4.5</span>
                                        <div className="flex items-center gap-1">
                                            {[...Array(4)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 text-[#84cc16] fill-current" />
                                            ))}
                                            <Star className="w-5 h-5 text-gray-200 fill-current" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-lg font-bold text-gray-900">Timings</h3>
                                        <p className="text-gray-500 text-sm font-medium">9:00 AM - 5:00 PM</p>
                                    </div>

                                    <div className="space-y-2 text-right md:text-left">
                                        <h3 className="text-lg font-bold text-gray-900">Consultation Fee</h3>
                                        <p className="text-gray-500 text-sm font-medium">₹500 per consultation</p>
                                    </div>
                                </div>
                            </div>

                            {/* Services section */}
                            <div className="mt-20 space-y-12">
                                <h3 className="text-xl font-bold text-gray-900">Services</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <h4 className="text-base font-bold text-gray-900">Specialization</h4>
                                        <ul className="space-y-2">
                                            {specializations.map((item, i) => (
                                                <li key={i} className="text-gray-400 text-sm flex items-center gap-2">
                                                    <span className="text-[#84cc16] text-xs">•</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-base font-bold text-gray-900">Awards and Recognitions</h4>
                                        <ul className="space-y-2">
                                            {awards.map((item, i) => (
                                                <li key={i} className="text-gray-400 text-xs flex items-start gap-2">
                                                    <span className="text-[#84cc16] text-xs shrink-0">•</span>
                                                    <span className="leading-relaxed">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <h4 className="text-base font-bold text-gray-900">Education</h4>
                                        <ul className="space-y-2">
                                            {education.map((item, i) => (
                                                <li key={i} className="text-gray-400 text-sm flex items-center gap-2">
                                                    <span className="text-[#84cc16] text-xs">•</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-base font-bold text-gray-900">Memberships</h4>
                                        <ul className="space-y-2">
                                            {memberships.map((item, i) => (
                                                <li key={i} className="text-gray-400 text-sm flex items-center gap-2">
                                                    <span className="text-[#84cc16] text-xs">•</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Awards & Recognitions again? (repeating as per user request to be exact) */}
                            <div className="mt-20 space-y-12 border-t border-gray-100 pt-12">
                                <h3 className="text-xl font-bold text-gray-900">Awards & Recognitions</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <h4 className="text-base font-bold text-gray-900">Specialization</h4>
                                        <ul className="space-y-2">
                                            {specializations.map((item, i) => (
                                                <li key={i} className="text-gray-400 text-sm flex items-center gap-2">
                                                    <span className="text-[#84cc16] text-xs">•</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-base font-bold text-gray-900">Awards and Recognitions</h4>
                                        <ul className="space-y-2">
                                            {awards.map((item, i) => (
                                                <li key={i} className="text-gray-400 text-xs flex items-start gap-2">
                                                    <span className="text-[#84cc16] text-xs shrink-0">•</span>
                                                    <span className="leading-relaxed">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <EnquiryBox listingId={listingId} />

                </div>
            </section>
        </main>
    );
}
