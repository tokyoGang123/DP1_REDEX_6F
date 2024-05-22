package com.redex.logisticaReparto.dto;

import jakarta.persistence.Transient;
import lombok.Getter;
import lombok.Setter;

import java.time.ZonedDateTime;

@Getter
@Setter
public class PlanVueloResponse {
    private long id_tramo;
    private int ciudad_origen;
    private ZonedDateTime hora_origen;
    private double longitud_origen;
    private double latitud_origen;
    private int ciudad_destino;
    private ZonedDateTime hora_destino;
    private double longitud_destino;
    private double latitud_destino;
    private int capacidad_maxima;
    private int capacidad_ocupada;
    private int estado;
    public boolean isFull() {return capacidad_maxima == capacidad_ocupada;}

    public PlanVueloResponse(long id_tramo, int ciudad_origen, ZonedDateTime hora_origen, double longitud_origen, double latitud_origen, int ciudad_destino, ZonedDateTime hora_destino, double longitud_destino, double latitud_destino, int capacidad_maxima, int capacidad_ocupada, int estado) {
        this.id_tramo = id_tramo;
        this.ciudad_origen = ciudad_origen;
        this.hora_origen = hora_origen;
        this.longitud_origen = longitud_origen;
        this.latitud_origen = latitud_origen;
        this.ciudad_destino = ciudad_destino;
        this.hora_destino = hora_destino;
        this.longitud_destino = longitud_destino;
        this.latitud_destino = latitud_destino;
        this.capacidad_maxima = capacidad_maxima;
        this.capacidad_ocupada = capacidad_ocupada;
        this.estado = estado;
    }
}
