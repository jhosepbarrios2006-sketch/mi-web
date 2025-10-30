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
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }

      // Traer el rol del usuario
      const { data: perfil } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("id", data.user.id)
        .single();

      if (perfil?.rol !== "admin") {
        router.push("/");
        return;
      }

      setUser(data.user);
      await fetchCafeterias();
      setLoading(false);
    }

    loadData();
  }, [router]);

  const fetchCafeterias = async () => {
    const { data, error } = await supabase.from("cafeterias").select("*");
    if (!error && data) setCafes(data);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("cafeterias").delete().eq("id", id);
    await fetchCafeterias();
  };

  const handleAdd = async () => {
    const nombre = prompt("Nombre de la cafetería:");
    const descripcion = prompt("Descripción:");
    if (!nombre) return;
    await supabase
      .from("cafeterias")
      .insert([{ nombre, descripcion }]);
    await fetchCafeterias();
  };

  if (loading) return <p className="p-4">Cargando...</p>;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Panel de Administración ☕</h1>
      <p className="text-gray-600">Bienvenido, {user?.email}</p>

      <button
        onClick={handleAdd}
        className="px-4 py-2 bg-green-600 text-white rounded-xl"
      >
        ➕ Agregar Cafetería
      </button>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cafes.map((cafe) => (
          <div
            key={cafe.id}
            className="border rounded-xl p-4 shadow-md flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold">{cafe.nombre}</h2>
              <p className="text-gray-600">{cafe.descripcion}</p>
            </div>
            <button
              onClick={() => handleDelete(cafe.id)}
              className="mt-3 bg-red-500 text-white px-3 py-1 rounded-xl"
            >
              🗑️ Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
