export default function Cafeterias() {
  const cafes = [
    {
      nombre: "Café Aroma",
      descripcion: "Capuchino famoso y un ambiente tranquilo para leer o trabajar.",
      img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
      direccion: "Calle 10 #23-45",
    },
    {
      nombre: "Latte Lovers",
      descripcion: "Lattes especiales y postres caseros deliciosos.",
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      direccion: "Carrera 7 #12-34",
    },
    {
      nombre: "Espresso House",
      descripcion: "Especialistas en espresso fuerte y croissants recién horneados.",
      img: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9",
      direccion: "Av. Principal #45-67",
    },
    {
      nombre: "Coffee & Books",
      descripcion: "Un espacio perfecto para disfrutar café y buena lectura.",
      img: "https://images.unsplash.com/photo-1522205408450-add114ad53fe",
      direccion: "Calle 8 #56-78",
    },
    {
      nombre: "Café Urbano",
      descripcion: "Estilo moderno con cafés fríos y ambiente juvenil.",
      img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
      direccion: "Cra. 5 #89-10",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-coffee-light to-yellow-100 py-12 px-6">
      <h1 className="text-4xl font-bold text-center text-brown-800 mb-12">
        ☕ Directorio de Cafeterías
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {cafes.map((cafe, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition"
          >
            <img
              src={cafe.img}
              alt={cafe.nombre}
              className="h-48 w-full object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-brown-700">{cafe.nombre}</h2>
              <p className="text-gray-600 mt-2">{cafe.descripcion}</p>
              <p className="text-sm text-gray-500 mt-4">📍 {cafe.direccion}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
