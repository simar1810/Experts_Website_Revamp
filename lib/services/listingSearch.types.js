/**
 * JSDoc typedefs for listing search (no runtime export needed).
 * @typedef {Object} ListingSearchParams
 * @property {string} [city]
 * @property {string[]} [expertiseTags]
 * @property {string} [consultationMode] — '' | 'online' | 'in_person' | 'both'
 * @property {{ type?: string, coordinates: [number, number] } | null} [clientLocation]
 * @property {string|number} [radiusKm]
 * @property {number} [page]
 * @property {string[]} [languages]
 *
 * @typedef {Object} ListingSearchResult
 * @property {unknown[]} paid
 * @property {unknown[]} free
 * @property {Record<string, unknown>} meta
 */

export {};
