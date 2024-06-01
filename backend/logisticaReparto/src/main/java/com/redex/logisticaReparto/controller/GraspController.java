package com.redex.logisticaReparto.controller;

import com.redex.logisticaReparto.model.*;
import com.redex.logisticaReparto.dto.*;
import com.redex.logisticaReparto.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
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

    //20240529T14:00-05:00
    //20240529T16:00-05:00

    @GetMapping("grasp/ejecutar/{fechaHora}")
    public ArrayList<Envio> ejecutarGrasp(@PathVariable String fechaHora){
        long startTime = System.currentTimeMillis();
        int anio = Integer.parseInt(fechaHora.substring(0, 4));
        int mes = Integer.parseInt(fechaHora.substring(4, 6));
        int dia = Integer.parseInt(fechaHora.substring(6, 8));
        int hora = Integer.parseInt(fechaHora.substring(9, 11));
        int minutos = Integer.parseInt(fechaHora.substring(12, 14));
        String husoHorarioStr = fechaHora.substring(15);

        ZonedDateTime fechaInicio = ZonedDateTime.of(anio, mes, dia, hora, minutos, 0, 0, ZoneId.of(husoHorarioStr));
        ZonedDateTime fechaFin = fechaInicio.plusHours(2);
        LocalDateTime fechaInicioLocal = fechaInicio.toLocalDateTime();
        LocalDateTime fechaFinLocal = fechaFin.toLocalDateTime();
        //Busqueda de envios en el rango de 2 horas
        ArrayList<Envio> enviosEnRango = envioService.obtenerEnviosPorFecha(fechaInicioLocal, husoHorarioStr, fechaFinLocal);
        //Busqueda de planes en el rango de 12 horas (por ahora)
        ArrayList<PlanDeVuelo> planesEnRango = planDeVueloService.obtenerPlanesVuelosPorFecha(fechaInicioLocal,
                husoHorarioStr, fechaFin.plusHours(12).toLocalDateTime());

        //450
        grasp.getEnvios().addAll(enviosEnRango);
        ArrayList<Envio> solucion = grasp.ejecutaGrasp(grasp.getAeropuertos(),grasp.getEnvios(),planesEnRango);
        //Implementar una funcion que busque, de solucion, aquellos envios que no tienen paquetes con rutas asignadas
        //20 no tienen ruta
        ArrayList<Envio> enviosSinRuta = grasp.buscarSinRuta(solucion);
        grasp.setEnvios(enviosSinRuta);

        long endTime = System.currentTimeMillis();
        long durationInMillis = endTime - startTime;
        double durationInSeconds = durationInMillis / 1000.0;
        System.out.println("Tiempo de ejecución: " + durationInSeconds + " segundos");
        return solucion;
    }
}
