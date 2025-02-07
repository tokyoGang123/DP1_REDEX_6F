import MapaSimulador from "../MapaSimulador"
import SelectorFecha from "../Elementos/SelectorFecha"
import { CuadroTiempo } from "../Elementos/CuadroTiempo"
import { Stack, Grid, Box, Button, Typography, Card, CardContent, IconButton } from "@mui/material"
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
import { ejecutaGRASP, ejecutaGRASPDiaria, iniciaGRASP, iniciaGRASPDiaria } from "@/app/api/grasp.api"
import { hallarPuntosIntermediosDiaria } from "../funcionesRuta"
import BusquedaPlanes from '../BusquedaPlanes/BusquedaPlanes';
import BusquedaAeropuertos from '../BusquedaAeropuertos/BusquedaAeropuertos';
import BusquedaEnvios from '../BusquedaEnvios/BusquedaEnvios';
import { getPDFFinal } from "@/app/api/pdf.api"
import HoraActual from "../horaActualSem/HoraActual"
import SaturacionAeropuertos from "../Elementos/SaturacionAeropuertos"
import RouteIcon from '@mui/icons-material/Route';
import SaturacionPlanes from "../Elementos/SaturacionPlanes"
import CapacidadesAeropuertos from "../Elementos/CapacidadesAeropuerto"
import CapacidadesPlanes from "../Elementos/CapacidadesPlanes"
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import { postEnvioIndividualDiario } from "@/app/api/envios.api"
import { getEnviosTodos, postEnviosArchivo } from '@/app/api/envios.api';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import RegistroEnvio from "../Envios/RegistrarEnvio"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

const transformaHoraS = (fecha) => {
    const formattedDate = fecha.format('YYYYMMDDTHH:mm:ss:Z');
    //const customFormattedDate = formattedDate.replace(/([-+]\d{2}):(\d{2})/, '$1:$2');
    return formattedDate;

}

export default function OperacionesDiarias() {

    dayjs.extend(utc);
    dayjs.extend(timezone);


    //---------------------------------------------------------
    //                      VARIABLES

    //ZONA HORARIA ACTUAL
    const zonaHorariaUsuario = dayjs.tz.guess();

    //TIEMPO SELECCIONADO PARA EJECUTAR LA SIMULACION
    const [fechaSim, setFechaSim] = useState(dayjs('2024-07-22T05:45:00').tz(zonaHorariaUsuario));
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
    const [aeropuertos, setAeropuertos] = useState([]);
    const [aeropList, setAeropList] = useState([])

    //Planes de Vuelo
    const [planesDeVuelo, setPlanesDeVuelo] = useState([])
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
    const [envios, setEnvios] = useState([])
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
    const tiempoLlamaGRASP = 30;

    //Frecuencia de movimiento de aviones
    const freqMov = 60000; //1 segundo

    //Mapa
    const [muestraLineas, setMuestraLineas] = useState(false)
    const toggleLineas = () => {
        setMuestraLineas(!muestraLineas)
    }

    //MEDIDOR DE SATURACION - AEROPUERTOS
    const [contadorAeropuerto, setContadorAeropuerto] = useState({ rojo: 0, amarillo: 0, verde: 0 })



    useEffect(() => {
        const contad = { rojo: 0, amarillo: 0, verde: 0 }
        aeropuertos.forEach(aeropuerto => {
            const ocup = aeropuerto.capacidad_ocupada * 100 / aeropuerto.capacidad_maxima
            if (ocup <= 33.3) contad.verde += 1;
            else if (ocup <= 66.6) contad.amarillo += 1;
            else contad.rojo += 1;
        })
        setContadorAeropuerto(contad)
        //console.log(contad)
    }, [aeropuertos])

    //MEDIDOR DE SATURACION - PLANES DE VUELO
    const [contadorPlanes, setContadorPlanes] = useState({ gris: 0, rojo: 0, amarillo: 0, verde: 0 })

    //TEST
    const [pdvSaturacion, setPdvSaturacion] = useState([])

    //TEST
    useEffect(() => {
        const contad = { gris: 0, rojo: 0, amarillo: 0, verde: 0 }
        pdvSaturacion.forEach(plan => {
            const ocup = plan.capacidad_ocupada * 100 / plan.capacidad_maxima
            if (plan.capacidad_ocupada == 0) contad.gris += 1
            else if (ocup <= 33.3) contad.verde += 1;
            else if (ocup <= 66.6) contad.amarillo += 1;
            else contad.rojo += 1;
        })
        setContadorPlanes(contad)
        //console.log("PLAN SAT", contad)
    }, [pdvSaturacion])

    const [showGris, setShowGris] = useState(true)

    const changeGrises = () => {
        setShowGris(!showGris)
    }


    //---------------------------------------------------------
    //                      USE EFFECTS E INTERVALS

    let abus = []

    useEffect(() => {
        //Obtener datos iniciales
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
            await setAeropList(a)
            console.log(a)
            abus = a
            fechaStartRef.current = fechaSimRef.current; //fecha inicial

            let fechaI = transformaHora(fechaStartRef.current)
            await iniciaGRASPDiaria(fechaI)
            await iniciaDatos() //obtener planes
            await setEstadoSim('PL')
            ejecucionSimulacion()
        }
        if (isInitialMount.current) obtenerDatos()
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
        let planFin = transformaHora(fechaSimRef.current.add(8, "d").add(2, "h"))

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
                let ruta = await hallarPuntosIntermediosDiaria(pdv.latitud_origen, pdv.longitud_origen, pdv.latitud_destino, pdv.longitud_destino, pdv, intervaloMS, 60000);
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

        /*
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
    */
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
                if (j == listRut.length - 1) pdv.paquetesEnDestino.push(paq.id_paquete)
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
            //console.log(pc)
            newPlanes.push(pc)
            if (pc.capacidad_ocupada > 0) await saleAeropuertoPorPlan(pc)
            planesEliminarRef.current.splice(i, 1)
        }
        //console.log(newPlanes)
        setPdvMapa(newPlanes)
    }

    const obtenerNuevosEnvios = async (fechaLlam) => {
        let tiempoEnviado = transformaHoraS(fechaLlam);
        let p = await ejecutaGRASPDiaria(tiempoEnviado);
        p.sort((a, b) => {
            let fechaA = new Date(a.zonedFechaIngreso);
            let fechaB = new Date(b.zonedFechaIngreso);
            return fechaA - fechaB;
        })
        if (p) console.log("NUEVOS LEIDO", p)
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
                let ruta = await hallarPuntosIntermediosDiaria(pdv.latitud_origen, pdv.longitud_origen, pdv.latitud_destino, pdv.longitud_destino, intervaloMS, freqMov);
                return { ...pdv, listaPaquetes: [], ruta: ruta, paquetesEnDestino: [] };
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
                const aeropuerto = aeropuertosActualizados[index];
                console.log(aeropuertosActualizados[index])
                const listaPaquetesActualizada = [
                    ...(aeropuerto.listaPaquetes || []), // Inicializar si undefined
                    ...envio.paquetes
                ];


                aeropuertosActualizados[index] = {
                    ...aeropuerto,
                    listaPaquetes: listaPaquetesActualizada,
                    capacidad_ocupada: aeropuerto.capacidad_ocupada + envio.paquetes.length
                }
            }

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

            //console.log("ANTES: ", planDeVuelo.listaPaquetes)
            //console.log(planDeVuelo.paquetesEnDestino)
            let plan = planDeVuelo.listaPaquetes.filter(item => !planDeVuelo.paquetesEnDestino.includes(item))
            //console.log("DESPUES    : ", planDeVuelo.listaPaquetes)

            if (index != -1) {
                aeropuertosActualizados[index] = {
                    ...aeropuertosActualizados[index],
                    listaPaquetes: aeropuertosActualizados[index].listaPaquetes = [
                        ...aeropuertosActualizados[index].listaPaquetes,
                        ...plan
                    ],
                    capacidad_ocupada: aeropuertosActualizados[index].capacidad_ocupada + plan.length
                }
            }

            return aeropuertosActualizados;


        })

    }



    //Quitar de aeropuertos los planes que llegan de un plan
    const saleAeropuertoPorPlan = (planDeVuelo) => {
        setAeropuertos((prevAeropuertos) => {
            // Copia de seguridad
            const aeropuertosActualizados = [...prevAeropuertos];
    
            // Encontrar aeropuerto del que salen todos los paquetes
            const index = aeropuertosActualizados.findIndex(
                (aeropuerto) => aeropuerto.id_aeropuerto === planDeVuelo.ciudad_origen
            );
    
            if (index !== -1) {
                aeropuertosActualizados[index] = {
                    ...aeropuertosActualizados[index],
                    listaPaquetes: aeropuertosActualizados[index].listaPaquetes.filter(
                        (paquete) => !planDeVuelo.listaPaquetes.includes(paquete)
                    ),
                    capacidad_ocupada: aeropuertosActualizados[index].capacidad_ocupada - planDeVuelo.listaPaquetes.length
                };
            }
            console.log("act luego de salida: ",aeropuertosActualizados)
            return aeropuertosActualizados;
        });
    };

    function generaMensajeObjetos(respuesta) {
        let texto = `ENVIOS RECIBIDOS <br />`
        respuesta.forEach(res => {
            //console.log(abus)
            //console.log(res)
            let aor = abus.find(item => item.id_aeropuerto === res.aeropuerto_origen).ciudad
            let ade = abus.find(item => item.id_aeropuerto === res.aeropuerto_destino).ciudad
            texto += `ID: ${res.id_envio} || ${aor} -> ${ade} || Paquetes: ${res.numPaquetes}<br />`
            //texto += " " + res.id_envio + "\n"
        })
        return texto
    }

    function generaMensajeReg1(respuesta, aerpo) {
        let texto = `SE HA REGISTRADO LO SIGUIENTE: <br />`
        console.log(aerpo)
        let aor = aerpo.find(item => item.id_aeropuerto === respuesta.aeropuerto_origen).ciudad
        let ade = aerpo.find(item => item.id_aeropuerto === respuesta.aeropuerto_destino).ciudad
        texto += `ID: ${respuesta.id_envio} || ${aor} -> ${ade} || Paquetes: ${respuesta.numPaquetes}<br />`
        return texto
    }

    function generaMensajeRegArch(respuesta) {
        let texto = `SE HA REGISTRADO LO SIGUIENTE: <br />`

        respuesta.forEach(res => {
            //console.log(abus)
            //console.log(res)
            let aor = abus.find(item => item.id_aeropuerto === res.aeropuerto_origen).ciudad
            let ade = abus.find(item => item.id_aeropuerto === res.aeropuerto_destino).ciudad
            texto += `ID: ${res.id_envio} || ${aor} -> ${ade} || Paquetes: ${res.numPaquetes}<br />`
            //texto += " " + res.id_envio + "\n"
        })
        return texto
    }

    const notifyObtenidos = (respuesta) => {
        if (respuesta.length == 0) {
            toast("No se recibieron envios", {
                position: "bottom-right",
                theme: "dark"
            })
        } else {
            let mensaje = generaMensajeObjetos(respuesta)
            console.log(mensaje)
            toast.success(<div dangerouslySetInnerHTML={{ __html: mensaje }} />, {
                position: "bottom-right",
                theme: "dark"
            })
        }
    }

    const notifyEnvioReg1 = (respuesta, aerpo) => {
        if (respuesta != []) {
            let mensaje = generaMensajeReg1(respuesta, aerpo)
            console.log(mensaje)
            toast.success(<div dangerouslySetInnerHTML={{ __html: mensaje }} />, {
                position: "bottom-right",
                theme: "dark"
            })
        } else {
            toast("Revisar envio", {
                position: "bottom-right",
                theme: "dark"
            })
        }
    }

    const notifyEnvioRegArch = (respuesta) => {
        if (respuesta != []) {
            let mensaje = generaMensajeRegArch(respuesta)
            console.log(mensaje)
            toast.success(<div dangerouslySetInnerHTML={{ __html: mensaje }} />, {
                position: "bottom-right",
                theme: "dark"
            })
        } else {
            toast("Revisar envios", {
                position: "bottom-right",
                theme: "dark"
            })
        }
    }


    //---------------------------------------------------------
    //                      CUERPO SIMULACION
    const ejecucionSimulacion = async () => {
        let i = 0;
        let ciclo = 30;
        let currentCiclo = 30
        let llamarAGrasp = 1;
        let nF = fechaSimRef.current;
        let fechaLlam = fechaStartRef.current //Fecha para llamar grasp
        let fechaLlamPlan = fechaStartRef.current.add(2, 'd').add(2, 'h') // 2 días + 2 horas ya se tienen leidos, se procedera a llamar bloques posteriores de 2 horas
        //console.log("LLAMADA INICIO: " + fechaLlam)


        setInterval(async () => {
            const inicio = performance.now();

            //Llamar a GRASP para planificar pedidos ingresados
            if (i == llamarAGrasp) {
                fechaLlam = fechaLlam.add(ciclo, 's')
                obtenerNuevosEnvios(fechaLlam, ciclo)
                llamarAGrasp = llamarAGrasp + ciclo
            }
            //Asignar pedidos
            if (i == currentCiclo - 1) {
                if (enviosFuturoRef.current.length > 0) enviosRef.current = enviosRef.current.concat(enviosFuturoRef.current)
                let mostrar = [...enviosFuturoRef.current]
                notifyObtenidos(mostrar)
                //planesDeVueloRef.current = planesDeVueloRef.current.concat([...planesDeVueloFuturoRef.current])
                //planesEliminarRef.current = planesEliminarRef.current.concat([...planesDeVueloFuturoRef.current])
                currentCiclo = currentCiclo + ciclo
            }

            //-----------------------------------
            //OPERACIONES

            //Revisar envios

            //console.log(enviosRef.current)
            await revisaEnvios()
            await revisaPlanes() //Ver si inicia algun plan para colocarlo en el arreglo y mostrarlo en mapa
            console.log(fechaSimRef.current)
            const fin = performance.now();
            const tiempoEjecucion = fin - inicio;
            const tiempoEspera = Math.max(0, 1000 - tiempoEjecucion);

            setTimeout(() => {
                setFechaSim(nF.add(1, 's'));
                fechaSimRef.current = nF;
            }, tiempoEspera);

            nF = nF.add(1, 's');
            fechaSimRef.current = nF;

            i++;
        }, 1000);


    }

    //---------------------------------------------------------

    //console.log("envios2Ref en SimSemanal:",envios2Ref);

    const [activePanel, setActivePanel] = useState('');
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        handleFileUpload(event.target.files[0]);
    };

    const handleFileUpload = async (file) => {
        if (!file) {
            alert('Por favor, seleccione un archivo primero.');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target.result;
            const cleanText = await changeText(text);
            const jsonData = await formatJSON(cleanText);

            console.log('JSON a enviar:', jsonData);

            async function sube() {
                let res = await postEnviosArchivo(jsonData);
                console.log(res);
                //notifyEnvioRegArch(res)
            }
            sube();
        };

        reader.readAsText(file);
    };

    async function changeText(texto) {
        const textoApropiado = texto.replace(/\r/g, '');
        return textoApropiado;
    }

    async function formatJSON(text) {
        const json = {
            data: text
        };
        return json;
    }


    const [panelVisible, setPanelVisible] = useState(true);

    const togglePanel = () => {
        setPanelVisible(!panelVisible);
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));  // Forza el redimensionamiento del mapa
        }, 300);  // Alineado con la duración de cualquier animación de CSS
    };


    return (
        <>
            <Header title={"OPERACIONES DIARIAS"} togglePanel={togglePanel} />
            <Grid container sx={{ height: 'calc(100vh - 64px)' }}>
                <Grid item xs={panelVisible ? 9 : 12}>
                    <Grid sx={{ py: 1, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
                        <Grid>
                            <Box sx={{ px: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                                <Typography>
                                    {fechaSimRef.current.format('DD/MM/YYYY HH:mm:ss')}
                                </Typography>
                                <Typography> ZONA HORARIA: {dayjs().tz(zonaHorariaUsuario).format('Z')}</Typography>
                            </Box>
                            <Box sx={{ px: 1, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <IconButton onClick={changeGrises}><AirplanemodeActiveIcon /></IconButton>
                                <IconButton onClick={toggleLineas}><RouteIcon /></IconButton>
                                {estadoSim == 'FI' ? <Button onClick={obtenerpdf}>Reporte Final</Button> : <></>}

                            </Box>
                        </Grid>
                        <Grid>
                            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                                    <SaturacionPlanes contadorPlanes={contadorPlanes}></SaturacionPlanes>
                                    <SaturacionAeropuertos contadorAeropuerto={contadorAeropuerto}></SaturacionAeropuertos>
                                </Box>
                                <CapacidadesAeropuertos aeropuertos={aeropuertos}></CapacidadesAeropuertos>
                                <CapacidadesPlanes planes={pdvSaturacion}></CapacidadesPlanes>
                                {/**/}
                            </Box>
                        </Grid>
                    </Grid>
                    <MapaSimulador aeropuertosBD={aeropuertos} planesDeVueloBD={pdvMapa} fechaSim={fechaSimRef.current} estadoSim={estadoSim} freqMov={freqMov} ingresarAeropuertos={ingresaAeropuertoPorPlan} muestraLineas={muestraLineas} setSaturacion={setPdvSaturacion} showGris={showGris} />
                </Grid>
                {panelVisible && (
                    <Grid item xs={3} sx={{ overflowY: 'auto', height: 'calc(100vh - 64px)', p: 2, borderLeft: '1px solid #ccc' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button variant="contained" onClick={() => setActivePanel('planes')}>Planes de Vuelo</Button>
                            <Button variant="contained" onClick={() => setActivePanel('aeropuertos')}>Aeropuertos</Button>
                            <Button variant="contained" onClick={() => setActivePanel('envios')}>Envíos</Button>
                            <Button variant="contained" onClick={() => setActivePanel('registrar_envio')}>Registrar envío</Button>
                            <input
                                type="file"
                                accept=".txt"
                                id="upload-file"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <label htmlFor="upload-file">
                                <Button
                                    variant="contained"
                                    component="span"
                                    color="primary"
                                    startIcon={<UploadFileIcon />}
                                    className="button-right"
                                    fullWidth
                                >
                                    + Cargar envíos
                                </Button>
                            </label>
                        </Box>
                        {activePanel === 'planes' && <BusquedaPlanes active={activePanel === 'planes'} planesDeVueloRef={planesDeVueloRef} aeropuertos={aeropList} envios2Ref={envios2Ref} />}
                        {activePanel === 'aeropuertos' && <BusquedaAeropuertos active={activePanel === 'aeropuertos'} aeropuertos={aeropuertos} />}
                        {activePanel === 'envios' && <BusquedaEnvios active={activePanel === 'envios'} envios2Ref={envios2Ref} planesDeVueloRef={planesDeVueloRef} aeropuertos={aeropList} />}
                        {activePanel === 'registrar_envio' && <RegistroEnvio active={activePanel === 'registrar_envio'} fechaSim={fechaSimRef} notifyEnvioReg1={notifyEnvioReg1}></RegistroEnvio>}
                    </Grid>
                )}
            </Grid>
            <ToastContainer></ToastContainer>
        </>
    );
}
