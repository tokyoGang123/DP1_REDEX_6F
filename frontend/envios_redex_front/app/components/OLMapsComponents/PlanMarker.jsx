import React, { useEffect } from 'react';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Icon, Style } from 'ol/style';
import { transform } from 'ol/proj';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

const PlanMarker = ({ map, planDeVuelo, planesDeVuelo }) => {

    //console.log(planDeVuelo)
    dayjs.extend(utc);
    dayjs.extend(timezone);

    useEffect(() => {
        if (!map) return;

        let horaOrigen = dayjs(planDeVuelo.hora_origen)
        //console.log(horaOrigen)
        let origen = [planDeVuelo.longitud_origen, planDeVuelo.latitud_origen]
        let destino = [planDeVuelo.longitud_destino, planDeVuelo.latitud_destino]
        //console.log("YAY")
        //console.log(origen,destino)

        const iconFeature = new Feature({
            geometry: new Point(transform(origen, 'EPSG:4326', 'EPSG:3857')),
        })

        const iconStyle = new Style({
            image: new Icon({
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: '/planes/plane_green.svg',
                scale: 0.4
            })
        })

        iconFeature.setStyle(iconStyle);

        const vectorSource = new VectorSource({
            features: [iconFeature]
        })

        const vectorLayer = new VectorLayer({
            source: vectorSource,
        })

        map.addLayer(vectorLayer);

        let step = 0;
        const steps = 100;


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
            }
        }

        movePlane();

        return () => map.removeLayer(vectorLayer)


    }, [map, planDeVuelo])


    return null;
}

export default PlanMarker;