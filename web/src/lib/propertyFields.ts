import type { PropertyInput } from "./types";

export const DEFAULT_PROPERTY: PropertyInput = {
    square_footage: 1850,
    bedrooms: 3,
    bathrooms: 2,
    year_built: 1998,
    lot_size: 7500,
    distance_to_city_center: 5.6,
    school_rating: 8.2
};

export interface FieldConfig {
    name: keyof PropertyInput;
    label: string;
    min: number;
    max?: number;
    step?: number;
}

export const PROPERTY_FIELDS: FieldConfig[] = [
    { name: "square_footage",label: "Square Footage",min: 1,step: 1 },
    { name: "bedrooms",label: "Bedrooms",min: 0,max: 20,step: 1 },
    { name: "bathrooms",label: "Bathrooms",min: 0,max: 20,step: 0.5 },
    { name: "year_built",label: "Year Built",min: 1800,max: new Date().getFullYear(),step: 1 },
    { name: "lot_size",label: "Lot Size",min: 1,step: 1 },
    { name: "distance_to_city_center",label: "Distance to City Center",min: 0,step: 0.1 },
    { name: "school_rating",label: "School Rating",min: 0,max: 10,step: 0.1 }
];

// Client-side validation for property input fields
export function validatePropertyInput(input: PropertyInput): 
    Partial<Record<keyof PropertyInput, string>> {
        const errors: Partial<Record<keyof PropertyInput, string>> = {};
        for (const field of PROPERTY_FIELDS) {
            const value = input[field.name];
            if (Number.isNaN(value)) {
                errors[field.name] = "Required";
                continue;
            }
            if (value < field.min) {
                errors[field.name] = `Must be at least ${field.min}`;
            } else if (field.max !== undefined && value > field.max) {
                errors[field.name] = `Must be at most ${field.max}`;
            }
        }
        return errors;
    };
    