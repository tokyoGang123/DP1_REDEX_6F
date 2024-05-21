package com.redex.logisticaReparto.services;

import com.redex.logisticaReparto.model.Aeropuerto;
import com.redex.logisticaReparto.model.Envio;
import com.redex.logisticaReparto.repository.AeropuertoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AeropuertoService {
    @Autowired
    private AeropuertoRepository aeropuertoRepository;

    public ArrayList<Aeropuerto> obtenerTodosAeropuertos() { return (ArrayList<Aeropuerto>) aeropuertoRepository.findAll(); }

    public Aeropuerto insertarAeropuerto(Aeropuerto aeropuerto) { return aeropuertoRepository.save(aeropuerto); }

    public ArrayList<Aeropuerto> insertarListaAeropuertos(ArrayList<Aeropuerto> aeropuertos) { return (ArrayList<Aeropuerto>)aeropuertoRepository.saveAll(aeropuertos); }

    public Optional<Aeropuerto> obtenerAeropuertoPorId(int id) { return aeropuertoRepository.findById(id); }

    public Optional<Aeropuerto> obtenerAeropuertoPorCodigo(String codigo) { return aeropuertoRepository.findAeropuertoByCodigo(codigo); }

}
