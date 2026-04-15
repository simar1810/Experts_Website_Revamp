/**
 * Same timing as `CuratedEliteSection` vertical marquees:
 * `Math.min(120, 22 + maxColLen * 14)` seconds.
 */

export function getCuratedVerticalMarqueeDurationSec(maxColumnLength) {
  const maxColLen = Math.max(1, maxColumnLength);
  return Math.min(120, 22 + maxColLen * 14);
}

export function getCuratedVerticalMarqueeDurationSecFromColumns(columns) {
  const maxColLen = Math.max(
    1,
    ...(columns ?? []).map((col) => col?.length ?? 0),
  );
  return getCuratedVerticalMarqueeDurationSec(maxColLen);
}
