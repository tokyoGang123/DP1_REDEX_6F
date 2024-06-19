import React, { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Style } from 'ol/style';
import {Icon} from 'ol/style';

const AeropuertoMarkers = ({ aeropuertos, map }) => {
    const overlaRef = useRef();

    //ASIGNAR IMAGEN A UN AEROPUERTO
    const getMarkerImage = (capOcu, capMax) => {
        let ocupacion = (capOcu / capMax) * 100
        if (ocupacion <= 33.3) return '/locationSigns/location_green.svg'
        else if (ocupacion <= 66.6) return '/locationSigns/location_yellow.svg'
        else return '/locationSigns/location_red.svg'
        //return '/locationSigns/location_red.svg'
    }

    //Generar los objetos cada vez que ocurre una actualizacion
    useEffect(() => {

        const vectorSource = new VectorSource();
        const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: (feature) => {
                return new Style({
                    image: new Icon({
                        anchor: [0.5, 1],    
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        src: getMarkerImage(feature.values_.capacidadOcupada, feature.values_.capacidadMaxima),
                        scale: 0.5
                    })
                })
            }
        })

        //Añadir cada uno de los aeropuertos al mapa
        if (map) {
            map.addLayer(vectorLayer);

            aeropuertos.forEach((aeropuerto) => {
                const feature = new Feature({
                    geometry: new Point(fromLonLat([aeropuerto.longitud, aeropuerto.latitud])),
                    name: aeropuerto.ciudad,
                    code: aeropuerto.codigo,
                    capacidadOcupada: aeropuerto.capacidad_ocupada,
                    capacidadMaxima: aeropuerto.capacidad_maxima,
                })
                //console.log(feature)
                vectorSource.addFeature(feature); //Agregar a la capa
            })

            

        }

        //Realizar el return con todos los elementos añadidos
        return () => {
            if (map) {
                map.removeLayer(vectorLayer);
            }
        }


    }, [aeropuertos, map])

    return null;
}

export default AeropuertoMarkers;