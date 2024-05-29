'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import './ListaEnvios.css';
import './RegistrarEnvio.css';

const ListaEnvios = () => {
  const [envios, setEnvios] = useState([]);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchEnvios = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/envios/obtenerTodos');
        if (res.ok) {
          const env = await res.json();
          setEnvios(env);
        } else {
          console.error('Error al obtener los envios');
        }
      } catch (error) {
        console.error('Error al obtener los envios:', error);
      }
    };

    fetchEnvios();
  }, []);

  

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    handleFileUpload(event.target.files[0]);
  };

  const handleFileUpload = async (file) => {
    if (!file) {
      alert('Por favor, seleccione un archivo primero.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const cleanText = await changeText(text);
      const jsonData = await formatJSON(cleanText);

      console.log('JSON a enviar:', jsonData);  // Agregar el console.log aquí

      axios.post('http://localhost:8080/api/envios/cargarArchivoEnvios', jsonData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        alert('Archivo cargado exitosamente');
        console.log('Respuesta del servidor:', response.data);
      })
      .catch(error => {
        console.error('Error al cargar el archivo:', error);
      });
    };
    reader.readAsText(file);
  };

  async function changeText(texto) {
    const textoApropiado = texto.replace(/\r/g, '');
    return textoApropiado;
  }

  async function formatJSON(text) {
    const json = {
      data: text
    };
    return json;
  }

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

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
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button className="button-right" onClick={handleButtonClick}>+ Cargar envíos</button>
        </div>
        <div className="customers-table">
          <div className="table-header">
            <span>Identificador del envío</span>
            <span>Ciudad origen</span>
            <span>Fecha en ciudad origen</span>
            <span>Hora en ciudad origen</span>
            <span>Ciudad destino</span>
            <span className='ulti-header'>Cantidad de paquetes</span>
          </div>
          {envios.map((envio, index) => (
            <div className="table-row" key={index}>
              <span>{envio.numero_envio_Aeropuerto}</span>
              <span>{envio.aeropuerto_origen}</span>
              <span>{new Date(envio.fecha_ingreso).toLocaleDateString()}</span>
              <span>{new Date(envio.fecha_ingreso).toLocaleTimeString()}</span>
              <span>{envio.aeropuerto_destino}</span>
              <span>{envio.numPaquetes}</span>
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







