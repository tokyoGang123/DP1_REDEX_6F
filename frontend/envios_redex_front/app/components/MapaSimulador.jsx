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
//import 'leaflet-canvas-markers'

const markerSize = 20
const iconoRojo = new Icon({
  iconUrl: "/planes/plane_red.svg",
  //iconUrl: require(""),
  iconSize: [markerSize, markerSize],
  
});

const iconoAmarillo = new Icon({
  iconUrl: "/planes/plane_yellow.svg",
  //iconUrl: require(""),
  iconSize: [markerSize, markerSize],
});

const iconoVerde = new Icon({
  iconUrl: "/planes/plane_green.svg",
  //iconUrl: require(""),
  iconSize: [markerSize, markerSize],
});

const iconoGris = new Icon({
  iconUrl: "/planes/plane_grey.svg",
  //iconUrl: require(""),
  iconSize: [markerSize, markerSize],
});


const iconos = {
  Rojo: iconoRojo,
  Amarillo: iconoAmarillo,
  Verde: iconoVerde,
  Gris: iconoGris
}

export default function MapaSimulador({aeropuertosBD,fechaSim,estadoSim,planesDeVueloBD,freqMov,ingresarAeropuertos,muestraLineas}) {

  //Variable para manejar los aeropuertos
  const [aeropuertos, setAeropuertos] = useState([]);
  const [planesDeVuelo, setPlanesDeVuelo] = useState([])
  //const [visiblePlanes, setVisiblePlanes] = useState({});

  useEffect(() => {
      setAeropuertos(aeropuertosBD)
      
  },[aeropuertosBD])

  useEffect(() => {
    setPlanesDeVuelo((prevPlanesDeVuelo) => [...prevPlanesDeVuelo,...planesDeVueloBD]);
  },[planesDeVueloBD])

  useEffect(() => {
    //console.log("PLANES",planesDeVuelo)
  },[planesDeVuelo])

  const removerPlan = (planDeVuelo,id) => {
    ingresarAeropuertos(planDeVuelo)
    setPlanesDeVuelo((prevPlanes) => prevPlanes.filter(plan => plan.id_tramo !== id))
    //console.log("Removido " + id)
  }

const idsTemp = [3860]
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
          {planesDeVuelo && planesDeVuelo.length > 0 && estadoSim == 'PL' ? planesDeVuelo.map((pos,index) => (
            <PlanDeVuelo key={pos.id_tramo} planDeVuelo={pos} fechaSim={fechaSim} estadoSim={estadoSim} freqMov={freqMov} removerPlan={removerPlan} iconos={iconos} muestraLineas={muestraLineas}></PlanDeVuelo>
          )) : <></>}
          {/*planesDeVuelo && planesDeVuelo.length > 0 ? planesDeVuelo.filter(pos => idsTemp.includes(pos.id_tramo)).map((pos,index) => (
            <PlanDeVuelo key={index} planDeVuelo={pos} fechaSim={fechaSim} estadoSim={estadoSim} intervaloMS={intervaloMS}></PlanDeVuelo>
          )) : <></>*/}
        </MapContainer>
      </div>


    </>
  )
}