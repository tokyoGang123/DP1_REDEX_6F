import MapaSimulador from "../MapaSimulador"
import SelectorFecha from "../Elementos/SelectorFecha"
import { CuadroTiempo } from "../Elementos/CuadroTiempo"
import { Stack } from "@mui/material"
import BotonIniciar from "../Botones/BotonIniciar"
import { useEffect, useRef, useState } from "react"
import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { getAeropuertosTodos } from "@/app/api/aeropuetos.api"
import Header from '../Header/Header'
import { getPlanesTodos } from "@/app/api/planesDeVuelo.api"
import { TryOutlined } from "@mui/icons-material"
import { useTimer } from "../usoTimer"
import { ejecutaGRASP, iniciaGRASP } from "@/app/api/grasp.api"

dayjs.extend(advancedFormat);

//Para manejar intervalos
function useCustomInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

const transformaHora = (fecha) => {
    const formattedDate = fecha.format('YYYYMMDDTHH:mm:Z');
    //const customFormattedDate = formattedDate.replace(/([-+]\d{2}):(\d{2})/, '$1:$2');
    return formattedDate;

}

export default function SimSemanal() {

    dayjs.extend(utc);
    dayjs.extend(timezone);


    //---------------------------------------------------------
    //                      VARIABLES

    //ZONA HORARIA ACTUAL
    const zonaHorariaUsuario = dayjs.tz.guess();

    //TIEMPO SELECCIONADO PARA EJECUTAR LA SIMULACION
    const [fechaSim, setFechaSim] = useState(dayjs().tz(zonaHorariaUsuario));


    //useRef de fechaSim
    const fechaSimRef = useRef(fechaSim)

    //useEffect de fechaSimRef
    useEffect(() => {
        fechaSimRef.current = fechaSim;
        //console.log(fechaSimRef.current)
    }, [fechaSim])

    //Variable para incrementar segundos totales
    const [segundosReales, setSegundosReales] = useState(0);
    //TIEMPO CRONOMETRADO
    const horaCron = Math.floor(segundosReales / 3600).toString().padStart(2, '0');
    const minutoCron = Math.floor((segundosReales % 3600) / 60).toString().padStart(2, '0');
    const segundoCron = (segundosReales % 60).toString().padStart(2, '0');
    const { time, startTimer, stopTimer } = useTimer(1000);
    const timeRef = useRef(time);

    useEffect(() => {
        timeRef.current = time;
    }, [time])

    //Estado de la simulación
    const [estadoSim, setEstadoSim] = useState('NI'); //NI (No Iniciado), PL (En ejecucion), PS (en pausa)

    //Aeropuertos
    const [aeropuertos, setAeropuertos] = useState({});

    //Planes de Vuelo
    const [planesDeVuelo, setPlanesDeVuelo] = useState({})
    const planesDeVueloRef = useRef(planesDeVuelo)
    useEffect(() => {
        planesDeVueloRef.current = planesDeVuelo
    },[planesDeVuelo])

    //Envios
    const [envios, setEnvios] = useState({})
    const enviosRef = useRef(envios)
    useEffect(() => {
        enviosRef.current = envios;
    }, [envios])

    //Paquetes
    const [paquetes, setPaquetes] = useState({})

    //TIEMPO EN EL QUE PASA 1 MINUTO REAL
    const [intervaloMS, setIntervaloMS] = useState(200)

    //Ref para montura inicial
    const isInitialMount = useRef(TryOutlined)

    //Tiempo hasta llamada de datos nueva
    const tiempoLlamaGRASP = 120;

    //---------------------------------------------------------
    //                      USE EFFECTS E INTERVALS

    useEffect(() => {
        //Obtener datos iniciales
        async function obtenerDatos() {
            isInitialMount.current = false;
            let a = await getAeropuertosTodos()
            await setAeropuertos(a);
            //let b = await cargarPlanesFecha(fechaSimRef)
            //let c = await getPlanesTodos()
            //await setPlanesDeVuelo(c);
            console.log("DATOS LEIDOS")
        }
        if (isInitialMount.current) obtenerDatos()
        fechaSimRef.current = fechaSim;
    }, [])

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
    const clickBotonIniciar = async () => {

        //"Play"
        setEstadoSim('PL')
        startTimer()
        await iniciaDatos()
        ejecucionSimulacion()

    }

    //---------------------------------------------------------
    //                      INICIAR DATOS
    const iniciaDatos = async () => {

        //Leer planes de vuelo de la fecha inicial + X tiempo
        let c = await getPlanesTodos() //Solicitar luego que se pueda dar la fecha
        
        //TEMPORAL
        c = c.map(pdv => {
            return { ...pdv, listaPaquetes: [] };
        });
        //TEMPORAL
        
        await setPlanesDeVuelo(c);

        //Comando para inicializar la simulación
        let res = await iniciaGRASP();
        //console.log(res)

        //Obtener envios asignados
        let tiempoEnviado = transformaHora(fechaSimRef.current);
        let p = await ejecutaGRASP(tiempoEnviado);
        await p.sort((a, b) => {
            let fechaA = new Date(a.zonedFechaIngreso);
            let fechaB = new Date(b.zonedFechaIngreso);
            return fechaA - fechaB;
        })
        await setEnvios(p)
        enviosRef.current = p
        //console.log("PEDIDOS")
        //console.log(p)

    }



    //---------------------------------------------------------
    //                      EJECUTA BLOQUE

    //---------------------------------------------------------
    //                      ASIGNAR ENVIO A PLANES
    const asignarAPlanes = async (env) => {

        //Por cada paquete del envio, asignaremos a un plan de vuelo
        console.log(env)
        for (let i = 0; i < env.paquetes.length; i++) {
            let paq = env.paquetes[i]
            let listRut = paq.ruta.listaRutas
            for (let j = 0; j < listRut.length; j++){
                //Encontrar plan de vuelo asignado a parte de la ruta
                let pdv = planesDeVueloRef.current.find(plan => plan.id_tramo == listRut[j])
                //AQUI SE ASIGNA A SU LISTA
                pdv.listaPaquetes.push(paq.id_paquete)
                pdv.capacidad_ocupada = pdv.capacidad_ocupada + 1 
                console.log("Paquete " + paq.id_paquete + " asignado a ruta " + pdv.id_tramo)
                console.log(pdv)
            }
           

        }


    }


    //---------------------------------------------------------
    //                      REVISAR ENVIOS
    const revisaEnvios = async () => {
  
        //FOR es "falso", solo revisamos hasta que no tenga sentido
        console.log(enviosRef.current,length)
        for (let i = 0; i < enviosRef.current.length; i++) {
            console.log("a")
            const env = enviosRef.current[i];

            //Si encontramos algun envio que no se necesite revisar, ignorar
            //console.log(dayjs(env.zonedFechaIngreso)  + " " + fechaSimRef.current)
            //console.log(dayjs(env.zonedFechaIngreso) > fechaSimRef.current)
            if (dayjs(env.zonedFechaIngreso) > fechaSimRef.current) break;
            //console.log(env.id_envio)

            await asignarAPlanes(env)

            //Quitar envio de la lista
            enviosRef.current.splice(i,1);
        }
        console.log("end")
        setEnvios(enviosRef.current)
    }

    //---------------------------------------------------------
    //                      CUERPO SIMULACION
    const ejecucionSimulacion = async () => {
        let i = 0;
        let llamadas_totales = 10080;
        let ciclo = 120
        let llamarAGrasp = 50;
        let tiempoMax = 1;
        let nF = fechaSimRef.current;

        while (i <= llamadas_totales) {

            //-----------------------------------
            //MANTENER TIEMPO
            if (i >= llamadas_totales) {
                break;
            }
            //Si se han llegado al momento de llamar a GRASP, realizar lo
            if (i == llamarAGrasp) {
                //console.log(llamarAGrasp)
                llamarAGrasp = llamarAGrasp + ciclo
            }

            const inicio = performance.now()
            //MANTENER TIEMPO
            //-----------------------------------

            //-----------------------------------
            //OPERACIONES

            //Revisar envios

            //let enviosAsignados = await evaluarEnvios()
            console.log(enviosRef.current)
            await revisaEnvios()

            //agregar un minuto simulado
            nF = await nF.add(1, 'm');
            await setFechaSim(nF);
            fechaSimRef.current = nF
            //console.log(fechaSimRef.current)
            //OPERACIONES
            //-----------------------------------


            //-----------------------------------
            //MANTENER TIEMPO
            const fin = performance.now();
            const tiempo = fin - inicio;
            const delay = Math.max(intervaloMS - tiempo)
            //MANTENER TIEMPO
            //-----------------------------------


            await new Promise(r => setTimeout(r, delay)); //originalmente 200
            //console.log(fechaSimRef.current.toDate() + " - " + tiempo)
            //console.log(timeRef)
            i++;
        }
    }

    //---------------------------------------------------------


    return (
        <>
            <Header title="Simulación" />
            <Stack direction="row" spacing={2}>




                <CuadroTiempo horas={horaCron} minutos={minutoCron} segundos={segundoCron} tiempo={time} ></CuadroTiempo>
                <Stack>
                    <SelectorFecha fechaSim={fechaSimRef.current} setFechaSim={setFechaSim} estadoSim={estadoSim} zonaHoraria={zonaHorariaUsuario}></SelectorFecha>
                    <BotonIniciar onClick={clickBotonIniciar}></BotonIniciar>
                    <h2>ZONA HORARIA: {dayjs().tz(zonaHorariaUsuario).format('Z')}</h2>
                </Stack>

            </Stack>
            <div style={{ height: 'calc(100vh - 50px)', width: '100%' }}>
                <MapaSimulador aeropuertosBD={aeropuertos} planesDeVueloBD={planesDeVueloRef.current} fechaSim={fechaSimRef.current} estadoSim={estadoSim} intervaloMS={intervaloMS} />
            </div>

        </>

    )
}
