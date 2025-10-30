"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

// 🧩 Tipo de dato para cafeterías
interface Cafeteria {
  id: string;
  nombre: string;
  descripcion?: string;
  ubicacion?: string;
  horario?: string;
}

export default function EditarCafeteriasPage() {
  const router = useRouter();

  // 📦 Estados
  const [cafeterias, setCafeterias] = useState<Cafeteria[]>([]);
  const [editando, setEditando] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Cafeteria, "id">>({
    nombre: "",
    descripcion: "",
    ubicacion: "",
    horario: "",
  });
  const [loading, setLoading] = useState(true);

  // 🧠 Verificar que el usuario sea admin y cargar cafeterías
  useEffect(() => {
    const verificarRol = async () => {
      const { data: userData, error: authError } = await supabase.auth.getUser();

      if (authError || !userData?.user) {
        router.push("/login");
        return;
      }

      const user = userData.user;

      const { data: rolData, error: rolError } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("email", user.email)
        .maybeSingle();

      if (rolError || rolData?.rol !== "admin") {
        alert("⚠️ No tienes permiso para acceder aquí");
        router.push("/");
        return;
      }

      await cargarCafeterias();
      setLoading(false);
    };

    verificarRol();
  }, [router]);

  // 📦 Cargar cafeterías
  const cargarCafeterias = async () => {
    const { data, error } = await supabase
      .from("cafeterias")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) {
      console.error("Error cargando cafeterías:", error);
    } else if (data) {
      setCafeterias(data as Cafeteria[]);
    }
  };

  // ✏️ Iniciar edición
  const editarCafeteria = (caf: Cafeteria) => {
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
    if (!editando) return;

    const { error } = await supabase
      .from("cafeterias")
      .update(formData)
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

  // 🌀 Pantalla de carga
  if (loading) return <p className="p-6 text-center text-gray-600">Cargando...</p>;

  // 🧱 Render principal
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-[#b08968] text-center">
        ☕ Editar Cafeterías
      </h1>

      {cafeterias.length === 0 && (
        <p className="text-center text-gray-500">No hay cafeterías registradas.</p>
      )}

      {cafeterias.map((caf) => (
        <div
          key={caf.id}
          className="bg-white p-4 shadow-md rounded-lg space-y-2 border border-gray-200"
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
              {caf.ubicacion && <p>📍 {caf.ubicacion}</p>}
              {caf.horario && <p>🕒 {caf.horario}</p>}
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
