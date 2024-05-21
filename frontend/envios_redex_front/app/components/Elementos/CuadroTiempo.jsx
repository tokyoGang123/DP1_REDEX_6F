'use client'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useEffect } from 'react';

export function CuadroTiempo({horas, minutos, segundos}) {

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
          horas.toString().padStart(2, '0') + ":" + minutos.toString().padStart(2, '0') + ":" + segundos.toString().padStart(2, '0')}
          />
        </Box>
      );
}