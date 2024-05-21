import React from 'react';
import '../Envios/ListaEnvios.css';

const ListaPlanes = () => {
    const customers = [
        { codigo: 'PDV000001', ciudadOrigen: 'Nueva York', ciudadDestino: 'Tokio', diaSalida: '20/10/23', tiempoSalida: '15:23', tiempoLlegada: '15:23',capacidadOcupada: '0/200', status: 'Habilitado' },
        { codigo: 'PDV000002', ciudadOrigen: 'París', ciudadDestino: 'Londres', diaSalida: '20/10/23', tiempoSalida: '14:21',tiempoLlegada: '14:21',capacidadOcupada: '0/200', status: 'Habilitado' },
        { codigo: 'PDV000003', ciudadOrigen: 'Ciudad de México', ciudadDestino: 'Rio de Janeiro', diaSalida: '20/10/23', tiempoSalida: '14:10', tiempoLlegada: '17:10',capacidadOcupada: '0/200', status: 'Habilitado' },
        { codigo: 'PDV000004', ciudadOrigen: 'Pekin', ciudadDestino: 'Moscú', diaSalida: '20/10/23', tiempoSalida: '09:10', tiempoLlegada: '12:12',capacidadOcupada: '0/200', status: 'Habilitado' },
        { codigo: 'PDV000005', ciudadOrigen: 'Barcelona', ciudadDestino: 'Sydney', diaSalida: '15/11/23', tiempoSalida: '11:10', tiempoLlegada: '13:46',capacidadOcupada: '0/200', status: 'Habilitado' },
        { codigo: 'PDV000006', ciudadOrigen: 'Roma', ciudadDestino: 'Estambul', diaSalida: '10/12/23', tiempoSalida: '12:57', tiempoLlegada: '17:10',capacidadOcupada: '0/300', status: 'Habilitado' },
        { codigo: 'PDV000007', ciudadOrigen: 'Buenos Aires', ciudadDestino: 'Ciudad del Cabo', diaSalida: '04/01/24', tiempoSalida: '18:10', tiempoLlegada: '23:10',capacidadOcupada: '0/300', status: 'Habilitado' },
        { codigo: 'PDV000008', ciudadOrigen: 'Bangkok', ciudadDestino: 'Dubái', diaSalida: '05/01/24', tiempoSalida: '23:59', tiempoLlegada: '03:10',capacidadOcupada: '0/400', status: 'Habilitado' }
      ];
      

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
                <span>Código</span>
                <span>Ciudad origen</span>
                <span>Ciudad destino</span>
                <span>Dia salida</span>
                <span>Tiempo salida</span>
                <span>Tiempo llegada</span>
                <span>Capacidad ocupada</span>
                <span className='ulti-header'>Estado</span>
                </div>
                {customers.map((customer, index) => (
                <div className="table-row" key={index}>
                    <span>{customer.codigo}</span>
                    <span>{customer.ciudadOrigen}</span>
                    <span>{customer.ciudadDestino}</span>
                    <span>{customer.diaSalida}</span>
                    <span>{customer.tiempoSalida}</span>
                    <span>{customer.tiempoLlegada}</span>
                    <span>{customer.capacidadOcupada}</span>
                    <span className={`status ${customer.status === 'Habilitado' ? 'habilitado' : 'no_habilitado'}`}>{customer.status}</span>
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

