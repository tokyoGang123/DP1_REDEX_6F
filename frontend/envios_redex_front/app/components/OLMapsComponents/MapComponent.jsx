import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { fromLonLat } from 'ol/proj';

const MapComponent = forwardRef(({ vectorLayer, aeropuertos }, ref) => {
    const mapElement = useRef();
    const mapRef = useRef(); // Use a ref to store the map instance

    //Exponer el ref del mapa
    useImperativeHandle(ref, () => ({
      getMap: () => mapRef.current,
    }));
  
    useEffect(() => {
      // Initialize the map only once
      if (!mapRef.current) {
        mapRef.current = new Map({
          target: mapElement.current,
          layers: [
            new TileLayer({
              source: new OSM(),
            }),
            vectorLayer,
          ],
          view: new View({
            center: [0, 0],
            zoom: 2,
          }),
          renderer: 'canvas'
        });
      }
  
      return () => {
        // Clean up the map instance on component unmount
        if (mapRef.current) {
          mapRef.current.setTarget(null);
          mapRef.current = null;
        }
      };
    }, [vectorLayer]);
  
    return <div ref={mapElement} style={{ width: '100%', height: '100vh' }}></div>;
});

export default MapComponent;
