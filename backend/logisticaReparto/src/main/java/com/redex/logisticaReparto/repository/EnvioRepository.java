package com.redex.logisticaReparto.repository;

import com.redex.logisticaReparto.model.Envio;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.lang.reflect.Array;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;

@Repository
public interface EnvioRepository extends CrudRepository<Envio, Long> {

    @Query("SELECT e FROM Envio e WHERE FUNCTION('DATE', e.fecha_ingreso) = :fecha")
    public ArrayList<Envio> findByFecha_ingreso(LocalDate fecha);


    //@Query("SELECT e FROM Envio e WHERE FUNCTION('CONVERT_TZ', e.fecha_ingreso, e.huso_horario_origen, ?2) BETWEEN ?1 AND ?3")
    //public ArrayList<Envio> findByFechaIngresoInRange(ZonedDateTime fechaInicio, String husoHorarioInicio, ZonedDateTime fechaFin);

//    @Query("SELECT e FROM Envio e WHERE e.fecha_ingreso BETWEEN :fechaInicio AND :fechaFin AND e.huso_horario_origen = :husoHorario")
//    ArrayList<Envio> findByFechaIngresoInRange(LocalDateTime fechaInicio, LocalDateTime fechaFin, String husoHorario);

    /*@Query(value = "SELECT * FROM Envio e WHERE " +
            "CAST((e.fecha_ingreso AT TIME ZONE e.huso_horario) AS TIMESTAMP) BETWEEN :fechaInicioUTC AND :fechaFinUTC",
            nativeQuery = true)
    ArrayList<Envio> findByFechaIngresoInRange(@Param("fechaInicioUTC") LocalDateTime fechaInicioUTC,
                                          @Param("fechaFinUTC") LocalDateTime fechaFinUTC);*/

    @Query("SELECT e FROM Envio e " +
            "WHERE e.fecha_ingreso BETWEEN " +
            "FUNCTION('CONVERT_TZ', :fechaInicio, :husoHorarioInicio, e.huso_horario_origen) " +
            "AND " +
            "FUNCTION('CONVERT_TZ', :fechaFin, :husoHorarioInicio, e.huso_horario_origen)")
    ArrayList<Envio> findByFechaIngresoInRange(@Param("fechaInicio") LocalDateTime fechaInicio,
                                          @Param("husoHorarioInicio") String husoHorarioInicio,
                                          @Param("fechaFin") LocalDateTime fechaFin);

}

