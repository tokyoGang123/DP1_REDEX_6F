'use client'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState, useRef, useCallback } from "react";
import { Marker, Popup } from "react-leaflet";
import hallarPuntosIntermedios from "./funcionesRuta";
import { Icon } from 'leaflet';
import L from 'leaflet'


const markerSize = 20

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

dayjs.extend(duration);
dayjs.extend(utc);

export default function PlanDeVuelo({ planDeVuelo, fechaSim, estadoSim, intervaloMS, removerPlan }) {

    const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
    const markerRef = useRef(null);
    const [colorMarcador, setColorMarcador] = useState('Verde')
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
                    removerPlan(planDeVuelo.id_tramo)
                    return prevIndex;
                }
            })
        }, 1000)

        return () => clearInterval(interval);

    }, [planDeVuelo.ruta.length])


    useEffect(() => {
        //console.log(currentPositionIndex)
        //console.log(planDeVuelo.ruta[currentPositionIndex])
        if (markerRef.current && currentPositionIndex > 0 && !rutaCompleta) markerRef.current.setLanLng(planDeVuelo.ruta[currentPositionIndex])
    }, [currentPositionIndex, planDeVuelo.ruta])


    useEffect(() => {
        let porcentajeOcupacion = (planDeVuelo.capacidad_ocupada / planDeVuelo.capacidad_maxima) * 100;
        if (planDeVuelo.capacidad_ocupada == 0) setColorMarcador("Gris")
        else if (porcentajeOcupacion < 33.33) setColorMarcador("Verde")
        else if (porcentajeOcupacion < 66.66) setColorMarcador("Amarillo")
        else setColorMarcador("Rojo")
    }, [planDeVuelo])

    return (
        <>
            {!rutaCompleta ?
                <Marker position={planDeVuelo.ruta[currentPositionIndex]}
                    icon={colorMarcador == 'Verde' ? iconoVerde : (colorMarcador == 'Amarillo' ? iconoAmarillo : (colorMarcador == 'Rojo' ? iconoRojo : iconoGris))}
                    ref={(ref) => {
                        if (ref && ref.leafletElement) {
                            markerRef.current = ref.leafletElement;
                        }
                    }}>
                    <Popup>
                        <h1>Info vuelo {planDeVuelo.id_tramo}</h1>
                        <p>Paquetes asignados: </p>
                        <p>SALE EL: {planDeVuelo.hora_origen}</p>
                        <p>llega EL: {planDeVuelo.hora_destino}</p>
                        <ul>
                            {planDeVuelo.listaPaquetes.map(paq => <li>{paq}</li>).join('')}
                        </ul>

                    </Popup>
                </Marker>
                : <></>}

        </>
    )


}