
import dynamic from "next/dynamic";
const PantallaPrincipalColapso = dynamic(() => import('../components/PantallaPrincipalColapso'), {ssr: false});


export default function SimulacionPage() {
    return (<PantallaPrincipalColapso></PantallaPrincipalColapso>)
}