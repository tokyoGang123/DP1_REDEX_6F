package com.redex.logisticaReparto.repository;

import com.redex.logisticaReparto.model.PlanDeVuelo;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanDeVueloRepository extends CrudRepository<PlanDeVuelo, Long> {
}
