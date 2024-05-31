package com.redex.logisticaReparto.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="Paquete")
public class Paquete {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private long id_paquete;
    @Transient
    private Ruta ruta = new Ruta();
    private int estado;

    @ManyToOne
    @JoinColumn(name = "id_envio")
    @JsonBackReference
    private Envio envio;

    //Un paquete estará asociado a un aeropuerto
    @ManyToOne
    @JoinColumn(name = "id_aeropuerto")
    @JsonBackReference
    private Aeropuerto aeropuerto;

    public Paquete() {
    }

    public Paquete(int estado) {
        this.ruta = new Ruta();
        this.estado = estado;
    }

    public Paquete(long id_paquete, int estado) {
        this.id_paquete = id_paquete;
        this.ruta = new Ruta();
        this.estado = estado;
    }

    /*public void setRuta(Ruta ruta) {
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
    }*/
}
