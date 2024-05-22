import React from "react";
import Link from 'next/link';
import "./RegistrarEnvio.css";

export default function RegistroEnvio() {
    return (
        <div>
            <header className="header-proyecto">
                <h1>Realizar envío</h1>
								<h1>RedEx</h1>
            </header>

            <main className="main-proyecto">
                <section className="section-proyecto">
                    <form>
												<h2>Introduzca información del envío</h2>
                        <div className="fila">
													<div className="campo">
														<label htmlFor="ciudadOrigen">Ciudad de origen:</label>
                            <input type="text" id="ciudadOrigen" name="ciudadOrigen" />
													</div>
													<div className="campo">
														<label htmlFor="fechaHoraOrigen">Fecha y hora de la ciudad de origen:</label>
                            <input type="datetime-local" id="fechaHoraOrigen" name="fechaHoraOrigen" />
													</div>
													<div className="campo">
														<label htmlFor="ciudadDestino">Ciudad de destino:</label>
                            <input type="text" id="ciudadDestino" name="ciudadDestino" />
													</div>
                        </div>
												<div className="fila">
													<div className="campo">
														<label htmlFor="cantidadPaquetes">Cantidad de paquetes:</label>
                            <input type="number" id="cantidadPaquetes" name="cantidadPaquetes" />
													</div>
													<div className="campo">
														<label htmlFor="nombreCliente">Nombre del cliente:</label>
                            <input type="text" id="nombreCliente" name="nombreCliente" />
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
