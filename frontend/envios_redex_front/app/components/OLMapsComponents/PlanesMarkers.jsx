import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";



const PlanesMarkers = ({planesDeVuelo, map, estadoSim, fechaSim}) => {

    //Fecha a ejecutar, será separada de la fecha cambainte del algoritmo principal
    const [fechaSimLocal, setFechaSimLocal] = useState(dayjs())
    const fechaSimLocalRef = useRef(fechaSimLocal)

    useEffect(() => {
        //Si no esta siendo ejecutado, asignar la fecha recibida 
        if (estadoSim != 'PL') {
            setFechaSimLocal(fechaSim)
        }
    },[fechaSim])


    
    useEffect(() => {
        if (estadoSim !== 'PL') return //Si la simulacion no esta iniciada, no mostrar

        //POR CADA PLAN DE VUELO
        planesDeVuelo.forEach((plan) => {
            const {hora_origen,hora_destino} = plan;
        })

    },[])

    return (
        <></>
    )
}

export default PlanesMarkers;