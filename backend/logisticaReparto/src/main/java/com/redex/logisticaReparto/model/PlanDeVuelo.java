package com.redex.logisticaReparto.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Entity
@Getter
@Setter
@Table(name="PlanVuelo")
public class PlanDeVuelo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private long id_tramo;;

    private int ciudad_origen;
    private LocalDateTime hora_origen;
    private String huso_horario_origen;
    private int ciudad_destino;
    private LocalDateTime hora_destino;
    private String huso_horario_destino;
    private int capacidad_maxima;
    private int capacidad_ocupada;
    private int estado;

    @Transient
    private ZonedDateTime zonedHora_origen;
    @Transient
    private ZonedDateTime zonedHora_destino;

    public boolean isFull() {return capacidad_maxima == capacidad_ocupada;}

    public PlanDeVuelo() {
    }

    public PlanDeVuelo(int ciudad_origen, LocalDateTime hora_origen, String huso_horario_origen, int ciudad_destino,
                       LocalDateTime hora_destino, String huso_horario_destino, int capacidad_maxima, int estado) {
        this.ciudad_origen = ciudad_origen;
        this.hora_origen = hora_origen;
        this.huso_horario_origen = huso_horario_origen;
        this.ciudad_destino = ciudad_destino;
        this.hora_destino = hora_destino;
        this.huso_horario_destino = huso_horario_destino;
        this.capacidad_maxima = capacidad_maxima;
        this.capacidad_ocupada = 0;
        this.estado = estado;
    }

    /*public PlanDeVuelo(long id_tramo, int ciudad_origen, ZonedDateTime hora_origen, int ciudad_destino, ZonedDateTime hora_destino, int capacidad_maxima, int estado) {
        this.id_tramo = id_tramo;
        this.ciudad_origen = ciudad_origen;
        this.hora_origen = hora_origen;
        this.ciudad_destino = ciudad_destino;
        this.hora_destino = hora_destino;
        this.capacidad_maxima = capacidad_maxima;
        this.capacidad_ocupada = 0;
        this.estado = estado;
    }*/

    @PostLoad
    public void cargarZonedDateTime() {
        this.zonedHora_origen = hora_origen.atZone(ZoneId.of(huso_horario_origen));
        this.zonedHora_destino = hora_destino.atZone(ZoneId.of(huso_horario_destino));
    }

    public void imprimeDetallePlan() {
        System.out.println("PLAN DE ID: " + id_tramo);
        System.out.println( ciudad_origen + " - " + hora_origen + " - >");
        System.out.println( ciudad_destino + " - " + hora_destino);
        System.out.println("Actualmente almacenando " + capacidad_ocupada + " paquetes, maximo " + capacidad_maxima);
    }

}
