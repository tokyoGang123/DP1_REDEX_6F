package com.redex.logisticaReparto.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "Pais")
public class Pais {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private int id_pais;
    private String nombre_pais;

    @ManyToOne
    @JoinColumn(name = "id_continente")
    private Continente continente;

    @OneToMany(mappedBy = "pais", cascade = CascadeType.ALL)
    private List<Aeropuerto> aeropuertos= new ArrayList<>();;

    public Pais(int id_pais) {
        this.id_pais = id_pais;
    }

    public Pais() {}

    public Pais(int id_pais, String nombre_pais, int id_continente) {
        this.id_pais = id_pais;
        this.nombre_pais = nombre_pais;
        this.continente = new Continente(id_continente);
    }

    public void setId_continente(int id_continente) {
        if (this.continente == null) {
            this.continente = new Continente();
        }
        this.continente.setId_continente(id_continente);
    }

    public int getId_continente() {
        if (this.continente == null) {
            return -1;
        }
        return continente.getId_continente();
    }
}
