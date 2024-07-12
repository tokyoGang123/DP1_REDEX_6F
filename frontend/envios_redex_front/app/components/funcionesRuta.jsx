

import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'


const anguloInicial = 45

export const calculaAnguloRotacion = (la1,lo1,la2,lo2) => {
    const dy = la2 - la1
    const dx = lo2 - lo1
    const theta = Math.atan2(dy,dx)
    return theta * 180 / Math.PI
}

/*
export const calculaAnguloRotacion = (la1,lo1,la2,lo2) => {
    const aGrados = (radianes) => (radianes * 180) / Math.PI;
    const aRadianes = (grados) => (grados* Math.PI) / 180;

    const a1 = aRadianes(la1)
    const a2 = aRadianes(la2)
    const d1 = aRadianes(lo2 - lo1)

    const y = Math.sin(d1) * Math.cos(a2)
    const x = 
        Math.cos(a1) * Math.sin(a2) -
        Math.sin(a1) * Math.cos(a2) * Math.cos(d1);

    const theta = Math.atan2(y,x)

    let bearing = aGrados(theta)
    bearing = (bearing / 360) % 360

    return bearing + anguloInicial
}
*/

export default async function hallarPuntosIntermedios(la1, lo1, la2, lo2, planDeVuelo, tiempoSim, freqMov) {
    dayjs.extend(utc);
    dayjs.extend(timezone);

    const horaOrigen = dayjs(planDeVuelo.hora_origen);
    const horaDestino = dayjs(planDeVuelo.hora_destino);
    const tiempoSimuladoMinutos = horaDestino.diff(horaOrigen, 'minute');
    if (tiempoSimuladoMinutos < 0) {
        console.log(planDeVuelo.id_tramo,tiempoSimuladoMinutos)
        return [[la1, lo1]]

    }
    //console.log(planDeVuelo.hora_origen + " -> " + planDeVuelo.hora_destino)
    //console.log(tiempoSimuladoMinutos)
    const tiempoRealMs = tiempoSimuladoMinutos * tiempoSim; // Ajusta según tu rango 200-230 ms
    const steps = Math.ceil(tiempoRealMs / freqMov); // Ajusta el intervalo de actualización
    //PUEDE HABER CAMBIO DEL 1000 POR freqMov SI HAY PROBLEMAS: VERIFICAR
    //console.log(steps)

    const origen = [la1, lo1];
    const destino = [la2, lo2];

    const coordenadas = Array.from({ length: steps }, (_, step) => {
        const coord = [
            origen[0] + ((destino[0] - origen[0]) * step) / steps,
            origen[1] + ((destino[1] - origen[1]) * step) / steps,
        ];
        return coord
        //return transform(coord, 'EPSG:4326', 'EPSG:3857');
    });

    return coordenadas
}


export async function hallarPuntosIntermediosDiaria(la1, lo1, la2, lo2, planDeVuelo) {
    dayjs.extend(utc);
    dayjs.extend(timezone);

    const horaOrigen = dayjs(planDeVuelo.hora_origen);
    const horaDestino = dayjs(planDeVuelo.hora_destino);
    const tiempoVuelo = horaDestino.diff(horaOrigen, 'minute');
    if (tiempoVuelo < 0) return [[la1, lo1]]
    //console.log(planDeVuelo.hora_origen + " -> " + planDeVuelo.hora_destino)
    //console.log(tiempoSimuladoMinutos)
    //const tiempoRealMs = tiempoSimuladoMinutos * 215; // Ajusta según tu rango 200-230 ms
    const steps = Math.ceil(tiempoVuelo); // Ajusta el intervalo de actualización
    //console.log(steps)
    //console.log(steps)

    const origen = [la1, lo1];
    const destino = [la2, lo2];

    const coordenadas = Array.from({ length: steps }, (_, step) => {
        const coord = [
            origen[0] + ((destino[0] - origen[0]) * step) / steps,
            origen[1] + ((destino[1] - origen[1]) * step) / steps,
        ];
        return coord
        //return transform(coord, 'EPSG:4326', 'EPSG:3857');
    });

    return coordenadas
}

/*
async function hallarPuntosIntermedios(la1,lo1,la2,lo2) {
    const distanciaARecorrer = distanciaPuntos(la1,lo1,la2,lo2)
    let densidad = 1 * 60
    const numPuntos = Math.ceil(distanciaARecorrer/densidad);

    const puntos = [];
    for (let i = 0; i <= numPuntos; i++) {
        const factor = i/numPuntos
        const latitud = la1 + factor * (la2-la1)
        const longitud = lo1 + factor * (lo2-lo1)
        puntos.push({lat: latitud, lon: longitud}) 
    }
    return puntos;
}*/

function distanciaPuntos(la1, lo1, la2, lo2) {
    const radio = 6371;
    const lat = gradToRadian(la2 - la1)
    const lon = gradToRadian(lo2 - lo1)
    const factorA = Math.sin(lat / 2) * Math.sin(lat / 2) +
        Math.cos(gradToRadian(la1)) * Math.cos(gradToRadian(la2)) *
        Math.sin(lon / 2) * Math.sin(lon / 2)
    const factorC = 2 * Math.atan2(Math.sqrt(factorA), Math.sqrt(1 - factorA))
    const dist = radio * factorC;
    return dist;
}

function gradToRadian(grados) {
    return grados * Math.PI / 180;
}

