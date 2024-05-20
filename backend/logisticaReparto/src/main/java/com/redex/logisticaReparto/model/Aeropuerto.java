package com.redex.logisticaReparto.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "Aeropuerto")
public class Aeropuerto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private int id_aeropuerto;

    //Un Pais puede tener varios Aeropuertos
    @ManyToOne
    @JoinColumn(name = "id_pais")
    private Pais pais;


    //Un aeropuerto puede tener paquetes
    //private ArrayList<Integer> paquetesAlmacenados;
    @OneToMany(mappedBy = "aeropuerto", cascade = CascadeType.ALL)
    private List<Paquete> paquetesAlmacenados= new ArrayList<>();;

    private double longitud;
    private double latitud;
    private int estado;
    private String codigo;
    private String huso_horario;
    private int capacidad_maxima;
    private int capacidad_ocupada;
    private String ciudad;

    public Aeropuerto() {

    }

    @Transient
    public boolean isFull() {return capacidad_maxima == capacidad_ocupada;}

    public Aeropuerto(int id_aeropuerto, String ciudad, int id_pais, String code, String huso_horario,
                      int capacidad_maxima, int capacidad_ocupada,  double latitud, double longitud, int estado) {

        this.id_aeropuerto = id_aeropuerto;
        this.ciudad = ciudad;
        this.pais=new Pais(id_pais);
        this.codigo = code;
        this.huso_horario = huso_horario;
        this.capacidad_maxima = capacidad_maxima;
        this.capacidad_ocupada = capacidad_ocupada;
        this.paquetesAlmacenados = new ArrayList<>();
        this.latitud = latitud;
        this.longitud = longitud;
        this.estado = estado;

    }

    public void setIdPais(int id_pais) {
        if (this.pais == null) {
            this.pais = new Pais();
        }
        this.pais.setId_pais(id_pais);
    }

    public int getId_pais() {
        if (this.pais == null) {
            return -1;
        }
        return pais.getId_pais();
    }
}
