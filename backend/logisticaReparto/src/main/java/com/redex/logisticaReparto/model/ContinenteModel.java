package com.redex.logisticaReparto.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Continente")
public class ContinenteModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private int idContinente;

    @OneToMany(mappedBy = "continente", cascade = CascadeType.ALL)
    private List<PaisModel> paises =new ArrayList<>();
}
