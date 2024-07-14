'use client'
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
const SimColapso = dynamic(() => import('./Simulaciones/SimColapso.jsx'), { ssr: false });

export default function PantallaPrincipalColapso() {

    //Simulación seleccionada
    const [simulacionActiva, setSimulacionActiva] = useState('COLAPSO'); //SEMANAL, DIARIA, COLAPSO, NINGUNA
    const [textoSim, setTextoSim] = useState('Simulacion al colapso'); //Simulacion Semanal, Operaciones Diarias, Simulacion al Colapso, No Activa

    //Se encuentra en ejecucion
    const [simulacionEjecutandose, setSimulacionEjecutandose] = useState(false);

    return (
        <>
            {/* MOSTRAR DATA DE LA SIMULACIÓN DESEADA */}
            {simulacionActiva == 'COLAPSO' ? (
                <SimColapso></SimColapso>
            ) : <></>}
            {}

        </>
    )
}