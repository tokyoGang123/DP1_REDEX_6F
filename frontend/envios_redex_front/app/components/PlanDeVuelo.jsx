'use client'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState, useRef, useCallback } from "react";
import { Marker, Popup } from "react-leaflet";
import hallarPuntosIntermedios from "./funcionesRuta";
import { Icon } from 'leaflet';
import L from 'leaflet'
import React from 'react';

const markerSize = 20

/*
const iconoRojo = new Icon({
    iconUrl: "/planes/plane_red.svg",
    //iconUrl: require(""),
    iconSize: [markerSize, markerSize],
});

const iconoAmarillo = new Icon({
    iconUrl: "/planes/plane_yellow.svg",
    //iconUrl: require(""),
    iconSize: [markerSize, markerSize],
});

const iconoVerde = new Icon({
    iconUrl: "/planes/plane_green.svg",
    //iconUrl: require(""),
    iconSize: [markerSize, markerSize],
});

const iconoGris = new Icon({
    iconUrl: "/planes/plane_grey.svg",
    //iconUrl: require(""),
    iconSize: [markerSize, markerSize],
});
*/

dayjs.extend(duration);
dayjs.extend(utc);

function getColorMarcador (capacidad_ocupada, capacidad_maxima) {
    let porcentajeOcupacion = (capacidad_ocupada/capacidad_maxima) * 100;
    if (capacidad_ocupada == 0) return "Gris"
    else if (porcentajeOcupacion < 33.33) return "Verde"
    else if (porcentajeOcupacion < 66.66) return "Amarillo"
    else return "Rojo"
}

const PlanDeVuelo = React.memo(({ planDeVuelo, fechaSim, estadoSim, freqMov,removerPlan, iconos }) => {

    const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
    const markerRef = useRef(null);
    const [colorMarcador, setColorMarcador] = useState(getColorMarcador(planDeVuelo.capacidad_ocupada,planDeVuelo.capacidad_maxima))
    const [rutaCompleta, setRutaCompleta] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            
            setCurrentPositionIndex((prevIndex) => {
                const nextIndex = prevIndex + 1
                if (nextIndex < planDeVuelo.ruta.length) {
                    return nextIndex;
                } else {
                    setRutaCompleta(true)
                    clearInterval(interval);
                    removerPlan(planDeVuelo,planDeVuelo.id_tramo)
                    return prevIndex;
                }
            })
        }, freqMov) //En sem, antes era 1000

        return () => clearInterval(interval);

    }, [planDeVuelo.ruta.length])


    useEffect(() => {
        //console.log(currentPositionIndex)
        //console.log(planDeVuelo.ruta[currentPositionIndex])
        if (markerRef.current && currentPositionIndex > 0 && !rutaCompleta) markerRef.current.setLanLng(planDeVuelo.ruta[currentPositionIndex])
    }, [currentPositionIndex, planDeVuelo.ruta])


    return (
        <>
            {/*!rutaCompleta ?
                <Marker position={planDeVuelo.ruta[currentPositionIndex]}
                    icon={colorMarcador == 'Verde' ? i : (colorMarcador == 'Amarillo' ? iconoAmarillo : (colorMarcador == 'Rojo' ? iconoRojo : iconoGris))}
                    ref={(ref) => {
                        if (ref && ref.leafletElement) {
                            markerRef.current = ref.leafletElement;
                        }
                    }}>
                    <Popup>
                        <h1>Vuelo #{planDeVuelo.id_tramo}</h1>
                        <p>Hora salida: {planDeVuelo.hora_origen}</p>
                        <p>Hora llegada: {planDeVuelo.hora_destino}</p>

                    </Popup>
                </Marker>
                : <></>*/}
                {!rutaCompleta ?
                <Marker position={planDeVuelo.ruta[currentPositionIndex]}
                    icon={iconos[colorMarcador]}
                    ref={(ref) => {
                        if (ref && ref.leafletElement) {
                            markerRef.current = ref.leafletElement;
                        }
                    }}>
                    <Popup>
                        <h1>Vuelo #{planDeVuelo.id_tramo}</h1>
                        <p>Hora salida: {planDeVuelo.hora_origen}</p>
                        <p>Hora llegada: {planDeVuelo.hora_destino}</p>

                    </Popup>
                </Marker>
                : <></>}

        </>
    )


});

export default PlanDeVuelo;