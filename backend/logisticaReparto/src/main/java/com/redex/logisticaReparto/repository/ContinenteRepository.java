package com.redex.logisticaReparto.repository;

import com.redex.logisticaReparto.model.Continente;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContinenteRepository extends CrudRepository<Continente,Integer> {

}
