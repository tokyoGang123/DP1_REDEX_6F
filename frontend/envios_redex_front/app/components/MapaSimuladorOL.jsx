'use client'
import React, { useState, useRef, useEffect, createContext } from 'react';
import MapComponent from './OLMapsComponents/MapComponent';
//import Markers from './Markers';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Icon, Style } from 'ol/style';
import AeropuertoMarkers from './OLMapsComponents/AeropuertoMarkers';
import PlanesMarkers from './OLMapsComponents/PlanesMarkers3';
import PlanMarker from './OLMapsComponents/PlanMarker';
import dayjs from 'dayjs';

export const BatchUpdateContext = createContext();

export default function MapaSimuladorOL({ aeropuertosBD, planesDeVueloBD, fechaSim, estadoSim }) {

    //fila de actualizacion
    const updateQueue = useRef([])
    const batchUpdatePlanes = (updateFn) => {
        updateQueue.current.push(updateFn)
    }
    useEffect(() => {
        const executeBatchUpdate = () => {
            const now = Date.now()
            updateQueue.current.forEach((updateFn) => updateFn());
            updateQueue.current = []
            requestAnimationFrame(executeBatchUpdate)
        }
        requestAnimationFrame(executeBatchUpdate)
    }, [])

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
    }, [aeropuertos])

    //--------------------------------------------------------
    //                  VARIABLES DEL MAPA      

    //Referencia al mapa
    const mapRef = useRef();

    //const [markers, setMarkers] = useState(initialMarkers);
    const vectorSource = useRef(new VectorSource()).current;
    const vectorLayer = useRef(new VectorLayer({
        source: vectorSource,
    })).current;

    //Remover un plan
    const removerPlan = (idTramo) => {
        planesDeVueloBD.filter(plan => plan.id_tramo != idTramo)
        let f = dayjs(fechaSim).toISOString()
        //console.log(idTramo + " removido a las " + f)
    }

    const iconStyle = new Style({
        image: new Icon({
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: '/planes/plane_green.svg',
            scale: 0.1
        })
    })



    return (
        <BatchUpdateContext.Provider value={batchUpdatePlanes}>
            <div className='App'>
                <MapComponent vectorLayer={vectorLayer} ref={mapRef}></MapComponent>
                {mapRef.current && aeropuertos && (aeropuertos.length > 0) && (
                    <AeropuertoMarkers aeropuertos={aeropuertos} map={mapRef.current.getMap()}></AeropuertoMarkers>
                )
                }
                {/*mapRef.current && planesDeVuelo && (planesDeVuelo.length > 0) && (
                <PlanesMarkers planesDeVuelo={planesDeVuelo} map={mapRef.current.getMap()} estadoSim={estadoSim} fechaSim={fechaSim}></PlanesMarkers>
            ) 
                */
                }

                {mapRef && planesDeVuelo && planesDeVuelo.length > 0 &&
                    planesDeVuelo.map((plan, index) => (
                        <PlanMarker key={index} map={mapRef.current.getMap()} planDeVuelo={plan} planes={planesDeVueloBD} vectorLayer={vectorLayer} onRemovePlan={removerPlan} style={iconStyle} />
                    ))}

            </div>
        </BatchUpdateContext.Provider>
    )


}