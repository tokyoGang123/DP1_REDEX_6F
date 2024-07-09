package com.redex.logisticaReparto.services;

import com.redex.logisticaReparto.model.Aeropuerto;
import com.redex.logisticaReparto.model.Envio;
import com.redex.logisticaReparto.model.PlanDeVuelo;
import com.redex.logisticaReparto.dto.PlanVueloResponse;
import com.redex.logisticaReparto.repository.PlanDeVueloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PlanDeVueloService {
    @Autowired
    private PlanDeVueloRepository planDeVueloRepository;
    @Autowired
    private AeropuertoService aeropuertoService;

    public ArrayList<PlanVueloResponse> obtenerPlanesVuelos() { return planDeVueloRepository.queryPlanDeVueloWithAeropuerto(); }

    public ArrayList<PlanDeVuelo> obtenerListaPlanesVuelos() { return (ArrayList<PlanDeVuelo>)planDeVueloRepository.findAll(); }

    public PlanDeVuelo insertarPlanVuelo(PlanDeVuelo plan) { return planDeVueloRepository.save(plan); }

    public Optional<PlanDeVuelo> obtenerPlanVueloPorId(long id) { return planDeVueloRepository.findById(id); }

    public ArrayList<PlanDeVuelo> insertarListaPlanesVuelos(List<PlanDeVuelo> planes) { return (ArrayList<PlanDeVuelo>)planDeVueloRepository.saveAll(planes); }

    public ArrayList<PlanDeVuelo> obtenerPlanesVuelosPorFecha(LocalDateTime fechaInicio, String husoHorario, LocalDateTime fechaFin){
        return planDeVueloRepository.findByFechaIngresoInRange(fechaInicio, husoHorario, fechaFin);
    }

    public ArrayList<PlanVueloResponse> obtenerPlanesVuelosPorFechaLatLong(LocalDateTime fechaInicio, String husoHorario, LocalDateTime fechaFin){
        return planDeVueloRepository.queryPlanDeVueloWithFechaIngresoFechaFin(fechaInicio, husoHorario, fechaFin);
    }

    public int calcularTotalPaquetesPlanes(ArrayList<PlanDeVuelo> planes) {
        int totalPaquetes = 0;
        for (PlanDeVuelo plan : planes) {
            System.out.println(plan.getId_tramo() + " - paquetes: " + plan.getCapacidad_ocupada());
            totalPaquetes += plan.getCapacidad_ocupada();
        }
        return totalPaquetes;
    }

    //public boolean planAcabaElSiguienteDia(String tInicio, String tFin) {
    public int planAcabaElSiguienteDia(String tInicio, String tFin,String husoOrigen, String husoDestino,
                                       int aa, int mm, int dd) {

        int cantidad = 0;
        LocalTime horaInicio = LocalTime.parse(tInicio);
        LocalTime horaFin = LocalTime.parse(tFin);

        ZonedDateTime zonedHoraInicio = ZonedDateTime.of(aa, mm, dd, horaInicio.getHour(), horaInicio.getMinute(), 0, 0, ZoneId.of(husoOrigen));

        ZonedDateTime convertedHoraInicio = zonedHoraInicio.withZoneSameInstant(ZoneId.of(husoDestino));

        if (!convertedHoraInicio.toLocalDate().isEqual(zonedHoraInicio.toLocalDate())) { //dia distinto, dia siguiente conversion
            cantidad++;
        }

        if (convertedHoraInicio.toLocalTime().isAfter(horaFin)) cantidad++; //hora de origen despues de hora destino

        return cantidad;
        //return convertedHoraInicio.toLocalTime().isAfter(horaFin);
    }
}
