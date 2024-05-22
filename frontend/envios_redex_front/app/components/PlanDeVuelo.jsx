'use client'
import { Icon } from "leaflet";
import { useEffect, useState, useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import hallarPuntosIntermedios from "./funcionesRuta";

const markerSize = 20

export default function PlanDeVuelo({ planDeVuelo, fechaSim, estadoSim }) {

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
        if (planDeVuelo != null) {
            const ciudadOrigen = planDeVuelo.ciudadOrigen;
            const ciudadDestino = planDeVuelo.ciudadDestino;
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
        console.log(estadoSim)
        if (estadoSim === 'PL') {
            cambiaPos()
        }
    },[estadoSim])


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
        let porcentajeOcupacion = (planDeVuelo.capacidadOcupada / planDeVuelo.capacidadMaxima) * 100;
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