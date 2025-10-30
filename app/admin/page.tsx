"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Cafe {
  id: string;
  nombre: string;
  descripcion: string;
}

interface Usuario {
  email: string;
}

export default function AdminPage() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // 🔐 Solo verificar sesión (el middleware ya verificó el rol)
  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      setUser({ email: session.user.email! });
      await fetchCafeterias();
      setLoading(false);
    }

    loadData();
  }, [router]);

  // 🔁 Obtener cafeterías
  const fetchCafeterias = async () => {
    const { data, error } = await supabase.from("cafeterias").select("*");
    if (error) {
      console.error("❌ Error al cargar cafeterías:", error);
      return;
    }
    setCafes(data as Cafe[]);
  };

  // ✏️ Abrir modal de edición
  const handleOpenModal = (cafe: Cafe) => {
    setSelectedCafe(cafe);
    setEditNombre(cafe.nombre);
    setEditDescripcion(cafe.descripcion);
    setShowModal(true);
  };

  // 💾 Guardar cambios
  const handleSave = async () => {
    if (!selectedCafe) return;

    const { error } = await supabase
      .from("cafeterias")
      .update({
        nombre: editNombre,
        descripcion: editDescripcion,
      })
      .eq("id", selectedCafe.id);

    if (error) {
      console.error("❌ Error actualizando cafetería:", error);
      alert("Error al actualizar la cafetería");
      return;
    }

    alert("✅ Cafetería actualizada correctamente");
    setShowModal(false);
    await fetchCafeterias();
  };

  // 🚪 Cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) return <p className="p-6 text-lg">Cargando panel...</p>;

  return (
    <div className="p-8 space-y-6 min-h-screen bg-gradient-to-br from-[#f4ede4] to-[#e1c6b2]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6b4226]">
            Panel de Administración ☕
          </h1>
          <p className="text-gray-700 mt-1">Bienvenido, {user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Lista de cafeterías */}
      <h2 className="text-2xl font-semibold text-[#6b4226]">
        Lista de Cafeterías
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cafes.map((cafe) => (
          <div
            key={cafe.id}
            className="border rounded-xl p-4 shadow-md bg-white flex flex-col justify-between hover:shadow-lg transition"
          >
            <div>
              <h3 className="text-xl font-semibold">{cafe.nombre}</h3>
              <p className="text-gray-600">{cafe.descripcion}</p>
            </div>

            <button
              onClick={() => handleOpenModal(cafe)}
              className="mt-3 bg-blue-500 text-white px-3 py-2 rounded-xl hover:bg-blue-600 transition"
            >
              ✏️ Editar
            </button>
          </div>
        ))}
      </div>

      {/* Modal de edición */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold text-[#6b4226]">
              Editar Cafetería
            </h3>

            <label className="block">
              <span className="text-gray-700 font-medium">Nombre:</span>
              <input
                type="text"
                value={editNombre}
                onChange={(e) => setEditNombre(e.target.value)}
                className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b08968]"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Descripción:</span>
              <textarea
                value={editDescripcion}
                onChange={(e) => setEditDescripcion(e.target.value)}
                className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b08968]"
                rows={3}
              />
            </label>

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#b08968] text-white rounded-lg hover:bg-[#9d7454] transition"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}