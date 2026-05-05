export default function DashboardHeading({ text }) {
  return (
    <div className="inline-flex w-fit max-w-full flex-col items-start gap-2.5 mb-5">
      <h2 className="font-lexend text-2xl font-bold uppercase text-black">
        {text}
      </h2>
      <span
        className="h-1.5 w-[55%] min-w-16 shrink-0 bg-[#70C136]"
        aria-hidden
      />
    </div>
  );
}
