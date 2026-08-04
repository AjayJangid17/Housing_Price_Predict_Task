import { MARKET_API_URL } from './config';
import type { MarketSummary, Property } from './types';

export interface PropertyQuery {
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
}

function buildQuery(q: PropertyQuery): string {
    const params = new URLSearchParams();
    if (q.minPrice != null) params.set("minPrice", String(q.minPrice));
    if (q.maxPrice != null) params.set("maxPrice", String(q.maxPrice));
    if (q.bedrooms != null) params.set("bedrooms", String(q.bedrooms));
    if (q.bathrooms != null) params.set("bathrooms", String(q.bathrooms));
    if (q.sortBy) params.set("sortBy", q.sortBy);
    if (q.order) params.set("order", q.order);
    return params.toString();
}

export async function getSummary(): Promise<MarketSummary> {
    const res = await fetch(`${MARKET_API_URL}/market/summary`, {
        next: { revalidate: 300 },
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch market summary: ${res.status}`);
    }
    return res.json();
}

export async function getProperties(q: PropertyQuery): Promise<Property[]> {
    const query = buildQuery(q);
    const url = `${MARKET_API_URL}/market/properties${query ? `?${query}` : ''}`;
    const res = await fetch(url, {
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch properties: ${res.status}`);
    }
    return res.json();
}