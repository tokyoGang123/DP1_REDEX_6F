'use client'
import React, { useState, useRef, useEffect } from 'react';
import MapComponent from './OLMapsComponents/MapComponent';
//import Markers from './Markers';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Icon, Style } from 'ol/style';
import AeropuertoMarkers from './OLMapsComponents/AeropuertoMarkers';
import PlanesMarkers from './OLMapsComponents/PlanesMarkers';

export default function MapaSimuladorOL({ aeropuertosBD, planesDeVueloBD, fechaSim }) {

    //Variable para manejar los aeropuertos
    const [aeropuertos, setAeropuertos] = useState({});
    const [planesDeVuelo, setPlanesDeVuelo] = useState({})

    useEffect(() => {
        setAeropuertos(aeropuertosBD)
    }, [aeropuertosBD])

    useEffect(() => {
        setPlanesDeVuelo(planesDeVueloBD)
    }, [planesDeVueloBD])

    useEffect(() => {
        console.log("PLANES", planesDeVuelo)
    }, [planesDeVuelo])

    useEffect(() => {
        console.log("AEROPUERTOS", aeropuertos)
    },[aeropuertos])

    //--------------------------------------------------------
    //                  VARIABLES DEL MAPA      

    //Referencia al mapa
    const mapRef = useRef();

    //const [markers, setMarkers] = useState(initialMarkers);
    const vectorSource = useRef(new VectorSource()).current;
    const vectorLayer = useRef(new VectorLayer({
        source: vectorSource,
        style: new Style({
            image: new Icon({
                anchor: [0.5, 1],
                src: '/plane_grey.svg',
            }),
        }),
    })).current;



    return (
        <div className='App'>
            <MapComponent vectorLayer={vectorLayer} ref={mapRef}></MapComponent>
            {mapRef.current && aeropuertos  && (aeropuertos.length > 0) &&  (
                <AeropuertoMarkers aeropuertos={aeropuertos} map={mapRef.current.getMap()}></AeropuertoMarkers>
            )
            }
            {mapRef.current && planesDeVuelo && (planesDeVuelo.length > 0) && (
                <PlanesMarkers planesDeVuelo={planesDeVuelo} map={mapRef.current.getMap()}></PlanesMarkers>
            ) 

            }
        </div>
    )


}