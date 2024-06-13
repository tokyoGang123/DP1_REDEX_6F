package com.redex.logisticaReparto.controller;

import com.redex.logisticaReparto.services.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RestController
@RequestMapping(path = "api")
public class PdfController {
    private final PdfService reporteSimulacionPDFService;
    //private final VehiculoBDService vehiculoBDService;
    @Autowired
    public PdfController(PdfService reporteSimulacionPDFService
                                          //,VehiculoBDService vehiculoBDService
                                          ){
        this.reporteSimulacionPDFService = reporteSimulacionPDFService;
        //this.vehiculoBDService = vehiculoBDService;
    }

    @GetMapping(value = "/generar",produces =  MediaType.APPLICATION_PDF_VALUE)
    public ModelAndView generarPDF(){
        //List<VehiculoBD> vehiculos = vehiculoBDService.listar();
        Map<String, Object> model = new HashMap<>();
        //model.put("Vehiculos", vehiculos);
        return new ModelAndView(reporteSimulacionPDFService,model);
    }
}
