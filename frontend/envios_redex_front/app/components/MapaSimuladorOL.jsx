import React, { useState, useRef, useEffect, createContext, useMemo } from 'react';
import MapComponent from './OLMapsComponents/MapComponent';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Icon, Style } from 'ol/style';
import AeropuertoMarkers from './OLMapsComponents/AeropuertoMarkers';
import PlanesMarkers from './OLMapsComponents/PlanesMarkers3';
import PlanMarker from './OLMapsComponents/PlanMarker';
import dayjs from 'dayjs';
export const BatchUpdateContext = createContext();

function mergeObjects(obj1, obj2) {
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      return [...obj1, ...obj2];
    } else if (typeof obj1 === 'object' && obj1 !== null && typeof obj2 === 'object' && obj2 !== null) {
      const result = { ...obj1 };
      Object.keys(obj2).forEach(key => {
        if (typeof obj2[key] === 'object' && obj2[key] !== null) {
          result[key] = mergeObjects(result[key], obj2[key]);
        } else {
          result[key] = obj2[key];
        }
      });
      return result;
    } else {
      return obj2;
    }
  }

export default function MapaSimuladorOL({ aeropuertosBD, planesDeVueloBD, fechaSim, estadoSim }) {
    const updateQueue = useRef([]);
    const batchUpdatePlanes = (updateFn) => {
        updateQueue.current.push(updateFn);
    };

    useEffect(() => {
        const executeBatchUpdate = () => {
            updateQueue.current.forEach((updateFn) => updateFn());
            updateQueue.current = [];
        };
        const intervalId = setInterval(executeBatchUpdate, 1000); // Ajusta el intervalo de ejecución
        return () => clearInterval(intervalId);
    }, []);

    const [aeropuertos, setAeropuertos] = useState({});
    const [memoizedPlanesDeVueloBD, setMemoizedPlanesDeVueloBD] = useState(planesDeVueloBD);

    useEffect(() => {
        setAeropuertos(aeropuertosBD);
    }, [aeropuertosBD]);

    const planesDeVuelo = useMemo(() => {
        return mergeObjects({}, memoizedPlanesDeVueloBD);
    }, [memoizedPlanesDeVueloBD]);

    useEffect(() => {
        setMemoizedPlanesDeVueloBD(planesDeVueloBD);
    }, [planesDeVueloBD]);

    useEffect(() => {
        console.log("PLANES", planesDeVuelo);
    }, [planesDeVuelo]);

    useEffect(() => {
        console.log("AEROPUERTOS", aeropuertos);
    }, [aeropuertos]);

    const mapRef = useRef();
    const vectorSource = useRef(new VectorSource({
        batch: true
    })).current;
    const vectorLayer = useRef(new VectorLayer({
        source: vectorSource,
        updateWhileAnimating: true,

    })).current;

    
    const removerPlan = (idTramo) => {
        
        setPlanesDeVuelo((prevPlanes) => {
            const newPlanes = prevPlanes.filter(plan => plan.id_tramo !== idTramo);
            return newPlanes
        })
        
        //let f = dayjs(fechaSim).toISOString();
        
    };

    const iconStyle = new Style({
        image: new Icon({
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: '/planes/plane_green.svg',
            scale: 0.3,
            renderMode: 'image'
        }),
    });


    return (
        <BatchUpdateContext.Provider value={batchUpdatePlanes}>
            <div className='App'>
                <MapComponent vectorLayer={vectorLayer} ref={mapRef}></MapComponent>
                {mapRef.current && aeropuertos && (aeropuertos.length > 0) && (
                    <AeropuertoMarkers aeropuertos={aeropuertos} map={mapRef.current.getMap()}></AeropuertoMarkers>
                )}
                {mapRef.current && planesDeVuelo && planesDeVuelo.length > 0 && (
                    planesDeVuelo.map((plan, index) => (
                        <PlanMarker key={index} map={mapRef.current.getMap()} planDeVuelo={plan} vectorLayer={vectorLayer} onRemovePlan={removerPlan} style={iconStyle} />
                    ))
                )}
            </div>
        </BatchUpdateContext.Provider>
    );
}