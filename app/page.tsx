"use client";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <main className="relative flex flex-col items-center min-h-screen bg-[var(--background)] text-[var(--foreground)] font-[var(--font-sans)]">

      {/* 🔴 Botón de Cerrar Sesión */}
      <button
        onClick={handleLogout}
        className="absolute top-5 right-6 bg-red-500 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-red-600 hover:shadow-lg transition-all font-semibold"
      >
        Cerrar Sesión
      </button>

      {/* 🌇 Hero principal */}
      <section className="w-full bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4')] bg-cover bg-center h-[420px] flex items-center justify-center text-center relative rounded-b-3xl overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10">
          <p className="text-white text-lg mb-3 font-medium tracking-wide">
            Disfruta con alegría:
          </p>
          <h1 className="text-5xl md:text-6xl font-[var(--font-title)] text-white leading-tight drop-shadow-lg">
            ¡Delicias frescas a la puerta de su casa!
          </h1>
        </div>
      </section>

      {/* ☕ Sección de cafeterías */}
      <section className="w-full max-w-6xl px-8 py-16 text-center">
        <h2 className="text-4xl font-[var(--font-title)] mb-3 text-[#4b2e16]">
          Descubra nuestras cafeterías más queridas
        </h2>
        <p className="text-[#6b4e2e] mb-12 text-lg">
          Explore los lugares más acogedores y deliciosos donde disfrutar un buen café.
          Perfectos para relajarse, trabajar o compartir.
        </p>

        {/* 🧋 Tarjetas */}
        <div className="grid md:grid-cols-3 gap-10">
          {/* Card 1 */}
          <div className="card hover:scale-[1.03]">
            <img
              src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/25/49/2e/50/caption.jpg?w=1100&h=-1&s=1"
              alt="Tayronacafé"
              className="h-56 w-full object-cover rounded-t-2xl"
            />
            <div className="p-6 text-left">
              <h3 className="text-2xl font-[var(--font-title)] text-[#4b2e16] mb-2">
                Tayronacafé
              </h3>
              <p className="text-[#5a3b1e] leading-relaxed">
                Famoso por su capuchino y ambiente relajado. Ideal para trabajar o leer un libro.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card hover:scale-[1.03]">
            <img
              src="https://www.centrocomercialsantacruzplaza.com/wp-content/uploads/2025/01/cafe-rojas-fusagasuga-3.jpeg"
              alt="Café Rojas"
              className="h-56 w-full object-cover rounded-t-2xl"
            />
            <div className="p-6 text-left">
              <h3 className="text-2xl font-[var(--font-title)] text-[#4b2e16] mb-2">
                Café Rojas
              </h3>
              <p className="text-[#5a3b1e] leading-relaxed">
                Perfecto para los amantes de los lattes y postres caseros. Ambiente cálido y moderno.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card hover:scale-[1.03]">
            <img
              src="https://media-cdn.tripadvisor.com/media/photo-p/1d/15/44/48/filadelfia-c.jpg"
              alt="Filadelfia Café Boutique"
              className="h-56 w-full object-cover rounded-t-2xl"
            />
            <div className="p-6 text-left">
              <h3 className="text-2xl font-[var(--font-title)] text-[#4b2e16] mb-2">
                Filadelfia Café Boutique
              </h3>
              <p className="text-[#5a3b1e] leading-relaxed">
                Especialistas en espresso intenso y croissants recién horneados. Un clásico.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🧡 Footer */}
      <footer className="w-full py-6 text-center bg-[#4b2e16] text-white mt-auto rounded-t-3xl">
       
      </footer>
    </main>
  );
}
