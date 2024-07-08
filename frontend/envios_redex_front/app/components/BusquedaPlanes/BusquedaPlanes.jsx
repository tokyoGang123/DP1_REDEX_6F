import React, { useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import { Search, Flight, LocalShipping, ArrowBack } from '@mui/icons-material';

const styleDetalles = {
  width: '100%',
  bgcolor: 'background.paper',
  boxShadow: 2,
  p: 2,
  borderRadius: 2,
};

export default function BusquedaPlanes({ active, planesDeVueloRef,aeropuertos }) {
  const [busqueda, setBusqueda] = useState('');
  const [planesFiltrados, setPlanesFiltrados] = useState([]);
  const [vueloSeleccionado, setVueloSeleccionado] = useState(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  const handleBusqueda = () => {
    const resultado = planesDeVueloRef.current.find(plan =>
      plan.id_tramo.toString() === busqueda.trim()
    );
    if (resultado) {
      setPlanesFiltrados([resultado]);
    } else {
      setPlanesFiltrados([]);
    }
  };

  const handleSelectVuelo = (vuelo) => {
    setVueloSeleccionado(vuelo);
    setMostrarDetalles(true);
  };

  const handleRegresar = () => {
    setMostrarDetalles(false);
    setVueloSeleccionado(null);
  };

  function obtenerNombre(id) {
      const nom = aeropuertos.find(item => item.id_aeropuerto == id)
      return nom ? nom.ciudad : "No identificada"
  }

  return (
    <Box sx={{ display: active ? 'block' : 'none', overflowY: 'auto', height: '100%' }}>
      {!mostrarDetalles ? (
        <>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Flight sx={{ mr: 1 }} />
            Búsqueda de Planes de Vuelo
          </Typography>
          <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
            <TextField
              label="Buscar por ID de Tramo"
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
            {planesFiltrados.map((plan) => (
              <React.Fragment key={plan.id_tramo}>
                <ListItem button onClick={() => handleSelectVuelo(plan)}>
                  <ListItemIcon><Flight /></ListItemIcon>
                  <ListItemText
                    primary={plan.id_tramo}
                    secondary={`${obtenerNombre(plan.ciudad_origen) || 'Origen'} → ${obtenerNombre(plan.ciudad_destino) || 'Destino'}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
            {planesFiltrados.length === 0 && (
              <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 2 }}>
                No se encontraron resultados.
              </Typography>
            )}
          </List>
        </>
      ) : (
        <Box sx={styleDetalles}>
          <Typography variant="h6" component="h2">
            Detalles del Vuelo: {vueloSeleccionado.id_tramo}
          </Typography>
          <Typography variant="body1">
            Origen: {obtenerNombre(vueloSeleccionado.ciudad_origen) || 'No especificado'}
          </Typography>
          <Typography variant="body1">
            Destino: {obtenerNombre(vueloSeleccionado.ciudad_destino) || 'No especificado'}
          </Typography>
          <Typography variant="body1">
            Capacidad Ocupada: {vueloSeleccionado.capacidad_ocupada || 0}
          </Typography>
          <Typography variant="h6">
            Paquetes Asignados:
          </Typography>
          <List dense>
            {(vueloSeleccionado.listaPaquetes || []).map((paquete, index) => (
              <ListItem key={index}>
                <ListItemIcon><LocalShipping /></ListItemIcon>
                <ListItemText primary={`Paquete ID: ${paquete}`} />
              </ListItem>
            ))}
            {(!vueloSeleccionado.listaPaquetes || vueloSeleccionado.listaPaquetes.length === 0) && (
              <Typography variant="body2" color="textSecondary" align="center">
                No hay paquetes asignados aún.
              </Typography>
            )}
          </List>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={handleRegresar}
            sx={{ mt: 2 }}
          >
            Regresar a la búsqueda
          </Button>
        </Box>
      )}
    </Box>
  );
}






