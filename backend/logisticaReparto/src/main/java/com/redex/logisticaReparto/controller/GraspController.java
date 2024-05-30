package com.redex.logisticaReparto.controller;

import com.redex.logisticaReparto.model.*;
import com.redex.logisticaReparto.dto.*;
import com.redex.logisticaReparto.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("api")
public class GraspController {
    @Autowired
    AeropuertoService aeropuertoService;
    @Autowired
    ContinenteService continenteService;
    @Autowired
    EnvioService envioService;
    @Autowired
    PaisService paisService;
    @Autowired
    PaqueteService paqueteService;
    @Autowired
    PlanDeVueloService planDeVueloService;

    private Grasp grasp = new Grasp();


    @GetMapping("/grasp/iniciar")
    public String iniciarGrasp(){
        ArrayList<Aeropuerto> aeropuertos = aeropuertoService.obtenerTodosAeropuertos();
        ArrayList<Continente> continentes = continenteService.obtenerTodosContinentes();
        ArrayList<Pais> paises = paisService.obtenerTodosPaises();
        grasp.setAeropuertos(aeropuertos);
        grasp.setContinentes(continentes);
        grasp.setPaises(paises);
        return "Se inicio la simulacion";
    }

    //20240529T14:00:-05:00
    //20240529T16:00:-05:00

    @GetMapping("grasp/ejecutar/{fechaHora}")
    public ArrayList<Envio> ejecutarGrasp(@PathVariable String fechaHora){
        ArrayList<Envio> solucion = new ArrayList<>();

        ArrayList<Envio> envios = envioService.obtenerEnvios();
        ArrayList<PlanDeVuelo> planes = planDeVueloService.obtenerListaPlanesVuelos();
        solucion = grasp.ejecutaGrasp(grasp.getAeropuertos(),grasp.getEnvios(),planes);
        return solucion;
    }


}
