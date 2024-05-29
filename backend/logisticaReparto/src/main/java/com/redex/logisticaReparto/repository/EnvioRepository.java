package com.redex.logisticaReparto.repository;

import com.redex.logisticaReparto.model.Envio;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.lang.reflect.Array;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;

@Repository
public interface EnvioRepository extends CrudRepository<Envio, Long> {

    @Query("SELECT e FROM Envio e WHERE FUNCTION('DATE', e.fecha_ingreso) = :fecha")
    public ArrayList<Envio> findByFecha_ingreso(LocalDate fecha);
}
