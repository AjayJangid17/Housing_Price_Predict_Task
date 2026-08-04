package com.housing.marketapi.export;

import com.housing.marketapi.model.ApiModels.Property;
import com.housing.marketapi.service.MarketService;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class ExportService {

    private final MarketService marketService;

    public ExportService(MarketService marketService) {
        this.marketService = marketService;
    }

    public byte[] exportCsv(Integer minPrice, Integer maxPrice, Integer bedrooms) {
        List<Property> properties = marketService.getFilteredProperties(minPrice, maxPrice, bedrooms, "price", "asc");

        StringBuilder sb = new StringBuilder();
        sb.append("id,square_footage,bedrooms,bathrooms,year_built,lot_size,distance_to_city_center,school_rating,price\n");
        for (Property property : properties) {
            sb.append(property.id()).append(',')
                    .append(property.square_footage()).append(',')
                    .append(property.bedrooms()).append(',')
                    .append(property.bathrooms()).append(',')
                    .append(property.year_built()).append(',')
                    .append(property.lot_size()).append(',')
                    .append(property.distance_to_city_center()).append(',')
                    .append(property.school_rating()).append(',')
                    .append(property.price()).append('\n');
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    public byte[] exportPdf(Integer minPrice, Integer maxPrice, Integer bedrooms) {
        String text = "Exported property filter: minPrice=" + minPrice + ", maxPrice=" + maxPrice + ", bedrooms=" + bedrooms;
        return text.getBytes(StandardCharsets.UTF_8);
    }
}
