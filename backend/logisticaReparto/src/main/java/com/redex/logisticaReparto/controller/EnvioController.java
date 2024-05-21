package com.redex.logisticaReparto.controller;

import com.redex.logisticaReparto.model.Envio;
import com.redex.logisticaReparto.services.EnvioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Optional;

@RequestMapping("api")
@RestController
public class EnvioController {
    @Autowired
    private EnvioService envioService;

    @GetMapping("/envios/obtenerTodos")
    ArrayList<Envio> obtenerTodosEnvios() { return envioService.obtenerEnvios();}

    @PostMapping("/envios/insertar")
    Envio insertarEnvio(Envio envio) { return envioService.insertarEnvio(envio); }

    @GetMapping("/envios/obtenerPorId")
    Optional<Envio> obtenerPorId(long idEnvio) { return envioService.obtenerEnvioPorId(idEnvio);}

    @PostMapping("envios/insertarTodos")
    ArrayList<Envio> insertarTodosEnvios(ArrayList<Envio> envios) {return envioService.insertarListaEnvios(envios);}
}
