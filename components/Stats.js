export default function Stats() {
  const stats = [
    { number: "7K+", label: "Wellness Experts on the platform" },
    { number: "25K+", label: "Satisfied Clients" },
    { number: "25+", label: "Collaborations" },
  ];

  return (
    <section className="bg-black text-white py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center md:text-left bg-gradient-to-r from-gray-100 to-gray-500 text-transparent bg-clip-text">
          Join the Movement
        </h2>

        <div className="bg-gray-900/50 rounded-3xl p-8 sm:p-10 border border-lime-500/30 flex flex-col md:flex-row justify-between items-center gap-10 md:gap-4 text-center md:text-left backdrop-blur-sm">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex-1 w-full md:w-auto md:border-r last:border-0 border-gray-800 md:pr-8 last:pr-0"
            >
              <h4 className="text-4xl sm:text-5xl font-black text-lime-500 mb-2">
                {stat.number}
              </h4>
              <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-widest font-bold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
