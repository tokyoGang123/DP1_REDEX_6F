package com.redex.logisticaReparto.repository;

import com.redex.logisticaReparto.model.Aeropuerto;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AeropuertoRepository extends CrudRepository<Aeropuerto, Integer>{
    Optional<Aeropuerto> findAeropuertoByCodigo(String codigo);
}
