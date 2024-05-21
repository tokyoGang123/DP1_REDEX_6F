import MapaSimulador from "../MapaSimulador"
import SelectorFecha from "../Elementos/SelectorFecha"
import { CuadroTiempo } from "../Elementos/CuadroTiempo"
import { Stack } from "@mui/material"
import BotonIniciar from "../Botones/BotonIniciar"
import { useEffect, useState } from "react"

export default function SimSemanal() {

    //---------------------------------------------------------
    //                      VARIABLES


    //TIEMPO SELECCIONADO PARA EJECUTAR LA SIMULACION
    const [fechaSim, setFechaSim] = useState(0);

    //Variable para incrementar segundos totales
    const [segundosReales, setSegundosReales] = useState(0);
    //TIEMPO CRONOMETRADO
    const horaCron = Math.floor(segundosReales / 3600).toString().padStart(2, '0');
    const minutoCron = Math.floor((segundosReales % 3600) / 60).toString().padStart(2, '0');
    const segundoCron = (segundosReales % 60).toString().padStart(2, '0');


    //Estado de la simulación
    const [estadoSim, setEstadoSim] = useState('NI'); //NI (No Iniciado), PL (En ejecucion), PS (en pausa)


    //---------------------------------------------------------
    //                      USE EFFECTS E INTERVALS


    //Cambio del cronómetro real (mediante variable segundosReales)
    useEffect(() => {
        let interval = null
        if (estadoSim === 'PL') {
            interval = setInterval(() => {
                setSegundosReales((segundosReales) => segundosReales + 1);
                console.log(segundosReales)
            }, 1000);
        } else {
            clearInterval(interval)
        }
        return () => {
            clearInterval(interval)
        }

    }, [estadoSim, segundosReales])



    //---------------------------------------------------------
    //                      FUNCIONES

    // Al hacer click al boton de iniciar, empieza la simulacion
    const clickBotonIniciar = () => {
        setEstadoSim('PL')
    }



    //---------------------------------------------------------
    

    return (
        <>
            <Stack direction="row" spacing={2}>

                <CuadroTiempo horas={horaCron} minutos={minutoCron} segundos={segundoCron}></CuadroTiempo>
                <Stack>
                    <SelectorFecha></SelectorFecha>
                    <BotonIniciar onClick={clickBotonIniciar}></BotonIniciar>
                </Stack>

            </Stack>
            <div style={{ height: 'calc(100vh - 50px)', width: '100%' }}>
                <MapaSimulador aeropuertos={[]} planesDeVuelo={[]} />
            </div>

        </>

    )
}
