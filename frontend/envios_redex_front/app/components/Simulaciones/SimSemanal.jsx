import MapaSimulador from "../MapaSimulador"
import SelectorFecha from "../Elementos/SelectorFecha"
import { CuadroTiempo } from "../Elementos/CuadroTiempo"
import { Stack, Grid, Box, Button, Typography } from "@mui/material"
import BotonIniciar from "../Botones/BotonIniciar"
import { useEffect, useRef, useState } from "react"
import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { getAeropuertosTodos } from "@/app/api/aeropuetos.api"
import Header from '../Header/Header'
import { getPlanesPorIntervalo, getPlanesPorIntervaloLatLon, getPlanesTodos } from "@/app/api/planesDeVuelo.api"
import { TryOutlined } from "@mui/icons-material"
import { useTimer } from "../usoTimer"
import { ejecutaGRASP, iniciaGRASP } from "@/app/api/grasp.api"
import hallarPuntosIntermedios from "../funcionesRuta"
import BusquedaPlanes from '../BusquedaPlanes/BusquedaPlanes';
import BusquedaAeropuertos from '../BusquedaAeropuertos/BusquedaAeropuertos';
import BusquedaEnvios from '../BusquedaEnvios/BusquedaEnvios';
import { getPDFFinal } from "@/app/api/pdf.api"
import HoraActual from "../horaActualSem/HoraActual"


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
    //const [fechaSim, setFechaSim] = useState(dayjs("2024-05-30T00:00:00Z").tz(zonaHorariaUsuario));

    //useRef de fechaSim
    const fechaSimRef = useRef(fechaSim)

    //Inicio
    const [fechaStart, setFechaStart] = useState()
    const fechaStartRef = useRef(fechaStart)

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
    }, [planesDeVuelo])

    //Planes de Vuelo FUturos
    const [planesDeVueloFuturo, setPlanesDeVueloFuturo] = useState({})
    const planesDeVueloFuturoRef = useRef(planesDeVueloFuturo)
    useEffect(() => {
        planesDeVueloFuturoRef.current = planesDeVueloFuturo
    }, [planesDeVueloFuturo])

    //Planes de Vuelo Eliminar
    const [planesEliminar, setPlanesEliminar] = useState([])
    const planesEliminarRef = useRef(planesEliminar)
    useEffect(() => {
        planesEliminarRef.current = planesEliminar;
        console.log("change")
    }, [planesEliminar])

    //Planes de Vuelo Mapa
    const [pdvMapa, setPdvMapa] = useState([])
    //console.log(pdvMapa)
    //const pdvMapaRef = useRef(pdvMapa);
    /*
    useEffect(() => {
        pdvMapaRef.current = pdvMapa;
        setPdvMapa()
        console.log("change")
    }, [])*/

    //Envios
    const [envios, setEnvios] = useState({})
    const enviosRef = useRef(envios)
    useEffect(() => {
        enviosRef.current = envios;
    }, [envios])

    const envios2Ref = useRef([]);

    const [enviosFuturo, setEnviosFuturo] = useState({})
    const enviosFuturoRef = useRef(enviosFuturo)
    useEffect(() => {
        enviosFuturoRef.current = enviosFuturo;
    }, [enviosFuturo])
    //Paquetes
    const [paquetes, setPaquetes] = useState({})
    const [vuelosFin, setVuelosFin] = useState({})

    //TIEMPO EN EL QUE PASA 1 MINUTO REAL
    const [intervaloMS, setIntervaloMS] = useState(200)

    //Ref para montura inicial
    const isInitialMount = useRef(TryOutlined)

    //Tiempo hasta llamada de datos nueva
    const tiempoLlamaGRASP = 120;

    //Frecuencia de movimiento de aviones
    const freqMov = 1000; //1 segundo

    //---------------------------------------------------------
    //                      USE EFFECTS E INTERVALS

    useEffect(() => {
        //Obtener datos iniciales
        async function obtenerDatos() {
            isInitialMount.current = false;
            let a = await getAeropuertosTodos()

            //Agregar lista a aeropuertos
            const handlePdvMapping = async () => {
                // Supongo que `c` es tu array original de puntos de venta
                const updatedA = await Promise.all(a.map(async a => {
                    return { ...a, listaPaquetes: [] };
                }));
                return updatedA;
            };
            // Uso de la función handlePdvMapping
            await handlePdvMapping().then(updatedA => {
                a = updatedA;
            });


            await setAeropuertos(a);
            //let b = await cargarPlanesFecha(fechaSimRef)
            //let c = await getPlanesTodos()
            //await setPlanesDeVuelo(c);
            console.log(a)
        }
        if (isInitialMount.current) obtenerDatos()
        fechaSimRef.current = fechaSim;
    }, [])

    //Cambio del cronómetro real (mediante variable segundosReales)
    /*
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

    }, [estadoSim, segundosReales])*/


    const [pdfFin, setPdfFin] = useState(null)

    const obtenerpdf = async () => {
        try {
            let pdf = await getPDFFinal();
            setPdfFin(pdf)

            const url = window.URL.createObjectURL(pdf)
            const a = document.createElement('a')
            a.href = url
            a.download = 'ReporteFinalizacion.pdf'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)

        } catch (error) {
            console.log("ERROR AL OBTENER PDF: ", error)
        }

    }

    //---------------------------------------------------------
    //                      FUNCIONES

    // Al hacer click al boton de iniciar, empieza la simulacion
    const clickBotonIniciar = async () => {

        if (estadoSim != 'PL') {
            //"Play"
            fechaStartRef.current = fechaSimRef.current.second(0); //fecha inicial
            startTimer()
            await iniciaDatos()

            //envios2Ref.current = [...enviosRef.current];

            ejecucionSimulacion()
        }


    }

    //---------------------------------------------------------
    //                      INICIAR DATOS
    const iniciaDatos = async () => {

        //Leer planes de vuelo de la fecha inicial + X tiempo

        //http://localhost:8080/api/planesVuelo/obtenerPorFechas/20240530T20:00:-05:00/20240530T21:00:-05:00
        let planInicio = transformaHora(fechaSimRef.current)
        let planFin = transformaHora(fechaSimRef.current.add(7, "d").add(2, "h"))

        /*
        let c = await getPlanesTodos()
        await c.sort((a, b) => {
            let fechaA = new Date(a.hora_origen);
            let fechaB = new Date(b.hora_origen);
            return fechaA - fechaB;
        })
            */
        //c = c.slice(0,500)

        let c = await getPlanesPorIntervaloLatLon(planInicio, planFin)
        await c.sort((a, b) => {
            let fechaA = new Date(a.hora_origen);
            let fechaB = new Date(b.hora_origen);
            return fechaA - fechaB;
        })
        //c = c.slice(0,1)



        //TEMPORAL
        /*
        c = c.map(pdv => {
            let ruta = hallarPuntosIntermedios(pdv.latitud_origen, pdv.latitud_destino, pdv.longitud_origen, pdv.longitud_destino)
            return { ...pdv, listaPaquetes: [], listaCamino : ruta};
        });*/
        const handlePdvMapping = async () => {
            // Supongo que `c` es tu array original de puntos de venta
            const updatedC = await Promise.all(c.map(async pdv => {
                let ruta = await hallarPuntosIntermedios(pdv.latitud_origen, pdv.longitud_origen, pdv.latitud_destino, pdv.longitud_destino, pdv, intervaloMS, freqMov);
                return { ...pdv, listaPaquetes: [], ruta: ruta, paquetesEnDestino: [] };
            }));
            return updatedC;
        };

        console.log(c)

        // Uso de la función handlePdvMapping
        await handlePdvMapping().then(updatedC => {
            c = updatedC;
            // Aquí puedes trabajar con el array actualizado `updatedC`
        });
        //TEMPORAL

        await setPlanesDeVuelo([...c]);
        await setPlanesEliminar([...c])
        console.log("PLANES FINALES", c)

        //Comando para inicializar la simulación
        let res = await iniciaGRASP();
        //console.log(res)

        //Obtener envios asignados
        let tiempoEnviado = transformaHora(fechaSimRef.current);
        let p = await ejecutaGRASP(tiempoEnviado);
        //let p = []
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
        //console.log(env)
        for (let i = 0; i < env.paquetes.length; i++) {
            let paq = env.paquetes[i]
            let listRut = paq.ruta.listaRutas
            if (listRut == 0) console.log("ERROR EN ENVIO: " + env.id_envio + " para paquete " + paq.id_paquete)
            for (let j = 0; j < listRut.length; j++) {
                //console.log("Buscar", listRut[j])
                //Encontrar plan de vuelo asignado a parte de la ruta
                let pdv = planesDeVueloRef.current.find(plan => plan.id_tramo == listRut[j])
                //console.log(pdv)
                //AQUI SE ASIGNA A SU LISTA
                pdv.listaPaquetes.push(paq.id_paquete)
                pdv.capacidad_ocupada = pdv.capacidad_ocupada + 1
                //console.log("Paquete " + paq.id_paquete + " asignado a ruta " + pdv.id_tramo)
                //console.log(pdv)
                //SI ES LA ULTIMA RUTA, CONFIGURAR PARA QUE SALGA DEL AEROPUERTO
                if (j == listRut.length -1) pdv.paquetesEnDestino.push(paq.id_paquete)
            }
        }

    }


    //---------------------------------------------------------
    //                      REVISAR ENVIOS
    const revisaEnvios = async () => {

        //FOR es "falso", solo revisamos hasta que no tenga sentido
        //console.log(enviosRef.current,length)
        for (let i = 0; i < enviosRef.current.length; i++) {
            //console.log("a")
            const env = enviosRef.current[i];

            //Si encontramos algun envio que no se necesite revisar, ignorar
            //console.log(dayjs(env.zonedFechaIngreso)  + " " + fechaSimRef.current)
            //console.log(dayjs(env.zonedFechaIngreso) > fechaSimRef.current)
            if (dayjs(env.zonedFechaIngreso) > fechaSimRef.current) break;
            //console.log(env.id_envio)

            await asignarAPlanes(env)
            await ingresaAeropuertoPorInicio(env)
            envios2Ref.current.push(env);

            //Quitar envio de la lista
            enviosRef.current.splice(i, 1);
        }
        //console.log("end")
        setEnvios(enviosRef.current)
    }

    const revisaPlanes = async () => {
        const newPlanes = []
        for (let i = 0; i < planesEliminarRef.current.length; i++) {
            const pc = planesEliminarRef.current[i];
            //console.log()
            if (dayjs(pc.hora_origen).tz(zonaHorariaUsuario) > fechaSimRef.current) break;
            if (pdvMapa.some(plan => plan.id_tramo == pc.id_tramo)) continue; //Si existe ya en el mapa, ignorar
            //console.log("PLAN " + pc.id_tramo + " CONFIRMADO")
            console.log(pc)
            newPlanes.push(pc)
            await saleAeropuertoPorPlan(pc)
            planesEliminarRef.current.splice(i, 1)
        }
        //console.log(newPlanes)
        setPdvMapa(newPlanes)
    }

    const obtenerNuevosEnvios = async (fechaLlam) => {
        let tiempoEnviado = transformaHora(fechaLlam);
        let p = await ejecutaGRASP(tiempoEnviado);
        p.sort((a, b) => {
            let fechaA = new Date(a.zonedFechaIngreso);
            let fechaB = new Date(b.zonedFechaIngreso);
            return fechaA - fechaB;
        })
        setEnviosFuturo([...p])
        //console.log("CON FECHA " + transformaHora(fechaSimRef.current))
        //console.log(p)
    }

    const obtenerNuevosPlanes = async (fechaLlam, ciclo) => {
        let tiempoI = transformaHora(fechaLlam)
        let tiempoF = transformaHora(fechaLlam.add(ciclo, 'm'))
        let p = await getPlanesPorIntervaloLatLon(tiempoI, tiempoF)
        p.sort((a, b) => {
            let fechaA = new Date(a.zonedFechaIngreso);
            let fechaB = new Date(b.zonedFechaIngreso);
            return fechaA - fechaB;
        })
        const handlePdvMapping = async () => {
            // Supongo que `c` es tu array original de puntos de venta
            const updatedC = await Promise.all(p.map(async pdv => {
                let ruta = await hallarPuntosIntermedios(pdv.latitud_origen, pdv.longitud_origen, pdv.latitud_destino, pdv.longitud_destino, intervaloMS, freqMov);
                return { ...pdv, listaPaquetes: [], ruta: ruta , paquetesEnDestino: [] };
            }));
            return updatedC;
        };



        // Uso de la función handlePdvMapping
        await handlePdvMapping().then(updatedC => {
            p = updatedC;
            console.log("ACTUALIZADOS", updatedC)
        });
        //console.log(p)
        setPlanesDeVueloFuturo([...p])
        //console.log("DESDE: " + tiempoI + " HASTA " + tiempoF)
        //console.log(p)
    }

    //Añadir a aeropuerto de origen cuando un vuelo llega al aeropuerto deseado
    const ingresaAeropuertoPorInicio = async (envio) => {

        setAeropuertos((prevAeropuertos) => {
            //Copia de seguridad
            const aeropuertosActualizados = [...prevAeropuertos]

            //Encontrar aeropuerto al que ingresan todos los paquetes
            const index = aeropuertosActualizados.findIndex(
                (aeropuerto) => aeropuerto.id_aeropuerto === envio.aeropuerto_origen
            )

            if (index != -1) {
                aeropuertosActualizados[index].listaPaquetes = [
                    ...aeropuertosActualizados[index].listaPaquetes,
                    ...envio.paquetes
                ]
            }

            aeropuertosActualizados[index].capacidad_ocupada = aeropuertosActualizados[index].capacidad_ocupada + envio.paquetes.length

            return aeropuertosActualizados;


        })

    }

    //Añadir a aeropuerto elegido todos los paquetes que ingresan al acabar un plan de vuelo
    const ingresaAeropuertoPorPlan = (planDeVuelo) => {

        setAeropuertos((prevAeropuertos) => {
            //Copia de seguridad
            const aeropuertosActualizados = [...prevAeropuertos]

            //Encontrar aeropuerto al que van a ingresar todos los paquetes
            const index = aeropuertosActualizados.findIndex(
                (aeropuerto) => aeropuerto.id_aeropuerto === planDeVuelo.ciudad_destino
            )

            console.log("ANTES: ", planDeVuelo.listaPaquetes)
            console.log(planDeVuelo.paquetesEnDestino)
            planDeVuelo.listaPaquetes = planDeVuelo.listaPaquetes.filter(item => !planDeVuelo.paquetesEnDestino.includes(item))
            console.log("DESPUES    : ", planDeVuelo.listaPaquetes)

            if (index != -1) {
                aeropuertosActualizados[index].listaPaquetes = [
                    ...aeropuertosActualizados[index].listaPaquetes,
                    ...planDeVuelo.listaPaquetes
                ]
            }
            //console.log("Agregados ", planDeVuelo.listaPaquetes.length)
            console.log(planDeVuelo.listaPaquetes.length)
            aeropuertosActualizados[index].capacidad_ocupada = aeropuertosActualizados[index].capacidad_ocupada + planDeVuelo.listaPaquetes.length

            return aeropuertosActualizados;


        })

    }



    //Quitar de aeropuertos los planes que llegan de un plan
    const saleAeropuertoPorPlan = (planDeVuelo) => {

        setAeropuertos((prevAeropuertos) => {
            //Copia de seguridad
            const aeropuertosActualizados = [...prevAeropuertos]

            //Encontrar aeropuerto del que salen todos los paquetes
            const index = aeropuertosActualizados.findIndex(
                (aeropuerto) => aeropuerto.id_aeropuerto === planDeVuelo.ciudad_origen
            )

            if (index != -1) {
                aeropuertosActualizados[index].listaPaquetes = aeropuertosActualizados[index].listaPaquetes.filter(
                    (paquete) => !planDeVuelo.listaPaquetes.includes(paquete)
                )
            }

            //console.log("Quitados ", planDeVuelo.listaPaquetes.length)

            aeropuertosActualizados[index].capacidad_ocupada = aeropuertosActualizados[index].capacidad_ocupada - planDeVuelo.listaPaquetes.length

            return aeropuertosActualizados;


        })

    }

    //---------------------------------------------------------
    //                      CUERPO SIMULACION
    const ejecucionSimulacion = async () => {
        let i = 0;
        let llamadas_totales = 10080;
        let ciclo = 120
        let currentCiclo = 120
        let llamarAGrasp = 10;
        let tiempoMax = 1;
        let nF = fechaSimRef.current;
        let fechaLlam = fechaStartRef.current //Fecha para llamar grasp
        let fechaLlamPlan = fechaStartRef.current.add(2, 'd').add(2, 'h') // 2 días + 2 horas ya se tienen leidos, se procedera a llamar bloques posteriores de 2 horas
        //console.log("LLAMADA INICIO: " + fechaLlam)
        await setEstadoSim('PL')

        const interval = setInterval(async () => {
            const inicio = performance.now();

            if (i >= llamadas_totales) {
                setEstadoSim('FI')
                console.log("FIN")
                stopTimer()
                clearInterval(interval)
            }
            //Si estamos antes que acabe el ciclo, colocar nuevos envios
            if (i == currentCiclo - 1) {
                enviosRef.current = enviosRef.current.concat(enviosFuturoRef.current)
                //planesDeVueloRef.current = planesDeVueloRef.current.concat([...planesDeVueloFuturoRef.current])
                //planesEliminarRef.current = planesEliminarRef.current.concat([...planesDeVueloFuturoRef.current])
                currentCiclo = currentCiclo + ciclo
            }

            //Si se han llegado al momento de llamar a GRASP, realizar la llamada a nuevos pedidos
            if (i == llamarAGrasp) {
                //console.log("llamada jaja ekide")
                fechaLlam = fechaLlam.add(ciclo, 'm')
                obtenerNuevosPlanes(fechaLlamPlan, ciclo)
                //fechaLlamPlan = fechaLlamPlan.add(ciclo, 'm')
                obtenerNuevosEnvios(fechaLlam)
                //console.log(enviosNew)
                llamarAGrasp = llamarAGrasp + ciclo
            }


            //MANTENER TIEMPO
            //-----------------------------------

            //-----------------------------------
            //OPERACIONES

            //Revisar envios

            //console.log(enviosRef.current)
            await revisaEnvios()
            await revisaPlanes() //Ver si inicia algun plan para colocarlo en el arreglo y mostrarlo en mapa


            const fin = performance.now();
            const tiempoEjecucion = fin - inicio;
            const tiempoEspera = Math.max(0, 200 - tiempoEjecucion);

            setTimeout(() => {
                setFechaSim(nF.add(1, 'm'));
                fechaSimRef.current = nF;
            }, tiempoEspera);

            nF = nF.add(1, 'm');
            fechaSimRef.current = nF;
            console.log(nF)
            i++;
        }, 200)


        /*
        while (i <= llamadas_totales) {
            //console.log(nF)
            //-----------------------------------
            //MANTENER TIEMPO

            const inicio = performance.now();

            if (i >= llamadas_totales) {
                break;
            }
            //Si estamos antes que acabe el ciclo, colocar nuevos envios
            if (i == currentCiclo - 1) {
                enviosRef.current = enviosRef.current.concat(enviosFuturoRef.current)
                //planesDeVueloRef.current = planesDeVueloRef.current.concat([...planesDeVueloFuturoRef.current])
                //planesEliminarRef.current = planesEliminarRef.current.concat([...planesDeVueloFuturoRef.current])
                currentCiclo = currentCiclo + ciclo
            }

            //Si se han llegado al momento de llamar a GRASP, realizar la llamada a nuevos pedidos
            if (i == llamarAGrasp) {
                //console.log("llamada jaja ekide")
                fechaLlam = fechaLlam.add(ciclo, 'm')
                obtenerNuevosPlanes(fechaLlamPlan, ciclo)
                //fechaLlamPlan = fechaLlamPlan.add(ciclo, 'm')
                obtenerNuevosEnvios(fechaLlam)
                //console.log(enviosNew)
                llamarAGrasp = llamarAGrasp + ciclo
            }


            //MANTENER TIEMPO
            //-----------------------------------

            //-----------------------------------
            //OPERACIONES

            //Revisar envios

            //console.log(enviosRef.current)
            await revisaEnvios()
            await revisaPlanes() //Ver si inicia algun plan para colocarlo en el arreglo y mostrarlo en mapa


            const fin = performance.now();
            const tiempoEjecucion = fin - inicio;
            const tiempoEspera = Math.max(0, 200 - tiempoEjecucion);
            console.log("Tiempo Espera: ",tiempoEspera)
            //agregar un minuto simulado
            // Update fechaSim
            nF = await new Promise((resolve) => setTimeout(() => resolve(nF.add(1, 'm')), tiempoEspera));
            setFechaSim(nF);
            //console.log(nF)
            fechaSimRef.current = nF;

            //console.log(timeRef)
            i++;
        }
            */
    }

    //---------------------------------------------------------

    //console.log("envios2Ref en SimSemanal:",envios2Ref);

    const [activePanel, setActivePanel] = useState('');

    return (
        <>
            <Header title={"SIMULACION SEMANAL"} setActivePanel={setActivePanel} />
            <Grid container sx={{ height: 'calc(100vh - 64px)' }}>
                <Grid item xs={9}>
                    <Box sx={{ p: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                        <HoraActual></HoraActual>
                        <Typography> ZONA HORARIA: {dayjs().tz(zonaHorariaUsuario).format('Z')}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <SelectorFecha fechaSim={fechaSimRef.current} setFechaSim={setFechaSim} estadoSim={estadoSim} zonaHoraria={zonaHorariaUsuario}></SelectorFecha>
                        <BotonIniciar onClick={clickBotonIniciar} disabled={estadoSim == 'PL'}></BotonIniciar>
                        {estadoSim == 'FI' ? <Button onClick={obtenerpdf}>Reporte Final</Button> : <></>}
                        {/*<CuadroTiempo horas={horaCron} minutos={minutoCron} segundos={segundoCron} tiempo={time} ></CuadroTiempo>*/}
                    </Box>
                    <MapaSimulador aeropuertosBD={aeropuertos} planesDeVueloBD={pdvMapa} fechaSim={fechaSimRef.current} estadoSim={estadoSim} freqMov={freqMov} ingresarAeropuertos={ingresaAeropuertoPorPlan} />
                </Grid>
                <Grid item xs={3} sx={{ overflowY: 'auto', p: 2, borderLeft: '1px solid #ccc' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button variant="contained" onClick={() => setActivePanel('planes')}>Planes de Vuelo</Button>
                        <Button variant="contained" onClick={() => setActivePanel('aeropuertos')}>Aeropuertos</Button>
                        <Button variant="contained" onClick={() => setActivePanel('envios')}>Envíos</Button>
                    </Box>
                    {activePanel === 'planes' && <BusquedaPlanes active={activePanel === 'planes'} planesDeVueloRef={planesDeVueloRef} />}
                    {activePanel === 'aeropuertos' && <BusquedaAeropuertos active={activePanel === 'aeropuertos'} aeropuertos={aeropuertos} />}
                    {activePanel === 'envios' && <BusquedaEnvios active={activePanel === 'envios'} envios2Ref={envios2Ref} />}
                </Grid>
            </Grid>

        </>
    );
}
