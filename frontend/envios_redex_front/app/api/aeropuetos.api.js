import baseApi from "./mainAxios.api";

export const getAeropuertosTodos = async () => {
    try {
        let data = await baseApi.get('aeropuertos/obtenerTodos').then(({data}) => data)
        return data;
    } catch (error) {
        console.log('Error al buscar data:', error)
        return null;
    }
}

export const postAeropuertosArchivo = async (data) => {
    try {
        //console.log("DATA",data)
        let res = await baseApi.post('aeropuertos/lecturaArchivo',data)
        //console.log(res)
        return res
    } catch(error) {
        console.log("Error al insertar data")
        return null
    }
}

