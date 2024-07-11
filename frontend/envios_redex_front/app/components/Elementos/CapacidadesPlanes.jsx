'use client'
import { useEffect, useState } from "react";
import { LinearProgress, Box, Typography } from "@mui/material";

export default function CapacidadesPlanes({ planes }) {
    const [contador, setContador] = useState(0)
    const [total, setTotal] = useState(0)
    //const [progress, setProgress] = useState(0)

    useEffect(() => {
        let tot = 0
        let curr = 0
        planes.forEach(plan => {
            tot += plan.capacidad_maxima
            curr += plan.capacidad_ocupada
        })
        setContador(curr)
        setTotal(tot)

    }, [planes])

    const progress = total > 0 ? (contador / total) * 100 : 0;

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="body1">
                Capacidad Ocupada - Planes: {contador} / {total} - {Math.ceil(progress)}%
            </Typography>
            <LinearProgress variant="determinate" value={progress} color="secondary"/>
        </Box>

    )


}