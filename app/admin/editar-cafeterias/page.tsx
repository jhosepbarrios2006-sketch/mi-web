"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Cafeteria {
  id: string;
  nombre: string;
  descripcion?: string;
  ubicacion?: string;
  horario?: string;
}

export default function EditarCafeteriasPage() {
  const [user, setUser] = useState<any>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cafes, setCafes] = useState<Cafeteria[]>([]);
  const router = useRouter();

  // 🔑 Verificar usuario y rol
  useEffect(() => {
    const fetchUserAndRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      setUser(currentUser);

      if (!currentUser) {
        router.push("/login");
        return;
      }

      const { data: userData, error } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("email", currentUser.email)
        .maybeSingle();

      if (error || !userData) {
        console.error("❌ Error obteniendo rol del usuario:", error);
        router.push("/login");
        return;
      }

      setRol(userData.rol);

      if (userData.rol !== "admin") {
        console.warn("🚫 Usuario no autorizado. Redirigiendo...");
        router.push("/cafeterias");
        return;
      }

      await fetchCafeterias();
      setLoading(false);
    };

    fetchUserAndRole();
  }, [router]);

  // ☕ Obtener cafeterías
  const fetchCafeterias = async () => {
    const { data, error } = await supabase.from("cafeterias").select("*");
    if (error) {
      console.error("❌ Error al cargar cafeterías:", error);
      return;
    }
    setCafes(data || []);
  };

  // ➕ Agregar cafetería
  const handleAdd = async () => {
    const nombre = prompt("Nombre de la cafetería:");
    const descripcion = prompt("Descripción:");
    if (!nombre) return;

    const { error } = await supabase
      .from("cafeterias")
      .insert([{ nombre, descripcion }]);

    if (error) {
      console.error("❌ Error al agregar cafetería:", error);
    } else {
      await fetchCafeterias();
    }
  };

  // 🗑️ Eliminar cafetería
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("¿Seguro que deseas eliminar esta cafetería?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("cafeterias").delete().eq("id", id);
    if (error) console.error("❌ Error al eliminar cafetería:", error);
    await fetchCafeterias();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Cargando panel de administración...
      </div>
    );

  return (
    <div className="p-8 space-y-6 min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
      <h1 className="text-3xl font-bold text-center text-brown-800">
        ☕ Panel de Administración
      </h1>

      <p className="text-center text-gray-700">
        Bienvenido, <span className="font-semibold">{user?.email}</span>
      </p>

      <div className="flex justify-center">
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          ➕ Agregar Cafetería
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cafes.map((cafe) => (
          <div
            key={cafe.id}
            className="border rounded-xl p-5 shadow-md bg-white hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-brown-800">
                {cafe.nombre}
              </h2>
              <p className="text-gray-600 mt-1">{cafe.descripcion}</p>
              {cafe.ubicacion && (
                <p className="text-sm text-gray-500 mt-2">
                  📍 {cafe.ubicacion}
                </p>
              )}
            </div>
            <button
              onClick={() => handleDelete(cafe.id)}
              className="mt-4 bg-red-500 text-white px-3 py-1 rounded-xl hover:bg-red-600 transition"
            >
              🗑️ Eliminar
            </button>
          </div>
        ))}
      </div>

      {cafes.length === 0 && (
        <p className="text-center text-gray-600 mt-6">
          No hay cafeterías registradas aún ☕
        </p>
      )}
    </div>
  );
}
