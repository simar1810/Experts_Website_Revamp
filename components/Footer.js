import { Instagram } from 'lucide-react';

export default function Footer() {


    const legalLinks = [
        'User Terms', 'Business Terms', 'Privacy Policy', 'Cookie Policy', 'Cookie Settings'
    ];

    return (
        <footer className="bg-black text-[#858585] py-12 sm:py-20 px-4 sm:px-6 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 mb-20 text-center md:text-left">
                    {/* App Download Section */}
                    <div className="lg:col-span-3 space-y-6">
                        <h4 className="text-white/60 text-sm font-medium">Need the Mobile App?</h4>
                        <div className="flex flex-col items-center md:items-start space-y-4">
                            <a href="#" className="block hover:opacity-80 transition-opacity">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                                    alt="App Store"
                                    className="h-10 md:h-12 border border-white/20 rounded-lg"
                                />
                            </a>
                            <a href="#" className="block hover:opacity-80 transition-opacity">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                    alt="Google Play"
                                    className="h-10 md:h-12 border border-white/20 rounded-lg"
                                />
                            </a>
                        </div>
                    </div>

                    {/* Locations Columns
                    <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-left">
                        {locations.map((column, i) => (
                            <div key={i} className="space-y-3 sm:space-y-4">
                                {column.map((city) => (
                                    <a
                                        key={city}
                                        href="#"
                                        className="block text-xs sm:text-sm hover:text-white transition-colors"
                                    >
                                        {city}
                                    </a>
                                ))}
                            </div>
                        ))}
                    </div> */}

                    {/* Get Listed Section */}
                    <div className="lg:col-start-10 lg:col-span-3 space-y-6 lg:text-right">
                        <p className="text-white/80 text-sm leading-relaxed max-w-[240px] mx-auto lg:ml-auto">
                            Are you a trainer and want to get more exposure by listing here?
                        </p>
                        <button className="border border-white/20 px-8 py-3.5 sm:px-10 sm:py-4 text-[10px] sm:text-xs font-black tracking-widest text-white hover:bg-white hover:text-black transition-all rounded-lg sm:rounded-none">
                            GET LISTED
                        </button>
                    </div>
                </div>

                {/* Social and Legal Section */}
                <div className="pt-12 border-t border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="flex items-center gap-8 sm:gap-10">
                            <a href="#" className="hover:text-white transition-colors">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-8.74h-2.94v-3.411h2.94v-2.515c0-2.915 1.779-4.502 4.379-4.502 1.246 0 2.316.093 2.628.135v3.047l-1.803.001c-1.414 0-1.688.672-1.688 1.658v2.171h3.37l-.439 3.411h-2.931v8.74h5.176c.732 0 1.325-.593 1.325-1.325v-21.351c0-.732-.593-1.325-1.325-1.325z" />
                                </svg>
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" />
                                </svg>
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>

                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 sm:gap-x-10 sm:gap-y-4">
                            {legalLinks.map((link) => (
                                <a
                                    key={link}
                                    href="#"
                                    className="text-xs sm:text-sm hover:text-white transition-colors"
                                >
                                    {link}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-16 sm:mt-20 text-center">
                    <p className="text-[10px] tracking-widest uppercase opacity-40">
                        © 2012-2026 WellnessZ
                    </p>
                </div>
            </div>
        </footer>
    );
}
