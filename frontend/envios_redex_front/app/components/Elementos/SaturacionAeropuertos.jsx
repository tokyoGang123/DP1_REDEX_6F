import { Box, Card, CardContent, Typography } from "@mui/material";



export default function SaturacionAeropuertos({ contadorAeropuerto }) {

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
                            ESTADO AEROPUERTOS
                        </Typography>
                    </Box>
                    {/* AEROPUERTOS ROJOS */}
                    <Box sx={{ backgroundColor: '#b21010', padding: 1, borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" component="div" color="white">
                            {contadorAeropuerto.rojo}
                        </Typography>
                    </Box>
                    {/* AEROPUERTOS AMARILLOS */}
                    <Box sx={{ backgroundColor: '#eebe11', padding: 1, borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" component="div" color="black">
                            {contadorAeropuerto.amarillo}
                        </Typography>
                    </Box>
                    {/* AEROPUERTOS VERDES */}
                    <Box sx={{ backgroundColor: '#5dbe0e', padding: 1, borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" component="div" color="white">
                            {contadorAeropuerto.verde}
                        </Typography>
                    </Box>


                </Box>

            </CardContent>
        </Card>


    )

}