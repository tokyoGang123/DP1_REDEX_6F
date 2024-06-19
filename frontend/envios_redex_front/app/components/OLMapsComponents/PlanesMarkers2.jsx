import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { Icon, Style } from "ol/style";



const PlanesMarkers = ({ planesDeVuelo, map, estadoSim, fechaSim }) => {

    //ASIGNAR IMAGEN A UN AVION
    const getMarkerImage = (capOcu, capMax) => {
        let ocupacion = (capOcu / capMax) * 100
        if (capOcu == 0) return '/planes/plane_grey.svg'
        if (ocupacion <= 33.3) return '/planes/plane_green.svg'
        else if (ocupacion <= 66.6) return '/planes/plane_yellow.svg'
        else return '/planes/plane_red.svg'
    }


    //------------------------------------------------------------------------------
    //                             REFERENCIA A MAPA
    const [vectorSource, setVectorSource] = useState(null);
    useEffect(() => {
        const newVector = new VectorSource();
        setVectorSource(newVector);
        const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: (feature) => {
                return new Style({
                    image: new Icon({
                        anchor: [0.5, 1],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        src: getMarkerImage(feature.values_.capacidadOcupada, feature.values_.capacidadMaxima),
                    })
                })
            }
        })
        if (map) {
            map.addLayer(vectorLayer)
        }

        return () => {
            if (map) {
                map.removeLayer(vectorLayer);
            }
        }
    }, [map])


    //------------------------------------------------------------------------------
    //                          MOSTRAR ELEMENTOS DEL MAPA
    useEffect(() => {
        if (!vectorSource || estadoSim !== 'PL') return //Si la simulacion no esta iniciada, no mostrar
        planesDeVuelo.forEach((plan) => {
            //Asignar plan
            const {longitud_origen, latitud_origen, longitud_destino, latitud_destino} = plan;
            const puntoInicio = fromLonLat([longitud_origen,latitud_origen])
            const puntoFin = fromLonLat([longitud_destino,latitud_destino])

            const velocidad = 100
            const intervaloActualizacion = 1000


            let posicionActual = puntoInicio;
            console.log(posicionActual)
            const markerAvion = new Feature({
                geometry: new Point(posicionActual)
            })
            const planeLayer = new VectorLayer({
                source: new VectorSource({
                    features: [markerAvion]
                }),
                style: new Style({
                    image: new Icon({
                        anchor: [0.5,0.5],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        src: '/planes/plane_green.svg',

                    })
                })
            })
            map.addLayer(planeLayer)

            setInterval(() => {
                const deltaX = puntoFin[0] - puntoInicio[0];
                const deltaY = puntoFin[1] - puntoInicio[1];
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const duration = (distance / velocidad) * 3600000; // Convertir a milisegundos

                posicionActual = [posicionActual[0] + (velocidad * (intervaloActualizacion / 3600000)) * (deltaX / distance), posicionActual[1] + (velocidad * (intervaloActualizacion / 3600000)) * (deltaY / distance)];

                markerAvion.setGeometry(new Point(posicionActual));
            }, intervaloActualizacion )



        })
        

    }, [fechaSim, planesDeVuelo, vectorSource, estadoSim])
    //------------------------------------------------------------------------------
    return null
}

export default PlanesMarkers;