import axios from "axios";

const baseApi = axios.create({

    //Descomentar URL a usar y comentar URL que ya no vas a usar

    //URL PARA PRUEBAS LOCALES
    //baseURL: `http://localhost:8080/api/`
    //URL PARA EL HOSTEADO EN EL V
    baseURL: `http://inf226-982-6f.inf.pucp.edu.pe/api/`
    //URL HTTPS
    //baseURL: `https://inf226-982-6f.inf.pucp.edu.pe/api/`
})

export default baseApi;