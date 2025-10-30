"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

// 🧩 Definimos el tipo de dato Cafeteria
interface Cafeteria {
  id: string;
  nombre: string;
  descripcion?: string;
  ubicacion?: string;
  horario?: string;
}

export default function EditarCafeteriasPage() {
  const router = useRouter();

  // 📦 Tipamos los estados
  const [cafeterias, setCafeterias] = useState<Cafeteria[]>([]);
  const [editando, setEditando] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Cafeteria, "id">>({
    nombre: "",
    descripcion: "",
    ubicacion: "",
    horario: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 📦 Cargar cafeterías existentes
  const cargarCafeterias = async () => {
    try {
      const { data, error } = await supabase
        .from("cafeterias")
        .select("*")
        .order("nombre", { ascending: true });

      if (error) throw error;
      
      if (data) {
        setCafeterias(data as Cafeteria[]);
      }
    } catch (err) {
      console.error("Error cargando cafeterías:", err);
      setError("Error al cargar las cafeterías");
    }
  };

  // 🧠 Verificar que el usuario sea admin
  useEffect(() => {
    const verificarRol = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          router.push("/login");
          return;
        }

        const { data: userData, error: roleError } = await supabase
          .from("usuarios")
          .select("rol")
          .eq("email", user.email)
          .maybeSingle();

        if (roleError) throw roleError;

        if (userData?.rol !== "admin") {
          alert("⚠️ No tienes permiso para acceder aquí");
          router.push("/");
          return;
        }

        await cargarCafeterias();
      } catch (err) {
        console.error("Error verificando rol:", err);
        setError("Error al verificar permisos");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    verificarRol();
  }, [router]);

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

  // ❌ Cancelar edición
  const cancelarEdicion = () => {
    setEditando(null);
    setFormData({
      nombre: "",
      descripcion: "",
      ubicacion: "",
      horario: "",
    });
  };

  // 💾 Guardar cambios
  const guardarCambios = async () => {
    if (!editando) return;

    // Validación básica
    if (!formData.nombre.trim()) {
      alert("⚠️ El nombre es obligatorio");
      return;
    }

    try {
      const { error } = await supabase
        .from("cafeterias")
        .update(formData)
        .eq("id", editando);

      if (error) throw error;

      alert("✅ Cambios guardados correctamente");
      cancelarEdicion();
      await cargarCafeterias();
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("❌ Error al guardar cambios");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-[#b08968] text-center">
        ☕ Editar Cafeterías
      </h1>

      {cafeterias.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay cafeterías registradas
        </p>
      ) : (
        cafeterias.map((caf) => (
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
                  className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b08968]"
                  placeholder="Nombre *"
                  required
                />
                <textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b08968]"
                  placeholder="Descripción"
                  rows={3}
                />
                <input
                  type="text"
                  value={formData.ubicacion}
                  onChange={(e) =>
                    setFormData({ ...formData, ubicacion: e.target.value })
                  }
                  className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b08968]"
                  placeholder="Ubicación"
                />
                <input
                  type="text"
                  value={formData.horario}
                  onChange={(e) =>
                    setFormData({ ...formData, horario: e.target.value })
                  }
                  className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b08968]"
                  placeholder="Horario"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={guardarCambios}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    💾 Guardar
                  </button>
                  <button
                    onClick={cancelarEdicion}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors"
                  >
                    ❌ Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="font-bold text-xl text-[#b08968]">{caf.nombre}</h2>
                {caf.descripcion && (
                  <p className="text-gray-600">{caf.descripcion}</p>
                )}
                {caf.ubicacion && <p className="text-sm">📍 {caf.ubicacion}</p>}
                {caf.horario && <p className="text-sm">🕒 {caf.horario}</p>}
                <button
                  onClick={() => editarCafeteria(caf)}
                  className="mt-2 bg-[#b08968] hover:bg-[#a06f4a] text-white px-4 py-2 rounded transition-colors"
                >
                  ✏️ Editar
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}