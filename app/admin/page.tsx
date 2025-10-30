"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cafes, setCafes] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const { data: userData, error: authError } = await supabase.auth.getUser();

      if (authError || !userData?.user) {
        console.warn("⚠️ No hay sesión activa, redirigiendo al login");
        router.push("/login");
        return;
      }

      const user = userData.user;
      setUser(user);

      // 🔍 Obtener el rol del usuario desde la tabla `usuarios`
      const { data: perfil, error: rolError } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("email", user.email)
        .single();

      if (rolError) {
        console.error("❌ Error obteniendo rol:", rolError);
        router.push("/login");
        return;
      }

      if (perfil?.rol !== "admin") {
        console.warn("🚫 Usuario no autorizado, redirigiendo...");
        router.push("/cafeterias");
        return;
      }

      // ✅ Si todo está bien, carga las cafeterías
      await fetchCafeterias();
      setLoading(false);
    }

    loadData();
  }, [router]);

  // 🔁 Función para obtener cafeterías
  const fetchCafeterias = async () => {
    const { data, error } = await supabase.from("cafeterias").select("*");
    if (error) {
      console.error("❌ Error al cargar cafeterías:", error);
      return;
    }
    setCafes(data || []);
  };

  // ➕ Agregar nueva cafetería
  const handleAdd = async () => {
    const nombre = prompt("Nombre de la cafetería:");
    const descripcion = prompt("Descripción:");
    if (!nombre) return;

    const { error } = await supabase
      .from("cafeterias")
      .insert([{ nombre, descripcion }]);

    if (error) console.error("❌ Error agregando cafetería:", error);
    await fetchCafeterias();
  };

  // 🗑️ Eliminar cafetería
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("cafeterias").delete().eq("id", id);
    if (error) console.error("❌ Error eliminando cafetería:", error);
    await fetchCafeterias();
  };

  // ⏳ Pantalla de carga
  if (loading) return <p className="p-6 text-lg">Cargando panel...</p>;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Panel de Administración ☕</h1>
      <p className="text-gray-600">Bienvenido, {user?.email}</p>

      <button
        onClick={handleAdd}
        className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
      >
        ➕ Agregar Cafetería
      </button>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cafes.map((cafe) => (
          <div
            key={cafe.id}
            className="border rounded-xl p-4 shadow-md flex flex-col justify-between hover:shadow-lg transition"
          >
            <div>
              <h2 className="text-xl font-semibold">{cafe.nombre}</h2>
              <p className="text-gray-600">{cafe.descripcion}</p>
            </div>
            <button
              onClick={() => handleDelete(cafe.id)}
              className="mt-3 bg-red-500 text-white px-3 py-1 rounded-xl hover:bg-red-600 transition"
            >
              🗑️ Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
