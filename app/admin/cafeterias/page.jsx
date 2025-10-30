"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function EditarCafeteriasPage() {
  const router = useRouter();
  const [cafeterias, setCafeterias] = useState([]);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    ubicacion: "",
    horario: "",
  });
  const [loading, setLoading] = useState(true);

  // 🧠 Verificar que el usuario sea admin
  useEffect(() => {
    const verificarRol = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: userData } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("email", user.email)
        .maybeSingle();

      if (userData?.rol !== "admin") {
        alert("⚠️ No tienes permiso para acceder aquí");
        router.push("/");
        return;
      }

      await cargarCafeterias();
      setLoading(false);
    };

    verificarRol();
  }, [router]);

  // 📦 Cargar cafeterías existentes
  const cargarCafeterias = async () => {
    const { data, error } = await supabase
      .from("cafeterias")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) {
      console.error("Error cargando cafeterías:", error);
    } else {
      setCafeterias(data);
    }
  };

  // ✏️ Iniciar edición
  const editarCafeteria = (caf) => {
    setEditando(caf.id);
    setFormData({
      nombre: caf.nombre || "",
      descripcion: caf.descripcion || "",
      ubicacion: caf.ubicacion || "",
      horario: caf.horario || "",
    });
  };

  // 💾 Guardar cambios
  const guardarCambios = async () => {
    const { error } = await supabase
      .from("cafeterias")
      .update({
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        ubicacion: formData.ubicacion,
        horario: formData.horario,
      })
      .eq("id", editando);

    if (error) {
      console.error(error);
      alert("❌ Error al guardar cambios");
    } else {
      alert("✅ Cambios guardados correctamente");
      setEditando(null);
      await cargarCafeterias();
    }
  };

  if (loading) return <p className="p-6 text-center">Cargando...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-[#b08968] text-center">
        ☕ Editar Cafeterías
      </h1>

      {cafeterias.map((caf) => (
        <div
          key={caf.id}
          className="bg-white p-4 shadow-md rounded-lg space-y-2"
        >
          {editando === caf.id ? (
            <>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
                placeholder="Nombre"
              />
              <textarea
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
                placeholder="Descripción"
              />
              <input
                type="text"
                value={formData.ubicacion}
                onChange={(e) =>
                  setFormData({ ...formData, ubicacion: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
                placeholder="Ubicación"
              />
              <input
                type="text"
                value={formData.horario}
                onChange={(e) =>
                  setFormData({ ...formData, horario: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
                placeholder="Horario"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={guardarCambios}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditando(null)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                >
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="font-bold text-xl">{caf.nombre}</h2>
              <p className="text-gray-600">{caf.descripcion}</p>
              <p>📍 {caf.ubicacion}</p>
              <p>🕒 {caf.horario}</p>
              <button
                onClick={() => editarCafeteria(caf)}
                className="mt-2 bg-[#b08968] hover:bg-[#a06f4a] text-white px-3 py-1 rounded"
              >
                Editar
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
