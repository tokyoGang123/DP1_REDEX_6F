package com.redex.logisticaReparto.controller;

import com.redex.logisticaReparto.model.Aeropuerto;
import com.redex.logisticaReparto.model.Envio;
import com.redex.logisticaReparto.model.Paquete;
import com.redex.logisticaReparto.model.PlanDeVuelo;
import com.redex.logisticaReparto.services.AeropuertoService;
import com.redex.logisticaReparto.services.EnvioService;
import com.redex.logisticaReparto.services.PaqueteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileNotFoundException;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Map;
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
    @Autowired
    private PaqueteService paqueteService;

    @GetMapping("/envios/obtenerTodos")
    ArrayList<Envio> obtenerTodosEnvios() { return envioService.obtenerEnvios();}

    @GetMapping("/envios/obtenerTodosFecha/{fecha}")
    ArrayList<Envio> obtenerTodosEnviosFecha(@PathVariable String fecha) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        LocalDate localDate = LocalDate.parse(fecha, formatter);

        return envioService.obtenerEnviosPorFecha(localDate);
    }

    @PostMapping("/envios/insertar")
    Envio insertarEnvio(Envio envio) { return envioService.insertarEnvio(envio); }

    @GetMapping("/envios/obtenerPorId")
    Optional<Envio> obtenerPorId(long idEnvio) { return envioService.obtenerEnvioPorId(idEnvio);}

    @PostMapping("envios/insertarTodos")
    ArrayList<Envio> insertarTodosEnvios(ArrayList<Envio> envios) {return envioService.insertarListaEnvios(envios);}

    @PostMapping("envios/cargarArchivoEnvios")
    ArrayList<Envio> cargarEnvios(@RequestBody Map<String, String> datos){
        long startTime = System.currentTimeMillis();
        ArrayList<Envio> envios = new ArrayList<>();
        String enviosDatos = datos.get("data");
        String[] lineas = enviosDatos.split("\n");

        for (String linea : lineas) {
            int i= 0;
            String data[] = linea.split("-");
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

                    LocalDateTime tiempoOrigen = LocalDateTime .of(LocalDate.of(anho,mes,dia), LocalTime.of(hora,minutos,0));

                    //AGREGAR CONDICION PARA VER SI ES VUELO NACIONAL O INTERNACIONAL
                    LocalDateTime tiempoMax = tiempoOrigen.plusDays(2); //ya que en el juego de datos aun no hay del mismo pais xd ni habra :v
                    //
                    Envio newEnvio = new Envio(0,numero_envio_Aeropuerto,tiempoOrigen,ciudadOrigen,
                            ciudadDestino,tiempoMax,numPaquetes,husoCiudadOrigen,husoCiudadDestino);
                    envios.add(newEnvio);
                }

            }
            System.out.println(i);
            i++;
        }
        envioService.insertarListaEnvios(envios);
        ArrayList<Paquete> paquetes = new ArrayList<>();

        // Generar y agregar los paquetes para cada envío
        for (Envio envio : envios) {
            ArrayList<Paquete> paquetesEnvio = new ArrayList<>();
            for (int j = 0; j < envio.getNumPaquetes(); j++) {
                Paquete paquete = new Paquete(0);
                paquete.setEnvio(envio);
                paquetesEnvio.add(paquete);
                paquetes.add(paquete);
            }
            // Agregar la lista de paquetes al envío
            envio.setPaquetes(paquetesEnvio);
        }
        // Guardar todos los paquetes de una vez
        paqueteService.insertarListaPaquetes(paquetes);

        long endTime = System.currentTimeMillis();
        long durationInMillis = endTime - startTime;
        double durationInSeconds = durationInMillis / 1000.0;
        System.out.println("Tiempo de ejecución: " + durationInSeconds + " segundos");
        return envios;
    }

    @PostMapping("envios/cargarArchivoEnviosBack")
    ArrayList<Envio> cargarEnviosBack(){
        long startTime = System.currentTimeMillis();
        ArrayList<Envio> envios = new ArrayList<>();
        try {
            File enviosFile = new File("src/main/resources/EnviosAngelo/pack_enviado_SCEL.txt");
            Scanner scanner = new Scanner(enviosFile);
            int i= 0;
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

                        LocalDateTime tiempoOrigen = LocalDateTime .of(LocalDate.of(anho,mes,dia), LocalTime.of(hora,minutos,0));

                        //AGREGAR CONDICION PARA VER SI ES VUELO NACIONAL O INTERNACIONAL
                        LocalDateTime tiempoMax = tiempoOrigen.plusDays(2); //ya que en el juego de datos aun no hay del mismo pais xd ni habra :v
                        //

                        Envio newEnvio = new Envio(0,numero_envio_Aeropuerto,tiempoOrigen,ciudadOrigen,
                                ciudadDestino,tiempoMax,numPaquetes,husoCiudadOrigen,husoCiudadDestino);
                        envios.add(newEnvio);
                    }

                }
                System.out.println(i);
                i++;
            }
        } catch (FileNotFoundException e) {
            System.out.println("Archivo de pedidos no encontrado, error: " + e.getMessage());
        }
        envioService.insertarListaEnvios(envios);
        ArrayList<Paquete> paquetes = new ArrayList<>();

        // Generar y agregar los paquetes para cada envío
        for (Envio envio : envios) {
            ArrayList<Paquete> paquetesEnvio = new ArrayList<>();
            for (int j = 0; j < envio.getNumPaquetes(); j++) {
                Paquete paquete = new Paquete(0);
                paquete.setEnvio(envio);
                paquetesEnvio.add(paquete);
                paquetes.add(paquete);
            }
            // Agregar la lista de paquetes al envío
            envio.setPaquetes(paquetesEnvio);
        }
        // Guardar todos los paquetes de una vez
        paqueteService.insertarListaPaquetes(paquetes);

        long endTime = System.currentTimeMillis();
        long durationInMillis = endTime - startTime;
        double durationInSeconds = durationInMillis / 1000.0;
        System.out.println("Tiempo de ejecución: " + durationInSeconds + " segundos");
        return envios;

    }

}
