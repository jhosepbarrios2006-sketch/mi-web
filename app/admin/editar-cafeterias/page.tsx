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
  const [verificando, setVerificando] = useState(true);
  const [cafes, setCafes] = useState<Cafeteria[]>([]);
  const [editando, setEditando] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Cafeteria>>({});
  const router = useRouter();

  // Verificar autenticación y rol
  useEffect(() => {
    checkAuthAndRole();
  }, []);

  const checkAuthAndRole = async () => {
    try {
      // 1. Verificar sesión
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        console.log("❌ No hay sesión");
        router.replace("/login");
        return;
      }

      console.log("✅ Sesión activa:", session.user.email);

      // 2. Verificar rol
      const { data: usuario, error } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("email", session.user.email)
        .single();

      console.log("👤 Usuario encontrado:", usuario);

      if (error || !usuario) {
        console.error("❌ Error al buscar usuario:", error);
        alert("No tienes permisos para acceder a esta página");
        router.replace("/");
        return;
      }

      if (usuario.rol !== "admin") {
        console.warn("⛔ No eres admin. Rol:", usuario.rol);
        alert("Solo los administradores pueden acceder a esta página");
        router.replace("/");
        return;
      }

      console.log("✅ Acceso concedido: eres admin");
      setVerificando(false);
      await loadCafeterias();
      setLoading(false);
    } catch (err) {
      console.error("❌ Error en verificación:", err);
      router.replace("/login");
    }
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

  // Mostrar pantalla de carga mientras verifica
  if (verificando || loading) {
    return (
      <div 
        className="flex flex-col items-center justify-center min-h-screen"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/33350257/pexels-photo-33350257.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="relative text-center bg-white/90 backdrop-blur-md p-12 rounded-3xl shadow-2xl">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#d4a574] border-t-transparent mb-6"></div>
          <p className="text-2xl text-[#6b4226] font-bold">
            {verificando ? "☕ Verificando permisos..." : "Cargando panel..."}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Solo los administradores pueden acceder
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4ede4] p-8">
      {/* Header con gradiente café */}
      <div className="max-w-7xl mx-auto mb-12">
        <div 
          className="bg-gradient-to-r from-[#6b4226] to-[#8b5a3c] rounded-2xl shadow-2xl p-8 text-white"
          style={{
            backgroundImage: 'url("https://images.pexels.com/photos/33350257/pexels-photo-33350257.jpeg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'multiply',
            backgroundColor: 'rgba(107, 66, 38, 0.85)'
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-bold mb-3 drop-shadow-lg">
                ☕ Panel de Administración
              </h1>
              <p className="text-xl text-white/90 drop-shadow">
                Gestiona las cafeterías más especiales de la ciudad
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition border border-white/30 shadow-lg"
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Botón agregar con estilo café */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={handleAdd}
          className="bg-[#d4a574] hover:bg-[#c9985d] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          ➕ Agregar Nueva Cafetería
        </button>
      </div>

      {/* Lista de cafeterías con diseño elegante */}
      <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {cafes.map((cafe) => (
          <div
            key={cafe.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 border border-[#e1c6b2]"
          >
            {cafe.img && (
              <div className="relative h-52 overflow-hidden">
                <img
                  src={cafe.img}
                  alt={cafe.nombre}
                  className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
            )}

            <div className="p-6">
              {editando === cafe.id ? (
                // Modo edición con inputs estilizados
                <div className="space-y-4">
                  <input
                    type="text"
                    value={formData.nombre || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    placeholder="Nombre"
                    className="w-full p-3 border-2 border-[#d4a574] rounded-xl focus:outline-none focus:border-[#b08968] transition"
                  />
                  <textarea
                    value={formData.descripcion || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    placeholder="Descripción"
                    className="w-full p-3 border-2 border-[#d4a574] rounded-xl focus:outline-none focus:border-[#b08968] transition resize-none"
                    rows={3}
                  />
                  <input
                    type="text"
                    value={formData.ubicacion || formData.direccion || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, ubicacion: e.target.value })
                    }
                    placeholder="📍 Ubicación"
                    className="w-full p-3 border-2 border-[#d4a574] rounded-xl focus:outline-none focus:border-[#b08968] transition"
                  />
                  <input
                    type="text"
                    value={formData.img || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, img: e.target.value })
                    }
                    placeholder="🖼️ URL de imagen"
                    className="w-full p-3 border-2 border-[#d4a574] rounded-xl focus:outline-none focus:border-[#b08968] transition"
                  />

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={saveEdit}
                      className="flex-1 bg-[#6b4226] hover:bg-[#543318] text-white py-3 rounded-xl font-semibold transition shadow-md hover:shadow-lg"
                    >
                      💾 Guardar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-xl font-semibold transition shadow-md"
                    >
                      ❌ Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // Modo vista elegante
                <>
                  <h2 className="text-2xl font-bold text-[#6b4226] mb-3">
                    {cafe.nombre}
                  </h2>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {cafe.descripcion}
                  </p>
                  {(cafe.ubicacion || cafe.direccion) && (
                    <p className="text-sm text-[#8b5a3c] mb-5 flex items-center gap-2">
                      <span className="text-lg">📍</span>
                      {cafe.ubicacion || cafe.direccion}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => startEdit(cafe)}
                      className="flex-1 bg-[#d4a574] hover:bg-[#c9985d] text-white py-3 rounded-xl font-semibold transition shadow-md hover:shadow-lg"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(cafe.id, cafe.nombre)}
                      className="flex-1 bg-[#a8624f] hover:bg-[#8b4e3d] text-white py-3 rounded-xl font-semibold transition shadow-md hover:shadow-lg"
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
        <div className="max-w-7xl mx-auto text-center py-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-[#e1c6b2]">
            <p className="text-2xl text-[#6b4226] font-semibold mb-3">
              ☕ No hay cafeterías registradas
            </p>
            <p className="text-gray-600">
              ¡Agrega la primera cafetería especial de la ciudad!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}