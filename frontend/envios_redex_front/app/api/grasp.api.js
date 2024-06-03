import baseApi from "./mainAxios.api";

export const iniciaGRASP = async () => {
    try {
        let data = await baseApi.get('grasp/iniciar').then(({data}) => data)
        console.log(data)
        return data;
    } catch (error) {
        console.log('Error al buscar data:', error)
        return null;
    }
}

export const ejecutaGRASP = async (fechaHoraHuso) => {
    try {
        let data = await baseApi.get('grasp/ejecutar/' + fechaHoraHuso).then(({data}) => data)
        console.log(data)
        return data;
    } catch (error) {
        console.log('Error al buscar data:', error)
        return null;
    }
}