package com.redex.logisticaReparto.repository;

import com.redex.logisticaReparto.dto.PlanVueloResponse;
import com.redex.logisticaReparto.model.PlanDeVuelo;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface PlanDeVueloRepository extends CrudRepository<PlanDeVuelo, Long> {
    @Query("SELECT new com.redex.logisticaReparto.dto.PlanVueloResponse(p.id_tramo, p.ciudad_origen, p.hora_origen, ao.longitud, ao.latitud, " +
            "p.ciudad_destino, p.hora_destino, ad.longitud, ad.latitud, " +
            "p.capacidad_maxima, p.capacidad_ocupada, p.estado) " +
            "FROM PlanDeVuelo p " +
            "JOIN Aeropuerto ao ON p.ciudad_origen = ao.id_aeropuerto " +
            "JOIN Aeropuerto ad ON p.ciudad_destino = ad.id_aeropuerto")
    public ArrayList<PlanVueloResponse> queryPlanDeVueloWithAeropuerto();
}
