import dynamic from "next/dynamic";
const PantallaPrincipalDiaria = dynamic(() => import('../components/PantallaPrincipalDiaria'), {ssr: false});


export default function SimulacionPage() {
    return (<PantallaPrincipalDiaria></PantallaPrincipalDiaria>)
}