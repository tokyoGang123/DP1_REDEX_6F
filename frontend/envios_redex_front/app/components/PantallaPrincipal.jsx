'use client'
import Image from "next/image";
import MapaSimulador from "./MapaSimulador";
import "leaflet/dist/leaflet.css";
import SelectorFecha, { Cronometro } from "./Elementos/SelectorFecha";
import { CuadroTiempo } from "./Elementos/CuadroTiempo";
import { useState } from "react";
import SimSemanal from "./Simulaciones/SimSemanal";

export default function PantallaPrincipal() {

    //Simulación seleccionada
    const [simulacionActiva, setSimulacionActiva] = useState('SEMANAL'); //SEMANAL, DIARIA, COLAPSO, NINGUNA
    const [textoSim, setTextoSim] = useState('Simulación Semanal'); //Simulacion Semanal, Operaciones Diarias, Simulacion al Colapso, No Activa

    //Se encuentra en ejecucion
    const [simulacionEjecutandose, setSimulacionEjecutandose] = useState(false);

    return (
        <>

            {/* MOSTRAR DATA DE LA SIMULACIÓN DESEADA */}
            {simulacionActiva == 'SEMANAL' ? (
                <SimSemanal></SimSemanal>
            ) : <></>}

        </>
    )
}