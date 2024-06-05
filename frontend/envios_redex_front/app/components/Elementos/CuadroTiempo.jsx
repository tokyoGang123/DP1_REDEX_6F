'use client'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useEffect } from 'react';

// horas.toString().padStart(2, '0') + ":" + minutos.toString().padStart(2, '0') + ":" + segundos.toString().padStart(2, '0')

const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export function CuadroTiempo({horas, minutos, segundos,tiempo}) {

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
        value={ formatTime(tiempo)
         }
          />
        </Box>
      );
}