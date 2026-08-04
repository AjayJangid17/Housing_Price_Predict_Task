export interface PropertyInput {
    square_footage: number;
    bedrooms: number;
    bathrooms: number;
    year_built: number;
    lot_size: number;
    distance_to_city_center: number;
    school_rating: number;
}

// Response from estimator-api /estimate
export interface EstimateResponse {
    id: string;
    timestamp: string;
    estimated_price: number;
    inputs: PropertyInput;
}   

// A Historical dataset row from market-api /market/properties
export interface Property extends PropertyInput {
    id: number;
    price: number;
}

export interface MarketSummary {
    count: number;
    average_price: number;
    minPrice: number;
    maxPrice: number;
    avgPriceByBedrooms: Record<string, number>;
}

export interface WhatifResponse {
    predicted_price: number;
    inputs: PropertyInput;
}

export const FEATURES_LABLES: Record<keyof PropertyInput, string> = {
    square_footage: "Square Footage",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    year_built: "Year Built",
    lot_size: "Lot Size",
    distance_to_city_center: "Distance to City Center",
    school_rating: "School Rating"
};  