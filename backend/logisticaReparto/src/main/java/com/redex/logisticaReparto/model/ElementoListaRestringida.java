package com.redex.logisticaReparto.model;

import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;

@Getter
@Setter
public class ElementoListaRestringida {

    private int id_elementoLista;
    public ArrayList<Integer> listaElementos;
    private double  fitnessSolucion;

    public ElementoListaRestringida() {

    }

    public ElementoListaRestringida(ArrayList<Integer> listaElementos, double fitnessSolucion) {
        this.listaElementos = listaElementos;
        this.fitnessSolucion = fitnessSolucion;
    }


}
