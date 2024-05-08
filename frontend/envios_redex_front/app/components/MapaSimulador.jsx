'use client'
import { MapContainer, Marker, TileLayer, Popup, FeatureGroup } from "react-leaflet";
import { Icon, divIcon, point } from "leaflet";
import { EditControl } from "react-leaflet-draw"
import { useState, useEffect } from "react";
import Aeropuerto from "./Aeropuerto";
import PlanDeVuelo from "./PlanDeVuelo";


//Temporal, reemplazada por la API de aeropuertos
let aeropuertosTemp = [
  { id: 1, nombre: "Bogota", latitude: 4.70139, longitude: -74.14694, capacidadMax: 100, capacidadActual: 0 },
  { id: 2, nombre: "Quito", latitude: 0.11333, longitude: -78.35861, capacidadMax: 200, capacidadActual: 0 }
]

let planesTemp = [
  {id_tramo: 1, ciudadOrigen: {latitude: 48.86,longitude: 2.3522}, ciudadDestino: {latitude: -12.0431800, longitude:  -77.0282400}, horaOrigen: "", hora_destino: "", capacidadMaxima: 100, capacidadOcupada: 0, estado: 1 },
  {id_tramo: 2, ciudadOrigen: {latitude: 40.71427, longitude: -74.00597}, ciudadDestino: {latitude: -30.559482,longitude:  22.937506 }, horaOrigen: "", hora_destino: "", capacidadMaxima: 100, capacidadOcupada: 45, estado: 1 },
  {id_tramo: 3, ciudadOrigen: {latitude:39.9075, longitude: 116.39723}, ciudadDestino: {latitude: 39.074208, longitude:  21.824312}, horaOrigen: "", hora_destino: "", capacidadMaxima: 100, capacidadOcupada: 98, estado: 1},
]

export default function MapaSimulador({ }) {

  //Variable para manejar los aeropuertos
  const [aeropuertos, setAeropuertos] = useState(aeropuertosTemp);
  const [planesDeVuelo, setPlanesDeVuelo] = useState(planesTemp)

  useEffect(() => {
    
  },[])

  return (
    <>

      <div style={{ position: 'relative', zIndex: 0 }}>
        <MapContainer center={[48.8566, 2.3522]} zoom={3}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          ></TileLayer>
          {aeropuertos.map((pos, index) => (
            <Aeropuerto aeropuerto={pos}></Aeropuerto>
          ))}
          {planesDeVuelo.map((pos,index) => (
            <PlanDeVuelo planDeVuelo={pos}></PlanDeVuelo>
          )) }
        </MapContainer>
      </div>


    </>
  )
}