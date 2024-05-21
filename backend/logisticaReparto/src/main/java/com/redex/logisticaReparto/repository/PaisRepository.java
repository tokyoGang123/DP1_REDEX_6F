package com.redex.logisticaReparto.repository;

import com.redex.logisticaReparto.model.Pais;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaisRepository extends CrudRepository<Pais, Integer> {
}
