package com.redex.logisticaReparto.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Pais")
public class PaisModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private int idPais;
    private String nombrePais;

    @ManyToOne
    @JoinColumn(name = "idContinente")
    private ContinenteModel continente;
}
