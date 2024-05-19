package com.redex.logisticaReparto.repository;

import com.redex.logisticaReparto.model.Envio;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnvioRepository extends CrudRepository<Envio, Long> {
}
