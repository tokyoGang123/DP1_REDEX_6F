import Image from "next/image";
import MapaSimulador from "./components/MapaSimulador";
import "leaflet/dist/leaflet.css";

export default function Home() {
  return (
    <>
    <MapaSimulador></MapaSimulador>
    </>
  );
}
