package com.redex.logisticaReparto.controller;

import com.redex.logisticaReparto.model.Aeropuerto;
import com.redex.logisticaReparto.model.PlanDeVuelo;
import com.redex.logisticaReparto.repository.AeropuertoRepository;
import com.redex.logisticaReparto.services.AeropuertoService;
import com.redex.logisticaReparto.services.PlanDeVueloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileNotFoundException;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Optional;
import java.util.Scanner;

@RequestMapping("api")
@RestController
public class PlanDeVueloController {
    @Autowired
    private PlanDeVueloService planDeVueloService;
    @Autowired
    private AeropuertoService aeropuertoService;

    @GetMapping("/planesVuelo/obtenerTodos")
    ArrayList<PlanDeVuelo> obtenerTodosPlanesVuelos() { return planDeVueloService.obtenerPlanesVuelos();}

    @PostMapping("/planesVuelo/insertar")
    PlanDeVuelo insertarPlanDeVuelo(PlanDeVuelo plan) { return planDeVueloService.insertarPlanVuelo(plan); }

    @GetMapping("/planesVuelo/obtenerPorId")
    Optional<PlanDeVuelo> obtenerPorId(long idPlan) { return planDeVueloService.obtenerPlanVueloPorId(idPlan);}

    @PostMapping("planesVuelo/insertarTodos")
    ArrayList<PlanDeVuelo> insertarTodosPlanesVuelos(ArrayList<PlanDeVuelo> planes) {return planDeVueloService.insertarListaPlanesVuelos(planes);}

    @PostMapping("planesVuelo/cargarArchivoPlanes/{fecha}")
    ArrayList<PlanDeVuelo> cargarPlanesVuelo(@PathVariable String fecha){
        ArrayList<PlanDeVuelo> planes = new ArrayList<>();
        String[] partesFecha = fecha.split("/");
        int aa = Integer.parseInt(partesFecha[0]);
        int mm = Integer.parseInt(partesFecha[1]);
        int dd = Integer.parseInt(partesFecha[2]);

        try {
            File planesFile = new File("src/main/resources/PlanesVuelo/planes_vuelo.v3.txt");
            Scanner scanner = new Scanner(planesFile);
            while(scanner.hasNextLine()) { //Leer todas la lineas
                String row = scanner.nextLine();
                String data[] = row.split("-");

                //Un solo dato significaría que solo se leyó el salto de linea, el cual no queremos
                if (data.length > 1) {

                    Optional<Aeropuerto> aeropuertoOptionalOrig = aeropuertoService.obtenerAeropuertoPorCodigo(data[0]);
                    Optional<Aeropuerto> aeropuertoOptionalDest = aeropuertoService.obtenerAeropuertoPorCodigo(data[1]);

                    if (aeropuertoOptionalOrig.isPresent() && aeropuertoOptionalDest.isPresent()) {
                        Aeropuerto aeropuertoOrigen = aeropuertoOptionalOrig.get();
                        Aeropuerto aeropuertoDest = aeropuertoOptionalDest.get();

                        int ciudad_origen = aeropuertoOrigen.getId_aeropuerto();
                        int ciudad_destino = aeropuertoDest.getId_aeropuerto();

                        String husoOrigen = aeropuertoOrigen.getHuso_horario();
                        String husoDestino = aeropuertoDest.getHuso_horario();

                        ZonedDateTime fechaInicio = ZonedDateTime.of(aa,mm,dd,12,0,0,0, ZoneId.of(husoOrigen));
                        ZonedDateTime fechaFin;

                        //Segun la hora de inicio y final, podemos determinar si el vuelo acaba
                        //en el mismo o diferente día
                        if (planDeVueloService.planAcabaElSiguienteDia(data[2],data[3])) {
                            //fechaFin = ZonedDateTime.now(ZoneId.of(husoDestino)).plusDays(1);
                            fechaFin = ZonedDateTime.of(aa,mm,dd,12,0,0,0,ZoneId.of(husoDestino)).plusDays(1);
                        } else {
                            fechaFin = ZonedDateTime.of(aa,mm,dd,12,0,0,0,ZoneId.of(husoDestino));
                        }

                        //Hora Inicio
                        LocalTime hI = LocalTime.parse(data[2]);

                        //Hora Final
                        LocalTime hF = LocalTime.parse(data[3]);

                        ZonedDateTime hora_inicio = fechaInicio.withHour(hI.getHour()).withMinute(hI.getMinute()).withSecond(0);
                        ZonedDateTime hora_fin = fechaFin.withHour(hF.getHour()).withMinute(hF.getMinute()).withSecond(0);

                        int capacidad = Integer.parseInt(data[4]);

                        //System.out.println(ciudad_origen + " " + ciudad_destino + " " + hora_inicio + " " + hora_fin + " " + capacidad);

                        PlanDeVuelo plan = new PlanDeVuelo(ciudad_origen,hora_inicio,ciudad_destino,hora_fin,capacidad,1);
                        planes.add(plan);
                    }
                }

            }
        } catch (FileNotFoundException e) {
            System.out.println("Archivo de pedidos no encontrado, error: " + e.getMessage());
        }
        planDeVueloService.insertarListaPlanesVuelos(planes);
        return planes;
    }
}
