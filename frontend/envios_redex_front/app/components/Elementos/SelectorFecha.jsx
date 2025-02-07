'use client'
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/es'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Box } from '@mui/material';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function SelectorFecha({ fechaSim, setFechaSim, estadoSim, zonaHoraria }) {



  //Valor del selector de fecha, otorga la fecha actual inicialmente y cambia de acuerdo a cambios en la fecha
  //const [fecha, setFecha] = useState(fechaSim);

  /*
   useEffect(() => {
    setFechaSim(fecha)
  },[fecha])
  */
 

  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '30ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
        <DemoContainer components={['DateTimePicker']}>
          <DateTimePicker
            label="Fecha de Simulación"
            value={fechaSim}
            onChange={(newFechaSim) => setFechaSim(newFechaSim.tz(zonaHoraria))}
            disabled={estadoSim == 'PL'}
          />
        </DemoContainer>
      </LocalizationProvider>
    </Box>
  );
}