import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, List, ListItem, ListItemText, ListItemIcon, IconButton, Divider, ListItemSecondaryAction } from '@mui/material';
import { Search, Flight, LocalShipping, Close, LocationOn, OpenInNew } from '@mui/icons-material';

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

export default function BusquedaAeropuertos({ open, onClose, aeropuertos }) {
  const [busqueda, setBusqueda] = useState('');
  const [aeropuertosFiltrados, setAeropuertosFiltrados] = useState([]);
  const [aeropuertoSeleccionado, setAeropuertoSeleccionado] = useState(null);

  const handleBusqueda = () => {
    const resultados = aeropuertos.filter(aeropuerto => 
      aeropuerto.ciudad.toLowerCase().includes(busqueda.toLowerCase())
    );    
    setAeropuertosFiltrados(resultados);
  };

  const handleOpenModal = (aeropuerto) => {
    setAeropuertoSeleccionado(aeropuerto);
  };

  const handleCloseModal = () => {
    setAeropuertoSeleccionado(null);
  };

  return (
    <>
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
                <ListItem button onClick={() => handleOpenModal(aeropuerto)}>
                  <ListItemIcon><LocationOn /></ListItemIcon>
                  <ListItemText 
                    primary={aeropuerto.ciudad} 
                    secondary={aeropuerto.nombre} 
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end">
                      <OpenInNew />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>

          {aeropuertosFiltrados.length === 0 && (
            <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 2 }}>
              No se encontraron resultados.
            </Typography>
          )}
        </Box>
      </Modal>

      <Modal open={!!aeropuertoSeleccionado} onClose={handleCloseModal}>
        <Box sx={styleDetalles}>
          {aeropuertoSeleccionado && (
            <>
              <Typography variant="h6" component="h2">
                {aeropuertoSeleccionado.ciudad}
              </Typography>
              <Box sx={{ mt: 2 }}>
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
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}


