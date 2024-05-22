package com.redex.logisticaReparto.controller;

import com.redex.logisticaReparto.model.Aeropuerto;
import com.redex.logisticaReparto.model.Envio;
import com.redex.logisticaReparto.model.PlanDeVuelo;
import com.redex.logisticaReparto.services.AeropuertoService;
import com.redex.logisticaReparto.services.EnvioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileNotFoundException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Optional;
import java.util.Scanner;

@CrossOrigin(origins = "*")
@RequestMapping("api")
@RestController
public class EnvioController {
    @Autowired
    private EnvioService envioService;
    @Autowired
    private AeropuertoService aeropuertoService;

    @GetMapping("/envios/obtenerTodos")
    ArrayList<Envio> obtenerTodosEnvios() { return envioService.obtenerEnvios();}

    @PostMapping("/envios/insertar")
    Envio insertarEnvio(Envio envio) { return envioService.insertarEnvio(envio); }

    @GetMapping("/envios/obtenerPorId")
    Optional<Envio> obtenerPorId(long idEnvio) { return envioService.obtenerEnvioPorId(idEnvio);}

    @PostMapping("envios/insertarTodos")
    ArrayList<Envio> insertarTodosEnvios(ArrayList<Envio> envios) {return envioService.insertarListaEnvios(envios);}

    @PostMapping("envios/cargarArchivoEnvios")
    ArrayList<Envio> cargarEnvios(){
        ArrayList<Envio> envios = new ArrayList<>();
        try {
            File enviosFile = new File("src/main/resources/Envios/pack_enviado_EBCI.txt");
            Scanner scanner = new Scanner(enviosFile);
            while (scanner.hasNextLine()) {
                String row = scanner.nextLine();
                String data[] = row.split("-");
                if (data.length > 1) {
                    Optional<Aeropuerto> aeropuertoOptionalOrig = aeropuertoService.obtenerAeropuertoPorCodigo(data[0]);
                    //CDES:QQ
                    String dataCdes[] = data[4].split(":");
                    Optional<Aeropuerto> aeropuertoOptionalDest = aeropuertoService.obtenerAeropuertoPorCodigo(dataCdes[0]);

                    if (aeropuertoOptionalOrig.isPresent() && aeropuertoOptionalDest.isPresent()) {
                        Aeropuerto aeropuertoOrigen = aeropuertoOptionalOrig.get();
                        Aeropuerto aeropuertoDest = aeropuertoOptionalDest.get();

                        int ciudadOrigen = aeropuertoOrigen.getId_aeropuerto();
                        long numero_envio_Aeropuerto = Long.parseLong(data[1]); // cambiar a numero_envio_Aeropuerto

                        int ciudadDestino = aeropuertoDest.getId_aeropuerto();
                        int numPaquetes = Integer.parseInt(dataCdes[1]);

                        String husoCiudadOrigen = aeropuertoOrigen.getHuso_horario();
                        String husoCiudadDestino = aeropuertoDest.getHuso_horario();

                        //FORI y HORI
                        int anho = Integer.parseInt(data[2].substring(0,4));
                        int mes = Integer.parseInt(data[2].substring(4,6));
                        int dia = Integer.parseInt(data[2].substring(6,8));

                        String tiempoHM[] = data[3].split(":");
                        int hora = Integer.parseInt(tiempoHM[0]);
                        int minutos = Integer.parseInt(tiempoHM[1]);

                        ZonedDateTime tiempoOrigen = ZonedDateTime.of(LocalDate.of(anho,mes,dia), LocalTime.of(hora,minutos,0), ZoneId.of(husoCiudadOrigen));

                        //AGREGAR CONDICION PARA VER SI ES VUELO NACIONAL O INTERNACIONAL
                        ZonedDateTime tiempoMax = tiempoOrigen.withZoneSameLocal(ZoneId.of(husoCiudadDestino)).plusDays(2); //ya que en el juego de datos aun no hay del mismo pais xd ni habra :v
                        //

                        Envio newEnvio = new Envio(0,numero_envio_Aeropuerto,tiempoOrigen,ciudadOrigen,ciudadDestino,tiempoMax,numPaquetes );
                        envios.add(newEnvio);
                    }

                }
            }
        } catch (FileNotFoundException e) {
            System.out.println("Archivo de pedidos no encontrado, error: " + e.getMessage());
        }
        envioService.insertarListaEnvios(envios);
        return envios;

    }

}
