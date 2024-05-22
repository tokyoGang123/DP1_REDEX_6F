import ListaPlanes from '../components/Planes/ListaPlanes';

export default async function PlanesPage() {
  const res = await fetch('http://127.0.0.1:8080/api/planesVuelo/obtenerTodos');
  const planes = await res.json();

  return <ListaPlanes planes={planes}/>;
}
