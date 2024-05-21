package com.redex.logisticaReparto.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "Continente")
public class Continente {

    @Id
    @Column(unique = true, nullable = false)
    private int id_continente;

    @OneToMany(mappedBy = "continente", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Pais> paises =new ArrayList<>();

    private String nombre_continente;

    public Continente() {}

    public Continente(int id_continente) {
        this.id_continente = id_continente;
    }

    public Continente(int id_continente, String nombre_continente) {
        this.id_continente = id_continente;
        this.nombre_continente = nombre_continente;
    }

}
