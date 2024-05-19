package com.redex.logisticaReparto.services;

import com.redex.logisticaReparto.model.Envio;
import com.redex.logisticaReparto.repository.EnvioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class EnvioService {

    @Autowired
    private EnvioRepository envioRepository;

    public ArrayList<Envio>obtenerEnvios() { return (ArrayList<Envio>)envioRepository.findAll(); }

    public Envio insertarEnvio(Envio envio) { return envioRepository.save(envio); }

    public Optional<Envio> obtenerEnvioPorId(long id) { return envioRepository.findById(id); }

    public ArrayList<Envio> insertarEnvios(List<Envio> envios) { return (ArrayList<Envio>)envioRepository.saveAll(envios); }
}
