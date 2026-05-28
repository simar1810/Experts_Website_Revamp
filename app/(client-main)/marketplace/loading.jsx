export default function MarketplaceLoading() {
  return (
    <main className="min-h-screen bg-white font-lato text-[#263616]">
      <section className="border-b border-[#eef2e8] bg-[linear-gradient(180deg,#ffffff_0%,#fbfff3_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="h-3 w-48 rounded-full bg-lime-100" />
          <div className="mt-5 h-14 w-72 rounded-2xl bg-lime-100/80 sm:w-96" />
          <div className="mt-5 h-5 max-w-xl rounded-full bg-lime-50" />
          <div className="mt-3 h-5 max-w-lg rounded-full bg-lime-50" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-8 w-72 rounded-xl bg-lime-100" />
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square rounded-[1.35rem] bg-lime-100/70" />
              <div className="mt-4 h-5 rounded-full bg-lime-100" />
              <div className="mt-2 h-4 w-20 rounded-full bg-lime-50" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
