package com.redex.logisticaReparto.services;

import com.lowagie.text.*;
import com.lowagie.text.Cell;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.*;
import com.lowagie.text.pdf.ColumnText;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfGState;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfPageEventHelper;
import com.lowagie.text.pdf.PdfWriter;
import com.redex.logisticaReparto.model.Envio;
import com.redex.logisticaReparto.model.Paquete;
import com.redex.logisticaReparto.model.Ruta;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.view.document.AbstractPdfView;


import java.awt.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import com.redex.logisticaReparto.model.Aeropuerto;
import java.util.HashMap;

@Component
public class PdfService extends AbstractPdfView {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    @Autowired
    PlanDeVueloService planDeVueloService;

    @Override
    protected void buildPdfDocument(Map<String, Object> model, Document document, PdfWriter writer,
                                    HttpServletRequest request, HttpServletResponse response) throws Exception {

        List<Envio> envios = (List<Envio>)model.get("Envios");
        //LocalDateTime fecha = (LocalDateTime)model.get("Fecha");
        LocalDateTime fecha = LocalDateTime.now();

        document.setPageSize(PageSize.LETTER.rotate());
        document.setMargins(-20,-20,30,40);
        document.open();

        Font fuentetitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD,16, Color.white);
        Font fuentesubtitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD,14, Color.BLACK);
        Font fuenteTituloColumnas = FontFactory.getFont(FontFactory.HELVETICA_BOLD,10,Color.white);
        Font fuenteDataCeldas = FontFactory.getFont(FontFactory.COURIER,10,Color.BLACK);
        Font fuenteResaltado = FontFactory.getFont(FontFactory.COURIER_BOLD,10,Color.BLACK);
        PdfPTable tablaTitulo = new PdfPTable(1);
        PdfPCell celda = null;

        celda = new PdfPCell(new Phrase("REPORTE SIMULACIÓN COLAPSO"+ fecha.format(formatter),fuentetitulo));
        celda.setBorder(0);
        celda.setBackgroundColor(new Color(8,157,227));
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(30);

        tablaTitulo.addCell(celda);
        tablaTitulo.setSpacingAfter(10);

        PdfPTable tablaSubTitulo = new PdfPTable(1);
        celda = new PdfPCell(new Phrase("RESUMEN DE ULTIMA PLANIFICACION PAQUETES:",fuentesubtitulo));
        celda.setBorder(0);
        celda.setHorizontalAlignment(Element.ALIGN_LEFT);
        celda.setVerticalAlignment(Element.ALIGN_LEFT);
        celda.setPadding(20);
        celda.setPaddingLeft(0);

        tablaSubTitulo.addCell(celda);
        tablaSubTitulo.setSpacingAfter(10);


        PdfPTable tablaRutasEntregados = new PdfPTable(7);
        tablaRutasEntregados.setWidths(new float[]{0.75f,0.75f,1.2f,1.2f,1f,1f,1f});

        celda = new PdfPCell(new Phrase("N# ENVIO",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaRutasEntregados.addCell(celda);

        celda = new PdfPCell(new Phrase("ID PAQUETE",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaRutasEntregados.addCell(celda);

        celda = new PdfPCell(new Phrase("HORA SALIDA",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaRutasEntregados.addCell(celda);

        celda = new PdfPCell(new Phrase("HORA LLEGADA",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaRutasEntregados.addCell(celda);

        celda = new PdfPCell(new Phrase("AEROPUERTO ORIGEN",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaRutasEntregados.addCell(celda);

        celda = new PdfPCell(new Phrase("AEROPUERTO DESTINO",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaRutasEntregados.addCell(celda);

        celda = new PdfPCell(new Phrase("ESTADO",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaRutasEntregados.addCell(celda);


        HashMap<Long, String> cities = new HashMap<>();

        // Agregar ciudades con su respectivo ID
        cities.put(1L, "Bogotá");
        cities.put(2L, "Quito");
        cities.put(3L, "Caracas");
        cities.put(4L, "Brasilia");
        cities.put(5L, "Lima");
        cities.put(6L, "La Paz");
        cities.put(7L, "Santiago de Chile");
        cities.put(8L, "Buenos Aires");
        cities.put(9L, "Asunción");
        cities.put(10L, "Montevideo");
        cities.put(11L, "Tirana");
        cities.put(12L, "Berlín");
        cities.put(13L, "Viena");
        cities.put(14L, "Bruselas");
        cities.put(15L, "Minsk");
        cities.put(16L, "Sofía");
        cities.put(17L, "Praga");
        cities.put(18L, "Zagreb");
        cities.put(19L, "Copenhague");
        cities.put(20L, "Amsterdam");
        cities.put(21L, "Delhi");
        cities.put(22L, "Seúl");
        cities.put(23L, "Bangkok");
        cities.put(24L, "Dubái");
        cities.put(25L, "Beijing");
        cities.put(26L, "Tokio");
        cities.put(27L, "Kuala Lumpur");
        cities.put(28L, "Singapur");
        cities.put(29L, "Yakarta");
        cities.put(30L, "Manila");


        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");

        final int[] j = {1};
        Color lightGray = new Color(211, 211, 211);
        Color white = new Color(255, 255, 255);
        int rowCounter = 0; // Contador de filas

        for(Envio envio: envios){

            for (Paquete paquete : envio.getPaquetes()) {

                if(paquete.getRuta()!=null) {
                    for (Long ruta : paquete.getRuta().getListaRutas()) {

                        Color backgroundColor = (rowCounter % 2 == 0) ? lightGray : white;

                        celda = new PdfPCell(new Phrase(String.valueOf(envio.getId_envio()), fuenteDataCeldas));
                        celda.setPadding(5);
                        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                        celda.setVerticalAlignment(Element.ALIGN_CENTER);
                        //celda.setBackgroundColor(backgroundColor);
                        tablaRutasEntregados.addCell(celda);

                        celda = new PdfPCell(new Phrase(String.valueOf(paquete.getId_paquete()), fuenteDataCeldas));
                        celda.setPadding(5);
                        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                        celda.setVerticalAlignment(Element.ALIGN_CENTER);
                        //celda.setBackgroundColor(backgroundColor);
                        tablaRutasEntregados.addCell(celda);

                        LocalDateTime horaHorigen=planDeVueloService.obtenerPlanVueloPorId(ruta).get().getHora_origen();
                        String fechaIngresoFormateada = horaHorigen.format(formatter);

                        LocalDateTime horaDestino=planDeVueloService.obtenerPlanVueloPorId(ruta).get().getHora_destino();
                        String fechaLlegadaFormateada = horaDestino.format(formatter);

                        celda = new PdfPCell(new Phrase(fechaIngresoFormateada, fuenteDataCeldas));
                        celda.setPadding(5);
                        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                        celda.setVerticalAlignment(Element.ALIGN_CENTER);
                        //celda.setBackgroundColor(backgroundColor);
                        tablaRutasEntregados.addCell(celda);

                        celda = new PdfPCell(new Phrase(fechaLlegadaFormateada, fuenteDataCeldas));
                        celda.setPadding(5);
                        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                        celda.setVerticalAlignment(Element.ALIGN_CENTER);
                        //celda.setBackgroundColor(backgroundColor);
                        tablaRutasEntregados.addCell(celda);

                        long idCiudadOrigen=planDeVueloService.obtenerPlanVueloPorId(ruta).get().getCiudad_origen();
                        long idCiudadDestino=planDeVueloService.obtenerPlanVueloPorId(ruta).get().getCiudad_destino();
                        String ciudadOrigen = cities.get(idCiudadOrigen);
                        String ciudadDestino = cities.get(idCiudadDestino);


                        celda = new PdfPCell(new Phrase(ciudadOrigen, fuenteDataCeldas));
                        celda.setPadding(5);
                        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                        celda.setVerticalAlignment(Element.ALIGN_CENTER);
                        //celda.setBackgroundColor(backgroundColor);
                        tablaRutasEntregados.addCell(celda);

                        celda = new PdfPCell(new Phrase(ciudadDestino, fuenteDataCeldas));
                        celda.setPadding(5);
                        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                        celda.setVerticalAlignment(Element.ALIGN_CENTER);
                        //celda.setBackgroundColor(backgroundColor);
                        tablaRutasEntregados.addCell(celda);

                        celda = new PdfPCell(new Phrase("NO PLANIFICADO", fuenteResaltado));
                        celda.setPadding(5);
                        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                        celda.setVerticalAlignment(Element.ALIGN_CENTER);
                        //celda.setBackgroundColor(backgroundColor);
                        tablaRutasEntregados.addCell(celda);

                        rowCounter++;
                        j[0]++;
                    }
                }
            }
        }


        tablaRutasEntregados.setSpacingAfter(30);


    /*
        PdfPTable tablaRutas = new PdfPTable(5);
        tablaRutas.setWidths(new float[]{0.5f,1f,1f,1f,1.5f});

        celda = new PdfPCell(new Phrase("N#",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaRutas.addCell(celda);

        celda = new PdfPCell(new Phrase("TIPO DE VEHICULO",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaRutas.addCell(celda);

        celda = new PdfPCell(new Phrase("POSICION X",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaRutas.addCell(celda);

        celda = new PdfPCell(new Phrase("POSICION Y",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaRutas.addCell(celda);

        celda = new PdfPCell(new Phrase("PEDIDO",fuenteTituloColumnas));
        celda.setBackgroundColor(Color.DARK_GRAY);
        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
        celda.setVerticalAlignment(Element.ALIGN_CENTER);
        celda.setPadding(10);
        tablaRutas.addCell(celda);

    */
        final int[] n = {1};

        /*
        for(Vehiculo lista: vehiculos){
            for(Cell posicion : lista.getRoute()) {
                for (Pedido pedido : lista.getOrder()) {
                    celda = new PdfPCell(new Phrase(String.valueOf(n[0]), fuenteDataCeldas));
                    celda.setPadding(5);
                    celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                    celda.setVerticalAlignment(Element.ALIGN_CENTER);
                    tablaRutas.addCell(celda);

                    celda = new PdfPCell(new Phrase(lista.getTipo(), fuenteDataCeldas));
                    celda.setPadding(5);
                    celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                    celda.setVerticalAlignment(Element.ALIGN_CENTER);
                    tablaRutas.addCell(celda);


                    celda = new PdfPCell(new Phrase(String.valueOf(posicion.getX()), fuenteDataCeldas));
                    celda.setPadding(5);
                    celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                    celda.setVerticalAlignment(Element.ALIGN_CENTER);
                    tablaRutas.addCell(celda);

                    celda = new PdfPCell(new Phrase(String.valueOf(posicion.getY()), fuenteDataCeldas));
                    celda.setPadding(5);
                    celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                    celda.setVerticalAlignment(Element.ALIGN_CENTER);
                    tablaRutas.addCell(celda);
                    if(pedido.getX() == posicion.getX() && pedido.getY() == posicion.getY()){

                        celda = new PdfPCell(new Phrase("ENTREGADO", fuenteResaltado));
                        celda.setPadding(5);
                        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                        celda.setVerticalAlignment(Element.ALIGN_CENTER);
                        tablaRutas.addCell(celda);

                    }
                    else{
                        celda = new PdfPCell(new Phrase("-", fuenteDataCeldas));
                        celda.setPadding(5);
                        celda.setHorizontalAlignment(Element.ALIGN_CENTER);
                        celda.setVerticalAlignment(Element.ALIGN_CENTER);
                        tablaRutas.addCell(celda);
                    }
                    n[0]++;
                }

            }

        }
        */

        String imagePath = "Extra/Logo.png";
        BackgroundImage event = new BackgroundImage(imagePath);
        writer.setPageEvent(event);
        PdfContentByte cb = writer.getDirectContent();
        FooterEvent footerEvent = new FooterEvent();
        writer.setPageEvent(new PdfPageEventHelper() {
            @Override
            public void onEndPage(PdfWriter writer, Document document) {
                footerEvent.onEndPage(writer, document);
            }
        });

        document.add(tablaTitulo);
        document.add(tablaSubTitulo);
        document.add(tablaRutasEntregados);
        //document.add(tablaRutas);


    }
}



class FooterEvent extends PdfPageEventHelper {
    @Override
    public void onEndPage(PdfWriter writer, Document document) {
        try {
            PdfContentByte cb = writer.getDirectContent();
            Font fuenteDataCeldas = FontFactory.getFont(FontFactory.COURIER, 10, Color.BLACK);
            Phrase footer = new Phrase("REDEX \n", fuenteDataCeldas);
            ColumnText.showTextAligned(cb, Element.ALIGN_CENTER, footer,
                    (document.right() - document.left()) / 2 + document.leftMargin(), document.bottom() - 20, 0);
        } catch (DocumentException e) {
            e.printStackTrace();
        }
    }
}

class BackgroundImage extends PdfPageEventHelper {
    private String imagePath;

    public BackgroundImage(String imagePath) {
        this.imagePath = imagePath;
    }

    @Override
    public void onEndPage(PdfWriter writer, Document document) {
        try {
            PdfContentByte canvas = writer.getDirectContentUnder();
            float width = PageSize.LETTER.getWidth();
            float height = PageSize.LETTER.getHeight();

            Image logo = Image.getInstance(ClassLoader.getSystemResource(imagePath));
            float imageWidth = logo.getScaledWidth();
            float imageHeight = logo.getScaledHeight();

            float x = (width - imageWidth) / 2;
            float y = (height - imageHeight) / 2;

            logo.setAbsolutePosition(x+100, y-100);

            PdfGState gs = new PdfGState();
            gs.setFillOpacity(0.2f);
            canvas.setGState(gs);

            canvas.addImage(logo);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
