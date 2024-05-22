import MapaSimulador from "../MapaSimulador"
import SelectorFecha from "../Elementos/SelectorFecha"
import { CuadroTiempo } from "../Elementos/CuadroTiempo"
import { Stack } from "@mui/material"
import BotonIniciar from "../Botones/BotonIniciar"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import { getAeropuertosTodos } from "@/app/api/aeropuetos.api"
import Header from '../Header/Header'

export default function SimSemanal() {

    //---------------------------------------------------------
    //                      VARIABLES


    //TIEMPO SELECCIONADO PARA EJECUTAR LA SIMULACION
    const [fechaSim, setFechaSim] = useState(dayjs());

    //Variable para incrementar segundos totales
    const [segundosReales, setSegundosReales] = useState(0);
    //TIEMPO CRONOMETRADO
    const horaCron = Math.floor(segundosReales / 3600).toString().padStart(2, '0');
    const minutoCron = Math.floor((segundosReales % 3600) / 60).toString().padStart(2, '0');
    const segundoCron = (segundosReales % 60).toString().padStart(2, '0');

    //Estado de la simulación
    const [estadoSim, setEstadoSim] = useState('NI'); //NI (No Iniciado), PL (En ejecucion), PS (en pausa)

    //Aeropuertos - Estático
    const [aeropuertos, setAeropuertos] = useState({});



    //---------------------------------------------------------
    //                      USE EFFECTS E INTERVALS

    useEffect(() => {
        //Obtener datos iniciales
        async function obtenerDatos() {
            let a = await getAeropuertosTodos()
            setAeropuertos(a);
        }
        obtenerDatos()
    }, [])

    //TEMP -> Ver actualizaciones
    useEffect(() => {
        //console.log(fechaSim)
    }, [fechaSim])


    //Cambio del cronómetro real (mediante variable segundosReales)
    useEffect(() => {
        let interval = null
        if (estadoSim === 'PL') {
            interval = setInterval(() => {
                setSegundosReales((segundosReales) => segundosReales + 1);
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
        
        //"Play"
        setEstadoSim('PL')
        ejecucionSimulacion()

    }

    //---------------------------------------------------------
    //                      EJECUTA BLOQUE

    //---------------------------------------------------------
    //                      CUERPO SIMULACION
    const ejecucionSimulacion = async () => {
        let i = 0;
        let llamadas_totales = 10800;
        let tiempoMax = 1;
        let nF = fechaSim;
    
        while (i < llamadas_totales) {
            
            nF = await nF.add(1, 'm');
            console.log(nF);
            await setFechaSim(nF);
            
            await new Promise(r => setTimeout(r, 200));
            i++;
        }
    }

    //---------------------------------------------------------


    return (
        <>
            <Header title="Simulación" />
            <Stack direction="row" spacing={2}>

                <CuadroTiempo horas={horaCron} minutos={minutoCron} segundos={segundoCron}></CuadroTiempo>
                <Stack>
                    <SelectorFecha fechaSim={fechaSim} estadoSim={estadoSim}></SelectorFecha>
                    <BotonIniciar onClick={clickBotonIniciar}></BotonIniciar>
                </Stack>

            </Stack>
            <div style={{ height: 'calc(100vh - 50px)', width: '100%' }}>
                <MapaSimulador aeropuertosBD={aeropuertos} planesDeVuelo={[]} fechaSim={fechaSim} estadoSim={estadoSim}/>
            </div>

        </>

    )
}
