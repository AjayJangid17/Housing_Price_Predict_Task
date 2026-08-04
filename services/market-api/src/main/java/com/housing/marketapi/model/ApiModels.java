package com.housing.marketapi.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.util.Map;

public final class ApiModels {

    private ApiModels() {
    }

    public record HealthResponse(String status) {
    }

    public record MarketSummary(
            @JsonProperty("count") long count,
            @JsonProperty("average_price") double averagePrice,
            @JsonProperty("minPrice") int minPrice,
            @JsonProperty("maxPrice") int maxPrice,
            @JsonProperty("avgPriceByBedrooms") Map<String, Double> avgPriceByBedrooms
    ) {
    }

    public record PropertyFeatures(
            @JsonProperty("square_footage") int squareFootage,
            @JsonProperty("bedrooms") int bedrooms,
            @JsonProperty("bathrooms") double bathrooms,
            @JsonProperty("year_built") int yearBuilt,
            @JsonProperty("lot_size") int lotSize,
            @JsonProperty("distance_to_city_center") double distanceToCityCenter,
            @JsonProperty("school_rating") double schoolRating
    ) {
    }

    public record Property(
            @JsonProperty("id") int id,
            @JsonProperty("square_footage") int square_footage,
            @JsonProperty("bedrooms") int bedrooms,
            @JsonProperty("bathrooms") double bathrooms,
            @JsonProperty("year_built") int year_built,
            @JsonProperty("lot_size") int lot_size,
            @JsonProperty("distance_to_city_center") double distance_to_city_center,
            @JsonProperty("school_rating") double school_rating,
            @JsonProperty("price") int price
    ) {
    }

    public record WhatIfResponse(
            @JsonProperty("predicted_price") double predictedPrice,
            @JsonProperty("inputs") PropertyFeatures inputs
    ) {
    }

    public record ErrorResponse(@JsonProperty("error") String error) {
    }

    public record MlPredictionResponse(@JsonProperty("predicted_price") double predictedPrice) {
    }
}
