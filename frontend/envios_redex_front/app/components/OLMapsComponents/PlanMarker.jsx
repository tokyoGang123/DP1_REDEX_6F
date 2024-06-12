import React, { useContext, useEffect } from 'react';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Icon, Style } from 'ol/style';
import { transform } from 'ol/proj';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import {BatchUpdateContext} from '../MapaSimuladorOL'

const PlanMarker = ({ map, planDeVuelo, planesDeVuelo,vectorLayer,onRemovePlan ,style}) => {

    //console.log(planDeVuelo)
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const batchUpdatePlanes = useContext(BatchUpdateContext)

    useEffect(() => {
        if (!map || !vectorLayer) return;
        //console.log(useContext(BatchUpdateContext))
        
        //console.log(horaOrigen)
        let origen = [planDeVuelo.longitud_origen, planDeVuelo.latitud_origen]
        let destino = [planDeVuelo.longitud_destino, planDeVuelo.latitud_destino]
        //console.log("YAY")
        //console.log(origen,destino)

        const iconFeature = new Feature({
            geometry: new Point(transform(origen, 'EPSG:4326', 'EPSG:3857')),
        })

        const iconStyle = style

        iconFeature.setStyle(iconStyle);

        /*
        const vectorSource = new VectorSource({
            features: [iconFeature]
        })

        const vectorLayer = new VectorLayer({
            source: vectorSource,
        })
            */
        
        vectorLayer.getSource().addFeature(iconFeature)

        //map.addLayer(vectorLayer);

        let step = 0;

        let horaOrigen = dayjs(planDeVuelo.hora_origen)
        let horaDestino = dayjs(planDeVuelo.hora_destino)
        let tiempoSimulado = horaDestino.diff(horaOrigen,'minute')
        let tiempoReal = tiempoSimulado * 100/1000 //En segundos
        //const steps = tiempoReal * 60;
        const steps = 100

        const movePlane = () => {
            if (step <= steps) {
                const coord = [
                    origen[0] + ((destino[0] - origen[0]) * step) / steps,
                    origen[1] + ((destino[1] - origen[1]) * step) / steps,
                ]

                iconFeature.setGeometry(new Point(transform(coord, 'EPSG:4326', 'EPSG:3857')));
                step++;
                requestAnimationFrame(movePlane);
            } else {
                vectorLayer.getSource().removeFeature(iconFeature);
                //planesDeVuelo = planesDeVuelo.filter(item => item.id_tramo !== planDeVuelo.id_tramo)
                onRemovePlan(planDeVuelo.id_tramo)
            }
        }

        const addToBatch = () => {
            batchUpdatePlanes(movePlane)
        }

        addToBatch();

        return () => {
            if(vectorLayer) {
                vectorLayer.getSource().removeFeature(iconFeature)
            }

        }


    }, [map, planDeVuelo])


    return null;
}

export default PlanMarker;