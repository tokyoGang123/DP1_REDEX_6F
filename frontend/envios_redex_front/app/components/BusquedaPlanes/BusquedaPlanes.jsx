import React, { useState } from 'react';
import { Grid, Paper, Modal, Box, Typography, TextField, Button, List, ListItem, ListItemText, ListItemIcon, IconButton, Divider, ListItemSecondaryAction } from '@mui/material';
import { Search, Flight, LocalShipping, Close, CalendarToday, LocationOn, FlightTakeoff, FlightLand, OpenInNew } from '@mui/icons-material';

const styleDetalles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function BusquedaPlanes({ open, onClose, planesDeVueloRef }) {
  const [busqueda, setBusqueda] = useState('');
  const [planesFiltrados, setPlanesFiltrados] = useState([]);
  const [vueloSeleccionado, setVueloSeleccionado] = useState(null);

  const handleBusqueda = () => {
    const resultados = planesDeVueloRef.current.filter(plan => 
      plan.id_tramo && plan.id_tramo.toString().toLowerCase().includes(busqueda.toLowerCase())
    );    
    setPlanesFiltrados(resultados);
  };

  const handleOpenModal = (vuelo) => {
    setVueloSeleccionado(vuelo);
  };

  const handleCloseModal = () => {
    setVueloSeleccionado(null);
  };

  const handleMostrarConPaquetes = () => {
    const planesConPaquetes = planesDeVueloRef.current.filter(plan => plan.listaPaquetes && plan.listaPaquetes.length > 0);
    setPlanesFiltrados(planesConPaquetes);
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        p: 4
      }}
    >
      <Box 
        sx={{
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: 'calc(100vh - 100px)',
          overflowY: 'auto'
        }}
      >
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

        <Button 
          variant="contained" 
          sx={{ mb: 2 }} 
          onClick={handleMostrarConPaquetes} 
          startIcon={<LocalShipping />}
        >
          Mostrar con Paquetes Asignados
        </Button>

        <List>
          {planesFiltrados.map((plan) => (
            <React.Fragment key={plan.id_tramo}>
              <ListItem button onClick={() => handleOpenModal(plan)}>
                <ListItemIcon><Flight /></ListItemIcon>
                <ListItemText 
                  primary={plan.id_tramo} 
                  secondary={`${plan.origen || 'Origen'} → ${plan.destino || 'Destino'}`} 
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleOpenModal(plan)}>
                    <OpenInNew />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>

        {planesFiltrados.length === 0 && (
          <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 2 }}>
            No se encontraron resultados.
          </Typography>
        )}

        <Modal open={!!vueloSeleccionado} onClose={handleCloseModal}>
          <Box sx={styleDetalles}>
            {vueloSeleccionado && (
              <>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" component="h2">
                    <FlightTakeoff sx={{ mr: 1, verticalAlign: 'middle' }} />
                    {vueloSeleccionado.id_tramo}
                  </Typography>
                  <IconButton onClick={handleCloseModal} size="small">
                    <Close />
                  </IconButton>
                </Box>

                <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                  {vueloSeleccionado.fecha || 'Fecha no disponible'}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ p: 2, bgcolor: '#e3f2fd' }}>
                      <Typography variant="subtitle1">
                        <LocationOn fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                        {vueloSeleccionado.origen || 'Origen no disponible'}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ p: 2, bgcolor: '#ffebee' }}>
                      <Typography variant="subtitle1">
                        <FlightLand fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                        {vueloSeleccionado.destino || 'Destino no disponible'}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Typography variant="h6" sx={{ mt: 3, mb: 1, display: 'flex', alignItems: 'center' }}>
                  <LocalShipping sx={{ mr: 1 }} />
                  Paquetes Asignados:
                </Typography>
                <List dense>
                  {(vueloSeleccionado.listaPaquetes || []).map((paquete, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <LocalShipping fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={paquete} />
                    </ListItem>
                  ))}
                  {(!vueloSeleccionado.listaPaquetes || vueloSeleccionado.listaPaquetes.length === 0) && (
                    <Typography variant="body2" color="textSecondary" align="center">
                      No hay paquetes asignados aún.
                    </Typography>
                  )}
                </List>

                <Typography variant="subtitle2" sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <LocalShipping fontSize="small" sx={{ mr: 1 }} />
                  Capacidad Ocupada: {vueloSeleccionado.capacidad_ocupada || 0}
                </Typography>
              </>
            )}
          </Box>
        </Modal>
      </Box>
    </Modal>
  );
}

