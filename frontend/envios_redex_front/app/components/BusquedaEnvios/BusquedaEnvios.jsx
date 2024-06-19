import React, { useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, ListItemIcon, Divider, IconButton, Pagination } from '@mui/material';
import { Search, Flight, LocalShipping, ArrowBack } from '@mui/icons-material';
import dayjs from 'dayjs';

export default function BusquedaEnvios({ active, envios2Ref }) {
  const [busqueda, setBusqueda] = useState('');
  const [enviosFiltrados, setEnviosFiltrados] = useState([]);
  const [envioSeleccionado, setEnvioSeleccionado] = useState(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const enviosPorPagina = 10;

  const handleBusqueda = () => {
    const resultados = envios2Ref.current;  // Asumiendo que envios2Ref.current contiene todos los envíos disponibles
    setEnviosFiltrados(resultados);
    setPaginaActual(1);
  };

  const handleSelectEnvio = (envio) => {
    setEnvioSeleccionado(envio);
    setMostrarDetalles(true);
  };

  const handleRegresar = () => {
    setMostrarDetalles(false);
    setEnvioSeleccionado(null);
  };

  const handleChangePage = (event, newPage) => {
    setPaginaActual(newPage);
  };

  const totalPaginas = Math.ceil(enviosFiltrados.length / enviosPorPagina);
  const enviosActuales = enviosFiltrados.slice(
    (paginaActual - 1) * enviosPorPagina,
    (paginaActual - 1) * enviosPorPagina + enviosPorPagina
  );

  return (
    <Box sx={{ display: active ? 'block' : 'none', overflowY: 'auto', height: '100%' }}>
      {!mostrarDetalles ? (
        <>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <LocalShipping sx={{ mr: 1 }} />
            Búsqueda de Envíos
          </Typography>
          <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
            <Button
              variant="contained"
              sx={{ ml: 1, height: '56px' }}
              onClick={handleBusqueda}
              startIcon={<Search />}
            >
              Mostrar Todos
            </Button>
          </Box>
          <List>
            {enviosActuales.map((envio) => (
              <React.Fragment key={envio.id_envio}>
                <ListItem button onClick={() => handleSelectEnvio(envio)}>
                  <ListItemIcon><Flight /></ListItemIcon>
                  <ListItemText primary={envio.destino} secondary={`ID: ${envio.id_envio} - Cantidad: ${envio.numPaquetes}`} />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
          <Pagination count={totalPaginas} page={paginaActual} onChange={handleChangePage} color="primary" sx={{ display: 'flex', justifyContent: 'center', my: 2 }} />
        </>
      ) : (
        <Box sx={{ p: 2 }}>
          <Button onClick={handleRegresar} startIcon={<ArrowBack />} sx={{ mb: 2 }}>
            Regresar
          </Button>
          <Typography variant="h6" component="h2">
            Detalles del Envío: {envioSeleccionado.id_envio}
          </Typography>
          <Typography variant="body1">
            <strong>Número en Aeropuerto:</strong> {envioSeleccionado.numero_envio_Aeropuerto}
          </Typography>
          <Typography variant="body1">
            <strong>Estado:</strong> {envioSeleccionado.estado}
          </Typography>
          <Typography variant="body1">
            <strong>Fecha de Ingreso:</strong> {envioSeleccionado.fecha_ingreso ? dayjs(envioSeleccionado.fecha_ingreso).format('DD/MM/YYYY HH:mm') : 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Huso Horario Origen:</strong> {envioSeleccionado.huso_horario_origen}
          </Typography>
          <Typography variant="body1">
            <strong>Aeropuerto Origen:</strong> {envioSeleccionado.aeropuerto_origen}
          </Typography>
          <Typography variant="body1">
            <strong>Aeropuerto Destino:</strong> {envioSeleccionado.aeropuerto_destino}
          </Typography>
          <Typography variant="body1">
            <strong>Fecha Máxima de Llegada:</strong> {envioSeleccionado.fecha_llegada_max ? dayjs(envioSeleccionado.fecha_llegada_max).format('DD/MM/YYYY HH:mm') : 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Huso Horario Destino:</strong> {envioSeleccionado.huso_horario_destino}
          </Typography>
          <Typography variant="body1">
            <strong>Cantidad de Paquetes:</strong> {envioSeleccionado.numPaquetes}
          </Typography>
          <Typography variant="body1">
            <strong>Paquetes:</strong>
            <List>
              {envioSeleccionado.paquetes.map(paq => (
                <ListItem key={paq.id_paquete}>
                  <ListItemText primary={`Paquete ID: ${paq.id_paquete}`} />
                </ListItem>
              ))}
            </List>
          </Typography>
        </Box>
      )}
    </Box>
  );
}










