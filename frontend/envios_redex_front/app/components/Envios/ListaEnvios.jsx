'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import './ListaEnvios.css';
import './RegistrarEnvio.css';

import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { getEnviosTodos, postEnviosArchivo } from '@/app/api/envios.api';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const columns = [
  { id: 'numero_envio_Aeropuerto', label: 'Identificador del envío', minWidth: 170 },
  { id: 'aeropuerto_origen', label: 'Ciudad origen', minWidth: 170 },
  { id: 'fecha_ingreso', label: 'Fecha en ciudad origen', minWidth: 170 },
  { id: 'hora_ingreso', label: 'Hora en ciudad origen', minWidth: 170 },
  { id: 'aeropuerto_destino', label: 'Ciudad destino', minWidth: 170 },
  { id: 'numPaquetes', label: 'Cantidad de paquetes', minWidth: 170 },
];

const ListaEnvios = () => {

  dayjs.extend(utc);
  dayjs.extend(timezone);

  let zonaHorariaUsuario = dayjs.tz.guess();
  let fechaActualDayJS = dayjs().tz(zonaHorariaUsuario);
  let fechaActual = fechaActualDayJS.format('YYYYMMDD');

  const [envios, setEnvios] = useState([]);
  const [file, setFile] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function carga() {
      let e = await getEnviosTodos(fechaActual);
      setEnvios(e);
    }
    carga();
  }, []);

  useEffect(() => {
    console.log(envios);
  }, [envios]);

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

      console.log('JSON a enviar:', jsonData);

      async function sube() {
        let res = await postEnviosArchivo(jsonData);
        console.log(res);
      }
      sube();
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
            <Button variant="contained" color="primary" className="button-left">
              Registrar envío
            </Button>
          </Link>
          <input
            type="file"
            accept=".txt"
            id="upload-file"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <label htmlFor="upload-file">
            <Button
              variant="contained"
              component="span"
              color="primary"
              startIcon={<UploadFileIcon />}
              className="button-right"
            >
              + Cargar envíos
            </Button>
          </label>
        </div>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {envios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((envio, index) => {
                  const fechaIngreso = new Date(envio.fecha_ingreso);
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => {
                        const value = envio[column.id];
                        if (column.id === 'fecha_ingreso') {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {fechaIngreso.toLocaleDateString()}
                            </TableCell>
                          );
                        }
                        if (column.id === 'hora_ingreso') {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {fechaIngreso.toLocaleTimeString()}
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={envios.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <Link href="/">
          <Button variant="contained" disableElevation sx={{ mt: 2 }}>
            Regresar
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ListaEnvios;







