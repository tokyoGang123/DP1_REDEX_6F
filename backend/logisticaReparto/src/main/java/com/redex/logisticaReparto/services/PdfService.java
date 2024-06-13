package com.redex.logisticaReparto.services;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class PdfService {

    public byte[] generatePdf() throws DocumentException, IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        Document document = new Document();

        PdfWriter.getInstance(document, byteArrayOutputStream);
        document.open();

        document.add(new Paragraph("¡Hola, Mundo! Este es un PDF generado con OpenPDF en Spring Boot."));

        document.close();

        return byteArrayOutputStream.toByteArray();
    }
}
