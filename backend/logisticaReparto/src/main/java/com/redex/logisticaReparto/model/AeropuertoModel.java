package com.redex.logisticaReparto.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Aeropuerto")
public class AeropuertoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private int idAeropuerto;

    public void setId(int idAeropuerto) {
        this.idAeropuerto = idAeropuerto;
    }

    public int getId() {
        return idAeropuerto;
    }
}
