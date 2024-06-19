import baseApi from "./mainAxios.api";

export const getPDFFinal = async () => {
    try {
        let data = await baseApi.get('PDF/generar',{responseType: 'blob'}).then(({data}) => data)
        console.log(data)
        return data;
    } catch (error) {
        console.log('Error al buscar data:', error)
        return null;
    }
}
