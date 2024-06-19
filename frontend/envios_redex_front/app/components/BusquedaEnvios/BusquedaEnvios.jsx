import React, { useState } from 'react';
import {
  Modal, Box, Typography, TextField, Button, List, ListItem, ListItemText, ListItemIcon, IconButton, Divider, ListItemSecondaryAction
} from '@mui/material';
import { Search, Flight, LocalShipping, OpenInNew } from '@mui/icons-material';
import dayjs from 'dayjs';

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

export default function BusquedaEnvios({ open, onClose, envios2Ref }) {
  const [busqueda, setBusqueda] = useState('');
  const [enviosFiltrados, setEnviosFiltrados] = useState([]);
  const [envioSeleccionado, setEnvioSeleccionado] = useState(null);

  const handleBusqueda = () => {
    if (envios2Ref && envios2Ref.current) {
      const resultados = busqueda.trim().length > 0 ? envios2Ref.current.filter(envio =>
        envio.destino && typeof envio.destino === 'string' && envio.destino.toLowerCase().includes(busqueda.toLowerCase())
      ) : envios2Ref.current;
      setEnviosFiltrados(resultados);
    } else {
      console.log("envios2Ref no está definido o es null.");
    }
  };

  const handleOpenModal = (envio) => {
    setEnvioSeleccionado(envio);
  };

  const handleCloseModal = () => {
    setEnvioSeleccionado(null);
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
            <LocalShipping sx={{ mr: 1 }} />
            Búsqueda de Envíos
          </Typography>

          <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
            <TextField 
              label="Buscar por Destino" 
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
            {enviosFiltrados.map((envio) => (
              <React.Fragment key={envio.id_envio}>
                <ListItem button onClick={() => handleOpenModal(envio)}>
                  <ListItemIcon><Flight /></ListItemIcon>
                  <ListItemText 
                    primary={envio.destino}
                    secondary={`ID: ${envio.id_envio} - Cantidad: ${envio.numPaquetes}`} 
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

          {enviosFiltrados.length === 0 && (
            <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 2 }}>
              No se encontraron resultados.
            </Typography>
          )}
        </Box>
      </Modal>

      <Modal open={!!envioSeleccionado} onClose={handleCloseModal}>
        <Box sx={styleDetalles}>
          {envioSeleccionado && (
            <>
              <Typography variant="h6" component="h2">
                Detalles del Envío
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">
                  <strong>ID del Envío:</strong> {envioSeleccionado.id_envio}
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
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}







