import * as React from 'react';
import FadeMenu from '../MenuVertical/FadeMenu'; // Importa el componente FadeMenu
import styles from './Header.module.css';

const Header = ({ title }) => {
  return (
    <header className={styles['header-proyecto']}>
      <FadeMenu /> {/* Renderiza el componente FadeMenu */}
      <h1>{title}</h1>
      <h1>RedEx</h1>
    </header>
  );
};

export default Header;