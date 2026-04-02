const DUMMY_BIO =
  "I focus on practical, measurable care outcomes with personalized plans. My approach combines strong clinical foundations with preventive strategies to improve long-term quality of life.";

export default function About({ details }) {
  return (
    <section className="w-full bg-[#F2F4F3] py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-6 lg:grid-cols-2">
        <div className="relative min-h-[230px] overflow-hidden rounded-2xl bg-[#0f6f63]">
          <img
            src={details?.aboutImage || "/images/apparatus.png"}
            alt="About visual"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.src = "/images/apparatus.png";
            }}
          />
        </div>

        <div>
          <h2 className="text-3xl font-extrabold text-[#0d3b1f]">About Me</h2>
          <p className="mt-4 text-sm leading-7 text-[#5d6d65]">
            {details?.bio || DUMMY_BIO}
          </p>
        </div>
      </div>
    </section>
  );
}
