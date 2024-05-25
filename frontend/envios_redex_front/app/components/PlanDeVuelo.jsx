'use client'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useEffect, useState, useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import hallarPuntosIntermedios from "./funcionesRuta";
import { Icon } from 'leaflet';


const markerSize = 20

export default function PlanDeVuelo({ planDeVuelo, fechaSim, estadoSim }) {

    dayjs.extend(duration);

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
    const [tiempoVueloTotal,setTiempoVueloTotal] = useState(0); //en seg

    //UseRef necesario
    const markerRef = useRef(null);

    //Quitar el marcador
    const removeMarker = () => {
        if (markerRef.current) {
            markerRef.current.remove();
        }
    }

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
            let fI = dayjs(planDeVuelo.hora_origen);
            let fF = dayjs(planDeVuelo.hora_destino);
            let difMl = fF.diff(fI)
            let dif = dayjs.duration(difMl).asSeconds();
            setTiempoVueloTotal(dif);
            console.log(dif)
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
        if (estadoSim === 'PL' && fechaActual === fechaProg) {
            cambiaPos()
            //console.log("si")
        }
        //console.log("No")
    }, [estadoSim, fechaSim])


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
        }, 0.005); // Ajusta el intervalo según sea necesario
    }

    useEffect(() => {
        setPosicionActual(listaPuntosViaje[currentPositionIndex])
    }, [currentPositionIndex])

    //Si el viaje culmina, desaparecer
    useEffect(() => {
        if (viajeFin) {
            removeMarker()
        }
    }, [viajeFin])


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

    useEffect(() => {
        let porcentajeOcupacion = (planDeVuelo.capacidad_ocupada / planDeVuelo.capacidad_maxima) * 100;
        if (porcentajeOcupacion < 33.33) setColorMarcador("Verde")
        else if (porcentajeOcupacion < 66.66) setColorMarcador("Amarillo")
        else setColorMarcador("Rojo")
    }, [planDeVuelo])

    return (
        <>
            {posicionActual && Object.keys(posicionActual).length !== 0 ?
                <Marker position={posicionActual}
                    icon={colorMarcador == 'Verde' ? iconoVerde : (colorMarcador == 'Amarillo' ? iconoAmarillo : iconoRojo)}
                    ref={markerRef}>
                    <Popup>Info vuelo</Popup>
                </Marker> : <></>}
        </>
    )


}