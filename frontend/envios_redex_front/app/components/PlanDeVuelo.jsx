'use client'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState, useRef, useCallback } from "react";
import { Marker, Popup } from "react-leaflet";
import hallarPuntosIntermedios from "./funcionesRuta";
import { Icon } from 'leaflet';


const markerSize = 20

const iconoRojo = new Icon({
    iconUrl: "/planes/plane_red.png",
    //iconUrl: require(""),
    iconSize: [markerSize, markerSize],
});

const iconoAmarillo = new Icon({
    iconUrl: "/planes/plane_yellow.png",
    //iconUrl: require(""),
    iconSize: [markerSize, markerSize],
});

const iconoVerde = new Icon({
    iconUrl: "/planes/plane_green.png",
    //iconUrl: require(""),
    iconSize: [markerSize, markerSize],
});

export default function PlanDeVuelo({ planDeVuelo, fechaSim, estadoSim, intervaloMS }) {

    dayjs.extend(duration);
    dayjs.extend(utc);

    //Rojo, Amarillo, Verde
    const [colorMarcador, setColorMarcador] = useState('Verde')
    //Lista de puntos a recorrer
    const [listaPuntosViaje, setListaPuntosViaje] = useState([])
    //Posicion actual en la lista
    const [currentPositionIndex, setCurrentPositionIndex] = useState(0)
    //Ubicacion geografica actual
    const [posicionActual, setPosicionActual] = useState({})
    //Indicador de si el viaje ha finalizado
    const [viajeFin, setViajeFin] = useState(false)
    //Tiempo total que le toma al vuelo
    const [tiempoVueloTotal, setTiempoVueloTotal] = useState(0); //en seg
    //Intervalo de cambio
    const [intervaloCambio, setIntervaloCambio] = useState(0); //en seg
    //Segundos transcurridos
    const [segTransc, setSegTransc] = useState(0);
    //Microsegundos de revision
    const [microsegVuelo, setMicrosegVuelo] = useState(1)
    const lastTimestampRef = useRef(null);

    //UseRef necesario
    const markerRef = useRef(null);
    //UseRef para el tiempo
    const segTranscRef = useRef(segTransc)
    //UseRef para la posición
    const posicionActualRef = useRef(posicionActual)
    //UseRef para el index
    const currentPositionIndexRef = useRef(currentPositionIndex)

    //Actualizar segundos
    useEffect(() => {
        segTranscRef.current = segTransc;
    }, [segTranscRef])

    //Actualizar posicion
    useEffect(() => {
        posicionActualRef.current = posicionActual;
    }, [posicionActualRef])

    //Actualizar posicion
    useEffect(() => {
        currentPositionIndexRef.current = currentPositionIndex;
    }, [currentPositionIndexRef])

    //Quitar el marcador
    const removeMarker = () => {
        if (markerRef.current) {
            markerRef.current.remove();
        }
    }

    //Calcular intervalo de cambio
    useEffect(() => {
        if (tiempoVueloTotal > 0) calculaTiempoCambio();
    }, [tiempoVueloTotal])

    //Colocar puntos en arreglo
    useEffect(() => {
        if (planDeVuelo != null && listaPuntosViaje.length == 0) {
            const ciudadOrigen = { latitude: planDeVuelo.latitud_origen, longitude: planDeVuelo.longitud_origen };
            const ciudadDestino = { latitude: planDeVuelo.latitud_destino, longitude: planDeVuelo.longitud_destino };
            hallarPuntosIntermedios(
                ciudadOrigen.latitude,
                ciudadOrigen.longitude,
                ciudadDestino.latitude,
                ciudadDestino.longitude
            )
                .then((puntos) => {
                    setListaPuntosViaje(puntos);
                    //console.log("Estado actualizado:", puntos);
                })
                .catch((error) => {
                    console.error("Error al obtener puntos intermedios:", error);
                });
            let fI = dayjs.utc(planDeVuelo.hora_origen);
            let fF = dayjs.utc(planDeVuelo.hora_destino);
            let difMl = fF.diff(fI)
            let dif = dayjs.duration(difMl).asSeconds();
            setTiempoVueloTotal(dif) //tiempo vuelo simulado
            /*
            console.log(planDeVuelo.id_tramo + ": " + dif)
            if (planDeVuelo.id_tramo === 1369){
                console.log(planDeVuelo.hora_origen + " - " + planDeVuelo.hora_destino);
                console.log(fI + " - " + fF)
            }
            */

        }
    }, [planDeVuelo]);

    //Cuando se actualiza el arreglo
    /*
    useEffect(() => {
        //console.log("Lita")
        //console.log(listaPuntosViaje)
        
        if (listaPuntosViaje.length != 0) {
            cambiaPos();
        }
    },[listaPuntosViaje])
    */




    useEffect(() => {
        //console.log(estadoSim)
        let fechaActual = fechaSim.format('YYYY-MM-DDTHH:mm');//DAYJS
        let fechaProg = dayjs(planDeVuelo.hora_origen).format('YYYY-MM-DDTHH:mm'); //ISO 8601

        //REMOVER TERCER ARGUMENTO CUANDO SE ARREGLEN LOS ERRORES
        if (estadoSim === 'PL' && fechaActual === fechaProg && tiempoVueloTotal > 0) {
            requestAnimationFrame(cambiaPos);
            //console.log("si")
        }
        //console.log("No")
    }, [estadoSim, fechaSim])


    //Calcular cada cuantos segundos se cambia de punto

    const calculaTiempoCambio = useCallback(() => {
        let relacionSegReales = intervaloMS * 0.001; //1 minuto simulado -> 0.2 segundos reales
        let tiempoVueloSimulado = tiempoVueloTotal / 60; //Tiempo que toma al vuelo viajar en la simulacion (en minutos)
        let numPuntos = listaPuntosViaje.length; // # de puntos que debemos cubrir
        let tiempoVueloReal = tiempoVueloSimulado * relacionSegReales; //Tiempo que le tomará para cubrir todos los puntos

        let intervalo = tiempoVueloReal * 1000 / (numPuntos - 1)
        setIntervaloCambio(intervalo)
        //console.log("Le toma: " + tiempoVueloReal + " para volar " + tiempoVueloSimulado + " minutos")
        //console.log(intervalo)
        /*

        //console.log(tiempoVueloReal + " - " + numPuntos + " - " + intervaloMS)
        let segundosReales = tiempoVueloReal/60 * intervaloMS * 0.001; //Segundos totales que pasarán en la realidad en los que aparece el vuelo
        //console.log(segundosReales)
        let intervalo = segundosReales/(numPuntos-1); //Intervalo de cambio (X segundos hasta ir al siguiente punto)
        //intervalo = Math.round(intervalo)
        setIntervaloCambio(intervalo)
        //console.log(intervalo)
        */
    })
    
    /*
    //Cambia posicion en intervalos de tiempo. CAMBIAR PARA QUE FUNCIONE A TIEMPO COMO CRONOMETRO
    async function cambiaPos() {
        const interval = setInterval(() => {
            setCurrentPositionIndex(prevIndex => {
                const newIndex = prevIndex === listaPuntosViaje.length - 1 ? 0 : prevIndex + 1;
                if (newIndex === 0) {
                    clearInterval(interval); // Detener el intervalo cuando se alcance el último índice
                    setViajeFin(true);
                }
                return newIndex;
            });
        }, intervaloMS); // Ajusta el intervalo según sea necesario
    }*/

    //Cambia posicion en intervalos de tiempo. CAMBIAR PARA QUE FUNCIONE A TIEMPO COMO CRONOMETRO

    const cambiaPos = useCallback(async (timestamp) => {
        if (!lastTimestampRef.current) {
            lastTimestampRef.current = timestamp
        }

        const deltaTime = timestamp - lastTimestampRef.current;
        lastTimestampRef.current = timestamp

        segTranscRef.current += deltaTime;

        if (segTranscRef.current >= intervaloCambio) { // Si ya ha pasado tiempo suficiente, hacer el cambio
            setCurrentPositionIndex(prevIndex => {
                const newIndex = prevIndex === listaPuntosViaje.length - 1 ? 0 : prevIndex + 1;
                if (newIndex === 0) {
                    setViajeFin(true);
                    return prevIndex; // Detener el avance cuando se alcance el último índice
                }
                currentPositionIndexRef.current = newIndex;
                return newIndex;
            });
            segTranscRef.current = 0;
        }

        if (!viajeFin) {
            requestAnimationFrame(cambiaPos);
        }


    })

    useEffect(() => {
        setPosicionActual(listaPuntosViaje[currentPositionIndex])
        posicionActualRef.current = listaPuntosViaje[currentPositionIndex]
    }, [currentPositionIndex])

    //Si el viaje culmina, desaparecer
    useEffect(() => {
        if (viajeFin) {
            removeMarker()
        }
    }, [viajeFin])




    useEffect(() => {
        let porcentajeOcupacion = (planDeVuelo.capacidad_ocupada / planDeVuelo.capacidad_maxima) * 100;
        if (porcentajeOcupacion < 33.33) setColorMarcador("Verde")
        else if (porcentajeOcupacion < 66.66) setColorMarcador("Amarillo")
        else setColorMarcador("Rojo")
    }, [planDeVuelo])

    return (
        <>
            {posicionActual && Object.keys(posicionActual).length !== 0 ?
                <Marker position={posicionActualRef.current}
                    icon={colorMarcador == 'Verde' ? iconoVerde : (colorMarcador == 'Amarillo' ? iconoAmarillo : iconoRojo)}
                    ref={markerRef}>
                    <Popup>Info vuelo {planDeVuelo.id_tramo}</Popup>
                </Marker> : <></>}
        </>
    )


}