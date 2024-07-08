import React, { useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import { Search, LocationOn, ArrowBack } from '@mui/icons-material';

const styleDetalles = {
  width: '100%',
  bgcolor: 'background.paper',
  boxShadow: 2,
  p: 2,
  borderRadius: 2,
};

export default function BusquedaAeropuertos({ active, aeropuertos }) {
  const [busqueda, setBusqueda] = useState('');
  const [aeropuertosFiltrados, setAeropuertosFiltrados] = useState([]);
  const [aeropuertoSeleccionado, setAeropuertoSeleccionado] = useState(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  const handleBusqueda = () => {
    const resultados = aeropuertos.filter(aeropuerto =>
      aeropuerto.ciudad.toLowerCase().includes(busqueda.toLowerCase())
    );
    setAeropuertosFiltrados(resultados)
  };

  const handleSelectAeropuerto = (aeropuerto) => {
    setAeropuertoSeleccionado(aeropuerto);
    setMostrarDetalles(true);
  };

  const handleRegresar = () => {
    setMostrarDetalles(false);
    setAeropuertoSeleccionado(null);
  };

  return (
    <Box sx={{ display: active ? 'block' : 'none', overflowY: 'auto', height: '100%' }}>
      {!mostrarDetalles ? (
        <>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn sx={{ mr: 1 }} />
            Búsqueda de Aeropuertos
          </Typography>
          <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
            <TextField
              label="Buscar por Ciudad"
              variant="outlined"
              fullWidth
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{ ml: 1, height: '56px' }}
              onClick={handleBusqueda}
              startIcon={<Search />}
            >
              Buscar
            </Button>
          </Box>
          <List>
            {aeropuertosFiltrados.map((aeropuerto) => (
              <React.Fragment key={aeropuerto.id}>
                <ListItem button onClick={() => handleSelectAeropuerto(aeropuerto)}>
                  <ListItemIcon><LocationOn /></ListItemIcon>
                  <ListItemText
                    primary={aeropuerto.ciudad}
                    secondary={aeropuerto.nombre}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
            {aeropuertosFiltrados.length === 0 && (
              <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 2 }}>
                No se encontraron resultados.
              </Typography>
            )}
          </List>
        </>
      ) : (
        <Box sx={styleDetalles}>
          <Typography variant="h6" component="h2">
            Detalles del Aeropuerto: {aeropuertoSeleccionado.ciudad}
          </Typography>
          <Typography variant="body1">
            <strong>Longitud:</strong> {aeropuertoSeleccionado.longitud}
          </Typography>
          <Typography variant="body1">
            <strong>Latitud:</strong> {aeropuertoSeleccionado.latitud}
          </Typography>
          <Typography variant="body1">
            <strong>Estado:</strong> {aeropuertoSeleccionado.estado}
          </Typography>
          <Typography variant="body1">
            <strong>Código:</strong> {aeropuertoSeleccionado.codigo}
          </Typography>
          <Typography variant="body1">
            <strong>Huso Horario:</strong> {aeropuertoSeleccionado.huso_horario}
          </Typography>
          <Typography variant="body1">
            <strong>Capacidad Máxima:</strong> {aeropuertoSeleccionado.capacidad_maxima}
          </Typography>
          <Typography variant="body1">
            <strong>Capacidad Ocupada:</strong> {aeropuertoSeleccionado.capacidad_ocupada}
          </Typography>
          <Typography variant="body1">
            <strong>Diminutivo:</strong> {aeropuertoSeleccionado.diminutivo}
          </Typography>
          
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            startIcon={<ArrowBack />}
            onClick={handleRegresar}
          >
            Regresar
          </Button>
        </Box>
      )}
    </Box>
  );
}


//


