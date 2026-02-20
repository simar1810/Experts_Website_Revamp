export default function LatestArticles() {
    const articles = [
        {
            date: "3 Oct 2025",
            title: "Herbs and Nutrition for Women's Vitality",
            description: "In our fast-paced world, many women find themselves running on empty, reaching for quick fixes...",
            author: "Taffy Chinyanga",
            authorImage: "https://randomuser.me/api/portraits/women/65.jpg",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop"
        },
        {
            date: "3 Oct 2025",
            title: "Herbs and Nutrition for Women's Vitality",
            description: "In our fast-paced world, many women find themselves running on empty, reaching for quick fixes...",
            author: "Taffy Chinyanga",
            authorImage: "https://randomuser.me/api/portraits/women/65.jpg",
            image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop"
        },
        {
            date: "3 Oct 2025",
            title: "Herbs and Nutrition for Women's Vitality",
            description: "In our fast-paced world, many women find themselves running on empty, reaching for quick fixes...",
            author: "Taffy Chinyanga",
            authorImage: "https://randomuser.me/api/portraits/women/65.jpg",
            image: "https://images.unsplash.com/photo-1552674605-4694559e5bc7?q=80&w=2070&auto=format&fit=crop"
        },
        {
            date: "3 Oct 2025",
            title: "Herbs and Nutrition for Women's Vitality",
            description: "In our fast-paced world, many women find themselves running on empty, reaching for quick fixes...",
            author: "Taffy Chinyanga",
            authorImage: "https://randomuser.me/api/portraits/women/65.jpg",
            image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2070&auto=format&fit=crop"
        }
    ];

    const featuredArticle = articles[0];
    const sideArticles = articles.slice(1);

    return (
        <section className="bg-[#74C62D] py-16 md:py-20 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight text-center sm:text-left">
                        Latest Articles
                    </h2>
                    <button className="bg-white text-[#74C62D] px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl sm:rounded-2xl font-black text-sm sm:text-lg hover:bg-gray-50 transition-all shadow-lg hover:-translate-y-1 active:scale-95">
                        Browse All
                    </button>
                </div>

                {/* Articles Grid */}
                <div className="grid lg:grid-cols-3 gap-6 items-stretch">
                    {/* Featured Article (Left) */}
                    <div className="lg:col-span-2 relative group cursor-pointer overflow-hidden rounded-[24px] sm:rounded-3xl shadow-xl h-[350px] sm:h-[400px] lg:h-[550px]">
                        <img
                            src={featuredArticle.image}
                            alt={featuredArticle.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                        <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end">
                            <span className="text-white text-xs sm:text-base font-bold mb-2 opacity-90">
                                {featuredArticle.date}
                            </span>
                            <h3 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#74C62D] mb-3 sm:mb-4 leading-tight tracking-tight">
                                {featuredArticle.title}
                            </h3>
                            <p className="text-white/80 text-sm sm:text-lg font-medium max-w-2xl mb-4 sm:mb-6 leading-relaxed line-clamp-2 sm:line-clamp-none">
                                {featuredArticle.description}
                            </p>

                            <div className="flex items-center gap-3">
                                <img
                                    src={featuredArticle.authorImage}
                                    alt={featuredArticle.author}
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/20"
                                />
                                <span className="text-white text-sm sm:text-lg font-bold">
                                    {featuredArticle.author}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Side Articles (Right) */}
                    <div className="flex flex-col gap-5">
                        {sideArticles.map((article, idx) => (
                            <div
                                key={idx}
                                className="relative flex-1 group cursor-pointer overflow-hidden rounded-2xl shadow-lg min-h-[160px]"
                            >
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end">
                                    <span className="text-white text-[10px] sm:text-xs font-bold mb-1 opacity-90 uppercase tracking-wider">
                                        {article.date}
                                    </span>
                                    <h4 className="text-lg sm:text-xl font-black text-[#74C62D] mb-2 leading-tight group-hover:text-white transition-colors">
                                        {article.title}
                                    </h4>

                                    <div className="flex items-center gap-2">
                                        <img
                                            src={article.authorImage}
                                            alt={article.author}
                                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white/20"
                                        />
                                        <span className="text-white text-[10px] sm:text-xs font-bold">
                                            {article.author}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
