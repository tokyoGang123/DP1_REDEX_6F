package com.redex.logisticaReparto.model;

import java.util.ArrayList;

public class Ruta {

    private int id_ruta;
    private ArrayList<Long> listaRutas;

    public Ruta() {
        this.listaRutas = new ArrayList<>();
    }

    public Ruta(int id_ruta, ArrayList<Integer> listaRutas) {
        this.id_ruta = id_ruta;
        this.listaRutas = new ArrayList<>();
    }

    public void setId_ruta(int id_ruta) {
        this.id_ruta = id_ruta;
    }

    public void setListaRutas(ArrayList<Long> listaRutas) {
        this.listaRutas = listaRutas;
    }

    public int getId_ruta() {
        return id_ruta;
    }

    public ArrayList<Long> getListaRutas() {
        return listaRutas;
    }

    public void copiarRuta(Ruta ruta) {
        this.id_ruta = ruta.id_ruta;
        this.listaRutas.clear();
        this.listaRutas.addAll(ruta.getListaRutas());
    }
}
