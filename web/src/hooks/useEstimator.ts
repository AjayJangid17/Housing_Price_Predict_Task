"use client";

import { useCallback, useEffect, useState } from "react";
import type { EstimateResponse, PropertyInput } from "@/lib/types";

export function useEstimator() {
    const [latest, setLatest] = useState<EstimateResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<EstimateResponse[]>([]);

    const refreshHistory = useCallback(async () => {
        try {
            const res = await fetch("/api/estimate/history"); 
            if (!res.ok) {
                throw new Error("Failed to fetch history");
            }
            const data: EstimateResponse[] = await res.json();
            setHistory(data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch history");
        }
    }, []);

    useEffect(() => {
        refreshHistory();
    }, [refreshHistory]);

    const estimate = useCallback(
        async (inputs: PropertyInput) => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch("/api/estimate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(inputs),
                });
                if (!res.ok) {
                    const detail = await res.json().catch(() => null);
                    const msg = detail?.detail?.[0]?.msg || "Failed to estimate price";
                    throw new Error(msg);
                }
                const data: EstimateResponse = await res.json();
                setLatest(data);
                await refreshHistory();
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to estimate price");
            } finally {
                setLoading(false);
            }
        },
        [refreshHistory]
    );

    return { latest, loading, error, history, estimate, refreshHistory };
}