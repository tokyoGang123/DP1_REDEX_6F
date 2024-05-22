import React from 'react';
import Link from 'next/link';
import '../Envios/ListaEnvios.css';

const ListaAeropuertos = () => {
  const customers = [
    { name: 'XYZ-213', company: 'Nueva York - USA', phone: 'America', email: '-5', country: '20', capacidad: '200',status: 'Habilitado' },
    { name: 'ASD-512', company: 'París - Francia', phone: 'Europa', email: '5', country: '10', capacidad: '200',status: 'Habilitado' },
    { name: 'QWE-765', company: 'Ciudad de México - México', phone: 'America', email: '-4', country: '30', capacidad: '200',status: 'Habilitado' },
    { name: 'TER-123', company: 'Pekin - China', phone: 'Asia', email: '-3', country: '20', capacidad: '200',status: 'Habilitado' },
    { name: 'VBC-757', company: 'Barcelona - España', phone: 'Europa', email: '+2', country: '15', capacidad: '200',status: 'Habilitado' },
    { name: 'KJL-891', company: 'Roma - Italia', phone: 'Europa', email: '+3', country: '10', capacidad: '300',status: 'Habilitado' },
    { name: 'ZXC-987', company: 'Buenos Aires - Argentina', phone: 'America', email: '+2', country: '40', capacidad: '300',status: 'Habilitado' },
    { name: 'YUT-546', company: 'Bangkok - Tailandia', phone: 'Asia', email: '+3', country: '5', capacidad: ' 400',status: 'Habilitado' }
  ];

  return (
    <div>
        <header className="header-proyecto">
            <h1>Lista Aeropuertos</h1>
            <h1>RedEx</h1>
        </header>
        <div className="customers-container">
            <div className="button-container">
                <Link href="/registroAeropuerto">
                    <button className="button-left">Registrar aeropuerto</button>
                </Link>
                <button className="button-right">+ Cargar aeropuertos</button>
            </div>
            <div className="customers-table">
                <div className="table-header">
                <span>Código</span>
                <span>Ciudad - País</span>
                <span>Continente</span>
                <span>Huso horario</span>
                <span>Paquetes almacenados</span>
                <span>Capacidad máxima</span>
                <span className='ulti-header'>Estado</span>
                </div>
                {customers.map((customer, index) => (
                <div className="table-row" key={index}>
                    <span>{customer.name}</span>
                    <span>{customer.company}</span>
                    <span>{customer.phone}</span>
                    <span>{customer.email}</span>
                    <span>{customer.country}</span>
                    <span>{customer.capacidad}</span>
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

export default ListaAeropuertos;

