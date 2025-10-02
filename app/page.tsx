export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-coffee-light via-yellow-100 to-coffee-light">
      {/* Encabezado */}
      <header className="text-center py-12">
        <h1 className="text-5xl font-bold text-brown-800">
          ☕ Mejores Cafeterías de la Ciudad de Fusagasugà
        </h1>
        <p className="text-lg text-gray-700 mt-4 max-w-2xl mx-auto">
          Explora los lugares más acogedores y deliciosos donde disfrutar un buen café.
          Una guía hecha para los verdaderos amantes del café.
        </p>
      </header>

      {/* Catálogo de cafeterías */}
      <section className="grid md:grid-cols-3 gap-8 mt-8 w-full max-w-6xl px-6">
        {/* Cafetería 1 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition">
          <img
            src="https://images.unsplash.com/photo-1509042239860-f550ce710b93"
            alt="Café Aroma"
            className="h-48 w-full object-cover"
          />
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-brown-700">Café Aroma</h2>
            <p className="text-gray-600 mt-2">
              Famoso por su capuchino y ambiente relajado. Ideal para trabajar o leer un libro.
            </p>
          </div>
        </div>

        {/* Cafetería 2 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
            alt="Latte Lovers"
            className="h-48 w-full object-cover"
          />
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-brown-700">Latte Lovers</h2>
            <p className="text-gray-600 mt-2">
              Perfecto para los amantes de los lattes y postres caseros. Ambiente cálido y moderno.
            </p>
          </div>
        </div>

        {/* Cafetería 3 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition">
          <img
            src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9"
            alt="Espresso House"
            className="h-48 w-full object-cover"
          />
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-brown-700">Espresso House</h2>
            <p className="text-gray-600 mt-2">
              Especialistas en espresso intenso y croissants recién horneados. Un clásico.
            </p>
          </div>
        </div>
      </section>

      {/* Pie de página */}
      <footer className="mt-16 py-6 w-full text-center bg-brown-800 text-white">
        © {new Date().getFullYear()} Mejores Cafeterías. Hecho con ❤️ y ☕.
      </footer>
    </main>
  );
}
