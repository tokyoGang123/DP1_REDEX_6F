import baseApi from "./mainAxios.api";

export const getPlanesTodos = async () => {
    try {
        let data = await baseApi.get('planesVuelo/obtenerTodos').then(({data}) => data)
        console.log(data)
        return data;
    } catch (error) {
        console.log('Error al buscar data:', error)
        return null;
    }
}

export const cargarPlanesFecha = async (fecha) => {
    try {
        baseApi.post('planesVuelo/cargarArchivoPlanes/' + fecha).then(({data}) => data)
        console.log(data)
        return data;
    } catch (error) {
        console.log('Error al buscar data:', error)
        return null;
    }

}

export const getPlanesPorIntervalo = async (fechaI,fechaF) => {
    try {
        let data = await baseApi.get('planesVuelo/obtenerPorFechas/' + fechaI + "/" + fechaF).then(({data}) => data)
        console.log(data)
        return data;
    } catch (error) {
        console.log('Error al buscar data:', error)
        return null;
    }
}

export const getPlanesPorIntervaloLatLon = async (fechaI, fechaF) => {
    try {
        let data = await baseApi.get('planesVuelo/obtenerPorFechasConLatitudLongitud/' + fechaI + "/" + fechaF).then(({data}) => data)
        console.log(data)
        return data;
    } catch (error) {
        console.log('Error al buscar data:', error)
        return null;
    }
}