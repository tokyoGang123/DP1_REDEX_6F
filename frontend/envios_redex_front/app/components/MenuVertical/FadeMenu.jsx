import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styles from './MenuStyles.module.css';

const FadeMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleClose} className={styles.menuItem}>
          PLANES DE VUELO
        </MenuItem>
        <MenuItem onClick={handleClose} className={styles.menuItem}>
          ENVIOS
        </MenuItem>
        <MenuItem onClick={handleClose} className={styles.menuItem}>
          AEROPUERTOS
        </MenuItem>
        <MenuItem onClick={handleClose} className={styles.menuItem}>
          ENVIOS
        </MenuItem>
        <MenuItem onClick={handleClose} className={styles.menuItem}>
          CAMBIO MODO DE EJECUCION
        </MenuItem>
      </Menu>
    </div>
  );
};

export default FadeMenu;
