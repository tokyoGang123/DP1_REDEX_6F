package com.redex.logisticaReparto.model;

import com.redex.logisticaReparto.repository.PlanDeVueloRepository;
import com.redex.logisticaReparto.services.PlanDeVueloService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.*;

@Getter
@Setter
@Component
public class Grasp {

    //@Autowired
    //PlanDeVueloService planDeVueloService = new PlanDeVueloService();

    ArrayList<Aeropuerto> aeropuertos;
    ArrayList<Pais> paises;
    ArrayList<Continente> continentes;
    ArrayList<Envio> envios = new ArrayList<>();
    ArrayList<PlanDeVuelo> planes = new ArrayList<>();

    ArrayList<Envio> solucionSimulacion;

    public Grasp() {
    }

    //public Grasp(PlanDeVueloService planDeVueloService) {
    //    this.planDeVueloService = planDeVueloService;
    //}
    public ArrayList<Envio> faseConstructivaGRASP(ArrayList<Aeropuerto> aeropuertos, ArrayList<PlanDeVuelo> planes, ArrayList<Envio> enviosSolicitados) {

        //Solucion
        ArrayList<Envio> solucion = new ArrayList<>();

        //Mezclar lista de envios recibidos
        Random rand = new Random();
        //Collections.shuffle(enviosSolicitados);

        //DESMUTEAR SHUFFLE ENVIOS PARA EL PROBLEMA REAL

        //Mezclar la lista de vuelos (ayuda a que no siempre salga el primero
        Collections.shuffle(planes);

        //Tamanho de lista restringida
        int tamRCL = 2;

            /*

            1. Elegimos un envio
            2. Cada vuelo que sale de su aeropuerto de origen será el inicio de un elemento posible para la
                lista restringida
            3. Por cada vuelo, encontramos una ruta posible que cumpla con los requisitos
                (llega a tiempo, entra a vuelos con espacio)
            4. Elegimos las rutas que llegan en menor tiempo para la lista restringida y elegimos una al azar
            5. Asignamos la ruta a tantos paquetes sea posible. En caso no se puedan mandar todos por dicha ruta,
                escogemos otra de la lista y asi sucesivamente.
             */


        //Para fines del algoritmo, se va a aumentar y considerar los paquetes asignados en aeropuertos y paquetes
        ArrayList<Aeropuerto> aeropuertosTemp = new ArrayList<>(aeropuertos);
        ArrayList<PlanDeVuelo> planesTemp = new ArrayList<>(planes);

        //Encontrar la solucion por cada pedido
        for (Envio envio : enviosSolicitados) { //Buscar solucion para cada pedido
            //Quitar envios sin destino de la lista
            System.out.println(envio.getId_envio());
            if (envio.getAeropuerto_origen() == -1 || envio.getAeropuerto_destino() == -1) continue;

            //LISTA RESTRINGIDA
            ArrayList<ElementoListaRestringida> listaRestringida = new ArrayList<ElementoListaRestringida>(tamRCL);

            //Por cada vuelo que sale del aeropuerto, ejecutaremos la busqueda de ruta
            //System.out.println("BUSQUEDA INICIADA");
            for (PlanDeVuelo planDeVuelo : planesTemp) {
                //Se asume que planes estan ordenados
                //System.out.println(planDeVuelo.getHora_origen() + " vs " + envio.getFecha_llegada_max());
                if (planDeVuelo.getHora_origen().isAfter(envio.getFecha_llegada_max())) break;
                if (envio.getAeropuerto_origen() == planDeVuelo.getCiudad_origen()) {
                    int i = 0;
                    ArrayList<Long> listaObtenida = generaRutaVuelo(aeropuertosTemp, planesTemp, planDeVuelo, envio, i);

                    //Si hay una ruta encontrada, la colocaremos en nuestra lista restringida
                    if (!listaObtenida.isEmpty()) {
                        ArrayList<Long> listaCaminos = new ArrayList<>();
                        listaCaminos.addAll(listaObtenida);

                        //Determinar si ingresa a nuestra lista
                        //CAMBIAR A FUNCION DE FITNESS
                        ElementoListaRestringida rutaPotencial = new ElementoListaRestringida(listaCaminos, getFitness(listaCaminos, planesTemp));

                        //Si la lista no esta completamente llena, agregar
                        if (listaRestringida.size() < tamRCL) {
                            listaRestringida.add(rutaPotencial);
                        } else { //Buscar el peor elemento y cambiarlo, si existe
                            for (ElementoListaRestringida elem : listaRestringida) {
                                if (elem.getFitnessSolucion() < rutaPotencial.getFitnessSolucion()) {
                                    listaRestringida.set(listaRestringida.indexOf(elem), rutaPotencial);
                                    break;
                                }
                            }
                        }
                        //Ordenar la lista segun el fitness
                        Collections.sort(listaRestringida, Comparator.comparing(ElementoListaRestringida::getFitnessSolucion));

                    }
                }
            }
            //Si la lista está vacía, no habia rutas y ocurre colapso
            if (listaRestringida.isEmpty()) {
                //System.out.println("No se pudo encontrar rutas posibles para paquetes del envio " + envio.getId_envio());
                //Descomentar break en producto final
                //break;
            }
            //Ya que hay varios paquetes en un pedido, se asignarán tantos como se puedan a la primera opcion,
            //asignando los restantes a la segunda opcion Y asi consecutivamente.
            //De no poder asignar todos los paquetes a estos pedidos, se considerará como COLAPSO
            int numPaquetes = 0;
            while (numPaquetes != envio.getPaquetes().size() && listaRestringida.size() != 0) {
                int num = rand.nextInt(listaRestringida.size()); //Obtener numero de lista restringida aleatoriamente
                ElementoListaRestringida elem = listaRestringida.get(num);
                //Mientras que haya espacio disponible en todos los vuelos
                while (espacioDisponible(elem.getListaElementos(), planesTemp)) {
                    //Luego de comprobar que se pueda, asignar todas las rutas a dicho paquete, y
                    //aumentar en 1 el espacio ocupado en el plan de vuelo
                    for (Long idPlanAAsignar : elem.getListaElementos()) {
                        PlanDeVuelo p = obtenerPlanByID(planesTemp,idPlanAAsignar);
                        p.setCapacidad_ocupada(p.getCapacidad_ocupada() + 1);
                        envio.getPaquetes().get(numPaquetes).getRuta().getListaRutas().add(idPlanAAsignar);
                    }
                    numPaquetes++;
                    if (numPaquetes == envio.getPaquetes().size()) break;

                }
                listaRestringida.remove(num);
                if (numPaquetes == envio.getPaquetes().size()) break;
            }
            //imprimePlanesDeVueloAhora(planesTemp);

            for (ElementoListaRestringida elem : listaRestringida) {
                //imprimePlanesAsignadosBeta(planesTemp,elem.getListaElementos(),envio);
            }
            solucion.add(envio);
        }


        return solucion;
    }
    public PlanDeVuelo obtenerPlanByID(ArrayList<PlanDeVuelo> planDeVuelos, Long id) {
        /*for (PlanDeVuelo plan : planDeVuelos) {
            if (plan.getId_tramo() == id) return plan;
        }
        return null;*/
        return planDeVuelos.stream()
                .filter(plan -> plan.getId_tramo() == id)
                .findFirst()
                .orElse(null);
    }

    public boolean espacioDisponible(ArrayList<Long> vuelos, ArrayList<PlanDeVuelo> planes) {
        for (Long vuelo:vuelos) {
            PlanDeVuelo p = obtenerPlanByID(planes,vuelo);
            if (p.isFull()) return false;
        }
        return true;

    }
    public Aeropuerto aeropuertoByID(ArrayList<Aeropuerto> aeropuertos, int id) {
        for (Aeropuerto aeropuerto : aeropuertos) {
            if (aeropuerto.getId_aeropuerto() == id) return aeropuerto;
        }
        return null;
    }

    public double getFitness(ArrayList<Long> listaCaminos, ArrayList<PlanDeVuelo> planes) {

        double fitnessTotal = 0;
        double minutosTotales = 0;
        int vuelosATomar = 0;
        for (Long camino : listaCaminos) {
            PlanDeVuelo p = obtenerPlanByID(planes,camino);

            //Fitness será determinado por
            // # de vuelos a tomar
            vuelosATomar++;

            // tiempo en minutos total para llegar al destino
            long segundosTotalesOrigen = p.getZonedHora_origen().toInstant().getEpochSecond();
            long segundosTotalesDestino = p.getZonedHora_destino().toInstant().getEpochSecond();
            double minutosVuelo = Duration.ofSeconds(Math.abs(segundosTotalesDestino - segundosTotalesOrigen)).toMinutes();
            minutosTotales += minutosVuelo;
        }
        //System.out.println(minutosTotales + " - " + vuelosATomar);
        //vuelosATomar = vuelosATomar * vuelosATomar;

        double pesoMinutos = 0.6;
        double pesoVuelos = 0.4;
        fitnessTotal = (vuelosATomar * pesoVuelos + minutosTotales * pesoMinutos) * -1;

        //fitnessTotal = (1.0 / vuelosATomar*minutosTotales);
        //
        //System.out.println(listaCaminos.size() + " - " + minutosTotales);
        //System.out.println(fitnessTotal);


        return fitnessTotal;
    }

    ;

    public ArrayList<Long> generaRutaVuelo(ArrayList<Aeropuerto> aeropuertos, ArrayList<PlanDeVuelo> planes, PlanDeVuelo planFinalizado, Envio envio, int i) {

        //Arraylist para almacenar datos
        ArrayList<Long> listaEnConstruccion = new ArrayList<>();

        //Identificamos el aeropuerto en el que nos encontramos
        int aeropuertoActual = planFinalizado.getCiudad_destino();

        //Añadimos a esta lista
        //Si ya estamos en el destino, lo logramos y devolvemos el id de este plan
        if (aeropuertoActual == envio.getAeropuerto_destino()
                && !planFinalizado.isFull()
                && envio.getFecha_ingreso().isBefore(planFinalizado.getHora_origen())
                && envio.getFecha_llegada_max().isAfter(planFinalizado.getHora_destino()) /*Si el vuelo no incumple con los tiempos establecidos*/
        ) {
            listaEnConstruccion.add(planFinalizado.getId_tramo());
            return listaEnConstruccion;
        }
        i++;

        //Si no estamos en el destino, buscar un camino
        for (PlanDeVuelo potencial : planes) {
            if (i > 4) new ArrayList<>(); //borrar si esta mal
            //borrar si esta mal
            if (
                    potencial.getId_tramo() != planFinalizado.getId_tramo() &&
                            aeropuertoActual == potencial.getCiudad_origen() /* Si el plan potencial inicia en donde va a llegar*/
                            && planFinalizado.getHora_destino().isBefore(potencial.getHora_origen())  /*Si el plan potencial inicia luego del que finalizamos*/
                            && !aeropuertoByID(aeropuertos, potencial.getCiudad_destino()).isFull() /* Si el aeropuerto al que iremos no esta lleno*/
                            && !potencial.isFull() /*Si el plan no esta lleno*/
                            && envio.getFecha_ingreso().isBefore(potencial.getHora_origen())
                            && envio.getFecha_llegada_max().isAfter(potencial.getHora_destino()) /*Si el vuelo no incumple con los tiempos establecidos*/) {
                    /*
                    //Añadimos a esta lista
                    //Si ya estamos en el destino, lo logramos y devolvemos el id de este plan
                    if (aeropuertoActual == envio.getAeropuerto_destino()) {
                        System.out.println("ENCONTRADO");
                        listaEnConstruccion.add(planFinalizado.getId_tramo());
                        return listaEnConstruccion;
                    }*/

                //Buscamos nuevas rutas basadas en esta
                ArrayList<Long> nuevasRutas = generaRutaVuelo(aeropuertos, planes, potencial, envio, i);
                //Si tenemos una lista no vacia, agregamos y devolvemos
                if (!nuevasRutas.isEmpty()) {
                    //if (i != 1) {listaEnConstruccion.add(potencial.getId_tramo());}
                    listaEnConstruccion.add(planFinalizado.getId_tramo());
                    listaEnConstruccion.addAll(nuevasRutas);
                    return listaEnConstruccion;
                }
            }

        }
        //Si no se encontro nada, regresar un ArrayList vacio
        return new ArrayList<>();
    }
    private int obtenerCiudadActual(Ruta ruta, ArrayList<PlanDeVuelo> planes) {
        // Obtener la última ciudad en la ruta actual
        int ultimaCiudad = 0;
        for (Long idPlan : ruta.getListaRutas()) {
            PlanDeVuelo plan = obtenerPlanByID(planes, idPlan);
            ultimaCiudad = plan.getCiudad_destino();
        }
        return ultimaCiudad;
    }

    private int obtenerCiudadDestino(Ruta rutaActual, ArrayList<PlanDeVuelo> planes) {
        // Obtener el último plan de vuelo en la ruta actual
        Long ultimoPlanId = rutaActual.getListaRutas().get(rutaActual.getListaRutas().size() - 1);
        PlanDeVuelo ultimoPlan = obtenerPlanByID(planes, ultimoPlanId);
        return ultimoPlan.getCiudad_destino();
    }
    private boolean esRutaValida(Ruta ruta, ArrayList<PlanDeVuelo> planes, Envio envio, Paquete paquete) {
        Long ultimoPlanId = ruta.getListaRutas().get(ruta.getListaRutas().size() - 1);
        PlanDeVuelo ultimoPlan = obtenerPlanByID(planes, ultimoPlanId);

        if (envio.getFecha_llegada_max().isAfter(ultimoPlan.getHora_destino())) {
            return true;
        } else {
            return false;
        }
    }

    private void generarCaminos(Ruta rutaActual, ArrayList<PlanDeVuelo> planes, Envio envio, Paquete paquete,
                                       int destinoFinal, ArrayList<Ruta> vecindario, int[] contador) {
        if (contador[0]>=1) return;
        int ciudadActual = obtenerCiudadActual(rutaActual, planes); // Obtener la última ciudad en la ruta actual
        if (ciudadActual == destinoFinal) {
            // Si llegamos al destino final, validamos y agregamos esta ruta al vecindario
            if (esRutaValida(rutaActual, planes, envio, paquete)||contador[0]<3) {
                //System.out.println("Estoy aca");
                Ruta rutaNueva = new Ruta();
                rutaNueva.copiarRuta(rutaActual);
                vecindario.add(rutaNueva);
                contador[0]++;
                return;
            }

        }
        // Buscamos vuelos posibles desde la ciudad actual
        // 1. Filtra planes de vuelo que tengan como ciudad de origen la ciudad actual
        // 2. La ruta generada no contiene al plan de vuelo a evaluar
        // 3. La hora de destino del plan a evaluar es antes a la fecha máxima de entrega del envío
        // 4. La hora de partida del plan a evaluar es despues de la hora de destino del ultimo plan de la ruta
        for (PlanDeVuelo vuelo : planes) {

            if (vuelo.getCiudad_origen() == ciudadActual && !rutaActual.getListaRutas().contains(vuelo.getId_tramo())
                    && vuelo.getHora_destino().isBefore(envio.getFecha_llegada_max())
                    && vuelo.getHora_origen().isAfter(obtenerPlanByID(planes,rutaActual.getListaRutas().get(rutaActual.getListaRutas().size()-1)).getHora_destino())

            ) {
                Ruta nuevaRuta = new Ruta();
                nuevaRuta.copiarRuta(rutaActual);
                nuevaRuta.getListaRutas().add(vuelo.getId_tramo()); // Agregamos el vuelo a la nueva ruta
                generarCaminos(nuevaRuta, planes, envio, paquete, destinoFinal, vecindario,contador); // Llamada recursiva
            }
        }

    }

    private ArrayList<Ruta> generaVecindario(Ruta rutaActual, ArrayList<PlanDeVuelo> planes, Envio envio,
                                                    Paquete paquete) {
        ArrayList<Ruta> vecindario = new ArrayList<>();
        Ruta rutaInicial = new Ruta();
        int[] contador = {0};
        rutaInicial.getListaRutas().add(rutaActual.getListaRutas().get(0)); // Tomamos el primer vuelo como inicio

        generarCaminos(rutaInicial, planes, envio, paquete, obtenerCiudadDestino(rutaActual, planes), vecindario,contador);

        return vecindario;
    }

    public Ruta getRutaMejorada(Paquete paquete, Ruta rutaActual, ArrayList<Aeropuerto> aeropuertos,
                                       ArrayList<PlanDeVuelo> planes,Envio envio) {

        Ruta mejorRuta = null;
        double mejorFitness = Double.MAX_VALUE;

        ArrayList<Ruta> vecindario = generaVecindario(rutaActual, planes, envio, paquete);
        //System.out.println(vecindario.size());
        for (Ruta rutaVecindario : vecindario) {
            double fitnessVecindario = getFitness(rutaVecindario.getListaRutas(), planes);

            if (Math.abs(fitnessVecindario) < Math.abs(mejorFitness)) {
                mejorRuta = rutaVecindario;
                mejorFitness = fitnessVecindario;
            }
        }
        if (Math.abs(mejorFitness) < Math.abs(getFitness(rutaActual.getListaRutas(), planes))) {
            return mejorRuta;
        } else {
            return null;
        }
    }

    public ArrayList<Envio> busquedaLocalGRASP(ArrayList<Aeropuerto> aeropuertos, ArrayList<PlanDeVuelo> planes,
                                                      ArrayList<Envio> enviosCubiertos) {
        int n = enviosCubiertos.size();
        ArrayList<Envio> enviosMejorados  = new ArrayList<>();

        for (int i = 0; i<n; i++){
            Envio envioActual = enviosCubiertos.get(i);
            //Envio envioMejorado = new Envio(envioActual);
            for (Paquete paquete : envioActual.getPaquetes()) {
                Ruta rutaActual = paquete.getRuta();
                //System.out.println(paquete.getRuta().getListaRutas().size());
                if (rutaActual.getListaRutas().size() == 0) continue;
                Ruta rutaMejorada = getRutaMejorada(paquete, rutaActual, aeropuertos, planes, envioActual);
                //System.out.println("Pasa la funcion de busqueda");
                if (rutaMejorada != null) {
                    paquete.setRuta(rutaMejorada);
                }
            }
            enviosMejorados.add(envioActual);
        }
        return enviosMejorados;
    }

    public  void imprimeSolucionEncontrada(ArrayList<Aeropuerto> aeropuertos,ArrayList<PlanDeVuelo> planes,ArrayList<Envio> enviosSolicitados){

        System.out.println(" ---- ENVIOS PROGRAMADOS ----");

        for (Envio envio: enviosSolicitados) {
            if (envio.getAeropuerto_origen() != -1 && envio.getAeropuerto_destino() != -1) {
                System.out.println("ENVIO #" + envio.getId_envio());
                String ciudadOg = aeropuertoByID(aeropuertos,envio.getAeropuerto_origen()).getCiudad();
                String ciudadFi = aeropuertoByID(aeropuertos,envio.getAeropuerto_destino()).getCiudad();
                System.out.println(ciudadOg + " -> " + ciudadFi);
                System.out.println(envio.getFecha_ingreso() + " -> " + envio.getFecha_llegada_max());

                for (Paquete paquete : envio.getPaquetes()) {
                    System.out.println("=======");
                    System.out.println("Paquete #" + paquete.getId_paquete());
                    System.out.println("Ruta:");
                    for (Long idPlan : paquete.getRuta().getListaRutas()) {
                        PlanDeVuelo p = obtenerPlanByID(planes,idPlan);
                        String ciudadOgP = aeropuertoByID(aeropuertos,p.getCiudad_origen()).getCiudad();
                        String ciudadFiP = aeropuertoByID(aeropuertos,p.getCiudad_destino()).getCiudad();
                        System.out.println(ciudadOgP + " -> " + ciudadFiP);
                        System.out.println(p.getHora_origen() + "->" + p.getHora_destino());

                    }
                    System.out.println("=======");
                }
            }

        }


    }

    public ArrayList<Envio> ejecutaGrasp(ArrayList<Aeropuerto> aeropuertos, ArrayList<Envio> envios,
                                         ArrayList<PlanDeVuelo> planes) {
        ArrayList<Envio> mejorSol = new ArrayList<>();
        //ALGORITMO
        int n = 1;
        for (int i = 0; i < n; i++) {
            //System.out.println(aeropuertos[i].getCiudad());
            //FASE CONSTRUCTIVA

            //IDEAS
            //Para cada pedido, generar las rutas posibles. Las mejores van a una lista restringida
            //Se elige aleatoriamente la ruta.

            ArrayList<Envio> enviosCubiertos = faseConstructivaGRASP(aeropuertos, planes, envios);
            mejorSol =enviosCubiertos;
            imprimeSolucionEncontrada(aeropuertos,planes,enviosCubiertos);
            //FASE DE MEJORA
            //realizamos la búsqueda local

            ArrayList<Envio> solucion = busquedaLocalGRASP(aeropuertos, planes, enviosCubiertos);
            imprimeSolucionEncontrada(aeropuertos,planes,solucion);
            mejorSol = solucion;
        }

        //imprimeSolucionEncontrada(aeropuertos,planes,enviosSolicitados);

        //imprimeSolucionEncontrada(aeropuertos,planes,solucion);

        System.out.println("IMPRIMIENDO");
        return mejorSol;
    }
}


