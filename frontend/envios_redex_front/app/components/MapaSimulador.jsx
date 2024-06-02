'use client'
import { MapContainer, Marker, TileLayer, Popup, FeatureGroup } from "react-leaflet";
import { Icon, divIcon, point } from "leaflet";
import { EditControl } from "react-leaflet-draw"
import { useState, useEffect, use } from "react";
import dynamic from "next/dynamic";
const Aeropuerto = dynamic(() => import('./Aeropuerto'), {ssr: false});
const PlanDeVuelo = dynamic(() => import('./PlanDeVuelo'), {ssr: false});
//import Aeropuerto from "";
//import PlanDeVuelo from "./PlanDeVuelo";
import { Cronometro } from "./Elementos/SelectorFecha";


//Temporal, reemplazada por la API de aeropuertos
let aeropuertosTemp = [
  { id: 1, nombre: "Bogota", latitude: 4.70139, longitude: -74.14694, capacidadMax: 100, capacidadActual: 0 },
  { id: 2, nombre: "Quito", latitude: 0.11333, longitude: -78.35861, capacidadMax: 200, capacidadActual: 0 }
]

let planesTemp = [
  {id_tramo: 1, ciudadOrigen: {latitude: 4.70139,longitude:-74.14694}, ciudadDestino: {latitude: -12.0431800, longitude:  -77.0282400}, horaOrigen: "", hora_destino: "", capacidadMaxima: 100, capacidadOcupada: 0, estado: 1 },
  {id_tramo: 2, ciudadOrigen: {latitude: -34.78917, longitude: -56.26472}, ciudadDestino: {latitude: 55.61806,longitude:  12.65611 }, horaOrigen: "", hora_destino: "", capacidadMaxima: 100, capacidadOcupada: 45, estado: 1 },
  {id_tramo: 3, ciudadOrigen: {latitude:39.9075, longitude: 116.39723}, ciudadDestino: {latitude: 39.074208, longitude:  21.824312}, horaOrigen: "", hora_destino: "", capacidadMaxima: 100, capacidadOcupada: 98, estado: 1},
]

export default function MapaSimulador({aeropuertosBD,fechaSim,estadoSim,planesDeVueloBD,intervaloMS}) {

  //Variable para manejar los aeropuertos
  const [aeropuertos, setAeropuertos] = useState({});
  const [planesDeVuelo, setPlanesDeVuelo] = useState({})

  useEffect(() => {
      setAeropuertos(aeropuertosBD)
      
  },[aeropuertosBD])

  useEffect(() => {
    setPlanesDeVuelo(planesDeVueloBD)
  },[planesDeVueloBD])

  useEffect(() => {
    console.log("PLANES",planesDeVuelo)
  },[planesDeVuelo])


  return (
    <>
      <div style={{ position: 'relative', zIndex: 0, height: '100%', width: '100%'  }}>
        <MapContainer center={[48.8566, 2.3522]} zoom={3} style={{ height: '100%', width: '100%' }} preferCanvas={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          ></TileLayer>
          {aeropuertos && aeropuertos.length > 0 ? aeropuertos.map((pos, index) => (
            <Aeropuerto key={index} aeropuerto={pos}></Aeropuerto>
          )) : <></>}
          {/*planesDeVuelo && planesDeVuelo.length > 0 ? planesDeVuelo.map((pos,index) => (
            <PlanDeVuelo key={index} planDeVuelo={pos} fechaSim={fechaSim} estadoSim={estadoSim} intervaloMS={intervaloMS}></PlanDeVuelo>
          )) : <></>*/}
          {/*planesDeVuelo && planesDeVuelo.length > 0 ? planesDeVuelo.filter(pos => pos.id_tramo == 588).map((pos,index) => (
            <PlanDeVuelo key={index} planDeVuelo={pos} fechaSim={fechaSim} estadoSim={estadoSim} intervaloMS={intervaloMS}></PlanDeVuelo>
          )) : <></>*/}
        </MapContainer>
      </div>


    </>
  )
}