package com.redex.logisticaReparto.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Continente")
public class ContinenteModel {
    @Id
    private int id;
}
