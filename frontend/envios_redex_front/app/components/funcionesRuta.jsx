
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
}

function distanciaPuntos(la1,lo1,la2,lo2) {
    const radio = 6371;
    const lat = gradToRadian(la2-la1)
    const lon = gradToRadian(lo2-lo1)
    const factorA = Math.sin(lat / 2) * Math.sin(lat / 2) +
    Math.cos(gradToRadian(la1)) * Math.cos(gradToRadian(la2)) *
    Math.sin(lon / 2) * Math.sin(lon / 2)
    const factorC = 2* Math.atan2(Math.sqrt(factorA), Math.sqrt(1 - factorA))
    const dist = radio * factorC;
    return dist;
}

function gradToRadian(grados) {
    return grados * Math.PI / 180;
}

export default hallarPuntosIntermedios;