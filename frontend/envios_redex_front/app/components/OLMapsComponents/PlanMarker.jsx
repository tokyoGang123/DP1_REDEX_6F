import React, { useContext, useEffect } from 'react';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { BatchUpdateContext } from '../MapaSimuladorOL';

const PlanMarker = ({ map, planDeVuelo, vectorLayer, onRemovePlan, style }) => {
    const batchUpdatePlanes = useContext(BatchUpdateContext);

    useEffect(() => {
        if (!map || !vectorLayer) return;


        //console.log("ENTRO: " + planDeVuelo.ruta)
        //const { coordenadas } = planDeVuelo.ruta;
        const iconFeature = new Feature({
            geometry: new Point(planDeVuelo.ruta[0]),
        });

        iconFeature.setStyle(style);
        vectorLayer.getSource().addFeature(iconFeature);

        let step = 0;

        const movePlane = () => {
            if (step < planDeVuelo.ruta.length) {
                iconFeature.setGeometry(new Point(planDeVuelo.ruta[step]));
                step++;
                //requestAnimationFrame(movePlane);
                setTimeout(movePlane, 1000);
            } else {
                vectorLayer.getSource().removeFeature(iconFeature);
                onRemovePlan(planDeVuelo.id_tramo);
            }
        };

        const addToBatch = () => {
            batchUpdatePlanes(movePlane);
        };

        addToBatch();

        return () => {
            if (vectorLayer) {
                vectorLayer.getSource().removeFeature(iconFeature);
            }
        };
    }, [map, planDeVuelo]);

    return null;
};

export default PlanMarker;
