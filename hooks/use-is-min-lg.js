import { useEffect, useState } from "react";

const LG_PX = 1024;

/**
 * Matches Tailwind `lg` (min-width: 1024px).
 * `undefined` until mounted (matches server render, avoids hydration mismatch).
 */
export function useIsMinLg() {
  const [isMinLg, setIsMinLg] = useState(undefined);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${LG_PX}px)`);
    const onChange = () => setIsMinLg(mq.matches);
    mq.addEventListener("change", onChange);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial matchMedia sync after mount
    setIsMinLg(mq.matches);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isMinLg;
}
