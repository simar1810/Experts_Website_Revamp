/**
 * JSDoc typedefs for listing search (no runtime export needed).
 * @typedef {Object} ListingSearchParams
 * @property {string} [city]
 * @property {string} [state] — when set without city, filter by listing.state (exact, case-insensitive)
 * @property {string} [country] — when set without city, filter by listing.country (exact, case-insensitive); with state, narrows the state
 * @property {string[]} [expertiseTags]
 * @property {string} [consultationMode] — '' | 'online' | 'in_person' | 'both'
 * @property {{ type?: string, coordinates: [number, number] } | null} [clientLocation]
 * @property {string|number} [radiusKm]
 * @property {number} [page]
 * @property {string[]} [languages]
 * @property {string} [nameQuery] — filter by coach display name (substring, case-insensitive)
 *
 * @typedef {Object} ListingSearchResult
 * @property {unknown[]} paid
 * @property {unknown[]} free
 * @property {Record<string, unknown>} meta
 */

export {};
