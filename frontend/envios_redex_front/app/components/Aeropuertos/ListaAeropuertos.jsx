"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '../Envios/ListaEnvios.css';
import '../Envios/RegistrarEnvio.css';

const ListaAeropuertos = () => {
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    const fetchAeropuertos = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/aeropuertos/obtenerTodos');
        if (res.ok) {
          const aeropuertos = await res.json();
          setAirports(aeropuertos);
        } else {
          console.error('Error al obtener los aeropuertos');
        }
      } catch (error) {
        console.error('Error al obtener los aeropuertos:', error);
      }
    };

    fetchAeropuertos();
  }, []);
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const contents = e.target.result;
      const textoApropiado = await changeText(contents);
      const json = await formatJSON(textoApropiado);

      // Verificar el JSON generado
      console.log('JSON generado:', json);

      // Enviar el contenido del archivo en formato JSON al backend
      const response = await fetch('http://localhost:8080/api/aeropuertos/lecturaArchivo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(json),
      });

      if (response.ok) {
        const newAirports = await response.json();
        setAirports(prevAirports => [...prevAirports, ...newAirports]);
      } else {
        console.error('Error al cargar los aeropuertos');
      }
    };
    reader.readAsText(file);
  };

  // Procesa el texto del archivo
  async function changeText(texto) {
    const textoApropiado = texto.replace(/\r/g, '');
    return textoApropiado;
  }

  // Formatea el texto en un JSON con la clave "data"
  const formatJSON = async (text) => {
    const json = {
      data: text
    };
    return json;
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
          {airports.map((aeropuerto, index) => (
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





