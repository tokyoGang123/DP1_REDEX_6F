'use client'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useEffect } from 'react';

export function CuadroTiempo({horas, minutos, segundos}) {

    //Temporal
    let horasT = 0;
    let minutosT = 0;
    let segundosT = 0;

    return (
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
            
          }}
          noValidate
          autoComplete="off"
        >
          <TextField id="outlined-basic" label="Tiempo Transcurrido" variant="outlined" disabled 
        value={
          horasT.toString().padStart(2, '0') + ":" + minutosT.toString().padStart(2, '0') + ":" + segundosT.toString().padStart(2, '0')}
          />
        </Box>
      );
}