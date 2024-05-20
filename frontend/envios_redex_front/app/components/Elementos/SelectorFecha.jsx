'use client'
import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function SelectorFecha() {



  //Valor del selector de fecha, otorga la fecha actual inicialmente y cambia de acuerdo a cambios en la fecha
  const [fecha, setFecha] = React.useState(dayjs());


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker']}>
        <DateTimePicker
          label="Fecha Inicio"
          value={fecha}
          onChange={(newFecha) => setFecha(newFecha)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}