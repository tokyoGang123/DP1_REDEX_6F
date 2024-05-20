package com.redex.logisticaReparto.repository;

import com.redex.logisticaReparto.model.Aeropuerto;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AeropuertoRepository extends CrudRepository<Aeropuerto, Integer>{
}
