'use client'
import { Icon } from "leaflet";
import { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";


const markerSize = 30;

export default function Aeropuerto({ aeropuerto }) {

    //Rojo, Amarillo, Verde
    const [colorMarcador, setColorMarcador] = useState('Verde');

    //Texto a mostrar en el popup de resumen rápido
    const textoAeropuerto = (
        <div>
            <h1>Aeropuerto de {aeropuerto.ciudad}</h1>
            <h1>Ocupación: {aeropuerto.capacidad_ocupada} de {aeropuerto.capacidad_maxima}</h1>
        </div>
    )

    /*
    useEffect(() => {

        const intervalo = setInterval(() => {
            aeropuerto.capacidadActual = aeropuerto.capacidadActual + 1
            console.log(aeropuerto.capacidadActual)
        },1000)
        return () => clearInterval(intervalo)

    },[])
    */
    const iconoRojo = new Icon({
        iconUrl: "/locationSigns/location_red.svg",
        //iconUrl: require(""),
        iconSize: [markerSize, markerSize],
    });

    const iconoAmarillo = new Icon({
        iconUrl: "/locationSigns/location_yellow.svg",
        //iconUrl: require(""),
        iconSize: [markerSize, markerSize],
    });

    const iconoVerde = new Icon({
        iconUrl: "/locationSigns/location_green.svg",
        //iconUrl: require(""),
        iconSize: [markerSize, markerSize],
    });

    //Maneja lo que ocurre cuando se le da click al aeropuerto
    const eventHandler = () => {
        
    }

    //Cambiar el color del aeropuerto cada vez que se actualiza la capacidad
    useEffect( () => {
        let porcentajeOcupacion = (aeropuerto.capacidad_ocupada/aeropuerto.capacidad_maxima)*100;
        if (porcentajeOcupacion < 33.33) setColorMarcador("Verde")
        else if (porcentajeOcupacion < 66.66) setColorMarcador("Amarillo")
        else setColorMarcador("Rojo")
    },[aeropuerto])

    return <>
        
        <Marker position={[aeropuerto.latitud, aeropuerto.longitud]} icon={
            colorMarcador == 'Verde' ? iconoVerde : (colorMarcador == 'Amarillo' ? iconoAmarillo : iconoRojo)
        }eventHandlers={{click:eventHandler}} >
            <Popup>{textoAeropuerto}</Popup>
        </Marker>

    </>

}