package com.redex.logisticaReparto.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="Envio")
public class Envio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private long id_envio;

    private long numero_envio_Aeropuerto;
    private int estado;
    private ZonedDateTime fecha_ingreso;
    private int aeropuerto_origen;
    private int aeropuerto_destino;
    private ZonedDateTime fecha_llegada_max;

    @OneToMany(mappedBy = "envio", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Paquete> paquetes =new ArrayList<>();

    public Envio() {
    }
    public Envio(int estado, long numero_envio_Aeropuerto, ZonedDateTime fecha_ingreso,
                 int aeropuerto_origen, int aeropuerto_destino, ZonedDateTime fecha_llegada_max, int numPaquetes) {
        this.estado = estado;
        this.numero_envio_Aeropuerto  = numero_envio_Aeropuerto;
        this.fecha_ingreso = fecha_ingreso;
        this.aeropuerto_origen = aeropuerto_origen;
        this.aeropuerto_destino = aeropuerto_destino;
        this.fecha_llegada_max = fecha_llegada_max;
        this.paquetes = new ArrayList<>();
        for (int i = 0; i < numPaquetes; i++) {
            //id_paquete = id_envio + #paquete
            String id_paquete = Long.toString(id_envio) + " _ " + Integer.toString(i);
            paquetes.add(new Paquete(id_paquete,0));
        }
    }

    public Envio(long id_envio, int estado, long numero_envio_Aeropuerto, ZonedDateTime fecha_ingreso,
                 int aeropuerto_origen, int aeropuerto_destino, ZonedDateTime fecha_llegada_max, int numPaquetes) {
        this.id_envio = id_envio;
        this.estado = estado;
        this.numero_envio_Aeropuerto  = numero_envio_Aeropuerto;
        this.fecha_ingreso = fecha_ingreso;
        this.aeropuerto_origen = aeropuerto_origen;
        this.aeropuerto_destino = aeropuerto_destino;
        this.fecha_llegada_max = fecha_llegada_max;
        this.paquetes = new ArrayList<>();
        for (int i = 0; i < numPaquetes; i++) {
            //id_paquete = id_envio + #paquete
            String id_paquete = Long.toString(id_envio) + " _ " + Integer.toString(i);
            paquetes.add(new Paquete(id_paquete,0));
        }
    }

    public void setFecha_ingreso(ZonedDateTime fecha_ingreso) {
        this.fecha_ingreso = fecha_ingreso;
    }

    public void setAeropuerto_origen(int aeropuerto_origen) {
        this.aeropuerto_origen = aeropuerto_origen;
    }

    public void setAeropuerto_destino(int aeropuerto_destino) {
        this.aeropuerto_destino = aeropuerto_destino;
    }

    public void setFecha_llegada_max(ZonedDateTime fecha_llegada_max) {
        this.fecha_llegada_max = fecha_llegada_max;
    }

    public ZonedDateTime getFecha_ingreso() {
        return fecha_ingreso;
    }

    public int getAeropuerto_origen() {
        return aeropuerto_origen;
    }

    public int getAeropuerto_destino() {
        return aeropuerto_destino;
    }

    public ZonedDateTime getFecha_llegada_max() {
        return fecha_llegada_max;
    }

    public void setId_envio(long id_envio) {
        this.id_envio = id_envio;
    }

    public void setEstado(int estado) {
        this.estado = estado;
    }

    public void setPaquetes(ArrayList<Paquete> paquetes) {
        this.paquetes = paquetes;
    }

    public long getId_envio() {
        return id_envio;
    }

    public int getEstado() {
        return estado;
    }

    public List<Paquete> getPaquetes() {
        return paquetes;
    }

    public long getNumero_envio_Aeropuerto() {
        return numero_envio_Aeropuerto;
    }

    public void setNumero_envio_Aeropuerto(long numero_envio_Aeropuerto) {
        this.numero_envio_Aeropuerto = numero_envio_Aeropuerto;
    }
}
