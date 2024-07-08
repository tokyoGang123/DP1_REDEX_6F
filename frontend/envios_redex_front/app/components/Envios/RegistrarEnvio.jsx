"use client"
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import "./RegistrarEnvio.css";
import { getAeropuertosTodos } from "@/app/api/aeropuetos.api";

export default function RegistroEnvio() {
    const [datosEnvio, setDatosEnvio] = useState({
        aeropuertoOrigenCodigo: '',
        aeropuertoDestinoCodigo: '',
        cantidadPaquetes: ''
    });
    const [aeropuertos, setAeropuertos] = useState([]);

    useEffect(() => {
        const cargarAeropuertos = async () => {
            await getAeropuertosTodos()
        };
        cargarAeropuertos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatosEnvio(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
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
    };

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
                                    <option value="">Seleccione un aeropuerto</option>
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


