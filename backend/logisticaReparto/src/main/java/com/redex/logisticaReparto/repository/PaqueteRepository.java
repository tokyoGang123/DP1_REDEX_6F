package com.redex.logisticaReparto.repository;

import com.redex.logisticaReparto.model.Paquete;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaqueteRepository extends CrudRepository<Paquete, String> {
}
