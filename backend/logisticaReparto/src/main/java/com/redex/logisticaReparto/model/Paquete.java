package com.redex.logisticaReparto.model;

import jakarta.persistence.*;

@Entity
@Table(name="Paquete")
public class Paquete {
    @Id
    @Column(unique = true, nullable = false)
    private String id_paquete;
    @Transient
    private Ruta ruta;
    private int estado;

    @ManyToOne
    @JoinColumn(name = "id_envio")
    private Envio envio;

    //Un paquete estará asociado a un aeropuerto
    @ManyToOne
    @JoinColumn(name = "id_aeropuerto")
    private Aeropuerto aeropuerto;



    public Paquete() {
    }

    public Paquete(String id_paquete, int estado) {
        this.id_paquete = id_paquete;
        this.ruta = new Ruta();
        this.estado = estado;
    }

    public void setRuta(Ruta ruta) {
        this.ruta = ruta;
    }

    public Ruta getRuta() {
        return ruta;
    }

    public String getId_paquete() {
        return id_paquete;
    }

    public int getEstado() {
        return estado;
    }

    public void setId_paquete(String id_paquete) {
        this.id_paquete = id_paquete;
    }

    public void setEstado(int estado) {
        this.estado = estado;
    }

    public Envio getEnvio() {
        return envio;
    }

    public void setEnvio(Envio envio) {
        this.envio = envio;
    }


    public Aeropuerto getAeropuerto() {
        return aeropuerto;
    }

    public void setAeropuerto(Aeropuerto aeropuerto) {
        this.aeropuerto = aeropuerto;
    }
}
