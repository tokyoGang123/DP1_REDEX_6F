package com.redex.logisticaReparto.services;

import com.redex.logisticaReparto.model.Aeropuerto;
import com.redex.logisticaReparto.model.PlanDeVuelo;
import com.redex.logisticaReparto.dto.PlanVueloResponse;
import com.redex.logisticaReparto.repository.PlanDeVueloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PlanDeVueloService {
    @Autowired
    private PlanDeVueloRepository planDeVueloRepository;
    @Autowired
    private AeropuertoService aeropuertoService;

    public ArrayList<PlanVueloResponse> obtenerPlanesVuelos() { return planDeVueloRepository.queryPlanDeVueloWithAeropuerto(); }

    public ArrayList<PlanDeVuelo> obtenerListaPlanesVuelos() { return (ArrayList<PlanDeVuelo>)planDeVueloRepository.findAll(); }

    public PlanDeVuelo insertarPlanVuelo(PlanDeVuelo plan) { return planDeVueloRepository.save(plan); }

    public Optional<PlanDeVuelo> obtenerPlanVueloPorId(long id) { return planDeVueloRepository.findById(id); }

    public ArrayList<PlanDeVuelo> insertarListaPlanesVuelos(List<PlanDeVuelo> planes) { return (ArrayList<PlanDeVuelo>)planDeVueloRepository.saveAll(planes); }

    public boolean planAcabaElSiguienteDia(String tInicio, String tFin) {

        String dataInicio[] = tInicio.split(":");
        int hI = Integer.parseInt(dataInicio[0]);
        int mI = Integer.parseInt(dataInicio[1]);
        String dataFin[] = tFin.split(":");
        int hF = Integer.parseInt(dataFin[0]);
        int mF = Integer.parseInt(dataFin[1]);

        //Si tiene las mismas horas, los minutos determinan si es del mismo dia
        if (hI == hF) {
            if (mI >= mF) return true;
            else return false;
        } else if (hI > hF) return true;
        else return false;

    }
}
