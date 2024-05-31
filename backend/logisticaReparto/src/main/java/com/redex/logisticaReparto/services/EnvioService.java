package com.redex.logisticaReparto.services;

import com.redex.logisticaReparto.model.Envio;
import com.redex.logisticaReparto.model.Pais;
import com.redex.logisticaReparto.repository.EnvioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class EnvioService {

    @Autowired
    private EnvioRepository envioRepository;

    public ArrayList<Envio>obtenerEnvios() { return (ArrayList<Envio>)envioRepository.findAll(); }

    public ArrayList<Envio>obtenerEnviosPorFecha(LocalDate fecha) { return envioRepository.findByFecha_ingreso(fecha);}

    public Envio insertarEnvio(Envio envio) { return envioRepository.save(envio); }

    public Optional<Envio> obtenerEnvioPorId(long id) { return envioRepository.findById(id); }

    public ArrayList<Envio> insertarListaEnvios(List<Envio> envios) { return (ArrayList<Envio>)envioRepository.saveAll(envios); }

    /*public ArrayList<Envio> obtenerEnviosPorFecha(ZonedDateTime fechaInicio, String husoHorarioInicio, ZonedDateTime fechaFin){
        return envioRepository.findByFechaIngresoInRange(fechaInicio, husoHorarioInicio, fechaFin);
    }*/
    public ArrayList<Envio> obtenerEnviosPorFecha(LocalDateTime  fechaInicio, String husoHorario, LocalDateTime fechaFin){
        return envioRepository.findByFechaIngresoInRange(fechaInicio, husoHorario, fechaFin);
    }
    public int tipoVuelo(int ciudadOrigen, int ciudadDestino, ArrayList<Pais> paises) {
        int contA = 0, contB = 0;
        for (Pais pais : paises) {
            if (pais.getId_pais() == ciudadOrigen) contA = pais.getId_continente();
            if (pais.getId_pais() == ciudadDestino) contB = pais.getId_continente();
        }
        if (contA == contB) return 1;
        else return 2;
    }
}
