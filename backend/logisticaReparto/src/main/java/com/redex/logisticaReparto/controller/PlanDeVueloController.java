package com.redex.logisticaReparto.controller;

import com.redex.logisticaReparto.dto.PlanVueloResponse;
import com.redex.logisticaReparto.model.Aeropuerto;
import com.redex.logisticaReparto.model.PlanDeVuelo;
import com.redex.logisticaReparto.services.AeropuertoService;
import com.redex.logisticaReparto.services.PlanDeVueloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileNotFoundException;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Scanner;

@CrossOrigin(origins = "*")
@RequestMapping("api")
@RestController
public class PlanDeVueloController {
    @Autowired
    private PlanDeVueloService planDeVueloService;
    @Autowired
    private AeropuertoService aeropuertoService;

    //@GetMapping("/planesVuelo/obtenerTodos")
    //ArrayList<PlanDeVuelo> obtenerTodosPlanesVuelos() { return planDeVueloService.obtenerPlanesVuelos();}

    @GetMapping("/planesVuelo/obtenerTodos")
    //ArrayList<PlanDeVuelo> obtenerTodosPlanesVuelos() { return planDeVueloService.obtenerPlanesVuelos();}
    ArrayList<PlanVueloResponse> obtenerTodosPlanesVuelos() { return planDeVueloService.obtenerPlanesVuelos();}


    //@GetMapping("planesVuelo/listarConLatitudLongitud")
    //ArrayList<PlanDeVuelo> obtenerPlanesConLatitudLongitud() { return planDeVueloService.obtenerPlanesLatitudLongitud();}

    @GetMapping("/planesVuelo/obtenerPorFechasConLatitudLongitud/{fechaI}/{fechaF}")
    ArrayList<PlanVueloResponse> obtenerTodosPorFechasConLatitudLongitud(@PathVariable String fechaI, @PathVariable String fechaF) {
        int anio = Integer.parseInt(fechaI.substring(0, 4));
        int mes = Integer.parseInt(fechaI.substring(4, 6));
        int dia = Integer.parseInt(fechaI.substring(6, 8));
        int hora = Integer.parseInt(fechaI.substring(9, 11));
        int minutos = Integer.parseInt(fechaI.substring(12, 14));
        String husoHorarioStr = fechaI.substring(15);
        ZonedDateTime fechaInicio = ZonedDateTime.of(anio, mes, dia, hora, minutos, 0, 0, ZoneId.of(husoHorarioStr));
        LocalDateTime fechaInicioLocal = fechaInicio.toLocalDateTime();

        anio = Integer.parseInt(fechaF.substring(0, 4));
        mes = Integer.parseInt(fechaF.substring(4, 6));
        dia = Integer.parseInt(fechaF.substring(6, 8));
        hora = Integer.parseInt(fechaF.substring(9, 11));
        minutos = Integer.parseInt(fechaF.substring(12, 14));
        husoHorarioStr = fechaF.substring(15);
        ZonedDateTime fechaFin = ZonedDateTime.of(anio, mes, dia, hora, minutos, 0, 0, ZoneId.of(husoHorarioStr));
        LocalDateTime fechaFinLocal = fechaFin.toLocalDateTime();

        return planDeVueloService.obtenerPlanesVuelosPorFechaLatLong(fechaInicioLocal,husoHorarioStr,fechaFinLocal);
    }

    @GetMapping("/planesVuelo/obtenerPorFechas/{fechaI}/{fechaF}")
    ArrayList<PlanDeVuelo> obtenerTodosPorFechas(@PathVariable String fechaI, @PathVariable String fechaF) {
        int anio = Integer.parseInt(fechaI.substring(0, 4));
        int mes = Integer.parseInt(fechaI.substring(4, 6));
        int dia = Integer.parseInt(fechaI.substring(6, 8));
        int hora = Integer.parseInt(fechaI.substring(9, 11));
        int minutos = Integer.parseInt(fechaI.substring(12, 14));
        String husoHorarioStr = fechaI.substring(15);
        ZonedDateTime fechaInicio = ZonedDateTime.of(anio, mes, dia, hora, minutos, 0, 0, ZoneId.of(husoHorarioStr));
        LocalDateTime fechaInicioLocal = fechaInicio.toLocalDateTime();

        anio = Integer.parseInt(fechaF.substring(0, 4));
        mes = Integer.parseInt(fechaF.substring(4, 6));
        dia = Integer.parseInt(fechaF.substring(6, 8));
        hora = Integer.parseInt(fechaF.substring(9, 11));
        minutos = Integer.parseInt(fechaF.substring(12, 14));
        husoHorarioStr = fechaF.substring(15);
        ZonedDateTime fechaFin = ZonedDateTime.of(anio, mes, dia, hora, minutos, 0, 0, ZoneId.of(husoHorarioStr));
        LocalDateTime fechaFinLocal = fechaFin.toLocalDateTime();

        return planDeVueloService.obtenerPlanesVuelosPorFecha(fechaInicioLocal,husoHorarioStr,fechaFinLocal);
    }


    @PostMapping("/planesVuelo/insertar")
    PlanDeVuelo insertarPlanDeVuelo(PlanDeVuelo plan) { return planDeVueloService.insertarPlanVuelo(plan); }

    @GetMapping("/planesVuelo/obtenerPorId")
    Optional<PlanDeVuelo> obtenerPorId(long idPlan) { return planDeVueloService.obtenerPlanVueloPorId(idPlan);}

    @PostMapping("planesVuelo/insertarTodos")
    ArrayList<PlanDeVuelo> insertarTodosPlanesVuelos(ArrayList<PlanDeVuelo> planes) {return planDeVueloService.insertarListaPlanesVuelos(planes);}

    @PostMapping("planesVuelo/cargarArchivoPlanes/{fecha}")
    ArrayList<PlanDeVuelo> cargarPlanesVuelo(@PathVariable String fecha){
        long startTime = System.currentTimeMillis();
        ArrayList<PlanDeVuelo> planes = new ArrayList<>();
        String anio = fecha.substring(0, 4);
        String mes = fecha.substring(4, 6);
        String dia = fecha.substring(6, 8);
        int aa = Integer.parseInt(anio);
        int mm = Integer.parseInt(mes);
        int dd = Integer.parseInt(dia);
        int i =1;
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

                        LocalTime hI = LocalTime.parse(data[2]);
                        LocalTime hF = LocalTime.parse(data[3]);

                        LocalDateTime fechaInicio = LocalDateTime.of(aa, mm, dd, hI.getHour(), hI.getMinute(), 0);
                        LocalDateTime fechaFin;

                        //Segun la hora de inicio y final, podemos determinar si el vuelo acaba
                        //en el mismo o diferente dia
                        if (planDeVueloService.planAcabaElSiguienteDia(data[2], data[3])) {
                            fechaFin = LocalDateTime.of(aa, mm, dd, hF.getHour(), hF.getMinute(), 0).plusDays(1);
                        } else {
                            fechaFin = LocalDateTime.of(aa, mm, dd, hF.getHour(), hF.getMinute(), 0);
                        }

                        ZonedDateTime zonedHoraInicio = fechaInicio.atZone(ZoneId.of(husoOrigen));
                        ZonedDateTime zonedHoraFin = fechaFin.atZone(ZoneId.of(husoDestino));
                        //ZonedDateTime hora_inicio = fechaInicio.withHour(hI.getHour()).withMinute(hI.getMinute()).withSecond(0);
                        //ZonedDateTime hora_fin = fechaFin.withHour(hF.getHour()).withMinute(hF.getMinute()).withSecond(0);

                        int capacidad = Integer.parseInt(data[4]);
                        //System.out.println(ciudad_origen + " " + ciudad_destino + " " + hora_inicio + " " + hora_fin + " " + capacidad);

                        PlanDeVuelo plan = new PlanDeVuelo(ciudad_origen,fechaInicio,husoOrigen,ciudad_destino,fechaFin,husoDestino,capacidad,1);

                        //plan.setCoordenada_origen(new Coordenada("Origen",aeropuertoOrigen.getLatitud(), aeropuertoOrigen.getLongitud()));
                        //plan.setCoordenada_destino(new Coordenada("Destino",aeropuertoDest.getLatitud(), aeropuertoDest.getLongitud()));
                        planes.add(plan);
                        //planDeVueloService.insertarPlanVuelo(plan);
                        System.out.println(i);
                        i++;
                    }
                }

            }
        } catch (FileNotFoundException e) {
            System.out.println("Archivo de pedidos no encontrado, error: " + e.getMessage());
        }
        planDeVueloService.insertarListaPlanesVuelos(planes);
        long endTime = System.currentTimeMillis();
        long durationInMillis = endTime - startTime;
        double durationInSeconds = durationInMillis / 1000.0;
        System.out.println("Tiempo de ejecución: " + durationInSeconds + " segundos");
        return planes;
    }
}
