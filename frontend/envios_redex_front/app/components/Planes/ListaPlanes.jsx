import React from 'react';
import '../Envios/ListaEnvios.css';
import '../Envios/RegistrarEnvio.css';

const ListaPlanes = ({ planes }) => {

    const formatFecha = (fechaString) => {
        const fecha = new Date(fechaString);
        const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return fecha.toLocaleDateString('es-ES', opciones);
        };
    
    const formatHora = (fechaString) => {
    const fecha = new Date(fechaString);
    const opciones = { hour: '2-digit', minute: '2-digit' };
    return fecha.toLocaleTimeString('es-ES', opciones);
    };

  return (
    <div>
        <header className="header-proyecto">
            <h1>Planes de vuelo</h1>
            <h1>RedEx</h1>
        </header>
        <div className="customers-container">
            <div className="button-container">
                <button className="button-left">+ Cargar planes de vuelo</button>
                <button className="button-right">Reiniciar datos</button>
            </div>
            <div className="customers-table">
                <div className="table-header">
                <span>Ciudad origen</span>
                <span>Ciudad destino</span>
                <span>Dia salida</span>
                <span>Tiempo salida</span>
                <span>Tiempo llegada</span>
                <span>Capacidad Ocupada</span>
                <span>Capacidad Maxima</span>
                <span className='ulti-header'>Estado</span>
                </div>
                {planes.map((plan, index) => (
                <div className="table-row" key={index}>
                    <span>{plan.ciudad_origen}</span>
                    <span>{plan.ciudad_destino}</span>
                    <span>{formatFecha(plan.hora_origen)}</span>
                    <span>{formatHora(plan.hora_origen)}</span>
                    <span>{formatHora(plan.hora_destino)}</span>
                    <span>{plan.capacidad_ocupada}</span>
                    <span>{plan.capacidad_maxima}</span>
                    <span className={`status ${plan.estado === 1 ? 'Habilitado' : 'No_habilitado'}`}>{plan.estado === 1? 'Habilitado' : 'No_habilitado'}</span>
                </div>
                ))}
            </div>
            <div className="pagination">
                <span className="active">1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>...</span>
                <span>40</span>
            </div>
        </div>
    </div>
  );
};

export default ListaPlanes;