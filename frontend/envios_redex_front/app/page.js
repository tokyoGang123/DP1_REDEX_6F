import Image from "next/image";
import MapaSimulador from "./components/MapaSimulador";
import "leaflet/dist/leaflet.css";
import SelectorFecha, { Cronometro } from "./components/Elementos/SelectorFecha";

export default function Home() {
  
  return (
    <>
    <MapaSimulador></MapaSimulador>
    <SelectorFecha></SelectorFecha>
    </>
  );
}
