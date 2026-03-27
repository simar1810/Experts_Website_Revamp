import { fetchAPI } from "./api";

export async function getFilteredExperts({city='', expertiseTags=[], consultationMode='', radiusKm='', page=1}={}) {
    try {
        const payload = {
            city,
            expertiseTags,
            consultationMode,
            radiusKm,
            page,
        };
        console.log('payload', payload);
        const experts = await fetchAPI(`/experts/listing/search`, payload, "POST");
        console.log('experts', experts);
        return [...(experts?.free || []), ...(experts?.paid || [])];
    } catch (err) {
        console.error("Search failed:", err);
    }
}

