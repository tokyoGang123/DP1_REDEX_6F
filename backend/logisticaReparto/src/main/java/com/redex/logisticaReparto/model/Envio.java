package com.redex.logisticaReparto.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name="Envio")
public class Envio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private long id_envio;

    private long numero_envio_Aeropuerto;
    private int estado;
    private LocalDateTime fecha_ingreso;
    private String huso_horario_origen;
    private int aeropuerto_origen;
    private int aeropuerto_destino;
    private LocalDateTime fecha_llegada_max;
    private String huso_horario_destino;
    private int numPaquetes;
    @Transient
    private ZonedDateTime zonedFechaIngreso;
    @Transient
    private ZonedDateTime zonedFechaLlegadaMax;

    @OneToMany(mappedBy = "envio", cascade = CascadeType.ALL)
    //@JsonIgnore
    private List<Paquete> paquetes =new ArrayList<>();

    public Envio() {
    }
    public Envio(int estado, long numero_envio_Aeropuerto, LocalDateTime fecha_ingreso, int aeropuerto_origen,
                 int aeropuerto_destino, LocalDateTime fecha_llegada_max, int numPaquetes,
                 String huso_horario_origen,String huso_horario_destino) {
        this.estado = estado;
        this.numero_envio_Aeropuerto  = numero_envio_Aeropuerto;
        this.fecha_ingreso = fecha_ingreso;
        this.aeropuerto_origen = aeropuerto_origen;
        this.aeropuerto_destino = aeropuerto_destino;
        this.fecha_llegada_max = fecha_llegada_max;
        this.numPaquetes = numPaquetes;
        this.huso_horario_origen = huso_horario_origen;
        this.huso_horario_destino = huso_horario_destino;
        this.paquetes = new ArrayList<>();
    }

    @PostLoad
    private void cargarZonedDateTime() {
        this.zonedFechaIngreso = fecha_ingreso.atZone(ZoneId.of(huso_horario_origen));
        this.zonedFechaLlegadaMax = fecha_llegada_max.atZone(ZoneId.of(huso_horario_destino));
    }
    /*public Envio(int estado, long numero_envio_Aeropuerto, ZonedDateTime fecha_ingreso,
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
    }*/


}
