package com.redex.logisticaReparto.services;

import com.redex.logisticaReparto.model.Continente;
import com.redex.logisticaReparto.repository.ContinenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class ContinenteService {
    @Autowired
    private ContinenteRepository continenteRepository;

    public Continente insertarContinente(Continente continente) {
        return continenteRepository.save(continente);
    }

    public ArrayList<Continente> obtenerTodosContinentes() {return (ArrayList<Continente>) continenteRepository.findAll();}
}
