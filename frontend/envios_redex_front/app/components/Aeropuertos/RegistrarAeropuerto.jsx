import React from "react";
import Link from 'next/link';
import "../Envios/RegistrarEnvio.css";

export default function RegistroAeropuerto() {
    return (
        <div>
            <header className="header-proyecto">
                <h1>Registrar Aeropuerto</h1>
								<h1>RedEx</h1>
            </header>

            <main className="main-proyecto">
                <section className="section-proyecto">
                    <form>
												<h2>Introduzca información del envío</h2>
                        <div className="fila">
													<div className="campo">
														<label htmlFor="codigo">Código:</label>
                            <input type="text" id="codigo" name="codigo" />
													</div>
													<div className="campo">
														<label htmlFor="ciudad">Ciudad:</label>
                            <input type="text" id="ciudad" name="ciudad" />
													</div>
													<div className="campo">
														<label htmlFor="pais">País:</label>
                            <input type="text" id="pais" name="pais" />
													</div>
                        </div>
												<div className="fila">
													<div className="campo">
														<label htmlFor="continente">Continente:</label>
                            <input type="text" id="continente" name="continente" />
													</div>
													<div className="campo">
														<label htmlFor="paquetesAlmacenados">Paquetes almacenados:</label>
                            <input type="number" id="paquetesAlmacenados" name="paquetesAlmacenados" />
													</div>
													<div className="campo">
														<label htmlFor="capacidadMaxima">Capacidad máxima:</label>
                            <input type="number" id="capacidadMaxima" name="capacidadMaxima" />
													</div>
												</div>
												<div className="fila">
													<div className="campo">
														<label htmlFor="husoHorario">Huso horario:</label>
                            <input type="number" id="husoHorario" name="husoHorario" />
													</div>
												</div>

                        <div className="botones">
							<Link href="/aeropuertos">
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
