'use client'
import { MapContainer, Marker, TileLayer, Popup, FeatureGroup } from "react-leaflet";
import { Icon, divIcon, point } from "leaflet";
import { EditControl } from "react-leaflet-draw"
import { useState, useEffect } from "react";


export default function MapaSimulador({}) {


    return(
        <>
        
        <div style={{ position: 'relative', zIndex: 0 }}>
        <MapContainer center={[48.8566, 2.3522]} zoom={4} >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          ></TileLayer>

        </MapContainer>
      </div>
        
        
        </>
    )
}