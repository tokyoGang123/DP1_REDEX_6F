import baseApi from "./mainAxios.api";

export const getEnviosTodos = async (fecha) => {
    try {
        let data = await baseApi.get('envios/obtenerTodosFecha/' + fecha).then(({data}) => data)
        console.log(data)
        return data;
    } catch (error) {
        console.log('Error al buscar data:', error)
        return null;
    }
}

export const postEnviosArchivo = async (data) =>{
    try {
        //console.log("DATA",data)
        let res = await baseApi.post('envios/cargarArchivoEnvios',data)
        //console.log(res)
        return res
    } catch(error) {
        console.log("Error al insertar data")
        return null
    }
}

export const postEnvioIndividualDiario = async (codigoOrigen, codigoDestino, numPaq) => {
    try {
        console.log(codigoOrigen, codigoDestino, numPaq)
        let data = await baseApi.post('envios/insertarEnvio/' + codigoOrigen + "/" + codigoDestino + "/" + numPaq).then(({data}) => data)
        console.log(data)
        return data;
    } catch (error) {
        console.log('Error al buscar data:', error)
        return null;
    }

}