package com.redex.logisticaReparto.controller;

import com.redex.logisticaReparto.model.Aeropuerto;
import com.redex.logisticaReparto.model.Continente;
import com.redex.logisticaReparto.model.Pais;
import com.redex.logisticaReparto.services.AeropuertoService;
import com.redex.logisticaReparto.services.ContinenteService;
import com.redex.logisticaReparto.services.PaisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;
import java.util.Scanner;

@CrossOrigin(origins = "*")
@RequestMapping("api")
@RestController
public class AeropuertoController {
    @Autowired
    private AeropuertoService aeropuertoService;
    private PaisService paisService;

    private ContinenteService continenteService;
    @Autowired
    public AeropuertoController(ContinenteService continenteService,PaisService paisService) {
        this.continenteService = continenteService;
        this.paisService = paisService;
    }


    @GetMapping("/aeropuertos/obtenerTodos")
    ArrayList<Aeropuerto> obtenerTodosAeropuertos() { return aeropuertoService.obtenerTodosAeropuertos();}

    @PostMapping("/aeropuertos/insertar")
    Aeropuerto insertarAeropuerto(Aeropuerto aeropuerto) { return aeropuertoService.insertarAeropuerto(aeropuerto); }

    @PostMapping("aeropuertos/insertarTodos")
    ArrayList<Aeropuerto> insertarTodosAeropuertos(ArrayList<Aeropuerto> aeropuertos) { return aeropuertoService.insertarListaAeropuertos(aeropuertos);}

    @GetMapping("/aeropuertos/obtenerPorId")
    Optional<Aeropuerto> obtenerAeropuertoPorId(int idAeropuerto) { return aeropuertoService.obtenerAeropuertoPorId(idAeropuerto);}

    @GetMapping("/aeropuertos/obtenerPorCodigo")
    Optional<Aeropuerto> obtenerAeropuertoPorCodigo(String codigo) { return aeropuertoService.obtenerAeropuertoPorCodigo(codigo);}

    @PostMapping("/aeropuertos/lecturaArchivo")
    ArrayList<Aeropuerto> cargarDatos(@RequestBody Map<String, String> datos){
        ArrayList<Aeropuerto> aeropuertos = new ArrayList<>();
        //Llamar ContinenteService
        Continente continente1 = new Continente();
        Continente continente2 = new Continente();
        Continente continente3 = new Continente();

        continente1.setNombre_continente("America del Sur");
        continente1.setId_continente(1);

        continente2.setNombre_continente("Europa");
        continente2.setId_continente(2);

        continente3.setNombre_continente("Asia");
        continente3.setId_continente(3);

        continenteService.insertarContinente(continente1);
        continenteService.insertarContinente(continente2);
        continenteService.insertarContinente(continente3);

        String aeropuertosDatos = datos.get("data");
        String[] lineas = aeropuertosDatos.split("\n");

        for (String linea : lineas) {
            String data[] = linea.split(",");
            Aeropuerto aeropuerto = new Aeropuerto();
            Pais pais=new Pais();
            Continente continente=new Continente();

            int continenteID = Integer.parseInt(data[1]);
            String codigoAeropuerto = data[2];
            String ciudad = data[3];
            String paisNombre = data[4];
            String diminutivoPais= data[5];
            String zonaHoraria= data[6];
            int capacidad= Integer.parseInt(data[7]);
            double latitud= Double.parseDouble(data[8]);
            double longitud= Double.parseDouble(data[9]);


            //Llamar PaisService
            pais.setNombre_pais(paisNombre);
            pais.setId_continente(continenteID);
            pais.setAeropuertos(new ArrayList<>());
            paisService.insertarPais(pais);

            //aeropuerto.setIdPais(1);
            int idPais = pais.getId_pais();

            aeropuerto.setIdPais(idPais);
            aeropuerto.setPaquetesAlmacenados(new ArrayList<>());
            aeropuerto.setLatitud(latitud);
            aeropuerto.setLongitud(longitud);aeropuerto.setEstado(1);
            aeropuerto.setCodigo(codigoAeropuerto);
            aeropuerto.setHuso_horario(zonaHoraria);
            aeropuerto.setCapacidad_maxima(capacidad);
            aeropuerto.setCapacidad_ocupada(0);
            aeropuerto.setCiudad(ciudad);
            aeropuerto.setDiminutivo(diminutivoPais);
            aeropuertos.add(aeropuerto);
            //Aeropuerto insertado
            insertarAeropuerto(aeropuerto);
        }

//        try {
//            File planesFile = new File("src/main/resources/Aeropuerto/aeropuertos.txt");
//            Scanner scanner = new Scanner(planesFile);
//
//            while(scanner.hasNextLine()) { //Leer todas la lineas
//                String row = scanner.nextLine();
//                String data[] = row.split(",");
//
//                Aeropuerto aeropuerto = new Aeropuerto();
//                Pais pais=new Pais();
//                Continente continente=new Continente();
//
//                int continenteID = Integer.parseInt(data[1]);
//                String codigoAeropuerto = data[2];
//                String ciudad = data[3];
//                String paisNombre = data[4];
//                String diminutivoPais= data[5];
//                String zonaHoraria= data[6];
//                int capacidad= Integer.parseInt(data[7]);
//                double latitud= Double.parseDouble(data[8]);
//                double longitud= Double.parseDouble(data[9]);
//
//
//                //Llamar PaisService
//                pais.setNombre_pais(paisNombre);
//                pais.setId_continente(continenteID);
//                pais.setAeropuertos(new ArrayList<>());
//                paisService.insertarPais(pais);
//
//                //aeropuerto.setIdPais(1);
//                int idPais = pais.getId_pais();
//
//                aeropuerto.setIdPais(idPais);
//                aeropuerto.setPaquetesAlmacenados(new ArrayList<>());
//                aeropuerto.setLatitud(latitud);
//                aeropuerto.setLongitud(longitud);aeropuerto.setEstado(1);
//                aeropuerto.setCodigo(codigoAeropuerto);
//                aeropuerto.setHuso_horario(zonaHoraria);
//                aeropuerto.setCapacidad_maxima(capacidad);
//                aeropuerto.setCapacidad_ocupada(0);
//                aeropuerto.setCiudad(ciudad);
//                aeropuerto.setDiminutivo(diminutivoPais);
//
//                //Aeropuerto insertado
//                insertarAeropuerto(aeropuerto);
//            }
//
//        } catch (FileNotFoundException e) {
//            throw new RuntimeException(e);
//        }

        return aeropuertos;
    }

}
