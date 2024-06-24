import { TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";



export default function HoraActual () {
    const [tiempo, setTiempo] = useState(new Date());

    useEffect(() => {

        const interval = setInterval(() => {
            setTiempo(new Date())
        },1000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    return (<>
        <Typography>
            {tiempo.toLocaleDateString('es', {day: '2-digit',month: '2-digit',year: 'numeric'}) + " " + tiempo.toLocaleTimeString()}
        </Typography>
    </>)

}