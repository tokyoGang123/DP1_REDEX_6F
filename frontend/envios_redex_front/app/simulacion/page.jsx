
import dynamic from "next/dynamic";
const PantallaPrincipal = dynamic(() => import('../components/PantallaPrincipal'), {ssr: false});


export default function SimulacionPage() {
    return (<PantallaPrincipal></PantallaPrincipal>)
}