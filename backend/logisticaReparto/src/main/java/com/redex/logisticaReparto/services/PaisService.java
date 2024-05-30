package com.redex.logisticaReparto.services;

import com.redex.logisticaReparto.model.Pais;
import com.redex.logisticaReparto.repository.PaisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class PaisService {
    @Autowired
    private PaisRepository paisRepository;
    public Pais insertarPais(Pais pais) {return paisRepository.save(pais);}

    public ArrayList<Pais> obtenerTodosPaises(){ return (ArrayList<Pais>) paisRepository.findAll();}
}
