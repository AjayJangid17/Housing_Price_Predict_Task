package com.housing.marketapi.export;

import com.housing.marketapi.model.ApiModels.Property;
import com.housing.marketapi.service.MarketService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class ExportService {

    private static final float MARGIN = 40f;
    private static final float LINE_HEIGHT = 16f;
    private static final float FONT_SIZE = 10f;

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
        List<Property> properties = marketService.getFilteredProperties(minPrice, maxPrice, bedrooms, "price", "asc");
        String header = "Exported property filter: minPrice=" + minPrice + ", maxPrice=" + maxPrice + ", bedrooms=" + bedrooms;
        String[] columns = {"id", "sqft", "bed", "bath", "year", "lot", "dist", "school", "price"};

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);
            PDType1Font font = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
            PDType1Font boldFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);

            PDPageContentStream stream = new PDPageContentStream(document, page);
            float y = page.getMediaBox().getHeight() - MARGIN;

            stream.setFont(boldFont, 12f);
            stream.beginText();
            stream.newLineAtOffset(MARGIN, y);
            stream.showText(header);
            stream.endText();
            y -= LINE_HEIGHT * 1.5f;

            stream.setFont(boldFont, FONT_SIZE);
            stream.beginText();
            stream.newLineAtOffset(MARGIN, y);
            stream.showText(String.join("  ", columns));
            stream.endText();
            y -= LINE_HEIGHT;

            stream.setFont(font, FONT_SIZE);
            for (Property property : properties) {
                if (y < MARGIN) {
                    stream.close();
                    page = new PDPage(PDRectangle.A4);
                    document.addPage(page);
                    stream = new PDPageContentStream(document, page);
                    stream.setFont(font, FONT_SIZE);
                    y = page.getMediaBox().getHeight() - MARGIN;
                }
                String row = String.format(
                        "%d  %d  %d  %.1f  %d  %d  %.1f  %.1f  %d",
                        property.id(), property.square_footage(), property.bedrooms(), property.bathrooms(),
                        property.year_built(), property.lot_size(), property.distance_to_city_center(),
                        property.school_rating(), property.price()
                );
                stream.beginText();
                stream.newLineAtOffset(MARGIN, y);
                stream.showText(row);
                stream.endText();
                y -= LINE_HEIGHT;
            }
            stream.close();

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            return out.toByteArray();
        } catch (IOException ex) {
            throw new UncheckedIOException("Failed to generate PDF export", ex);
        }
    }
}
