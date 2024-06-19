import * as React from 'react';
import FadeMenu from '../MenuVertical/FadeMenu'; // Importa el componente FadeMenu
import styles from './Header.module.css';

const Header = ({ title, planesDeVueloRef, aeropuertos, envios2Ref}) => { // Agrega aeropuertos como un parámetro
  //console.log("envios2Ref en Header:",envios2Ref);
  return (
    <header className={styles['header-proyecto']}>
      <FadeMenu planesDeVueloRef={planesDeVueloRef} aeropuertos={aeropuertos} envios2Ref={envios2Ref} /> {/* Pasa aeropuertos como una propiedad */}
      <h1>{title}</h1>
      <h1>RedEx</h1>
    </header>
  );
};

export default Header;
