package com.housing.marketapi.controller;

import com.housing.marketapi.client.MlApiClient;
import com.housing.marketapi.export.ExportService;
import com.housing.marketapi.model.ApiModels.ErrorResponse;
import com.housing.marketapi.model.ApiModels.HealthResponse;
import com.housing.marketapi.model.ApiModels.MarketSummary;
import com.housing.marketapi.model.ApiModels.Property;
import com.housing.marketapi.model.ApiModels.PropertyFeatures;
import com.housing.marketapi.model.ApiModels.WhatIfResponse;
import com.housing.marketapi.service.MarketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/")
public class MarketController {

    private final MarketService marketService;
    private final ExportService exportService;
    private final MlApiClient mlApiClient;

    public MarketController(MarketService marketService, ExportService exportService, MlApiClient mlApiClient) {
        this.marketService = marketService;
        this.exportService = exportService;
        this.mlApiClient = mlApiClient;
    }

    @GetMapping("/health")
    public HealthResponse health() {
        return new HealthResponse("ok");
    }

    @GetMapping("/market/summary")
    public MarketSummary marketSummary() {
        return marketService.getSummary();
    }

    @GetMapping("/market/properties")
    public List<Property> properties(
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(name = "sortBy", defaultValue = "price") String sortBy,
            @RequestParam(defaultValue = "asc") String order
    ) {
        return marketService.getFilteredProperties(minPrice, maxPrice, bedrooms, sortBy, order);
    }

    @PostMapping("/market/what-if")
    public ResponseEntity<?> whatIf(@Valid @RequestBody PropertyFeatures input) {
        try {
            double predictedPrice = mlApiClient.predict(input);
            return ResponseEntity.ok(new WhatIfResponse(predictedPrice, input));
        } catch (ResponseStatusException ex) {
            if (ex.getStatusCode().value() == HttpStatus.SERVICE_UNAVAILABLE.value()) {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(new ErrorResponse("ml-api is unavailable"));
            }
            throw ex;
        }
    }

    @GetMapping("/market/export")
    public ResponseEntity<byte[]> export(
            @RequestParam String format,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Integer bedrooms
    ) {
        if ("csv".equalsIgnoreCase(format)) {
            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_PLAIN)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=properties.csv")
                    .body(exportService.exportCsv(minPrice, maxPrice, bedrooms));
        }

        if ("pdf".equalsIgnoreCase(format)) {
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=properties.pdf")
                    .body(exportService.exportPdf(minPrice, maxPrice, bedrooms));
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Supported export formats: csv, pdf");
    }
}
