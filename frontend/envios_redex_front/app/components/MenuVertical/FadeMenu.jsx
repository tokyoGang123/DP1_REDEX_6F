import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styles from './MenuStyles.module.css';
import BusquedaPlanes from '../BusquedaPlanes/BusquedaPlanes';
import BusquedaAeropuertos from '../BusquedaAeropuertos/BusquedaAeropuertos'; // Importa el componente de búsqueda de aeropuertos
import BusquedaEnvios from '../BusquedaEnvios/BusquedaEnvios';

const FadeMenu = ({ planesDeVueloRef, aeropuertos, envios2Ref }) => { // Agrega aeropuertos como un parámetro
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openBusquedaPlanes, setOpenBusquedaPlanes] = React.useState(false);
  const [openBusquedaAeropuertos, setOpenBusquedaAeropuertos] = React.useState(false);
  const [openBusquedaEnvios, setOpenBusquedaEnvios] = React.useState(false); // Agrega estado para controlar la apertura de
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenBusquedaPlanes = () => {
    setOpenBusquedaPlanes(true);
    setAnchorEl(null);
  };


  const handleOpenBusquedaAeropuertos = () => {
    setOpenBusquedaAeropuertos(true);
    setAnchorEl(null);
  };

  const handleOpenBusquedaEnvios = () => {
    setOpenBusquedaEnvios(true);
    setAnchorEl(null);
  };


  const handleCloseBusquedaPlanes = () => {
    setOpenBusquedaPlanes(false);
  };

  const handleCloseBusquedaAeropuertos = () => {
    setOpenBusquedaAeropuertos(false);
  };

  const handleCloseBusquedaEnvios = () => {
    setOpenBusquedaEnvios(false);
  };

  //console.log("envios2Ref en FadeMenu:",envios2Ref);

  return (
    <div>
      <IconButton
        aria-controls="fade-menu"
        aria-haspopup="true"
        aria-expanded={openBusquedaPlanes || openBusquedaAeropuertos || openBusquedaEnvios ? 'true' : undefined}
        onClick={handleClick}
        className={styles.menuIcon}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        TransitionProps={{
          onExited: handleClose,
        }}
      >
        <MenuItem onClick={handleOpenBusquedaPlanes}>Planes de Vuelo</MenuItem>
        <MenuItem onClick={handleOpenBusquedaAeropuertos}>Aeropuertos</MenuItem>
        <MenuItem onClick={handleOpenBusquedaEnvios}>Envios</MenuItem>
      </Menu>
      <BusquedaPlanes open={openBusquedaPlanes} onClose={handleCloseBusquedaPlanes} planesDeVueloRef={planesDeVueloRef} />
      <BusquedaAeropuertos open={openBusquedaAeropuertos} onClose={handleCloseBusquedaAeropuertos} aeropuertos={aeropuertos} /> {/* Pasa aeropuertos como una propiedad */}
      <BusquedaEnvios open={openBusquedaEnvios} onClose={handleCloseBusquedaEnvios} envios2Ref={envios2Ref} />
    </div>
  );
};

export default FadeMenu;
