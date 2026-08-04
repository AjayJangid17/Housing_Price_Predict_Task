package com.housing.marketapi.service;

import com.housing.marketapi.model.ApiModels.MarketSummary;
import com.housing.marketapi.model.ApiModels.Property;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MarketService {

    private final List<Property> properties;

    public MarketService() throws IOException {
        this.properties = loadProperties();
    }

    public MarketSummary getSummary() {
        long count = properties.size();
        double averagePrice = properties.stream().mapToDouble(Property::price).average().orElse(0.0);
        int minPrice = (int) properties.stream().mapToDouble(Property::price).min().orElse(0.0);
        int maxPrice = (int) properties.stream().mapToDouble(Property::price).max().orElse(0.0);

        Map<String, Double> avgPriceByBedrooms = properties.stream()
                .collect(Collectors.groupingBy(
                        p -> String.valueOf(p.bedrooms()),
                        Collectors.averagingDouble(Property::price)
                ));

        return new MarketSummary(count, averagePrice, minPrice, maxPrice, avgPriceByBedrooms);
    }

    public List<Property> getFilteredProperties(Integer minPrice, Integer maxPrice, Integer bedrooms,
                                                String sortBy, String order) {
        List<Property> filtered = properties.stream()
                .filter(p -> minPrice == null || p.price() >= minPrice)
                .filter(p -> maxPrice == null || p.price() <= maxPrice)
                .filter(p -> bedrooms == null || p.bedrooms() == bedrooms)
                .toList();

        Comparator<Property> comparator = switch (sortBy.toLowerCase()) {
            case "square_footage" -> Comparator.comparingInt(Property::square_footage);
            case "year_built" -> Comparator.comparingInt(Property::year_built);
            case "school_rating" -> Comparator.comparingDouble(Property::school_rating);
            default -> Comparator.comparingInt(Property::price);
        };

        if ("desc".equalsIgnoreCase(order)) {
            comparator = comparator.reversed();
        }

        return filtered.stream().sorted(comparator).toList();
    }

    private List<Property> loadProperties() throws IOException {
        List<Property> loaded = new ArrayList<>();
        ClassPathResource resource = new ClassPathResource("data/House Price Dataset.csv");

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()))) {
            String line = reader.readLine();
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length < 9) {
                    continue;
                }

                loaded.add(new Property(
                        Integer.parseInt(parts[0]),
                        Integer.parseInt(parts[1]),
                        Integer.parseInt(parts[2]),
                        Double.parseDouble(parts[3]),
                        Integer.parseInt(parts[4]),
                        Integer.parseInt(parts[5]),
                        Double.parseDouble(parts[6]),
                        Double.parseDouble(parts[7]),
                        Integer.parseInt(parts[8])
                ));
            }
        }

        return loaded;
    }
}
