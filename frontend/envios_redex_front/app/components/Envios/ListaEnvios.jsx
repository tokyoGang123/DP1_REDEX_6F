import React from 'react';
import Link from 'next/link';
import './ListaEnvios.css';

const ListaEnvios = () => {
  const customers = [
    { name: 'XYZ-213', company: 'Nueva York', phone: 'Tokio', email: 'Sofia Martínez', country: '8', status: 'Entregado' },
    { name: 'ASD-512', company: 'París', phone: 'Londres', email: 'Alejandro Sánchez', country: '1', status: 'Esperando' },
    { name: 'QWE-765', company: 'Ciudad de México', phone: 'Río de Janeriro', email: 'Lucia Gómez', country: '5', status: 'Esperando' },
    { name: 'TER-123', company: 'Pekin', phone: 'Moscú', email: 'Diego Rodríguez', country: '3', status: 'Entregado' },
    { name: 'VBC-757', company: 'El cairo', phone: 'Sydney', email: 'Valentina Pérez', country: '7', status: 'Entregado' },
    { name: 'KJL-891', company: 'Roma', phone: 'Estambul', email: 'Mateo García', country: '3', status: 'Entregado' },
    { name: 'ZXC-987', company: 'Buenos Aires', phone: 'Ciudad del Cabo', email: 'Isabella Fernández', country: '1', status: 'Entregado' },
    { name: 'YUT-546', company: 'Bangkok', phone: 'Dubái', email: 'Nicolás López', country: '5', status: 'Esperando' }
  ];

  return (
    <div>
        <header className="header-proyecto">
            <h1>Lista Envíos</h1>
            <h1>RedEx</h1>
        </header>
        <div className="customers-container">
            <div className="button-container">
                <Link href="/registroEnvio">
                    <button className="button-left">Registrar envío</button>
                </Link>
                <button className="button-right">+ Cargar envíos</button>
            </div>
            <div className="customers-table">
                <div className="table-header">
                <span>Código del paquete</span>
                <span>Ciudad origen</span>
                <span>Ciudad destino</span>
                <span>Nombre del cliente</span>
                <span>Cantidad de paquetes</span>
                <span className='ulti-header'>Estado</span>
                </div>
                {customers.map((customer, index) => (
                <div className="table-row" key={index}>
                    <span>{customer.name}</span>
                    <span>{customer.company}</span>
                    <span>{customer.phone}</span>
                    <span>{customer.email}</span>
                    <span>{customer.country}</span>
                    <span className={`status ${customer.status === 'Entregado' ? 'entregado' : 'esperando'}`}>{customer.status}</span>
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

export default ListaEnvios;

