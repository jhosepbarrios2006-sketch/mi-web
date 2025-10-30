"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Cafeteria {
  id: string;
  nombre: string;
  descripcion?: string;
  ubicacion?: string;
  direccion?: string;
  img?: string;
}

export default function EditarCafeteriasPage() {
  const [loading, setLoading] = useState(true);
  const [cafes, setCafes] = useState<Cafeteria[]>([]);
  const [editando, setEditando] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Cafeteria>>({});
  const router = useRouter();

  // Verificar sesión al cargar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    await loadCafeterias();
    setLoading(false);
  };

  // Cargar cafeterías
  const loadCafeterias = async () => {
    const { data, error } = await supabase
      .from("cafeterias")
      .select("*")
      .order("nombre");

    if (error) {
      console.error("Error al cargar cafeterías:", error);
      alert("Error al cargar cafeterías");
      return;
    }

    setCafes(data || []);
  };

  // Agregar nueva cafetería
  const handleAdd = async () => {
    const nombre = prompt("Nombre de la cafetería:");
    if (!nombre) return;

    const descripcion = prompt("Descripción (opcional):");

    const { error } = await supabase
      .from("cafeterias")
      .insert({ nombre, descripcion });

    if (error) {
      console.error("Error:", error);
      alert("Error al agregar cafetería");
    } else {
      alert("✅ Cafetería agregada");
      await loadCafeterias();
    }
  };

  // Iniciar edición
  const startEdit = (cafe: Cafeteria) => {
    setEditando(cafe.id);
    setFormData(cafe);
  };

  // Cancelar edición
  const cancelEdit = () => {
    setEditando(null);
    setFormData({});
  };

  // Guardar cambios
  const saveEdit = async () => {
    if (!editando) return;

    const { error } = await supabase
      .from("cafeterias")
      .update(formData)
      .eq("id", editando);

    if (error) {
      console.error("Error:", error);
      alert("Error al actualizar");
    } else {
      alert("✅ Cafetería actualizada");
      setEditando(null);
      setFormData({});
      await loadCafeterias();
    }
  };

  // Eliminar cafetería
  const handleDelete = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;

    const { error } = await supabase.from("cafeterias").delete().eq("id", id);

    if (error) {
      console.error("Error:", error);
      alert("Error al eliminar");
    } else {
      alert("✅ Cafetería eliminada");
      await loadCafeterias();
    }
  };

  // Cerrar sesión
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-amber-900">
              ☕ Panel de Administración
            </h1>
            <p className="text-amber-700 mt-2">
              Gestiona las cafeterías del directorio
            </p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Botón agregar */}
      <div className="max-w-7xl mx-auto mb-6">
        <button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          ➕ Agregar Cafetería
        </button>
      </div>

      {/* Lista de cafeterías */}
      <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cafes.map((cafe) => (
          <div
            key={cafe.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
          >
            {cafe.img && (
              <img
                src={cafe.img}
                alt={cafe.nombre}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-6">
              {editando === cafe.id ? (
                // Modo edición
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.nombre || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    placeholder="Nombre"
                    className="w-full p-2 border rounded-lg"
                  />
                  <textarea
                    value={formData.descripcion || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    placeholder="Descripción"
                    className="w-full p-2 border rounded-lg"
                    rows={3}
                  />
                  <input
                    type="text"
                    value={formData.ubicacion || formData.direccion || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, ubicacion: e.target.value })
                    }
                    placeholder="Ubicación"
                    className="w-full p-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    value={formData.img || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, img: e.target.value })
                    }
                    placeholder="URL de imagen"
                    className="w-full p-2 border rounded-lg"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                    >
                      💾 Guardar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg transition"
                    >
                      ❌ Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // Modo vista
                <>
                  <h2 className="text-2xl font-bold text-amber-900 mb-2">
                    {cafe.nombre}
                  </h2>
                  <p className="text-gray-700 mb-3">{cafe.descripcion}</p>
                  {(cafe.ubicacion || cafe.direccion) && (
                    <p className="text-sm text-gray-600 mb-4">
                      📍 {cafe.ubicacion || cafe.direccion}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(cafe)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(cafe.id, cafe.nombre)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {cafes.length === 0 && (
        <div className="max-w-7xl mx-auto text-center py-12">
          <p className="text-xl text-gray-600">
            No hay cafeterías registradas. ¡Agrega la primera!
          </p>
        </div>
      )}
    </div>
  );
}