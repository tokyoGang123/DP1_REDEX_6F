import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { Icon, Style } from "ol/style";



const PlanesMarkers = ({ planesDeVuelo, map, estadoSim, fechaSim }) => {

    //ASIGNAR IMAGEN A UN AVION
    const getMarkerImage = (capOcu, capMax) => {
        let ocupacion = (capOcu / capMax) * 100
        if (capOcu == 0) return '/planes/plane_grey.svg'
        if (ocupacion <= 33.3) return '/planes/plane_green.svg'
        else if (ocupacion <= 66.6) return '/planes/plane_yellow.svg'
        else return '/planes/plane_red.svg'
    }


    //------------------------------------------------------------------------------
    //                             REFERENCIA A MAPA
    const [vectorSource, setVectorSource] = useState(null);
    useEffect(() => {
        const newVector = new VectorSource();
        setVectorSource(newVector);
        const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: (feature) => {
                return new Style({
                    image: new Icon({
                        anchor: [0.5, 1],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        src: getMarkerImage(feature.values_.capacidadOcupada, feature.values_.capacidadMaxima),
                    })
                })
            }
        })
        if (map.current) {
            map.current.addLayer(vectorLayer)
        }

        return () => {
            if (map.current) {
                map.current.removeLayer(vectorLayer);
            }
        }
    }, [map])


    //------------------------------------------------------------------------------
    //                          MOSTRAR ELEMENTOS DEL MAPA
    useEffect(() => {
        if (!vectorSource || estadoSim !== 'PL') return //Si la simulacion no esta iniciada, no mostrar

        //INTERPOLACION DE PUNTOS
        const interpolar = (point1, point2, factor) => ({
            lat: point1.lat + (point2.lat - point1.lat) * factor,
            lon: point1.lon + (point2.lon - point1.lon) * factor,
          });
        //vectorSource.clear(); //Limpiar

        //POR CADA PLAN DE VUELO
        planesDeVuelo.forEach((plan) => {
            const { hora_origen, hora_destino, listaCamino } = plan;
            const tiempoTransc = fechaSim.diff(dayjs(hora_origen), 'second') //Verificar si ya debe empezar a mostrar
            const duracion = dayjs(hora_destino).diff(dayjs(hora_origen), 'second') //Verificar el total de duración

            if (tiempoTransc >= 0 && tiempoTransc <= duracion) {
                //console.log("INICIO RECORRIDO")
                const factor = tiempoTransc / duracion
                const indiceInicio = Math.floor(factor * (listaCamino.length - 1))
                const indiceFin = indiceInicio + 1
                if (indiceFin >= listaCamino.length) {
                    return
                }
                
                const factorLocal = (factor * (listaCamino.length - 1)) % 1;
                const inicio = listaCamino[indiceInicio];
                const fin = listaCamino[indiceFin];
                //console.log(listaCamino)
                //console.log(inicio)
                //console.log(fin)
                const posicion = interpolar(inicio, fin, factorLocal);

                //console.log(posicion)
                //Crear el feature para colocar en el mapa
                const feature = new Feature({
                    geometry: new Point(fromLonLat([posicion.lon, posicion.lat])),
                })
                feature.setStyle(new Style({
                    image: new Icon({
                      anchor: [0.5, 1],
                      src: getMarkerImage(plan.capacidad_ocupada,plan.capacidad_maxima),
                    }),
                  }));
                //Colocar en capa
                vectorSource.addFeature(feature);
            }
        })

    }, [fechaSim, planesDeVuelo, vectorSource, estadoSim])
    //------------------------------------------------------------------------------
    return null
}

export default PlanesMarkers;

/*

   //------------------------------------------------------------------------------
   //Fecha que se utilizará para llevar el tiempo de aparicion de los planes
   //Se ejecuta por separado de fechaSim
   const [fechaSimLocal, setFechaSimLocal] = useState(dayjs())
   const fechaSimLocalRef = useRef(fechaSimLocal)

   useEffect(() => {
       setFechaSimLocal(fechaSim)
       fechaSimLocalRef.current = fechaSim
   }, [])

   useEffect(() => {
       //Si no esta siendo ejecutado, asignar la fecha recibida 
       if (estadoSim != 'PL') {
           setFechaSimLocal(fechaSim)
       }
       console.log("fechaSim",fechaSim)
   },[fechaSim])

   useEffect(() => {
       fechaSimLocalRef.current = fechaSimLocal
       console.log("fechasimlocal",fechaSimLocal)
   },[fechaSimLocal])
   

   //Inicializar contador que sólo se procesará dentro de este componente
   useEffect(() => {
       let interval
       if (estadoSim == 'PL') {
           interval = setInterval(() => {
               console.log("cambio",fechaSimLocal)
               //fechaSimLocalRef.current = fechaSimLocal.add(5,'m')
               setFechaSimLocal(prevFecha => dayjs(prevFecha).add(5,"m"));
               
           },1100)

           return () => clearInterval(interval)
       }
   },[estadoSim])
   
   */