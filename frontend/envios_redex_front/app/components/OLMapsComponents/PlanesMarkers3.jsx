import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { Icon, Style } from "ol/style";

const PlanesMarkers = ({ planesDeVuelo, map, estadoSim, fechaSim }) => {

    // ASIGNAR IMAGEN A UN AVION
    const getMarkerImage = (capOcu, capMax) => {
        let ocupacion = (capOcu / capMax) * 100;
        if (capOcu === 0) return '/planes/plane_grey.svg';
        if (ocupacion <= 33.3) return '/planes/plane_green.svg';
        else if (ocupacion <= 66.6) return '/planes/plane_yellow.svg';
        else return '/planes/plane_red.svg';
    };

    // REFERENCIA A MAPA
    const [vectorSource, setVectorSource] = useState(new VectorSource());
    const planeFeatures = useRef(new Map());

    useEffect(() => {
        const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: (feature) => {
                return new Style({
                    image: new Icon({
                        anchor: [0.5, 1],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        src: getMarkerImage(feature.get('capacidadOcupada'), feature.get('capacidadMaxima')),
                    })
                });
            }
        });

        if (map) {
            map.addLayer(vectorLayer);
        }

        return () => {
            if (map) {
                map.removeLayer(vectorLayer);
            }
        };
    }, [map]);

    // MOSTRAR ELEMENTOS DEL MAPA
    useEffect(() => {
        if (!vectorSource || estadoSim !== 'PL') return; // Si la simulación no está iniciada, no mostrar

        const updatePlanePositions = () => {
            planesDeVuelo.forEach((plan) => {
                const { hora_origen, hora_destino, listaCamino } = plan;
                const tiempoTransc = fechaSim.diff(dayjs(hora_origen), 'second'); // Verificar si ya debe empezar a mostrar
                const duracion = dayjs(hora_destino).diff(dayjs(hora_origen), 'second'); // Verificar el total de duración

                if (tiempoTransc >= 0 && tiempoTransc <= duracion) {
                    const factor = tiempoTransc / duracion;
                    const indiceInicio = Math.floor(factor * (listaCamino.length - 1));
                    const indiceFin = indiceInicio + 1;
                    if (indiceFin >= listaCamino.length) {
                        return;
                    }

                    const factorLocal = (factor * (listaCamino.length - 1)) % 1;
                    const inicio = listaCamino[indiceInicio];
                    const fin = listaCamino[indiceFin];
                    const posicion = {
                        lon: inicio.lon + (fin.lon - inicio.lon) * factorLocal,
                        lat: inicio.lat + (fin.lat - inicio.lat) * factorLocal
                    };

                    let feature = planeFeatures.current.get(plan.id);
                    if (!feature) {
                        feature = new Feature({
                            geometry: new Point(fromLonLat([posicion.lon, posicion.lat])),
                            capacidadOcupada: plan.capacidad_ocupada,
                            capacidadMaxima: plan.capacidad_maxima
                        });
                        vectorSource.addFeature(feature);
                        planeFeatures.current.set(plan.id, feature);
                    } else {
                        feature.setGeometry(new Point(fromLonLat([posicion.lon, posicion.lat])));
                    }
                } else {
                    // Si el avión ya no debe mostrarse, eliminar la característica
                    let feature = planeFeatures.current.get(plan.id);
                    if (feature) {
                        vectorSource.removeFeature(feature);
                        planeFeatures.current.delete(plan.id);
                    }
                }
            });
        };

        updatePlanePositions(); // Actualizar inmediatamente
        const intervalId = setInterval(updatePlanePositions, 1000); // Actualizar cada segundo

        return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar
    }, [fechaSim, planesDeVuelo, vectorSource, estadoSim]);

    return null;
};

export default PlanesMarkers;
