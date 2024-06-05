"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '../Envios/ListaEnvios.css';
import '../Envios/RegistrarEnvio.css';
import { getPlanesTodos } from '@/app/api/planesDeVuelo.api';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';

const ListaPlanes = () => {
    const [planes, setPlanes] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        async function carga() {
            let p = await getPlanesTodos();
            setPlanes(p);
        }
        carga();
    }, []);

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
                <h1>Planes de vuelo</h1>
                <h1>RedEx</h1>
            </header>
            <div className="customers-container">
                <div className="button-container">
                    <Button variant="contained" className="button-left">+ Cargar planes de vuelo</Button>
                    <Button variant="contained" className="button-right">Reiniciar datos</Button>
                </div>
                <TableContainer component={Paper}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Ciudad origen</TableCell>
                                <TableCell>Ciudad destino</TableCell>
                                <TableCell>Dia salida</TableCell>
                                <TableCell>Tiempo salida</TableCell>
                                <TableCell>Tiempo llegada</TableCell>
                                <TableCell>Capacidad Ocupada</TableCell>
                                <TableCell>Capacidad Maxima</TableCell>
                                
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {planes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((plan, index) => (
                                <TableRow key={index}>
                                    <TableCell>{plan.ciudad_origen}</TableCell>
                                    <TableCell>{plan.ciudad_destino}</TableCell>
                                    <TableCell>{formatFecha(plan.hora_origen)}</TableCell>
                                    <TableCell>{formatHora(plan.hora_origen)}</TableCell>
                                    <TableCell>{formatHora(plan.hora_destino)}</TableCell>
                                    <TableCell>{plan.capacidad_ocupada}</TableCell>
                                    <TableCell>{plan.capacidad_maxima}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={planes.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
                <Link href="/">
                  <Button variant="contained" disableElevation sx={{ mt: 2 }}>
                    Regresar
                  </Button>
                </Link>
            </div>
        </div>
    );
};

export default ListaPlanes;