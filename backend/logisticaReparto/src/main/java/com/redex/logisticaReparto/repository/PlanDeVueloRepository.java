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
    @Query("SELECT new com.redex.logisticaReparto.dto.PlanVueloResponse(" +
            "p.id_tramo, " +
            "p.ciudad_origen, " +
            "CONCAT(CAST(FUNCTION('DATE_FORMAT', p.hora_origen, '%Y-%m-%d %H:%i:%s') AS string),'Z',ao.huso_horario), " +
            "ao.longitud, ao.latitud, " +
            "p.ciudad_destino, " +
            "CONCAT(CAST(FUNCTION('DATE_FORMAT', p.hora_destino, '%Y-%m-%d %H:%i:%s') AS string),'Z',ad.huso_horario), " +
            "ad.longitud, ad.latitud, " +
            "p.capacidad_maxima, " +
            "p.capacidad_ocupada, " +
            "p.estado) " +
            "FROM PlanDeVuelo p " +
            "JOIN Aeropuerto ao ON p.ciudad_origen = ao.id_aeropuerto " +
            "JOIN Aeropuerto ad ON p.ciudad_destino = ad.id_aeropuerto")
    ArrayList<PlanVueloResponse> queryPlanDeVueloWithAeropuerto();
}

