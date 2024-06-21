'use client'
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
const OperacionesDiarias = dynamic(() => import('./Simulaciones/OperacionesDiarias.jsx'), { ssr: false });

export default function PantallaPrincipalDiaria() {

    //Simulación seleccionada
    const [simulacionActiva, setSimulacionActiva] = useState('DIARIA'); //SEMANAL, DIARIA, COLAPSO, NINGUNA
    const [textoSim, setTextoSim] = useState('Operaciones Diarias'); //Simulacion Semanal, Operaciones Diarias, Simulacion al Colapso, No Activa

    //Se encuentra en ejecucion
    const [simulacionEjecutandose, setSimulacionEjecutandose] = useState(false);

    return (
        <>
            {/* MOSTRAR DATA DE LA SIMULACIÓN DESEADA */}
            {simulacionActiva == 'DIARIA' ? (
                <OperacionesDiarias></OperacionesDiarias>
            ) : <></>}
            {}

        </>
    )
}