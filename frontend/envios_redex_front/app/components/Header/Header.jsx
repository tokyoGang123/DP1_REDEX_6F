import React from 'react';
import styles from './Header.module.css';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu'; // Importa el ícono de menú

const Header = ({ title, togglePanel }) => {
  return (
    <header className={styles['header-proyecto']} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
      <h1 style={{ margin: 0, flexGrow: 1, textAlign: 'left' }}>RedEx</h1>
      <h1 style={{ flexGrow: 3, textAlign: 'center', margin: 0, marginRight: '+300px' }}>{title}</h1>
      <IconButton 
        onClick={togglePanel} 
        style={{ position: 'absolute', right: '10px' }}
        size="large"
      >
        <MenuIcon /> {/* Ícono de menú */}
      </IconButton>
    </header>
  );
};

export default Header;



