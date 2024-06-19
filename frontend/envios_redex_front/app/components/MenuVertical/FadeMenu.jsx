// /components/MenuVertical/FadeMenu.jsx
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styles from './MenuStyles.module.css';
import BusquedaPlanes from '../BusquedaPlanes/BusquedaPlanes';

const FadeMenu = ({ planesDeVueloRef }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openBusquedaPlanes, setOpenBusquedaPlanes] = React.useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenBusquedaPlanes = () => {
    setOpenBusquedaPlanes(true);
    handleClose(); // Cierra el menú al abrir el modal
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
        aria-label="menu"
        aria-controls="menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem onClick={handleOpenBusquedaPlanes} className={styles.menuItem}>
          PLANES DE VUELO
        </MenuItem>
        <MenuItem onClick={handleClose} className={styles.menuItem}>
          ENVIOS
        </MenuItem>
        <MenuItem onClick={handleClose} className={styles.menuItem}>
          AEROPUERTOS
        </MenuItem>
        <MenuItem onClick={handleClose} className={styles.menuItem}>
          CAMBIO MODO DE EJECUCION
        </MenuItem>
      </Menu>

      <BusquedaPlanes 
        open={openBusquedaPlanes} 
        onClose={() => setOpenBusquedaPlanes(false)} 
        planesDeVueloRef={planesDeVueloRef}
      />
    </div>
  );
};

export default FadeMenu;