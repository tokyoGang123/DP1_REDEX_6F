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

export default function BusquedaPlanes({ active, planesDeVueloRef, aeropuertos, envios2Ref }) {
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
    const nom = aeropuertos.find(item => item.id_aeropuerto === id);
    return nom ? nom.ciudad : "No identificada";
  }

  function buscarPaquetesYRutas(paquetes) {
    return paquetes.map(idPaquete => {
      const envio = envios2Ref.current.find(env => env.paquetes.some(paq => paq.id_paquete === idPaquete));
      const paquete = envio ? envio.paquetes.find(paq => paq.id_paquete === idPaquete) : null;
      return {
        idPaquete,
        ruta: paquete ? paquete.ruta.listaRutas.map(idTramo => {
          const plan = planesDeVueloRef.current.find(p => p.id_tramo === idTramo);
          return plan ? {
            tramoId: idTramo,
            origen: obtenerNombre(plan.ciudad_origen),
            destino: obtenerNombre(plan.ciudad_destino)
          } : null;
        }) : []
      };
    });
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
                    secondary={`${obtenerNombre(plan.ciudad_origen)} → ${obtenerNombre(plan.ciudad_destino)}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </>
      ) : (
        <Box sx={styleDetalles}>
          <Typography variant="h6" component="h2">
            Detalles del Vuelo: {vueloSeleccionado.id_tramo}
          </Typography>
          <Typography variant="body1">
            <strong>Origen:</strong> {obtenerNombre(vueloSeleccionado.ciudad_origen)}
          </Typography>
          <Typography variant="body1">
            <strong>Destino:</strong> {obtenerNombre(vueloSeleccionado.ciudad_destino)}
          </Typography>
          <Typography variant="body1">
            <strong>Capacidad Ocupada:</strong> {vueloSeleccionado.capacidad_ocupada}
          </Typography>
          <Typography variant="body1">
            <strong>Capacidad Máxima:</strong> {vueloSeleccionado.capacidad_maxima}
          </Typography>
          <Typography variant="h6">
            <strong>Paquetes Asignados:</strong>
          </Typography>
          <List dense>
            {buscarPaquetesYRutas(vueloSeleccionado.listaPaquetes || []).map(({ idPaquete, ruta }) => (
              <ListItem key={idPaquete}>
                <ListItemIcon><LocalShipping /></ListItemIcon>
                <ListItemText
                  primary={`Paquete ID: ${idPaquete}`}
                  secondary={`Ruta: ${ruta.map(r => r ? `${r.tramoId} (${r.origen} - ${r.destino})` : 'Detalles no disponibles').join(' -> ')}`}
                />
              </ListItem>
            ))}
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







//