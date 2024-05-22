import ListaAeropuertos from '../components/Aeropuertos/ListaAeropuertos';

export default async function AeropuertosPage() {
  const res = await fetch('http://127.0.0.1:8080/api/aeropuertos/obtenerTodos');
  const aeropuertos = await res.json();

  return <ListaAeropuertos aeropuertos={aeropuertos} />;
}
