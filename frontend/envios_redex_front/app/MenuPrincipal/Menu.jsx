import React from 'react';
import Link from 'next/link';
import '../components/Envios/RegistrarEnvio.css';
import './Menu.css';

export default function Menu() {

	return (
		<div>
			<header className="header-proyecto">
				<h1>RedEx</h1>
				<img src="/icons/usuario1.png" width="30" height="30" />
			</header>

			<div className="principal">
				<div className="welcome-message">Bienvenido al sistema de Simulacion RedEx</div>

				<div className="container">
					<div className="header">
						<Link href='/simulacion'>
							<button className="seleccion">SELECCIONAR TIPO DE EJECUCIÓN</button>
						</Link>
					</div>
					<div className="options">
						<Link href="/envios">
							<button className="option">ENVIOS HISTORICOS</button>
						</Link>
						<Link href="/aeropuertos">
							<button className="option">AEROPUERTOS</button>
						</Link>
						<Link href="/planes">
							<button className="option">PLANES DE VUELO</button>
						</Link>
						<button className="option">REPORTES Y GRAFICOS</button>
					</div>
				</div>
			</div>
		</div>
	);
}
