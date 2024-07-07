import { Box, Card, CardContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";



export default function SaturacionPlanes({ contadorPlanes }) {

    const [porcentajes, setPorcentajes] = useState({gris: 0, rojo: 0, amarillo: 0, verde: 0})

    useEffect(() => {
        let total = contadorPlanes.gris + contadorPlanes.rojo + contadorPlanes.amarillo + contadorPlanes.verde
        let porGris = contadorPlanes.gris*100/total
        let porRojo = contadorPlanes.rojo*100/total
        let porAma = contadorPlanes.amarillo*100/total
        let porVerde = contadorPlanes.verde*100/total
        setPorcentajes({gris: porGris, rojo: porRojo, amarillo: porAma, verde: porVerde})
    },[contadorPlanes])


    return (
        <Card sx={{ margin: 0, padding: 0, backgroundColor: '#f0f0f0', display: 'inline-block' }}>
            <CardContent sx={{ padding: 0, '&:last-child': { paddingBottom: 0 } }}>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',  // Centra los elementos horizontalmente
                        gap: 2,
                    }}
                >
                    <Box sx={{ padding: 1, borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" component="div" color="black">
                            ESTADO PLANES
                        </Typography>
                    </Box>
                    {/* AEROPUERTOS GRIS */}
                    <Box sx={{ backgroundColor: 'gray', padding: 1, borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" component="div" color="black">
                            {porcentajes.gris ? porcentajes.gris : 0}
                        </Typography>
                    </Box>
                    {/* AEROPUERTOS ROJOS */}
                    <Box sx={{ backgroundColor: '#b21010', padding: 1, borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" component="div" color="white">
                            {porcentajes.rojo ? porcentajes.rojo : 0}
                        </Typography>
                    </Box>
                    {/* AEROPUERTOS AMARILLOS */}
                    <Box sx={{ backgroundColor: '#eebe11', padding: 1, borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" component="div" color="black">
                            {porcentajes.amarillo ? porcentajes.amarillo : 0}
                        </Typography>
                    </Box>
                    {/* AEROPUERTOS VERDES */}
                    <Box sx={{ backgroundColor: '#5dbe0e', padding: 1, borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" component="div" color="white">
                            {porcentajes.verde ? porcentajes.verde : 0}
                        </Typography>
                    </Box>


                </Box>

            </CardContent>
        </Card>


    )

}