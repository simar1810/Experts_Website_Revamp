'use client';

export default function PaymentsSection() {
    return (
        <section className="relative py-30 px-6 overflow-hidden bg-white">
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <span className="bg-lime-100 text-[#4d7c0f] text-[10px] sm:text-xs font-black px-5 py-2.5 rounded-full uppercase tracking-[0.2em] inline-block mb-8 shadow-sm">
                    Business Operations
                </span>

                <h2 className="text-4xl sm:text-6xl font-[900] text-gray-900 leading-[1.1] tracking-[-0.04em] mb-8">
                    Seamless <span className="text-[var(--brand-primary)]">Payments</span>
                </h2>

                <p className="text-gray-500 text-lg sm:text-2xl font-medium leading-relaxed max-w-3xl mx-auto opacity-90">
                    Accept payments easily and manage your wellness business without worrying about manual transactions.
                </p>

                {/* Subtle background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-lime-50 rounded-full blur-[120px] -z-10 opacity-40"></div>
            </div>
        </section>
    );
}
