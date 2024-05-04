'use client'
import { MapContainer, Marker, TileLayer, Popup, FeatureGroup } from "react-leaflet";
import { Icon, divIcon, point } from "leaflet";
import { EditControl } from "react-leaflet-draw"
import { useState, useEffect } from "react";
import Aeropuerto from "./Aeropuerto";


//Temporal, reemplazada por la API de aeropuertos
let aeropuertosTemp = [
  { id: 1, nombre: "Bogota", latitude: 4.70139, longitude: -74.14694, capacidadMax: 100, capacidadActual: 0 },
  { id: 2, nombre: "Quito", latitude: 0.11333, longitude: -78.35861, capacidadMax: 200, capacidadActual: 0 }
]


export default function MapaSimulador({ }) {

  //Variable para manejar los aeropuertos
  const [aeropuertos, setAeropuertos] = useState(aeropuertosTemp);

  useEffect(() => {
    
  },[])

  return (
    <>

      <div style={{ position: 'relative', zIndex: 0 }}>
        <MapContainer center={[48.8566, 2.3522]} zoom={6}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          ></TileLayer>
          {aeropuertos.map((pos, index) => (
            <Aeropuerto aeropuerto={pos}></Aeropuerto>
          ))}
        </MapContainer>
      </div>


    </>
  )
}