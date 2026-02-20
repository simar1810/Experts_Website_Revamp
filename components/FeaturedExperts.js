export default function FeaturedExperts() {
    const experts = [
        { name: "John Doe", title: "Chief operating officer" },
        { name: "John Doe", title: "Chief operating officer" },
        { name: "John Doe", title: "Chief operating officer" },
        { name: "John Doe", title: "Chief operating officer" },
        { name: "John Doe", title: "Chief operating officer" },
    ];

    return (
        <section className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-2xl sm:text-3xl font-black mb-2 text-gray-900 tracking-tight">Top Rated Experts</h2>
                <p className="text-gray-500 mb-10 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                    Browse through our extensive list of experts
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
                    {experts.map((expert, index) => (
                        <div key={index} className="text-center group cursor-pointer">
                            <div className="aspect-[4/5] bg-gray-100 rounded-2xl mb-3 overflow-hidden relative shadow-sm group-hover:shadow-md transition-all duration-500">
                                <img
                                    src={`https://randomuser.me/api/portraits/men/${index + 40}.jpg`}
                                    alt={expert.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <h3 className="font-black text-sm sm:text-base text-gray-900 leading-tight mb-1">{expert.name}</h3>
                            <p className="text-gray-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">{expert.title}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button className="bg-gray-50 text-[#84CC16] px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-[#84CC16] hover:text-white transition-all shadow-sm active:scale-95 border border-gray-100">
                        View all Experts
                    </button>
                </div>
            </div>
        </section>
    );
}
