package com.redex.logisticaReparto.services;

import com.redex.logisticaReparto.model.Aeropuerto;
import com.redex.logisticaReparto.model.Paquete;
import com.redex.logisticaReparto.repository.PaqueteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class PaqueteService {
    @Autowired
    private PaqueteRepository paqueteRepository;

    public ArrayList<Paquete> obtenerTodosPaquetes() { return (ArrayList<Paquete>) paqueteRepository.findAll(); }

    public Paquete insertarPaquete(Paquete paquete) { return paqueteRepository.save(paquete); }

    public ArrayList<Paquete> insertarListaPaquetes(ArrayList<Paquete> paquetes) { return (ArrayList<Paquete>)paqueteRepository.saveAll(paquetes); }

    public Optional<Paquete> obtenerPaquetePorId(Long id) { return paqueteRepository.findById(id); }
}
