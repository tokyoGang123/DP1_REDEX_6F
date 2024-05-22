"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import '../Envios/ListaEnvios.css';

const ListaAeropuertos = ({ aeropuertos }) => {
  // Estado para almacenar los aeropuertos
  const [airports, setAirports] = useState(aeropuertos);

  // Maneja la carga del archivo
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const contents = e.target.result;
      const textoApropiado = await changeText(contents);
      const json = parseFileContents(textoApropiado);

      // Actualiza el estado con los nuevos aeropuertos
      setAirports(prevAirports => {
        const updatedAirports = [...prevAirports, ...json];
        console.log("Updated Airports:", updatedAirports); // Añade el console.log aquí
        return updatedAirports;
      });
    };
    reader.readAsText(file);
  };

  // Procesa el texto del archivo
  async function changeText(texto) {
    const textoApropiado = texto.replace(/\r/g, '');
    return textoApropiado;
  }

  // Convierte el texto del archivo a JSON
  const parseFileContents = (contents) => {
    const lines = contents.split('\n');
    const result = lines.map(line => {
      const [id, id_pais, codigo, ciudad, pais, diminutivo, huso_horario, capacidad_maxima, latitud, longitud] = line.split(',');
      return {
        id_aeropuerto: id,
        id_pais,
        codigo,
        ciudad,
        pais,
        diminutivo,
        huso_horario,
        capacidad_maxima: parseInt(capacidad_maxima),
        latitud: parseFloat(latitud),
        longitud: parseFloat(longitud),
        capacidad_ocupada: 0, // Ajusta este valor según sea necesario
        full: false, // Ajusta este valor según sea necesario
        estado: 1 // Ajusta este valor según sea necesario
      };
    });
    return result;
  };

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
          <label className="button-right">
            + Cargar aeropuertos
            <input type="file" accept=".txt" style={{ display: 'none' }} onChange={handleFileUpload} />
          </label>
        </div>
        <div className="customers-table">
          <div className="table-header">
            <span>Código</span>
            <span>Ciudad</span>
            <span>Diminutivo</span>
            <span>Huso horario</span>
            <span>Capacidad ocupada</span>
            <span>Capacidad máxima</span>
            <span>Longitud</span>
            <span>Latitud</span>
            <span className="ulti-header">Estado</span>
          </div>
          {aeropuertos.map((aeropuerto, index) => (
            <div className="table-row" key={index}>
              <span>{aeropuerto.codigo}</span>
              <span>{aeropuerto.ciudad}</span>
              <span>{aeropuerto.diminutivo}</span>
              <span>{aeropuerto.huso_horario}</span>
              <span>{aeropuerto.capacidad_ocupada}</span>
              <span>{aeropuerto.capacidad_maxima}</span>
              <span>{aeropuerto.longitud}</span>
              <span>{aeropuerto.latitud}</span>
              <span className={`status ${aeropuerto.full === false ? 'habilitado' : 'no_habilitado'}`}>{aeropuerto.full === false ? 'Habilitado' : 'No habilitado'}</span>
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


