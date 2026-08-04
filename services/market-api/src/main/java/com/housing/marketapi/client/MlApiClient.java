package com.housing.marketapi.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.housing.marketapi.model.ApiModels.MlPredictionResponse;
import com.housing.marketapi.model.ApiModels.PropertyFeatures;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Component
public class MlApiClient {

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String baseUrl;

    public MlApiClient(@Value("${app.ml-api.base-url:http://127.0.0.1:8000}") String baseUrl) {
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        this.objectMapper = new ObjectMapper();
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .version(HttpClient.Version.HTTP_1_1)
                .build();
    }

    public double predict(PropertyFeatures input) {
        try {
            String payload = objectMapper.writeValueAsString(input);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(this.baseUrl + "/predict"))
                    .header("Content-Type", "application/json")
                    .version(HttpClient.Version.HTTP_1_1)
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                MlPredictionResponse body = objectMapper.readValue(response.body(), MlPredictionResponse.class);
                return body.predictedPrice();
            }

            throw new ResponseStatusException(HttpStatusCode.valueOf(503), "ml-api is unavailable");
        } catch (IOException | InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatusCode.valueOf(503), "ml-api is unavailable");
        }
    }
}
