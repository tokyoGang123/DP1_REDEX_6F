package com.redex.logisticaReparto.controller;

import com.redex.logisticaReparto.model.Aeropuerto;
import com.redex.logisticaReparto.services.AeropuertoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

@RequestMapping("api")
@RestController
public class AeropuertoController {
    @Autowired
    private AeropuertoService aeropuertoService;
    private static final Pattern LINE_PATTERN = Pattern.compile(
            "(\\d+)\\s+" +                        // Número
                    "(\\w+)\\s+" +                        // Código
                    "([\\w\\s]+?)\\s+" +                  // Ciudad
                    "([\\w\\s]+?)\\s+" +                  // País
                    "(\\w+)\\s+" +                        // Código ciudad
                    "([+-]?\\d+)\\s+" +                   // GMT
                    "(\\d+)\\s+" +                        // Capacidad
                    "Latitude:\\s+([\\d°'\"\\sNSEW]+)\\s+" + // Latitud
                    "Longitude:\\s+([\\d°'\"\\sNSEW]+)"     // Longitud
    );

    @GetMapping("/aeropuertos/obtenerTodos")
    ArrayList<Aeropuerto> obtenerTodosAeropuertos() { return aeropuertoService.obtenerTodosAeropuertos();}

    @PostMapping("/aeropuertos/insertar")
    Aeropuerto insertarAeropuerto(Aeropuerto aeropuerto) { return aeropuertoService.insertarAeropuerto(aeropuerto); }

    @PostMapping("aeropuertos/insertarTodos")
    ArrayList<Aeropuerto> insertarTodosAeropuertos(ArrayList<Aeropuerto> aeropuertos) { return aeropuertoService.insertarListaAeropuertos(aeropuertos);}

    @GetMapping("/aeropuertos/obtenerPorId")
    Optional<Aeropuerto> obtenerAeropuertoPorId(int idAeropuerto) { return aeropuertoService.obtenerAeropuertoPorId(idAeropuerto);}

    @GetMapping("/aeropuertos/obtenerPorCodigo")
    Optional<Aeropuerto> obtenerAeropuertoPorCodigo(String codigo) { return aeropuertoService.obtenerAeropuertoPorCodigo(codigo);}

    /*@PostMapping("/aeropuertos/cargarAeropuertos")
    ArrayList<Aeropuerto> cargarAeropuertos(@RequestBody Map<String, String> datos){
        String aeropuertos = datos.get("data");

    }*/

}
