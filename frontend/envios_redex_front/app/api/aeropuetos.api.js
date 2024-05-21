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