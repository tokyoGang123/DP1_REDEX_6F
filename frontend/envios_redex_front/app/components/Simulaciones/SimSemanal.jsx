import MapaSimulador from "../MapaSimulador"
import SelectorFecha from "../Elementos/SelectorFecha"
import { CuadroTiempo } from "../Elementos/CuadroTiempo"

export default function SimSemanal() {

    return (
        <>
            <MapaSimulador></MapaSimulador>
            <SelectorFecha></SelectorFecha>
            <CuadroTiempo></CuadroTiempo>
        </>
        
    )
}
