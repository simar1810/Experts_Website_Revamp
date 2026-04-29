import { Sparkles } from "lucide-react";

export default function CollectionEmptyState({
  title = "Collections are coming soon",
  description = "Partner products will appear here as soon as active collections are published.",
}) {
  return (
    <div className="mx-auto max-w-2xl rounded-[2rem] border border-[#e6edd9] bg-[#fbfff4] px-6 py-12 text-center">
      <Sparkles className="mx-auto size-8 text-[#72ba2d]" />
      <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#263616]">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-[#7b806f]">{description}</p>
    </div>
  );
}
