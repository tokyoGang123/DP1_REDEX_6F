"use client"
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import "./RegistrarEnvio.css";
import { getAeropuertosTodos } from '@/app/api/aeropuetos.api';
import { postEnvioIndividualDiario } from '@/app/api/envios.api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import SelectorFecha from "../Elementos/SelectorFecha";
import 'dayjs/locale/es'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Box } from '@mui/material';

const transformaHora = (fecha) => {
    const formattedDate = fecha.format('YYYYMMDDTHH:mm:ss:Z');
    console.log(formattedDate)
    //const customFormattedDate = formattedDate.replace(/([-+]\d{2}):(\d{2})/, '$1:$2');
    return formattedDate;

}
dayjs.extend(utc);
dayjs.extend(timezone);
export default function RegistroEnvioComp() {

    const zonaHorariaUsuario = dayjs.tz.guess();
    const [datosEnvio, setDatosEnvio] = useState({
        aeropuertoOrigenCodigo: '',
        aeropuertoDestinoCodigo: '',
        cantidadPaquetes: ''
    });
    const [aeropuertos, setAeropuertos] = useState([]);

    const [fechaSim, setFechaSim] = useState(dayjs());

    const [isClient, setIsClient] = useState(false)

    /*useEffect(() => {
        const cargarAeropuertos = async () => {
            await getAeropuertosTodos()
        };
        cargarAeropuertos();
    }, []);*/

    useEffect(() => {
        console.log(fechaSim)
    }, [fechaSim])

    useEffect(() => {
        async function carga() {
            let a = await getAeropuertosTodos();
            setAeropuertos(a);
        }
        carga();
        //setFechaSim(dayjs('2024-07-22T05:45:00').tz(zonaHorariaUsuario));
    }, []);

    useEffect(() => {
        setIsClient(true);
        setFechaSim(dayjs('2024-07-22T05:45:00').tz(zonaHorariaUsuario));
    }, [zonaHorariaUsuario]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatosEnvio(prev => ({ ...prev, [name]: value }));
    };

    /*const handleSubmit = async (e) => {
        e.preventDefault();
        const { aeropuertoOrigenCodigo, aeropuertoDestinoCodigo, cantidadPaquetes } = datosEnvio;
        try {
            const response = await fetch(`http://localhost:8080/api/envios/insertarEnvio/${aeropuertoOrigenCodigo}/${aeropuertoDestinoCodigo}/${cantidadPaquetes}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            if (response.ok) {
                const result = await response.json();
                console.log('Envío registrado con éxito:', result);
            } else {
                throw new Error('Algo salió mal con la petición');
            }
        } catch (error) {
            console.error('Error al registrar el envío:', error);
        }
    };*/

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { aeropuertoOrigenCodigo, aeropuertoDestinoCodigo, cantidadPaquetes } = datosEnvio;
        let fechaReg = transformaHora(fechaSim)
        try {
            // Asegúrate de que los nombres de las propiedades coincidan con lo esperado por la función de la API.
            const res = await postEnvioIndividualDiario({
                codigoOrigen: aeropuertoOrigenCodigo,
                codigoDestino: aeropuertoDestinoCodigo,
                numPaq: cantidadPaquetes,
                fechaHora: fechaReg
            });
            console.log('Envío registrado con éxito:', res);
            //notifyEnvioReg1(res)
        } catch (error) {
            console.error('Error al registrar el envío:', error);
        }
    };

    if (!isClient) {
        return null; // Renderiza nada hasta que el cliente esté listo
    }


    return (
        <div>
            {/*<header className="header-proyecto">
                <h1>Realizar envío</h1>
                <h1>RedEx</h1>
            </header>*/}
            <main className="main-proyecto">
                <section className="section-proyecto">
                    <form onSubmit={handleSubmit}>
                        <h2>Introduzca información del envío</h2>
                        <div className="fila">
                            <div className="campo">
                                <label htmlFor="aeropuertoOrigenCodigo">Ciudad de origen:</label>
                                <select id="aeropuertoOrigenCodigo" name="aeropuertoOrigenCodigo" value={datosEnvio.aeropuertoOrigenCodigo} onChange={handleChange}>
                                    <option value="">Seleccione un aeropuertooo</option>
                                    {aeropuertos.map((aeropuerto) => (
                                        <option key={aeropuerto.id} value={aeropuerto.codigo}>{aeropuerto.ciudad}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="fila">
                            <div className="campo">
                                <label htmlFor="aeropuertoDestinoCodigo">Ciudad de destino:</label>
                                <select id="aeropuertoDestinoCodigo" name="aeropuertoDestinoCodigo" value={datosEnvio.aeropuertoDestinoCodigo} onChange={handleChange}>
                                    <option value="">Seleccione un aeropuerto</option>
                                    {aeropuertos.map((aeropuerto) => (
                                        <option key={aeropuerto.id} value={aeropuerto.codigo}>{aeropuerto.ciudad}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="fila">
                            <div className="campo">
                                <label htmlFor="cantidadPaquetes">Cantidad de paquetes:</label>
                                <input type="number" id="cantidadPaquetes" name="cantidadPaquetes" value={datosEnvio.cantidadPaquetes} onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            {isClient && (
                                <Box
                                    component="form"
                                    sx={{
                                        '& > :not(style)': { m: 1, width: '30ch' },
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
                                        <DemoContainer components={['DateTimePicker']}>
                                            <DateTimePicker
                                                label="Fecha de Simulación"
                                                value={fechaSim}
                                                onChange={(newFechaSim) => setFechaSim(newFechaSim.tz(zonaHorariaUsuario))}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Box>
                            )}
                        </div>
                        <div className="botones">
                            <Link href="/envios">
                                <button type="button" className="boton-regresar">Regresar</button>
                            </Link>
                            <button type="submit" className="boton-confirmar">Confirmar</button>
                        </div>

                    </form>
                </section>
            </main>
        </div>
    );
}


