import MapaSimulador from "../MapaSimulador"
import SelectorFecha from "../Elementos/SelectorFecha"
import { CuadroTiempo } from "../Elementos/CuadroTiempo"
import { Stack, Grid, Box, Button } from "@mui/material"
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
import { postEnvioIndividualDiario } from "@/app/api/envios.api"
import RegistroEnvio from "../Envios/RegistrarEnvio";
import { getEnviosTodos, postEnviosArchivo } from '@/app/api/envios.api';
import UploadFileIcon from '@mui/icons-material/UploadFile';

dayjs.extend(advancedFormat);

const transformaHora = (fecha) => {
    const formattedDate = fecha.format('YYYYMMDDTHH:mm:Z');
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
    const [fechaSim, setFechaSim] = useState(dayjs().tz(zonaHorariaUsuario));
    //const [fechaSim, setFechaSim] = useState(dayjs("2024-05-30T00:00:00Z").tz(zonaHorariaUsuario));
    //const [fechaSim, setFechaSim] = useState(dayjs("2024-05-30T22:02:00Z").tz(zonaHorariaUsuario));
    //useRef de fechaSim
    const fechaSimRef = useRef(fechaSim)

    //FECHA INICIO DE LA SIMULACION
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
    const [estadoSim, setEstadoSim] = useState('PL'); //NI (No Iniciado), PL (En ejecucion), PS (en pausa)

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

    //Envios
    const [envios, setEnvios] = useState([])
    const enviosRef = useRef(envios)
    useEffect(() => {
        enviosRef.current = envios;
    }, [envios])

    const envios2Ref = useRef([]);

    const [enviosFuturo, setEnviosFuturo] = useState([])
    const enviosFuturoRef = useRef(enviosFuturo)
    useEffect(() => {
        enviosFuturoRef.current = enviosFuturo;
    }, [enviosFuturo])
    //Paquetes
    const [paquetes, setPaquetes] = useState({})

    //Ref para montura inicial
    const isInitialMount = useRef(TryOutlined)

    //Tiempo hasta llamada de datos nueva
    const tiempoLlamaGRASP = 30; //30 seg?

    const freqMov = 60000 // 1 minuto (real)

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
            console.log(a)

            fechaStartRef.current = fechaSimRef.current; //fecha inicial
            await iniciaGRASP()
            await iniciaDatos()
            await setEstadoSim('PL')
            ejecucionSimulacion()
        }
        if (isInitialMount.current) obtenerDatos()
    }, [])

    /*

    //          FUNCIONES PDF

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

    */

    //---------------------------------------------------------
    //                      FUNCIONES
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
        console.log("PLANES DE: " + planInicio + " - " + planFin)
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
                let ruta = await hallarPuntosIntermedios(pdv.latitud_origen, pdv.longitud_origen, pdv.latitud_destino, pdv.longitud_destino, pdv,60000, freqMov);
                return { ...pdv, listaPaquetes: [], ruta: ruta };
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
            console.log(pc.id_tramo)
            if (dayjs(pc.hora_origen).tz(zonaHorariaUsuario) > fechaSimRef.current) break;
            if (pdvMapa.some(plan => plan.id_tramo == pc.id_tramo)) continue; //Si existe ya en el mapa, ignorar
            console.log("PLAN " + pc.id_tramo + " CONFIRMADO")
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
        if (p) {
            p.sort((a, b) => {
                let fechaA = new Date(a.zonedFechaIngreso);
                let fechaB = new Date(b.zonedFechaIngreso);
                return fechaA - fechaB;
            })
            setEnviosFuturo([...p])
        }
        else console.log("No hay envios programados en este bloque")
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
                let ruta = await hallarPuntosIntermedios(pdv.latitud_origen, pdv.longitud_origen, pdv.latitud_destino, pdv.longitud_destino, pdv, 60000, freqMov);
                return { ...pdv, listaPaquetes: [], ruta: ruta };
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

    //Añadir a aeropuerto de origen cuando un envio llega al aeropuerto deseado (desde que el cliente lo deja)
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

            if (index != -1) {
                aeropuertosActualizados[index].listaPaquetes = [
                    ...aeropuertosActualizados[index].listaPaquetes,
                    ...planDeVuelo.listaPaquetes
                ]
            }
            //console.log("Agregados ", planDeVuelo.listaPaquetes.length)

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

    //insertar envio generico (de pruebas)

    const insertaEnvioGenerico = async () => {
        let codigoOrigen = 'SKBO'
        let codigoDestino = 'SEQM'
        let numPaquetes = 10

        let res = await postEnvioIndividualDiario(codigoOrigen,codigoDestino,numPaquetes)
        if (res) console.log("ENVIO REGISTRADO A LAS + ", fechaSim)
        else console.log("ERROR EN EL ENVIO A LAS " + fechaSim.tz(zonaHorariaUsuario).toISOString())
    }


    //---------------------------------------------------------
    //                      CUERPO SIMULACION
    const ejecucionSimulacion = async () => {
        let i = 0;
        let ciclo = 45;
        let currentCiclo = 45
        let llamarAGrasp = 10;
        let nF = fechaSimRef.current;
        let fechaLlam = fechaStartRef.current //Fecha para llamar grasp
        let fechaLlamPlan = fechaStartRef.current.add(2, 'd').add(2, 'h') // 2 días + 2 horas ya se tienen leidos, se procedera a llamar bloques posteriores de 2 horas
        //console.log("LLAMADA INICIO: " + fechaLlam)
        

        setInterval(async () => {
            const inicio = performance.now();

            //Llamar a GRASP para planificar pedidos ingresados
            if (i == llamarAGrasp) {
                fechaLlam = fechaLlam.add(ciclo, 's')
                //obtenerNuevosEnvios(fechaLlam,ciclo)
                llamarAGrasp = llamarAGrasp + ciclo
            }
            //Asignar pedidos
            if (i == currentCiclo - 1) {
                enviosRef.current = enviosRef.current.concat(enviosFuturoRef.current)
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
                    <Box sx={{ p: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                        {/*<CuadroTiempo horas={horaCron} minutos={minutoCron} segundos={segundoCron} tiempo={time} ></CuadroTiempo>*/}
                        <h1>FECHA ACTUAL: {fechaSim.format('YYYY-MM-DD HH:mm:ss [GMT]Z')}</h1>
                        {/*<Button onClick={insertaEnvioGenerico}>INSERTA ENVIO PRUEBA</Button>*/}
                        {/*<Button onClick={obtenerpdf}>DESCARGAR PDF</Button>*/}
                    </Box>
                    <MapaSimulador aeropuertosBD={aeropuertos} planesDeVueloBD={pdvMapa} fechaSim={fechaSimRef.current} estadoSim={estadoSim} freqMov={freqMov} ingresarAeropuertos={ingresaAeropuertoPorPlan}/>
                </Grid>
                {panelVisible && (
                    <Grid item xs={3} sx={{ overflowY: 'auto', height: 'calc(100vh - 64px)',p: 2, borderLeft: '1px solid #ccc' }}>
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
                        {activePanel === 'planes' && <BusquedaPlanes active={activePanel === 'planes'} planesDeVueloRef={planesDeVueloRef} />}
                        {activePanel === 'aeropuertos' && <BusquedaAeropuertos active={activePanel === 'aeropuertos'} aeropuertos={aeropuertos} />}
                        {activePanel === 'envios' && <BusquedaEnvios active={activePanel === 'envios'} envios2Ref={envios2Ref} />}
                        {activePanel === 'registrar_envio' && <RegistroEnvio active={activePanel === 'registrar_envio'} />}
                    </Grid>
                )}
            </Grid>

        </>
    );
}
