package com.redex.logisticaReparto.model;

import jakarta.persistence.*;

import java.time.ZonedDateTime;

@Entity
@Table(name="PlanVuelo")
public class PlanDeVuelo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private long id_tramo;;

    private int ciudad_origen;
    private ZonedDateTime hora_origen;
    private int ciudad_destino;
    private ZonedDateTime hora_destino;
    private int capacidad_maxima;
    private int capacidad_ocupada;
    private int estado;

    @Transient
    public boolean isFull() {return capacidad_maxima == capacidad_ocupada;}

    public PlanDeVuelo() {
    }

    public PlanDeVuelo(int ciudad_origen, ZonedDateTime hora_origen, int ciudad_destino, ZonedDateTime hora_destino, int capacidad_maxima, int estado) {
        this.ciudad_origen = ciudad_origen;
        this.hora_origen = hora_origen;
        this.ciudad_destino = ciudad_destino;
        this.hora_destino = hora_destino;
        this.capacidad_maxima = capacidad_maxima;
        this.capacidad_ocupada = 0;
        this.estado = estado;
    }

    public PlanDeVuelo(long id_tramo, int ciudad_origen, ZonedDateTime hora_origen, int ciudad_destino, ZonedDateTime hora_destino, int capacidad_maxima, int estado) {
        this.id_tramo = id_tramo;
        this.ciudad_origen = ciudad_origen;
        this.hora_origen = hora_origen;
        this.ciudad_destino = ciudad_destino;
        this.hora_destino = hora_destino;
        this.capacidad_maxima = capacidad_maxima;
        this.capacidad_ocupada = 0;
        this.estado = estado;
    }

    public void imprimeDetallePlan() {
        System.out.println("PLAN DE ID: " + id_tramo);
        System.out.println( ciudad_origen + " - " + hora_origen + " - >");
        System.out.println( ciudad_destino + " - " + hora_destino);
        System.out.println("Actualmente almacenando " + capacidad_ocupada + " paquetes, maximo " + capacidad_maxima);
    }

    public int getEstado() {
        return estado;
    }

    public long getId_tramo() {
        return id_tramo;
    }

    public int getCiudad_origen() {
        return ciudad_origen;
    }

    public ZonedDateTime getHora_origen() {
        return hora_origen;
    }

    public int getCiudad_destino() {
        return ciudad_destino;
    }

    public ZonedDateTime getHora_destino() {
        return hora_destino;
    }

    public int getCapacidad_maxima() {
        return capacidad_maxima;
    }

    public int getCapacidad_ocupada() {
        return capacidad_ocupada;
    }

    public void setCiudad_origen(int ciudad_origen) {
        this.ciudad_origen = ciudad_origen;
    }

    public void setHora_origen(ZonedDateTime hora_origen) {
        this.hora_origen = hora_origen;
    }

    public void setCiudad_destino(int ciudad_destino) {
        this.ciudad_destino = ciudad_destino;
    }

    public void setHora_destino(ZonedDateTime hora_destino) {
        this.hora_destino = hora_destino;
    }

    public void setCapacidad_maxima(int capacidad_maxima) {
        this.capacidad_maxima = capacidad_maxima;
    }

    public void setCapacidad_ocupada(int capacidad_ocupada) {
        this.capacidad_ocupada = capacidad_ocupada;
    }

    public void setId_tramo(long id_tramo) {
        this.id_tramo = id_tramo;
    }

    public void setEstado(int estado) {
        this.estado = estado;
    }
}
