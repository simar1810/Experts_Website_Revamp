export default function AsSeenIn() {
    const brands = [
        {
            name: "fitness",
            src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Fitness_Magazine_logo.svg/2560px-Fitness_Magazine_logo.svg.png",
            height: "h-8 md:h-10"
        },
        {
            name: "SHAPE",
            src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Shape_Magazine_logo.svg/2560px-Shape_Magazine_logo.svg.png",
            height: "h-12 md:h-16"
        },
        {
            name: "HuffPost",
            src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/The_Huffington_Post_logo.svg/2560px-The_Huffington_Post_logo.svg.png",
            height: "h-8 md:h-10"
        },
        {
            name: "Yahoo Tech",
            src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Yahoo%21_%282019%29.svg/2560px-Yahoo%21_%282019%29.svg.png",
            height: "h-8 md:h-10",
            extra: "TECH"
        },
        {
            name: "InStyle",
            src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/InStyle_magazine_logo.svg/2560px-InStyle_magazine_logo.svg.png",
            height: "h-8 md:h-10"
        },
    ];

    return (
        <section className="bg-[#E5E7EB] py-16 px-6">
            <div className="max-w-7xl mx-auto text-center">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-black mb-10 sm:mb-12 tracking-tight uppercase">
                    As Seen In
                </h3>
                <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-8 sm:gap-x-12 md:gap-x-20">
                    {brands.map((brand) => (
                        <div key={brand.name} className="flex flex-col items-center group">
                            <img
                                src={brand.src}
                                alt={brand.name}
                                className={`${brand.height} object-contain opacity-60 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0 hover:scale-110`}
                            />
                            {brand.extra && (
                                <span className="text-[8px] sm:text-[10px] font-black tracking-[0.2em] mt-1.5 opacity-60">
                                    {brand.extra}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
