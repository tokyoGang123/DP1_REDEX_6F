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
        console.log("LLAMADA DESDE " + fechaHoraHuso + " +2 horas")
        console.log("OBTENIDO GRASP")
        console.log(data)
        return data;
    } catch (error) {
        console.log('Error al buscar data:', error)
        return null;
    }
}

export const iniciaGRASPDiaria = async (fechaHora) => {
    try {
        let data = await baseApi.get('grasp/iniciarDiaria/' + fechaHora).then(({data}) => data)
        console.log(data)
        return data;
    } catch (error) {
        console.log('Error al buscar data:', error)
        return null;
    }
}

export const ejecutaGRASPDiaria = async () => {
    try {
        let data = await baseApi.get('grasp/ejecutarDiaria').then(({data}) => data)
        console.log("OBTENIDO GRASP DIARIA: ",data)
        return data;
    } catch (error) {
        console.log('Error al buscar data:', error)
        return null;
    }
}