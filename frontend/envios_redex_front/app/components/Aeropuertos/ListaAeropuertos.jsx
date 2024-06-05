"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { getAeropuertosTodos, postAeropuertosArchivo } from '@/app/api/aeropuetos.api';
import '../Envios/ListaEnvios.css';
import '../Envios/RegistrarEnvio.css';
import Button from '@mui/material/Button';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const columns = [
  { id: 'codigo', label: 'Código', minWidth: 100 },
  { id: 'ciudad', label: 'Ciudad', minWidth: 170 },
  { id: 'diminutivo', label: 'Diminutivo', minWidth: 100 },
  { id: 'huso_horario', label: 'Huso Horario', minWidth: 150 },
  { id: 'capacidad_ocupada', label: 'Capacidad Ocupada', minWidth: 150, align: 'right' },
  { id: 'capacidad_maxima', label: 'Capacidad Máxima', minWidth: 150, align: 'right' },
  { id: 'longitud', label: 'Longitud', minWidth: 150, align: 'right' },
  { id: 'latitud', label: 'Latitud', minWidth: 150, align: 'right' },
];

const ListaAeropuertos = () => {
  const [airports, setAirports] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    async function carga() {
      let a = await getAeropuertosTodos();
      setAirports(a);
    }
    carga();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const contents = e.target.result;
      const textoApropiado = await changeText(contents);
      const json = await formatJSON(textoApropiado);

      async function sube() {
        let res = await postAeropuertosArchivo(json);
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

  const formatJSON = async (text) => {
    const json = { data: text };
    return json;
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
        <h1>Lista Aeropuertos</h1>
        <h1>RedEx</h1>
      </header>
      <div className="customers-container">
        <div className="button-container">
          <Link href="/registroAeropuerto">
            <Button variant="contained" color="primary" className="button-left">
              Registrar aeropuerto
            </Button>
          </Link>
          <input
            type="file"
            accept=".txt"
            id="upload-file"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <label htmlFor="upload-file">
            <Button
              variant="contained"
              component="span"
              color="primary"
              startIcon={<UploadFileIcon />}
              className="button-right"
            >
              + Cargar aeropuertos
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
                {airports
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((aeropuerto, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        {columns.map((column) => {
                          const value = aeropuerto[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number' ? column.format(value) : value}
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
            count={airports.length}
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

export default ListaAeropuertos;





