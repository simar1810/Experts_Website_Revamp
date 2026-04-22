import { getTocEntries, parseLegalBody } from "@/lib/legal/parseLegalBody";
import TocList from "./LegalTocList";

const pClass =
  "text-[15px] leading-[1.7] text-neutral-700 sm:text-base sm:leading-relaxed";
const h2Class =
  "text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl";
const h3Class = "text-base font-semibold text-neutral-900 sm:text-lg";

function LegalNode({ node, isFirstH2 }) {
  if (node.type === "h2") {
    return (
      <h2
        id={node.id}
        className={`${h2Class} scroll-mt-24 border-b border-stone-200/90 pb-2 ${
          isFirstH2 ? "pt-2" : "pt-10"
        }`}
      >
        {node.text}
      </h2>
    );
  }
  if (node.type === "h3") {
    return (
      <h3 id={node.id} className={`${h3Class} scroll-mt-24 mb-1 pt-6`}>
        {node.text}
      </h3>
    );
  }
  if (node.type === "clause") {
    return (
      <p
        id={node.id}
        className={`${pClass} scroll-mt-20 mb-4 border-l-2 border-lime-200/80 pl-4 pt-1`}
      >
        <span className="font-semibold text-neutral-900">
          {node.number}
        </span>{" "}
        {node.body}
      </p>
    );
  }
  if (node.type === "p") {
    return <p className={`${pClass} mb-4 mt-0`}>{node.text}</p>;
  }
  if (node.type === "ul") {
    return (
      <ul className="mb-5 mt-0 list-outside list-disc space-y-1.5 pl-5 text-[15px] text-neutral-700 sm:text-base">
        {node.items.map((item, idx) => (
          <li
            key={`li-${idx}-${item.slice(0, 32)}`}
            className="leading-[1.65] [padding-inline-start:0.2em]"
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }
  return null;
}

/**
 * @param {object} props
 * @param {string} props.bodyText
 * @param {boolean} [props.showToc]
 * @param {"h2" | "full"} [props.tocMode] "h2" = major sections only; "full" = H2 + H3.
 */
export default function LegalBody({ bodyText, showToc = true, tocMode = "h2" }) {
  const nodes = parseLegalBody(bodyText);
  const toc = showToc
    ? getTocEntries(nodes, { includeH3: tocMode === "full" })
    : [];
  const hasToc = showToc && toc.length > 0;
  const firstH2Index = nodes.findIndex((n) => n.type === "h2");

  return (
    <div
      className={
        hasToc
          ? "font-lato lg:grid lg:grid-cols-[1fr,13.5rem] lg:items-start lg:gap-10 xl:grid-cols-[1fr,15rem] xl:gap-12"
          : "max-w-3xl font-lato"
      }
    >
      {hasToc ? (
        <TocList entries={toc} className="mb-2 lg:order-2 lg:mb-0" />
      ) : null}
      <div
        className={hasToc ? "min-w-0 lg:order-1" : "min-w-0"}
        data-legal-rendered
      >
        {nodes.map((node, i) => (
          <LegalNode
            key={
              "id" in node && node.id != null
                ? node.id
                : `${node.type}-${i}`
            }
            node={node}
            isFirstH2={node.type === "h2" && i === firstH2Index}
          />
        ))}
      </div>
    </div>
  );
}
