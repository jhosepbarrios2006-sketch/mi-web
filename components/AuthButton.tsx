"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 🔐 Obtener sesión actual al cargar
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Error obteniendo sesión:", error);
      setSession(data.session);
      setLoading(false);
    };
    getSession();

    // 👂 Escuchar cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🚪 Cerrar sesión
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error cerrando sesión:", error.message);
      alert("Hubo un problema al cerrar sesión.");
    } else {
      router.push("/"); // Redirigir al inicio
    }
  };

  // 🔑 Ir a login
  const handleLogin = () => {
    router.push("/login");
  };

  if (loading) return null;

  // Si hay sesión activa ➜ mostrar botón de cerrar sesión
  if (session) {
    return (
      <button
        onClick={handleLogout}
        className="ml-4 px-4 py-2 rounded-xl bg-[#d7ccc8] text-[#3e2723] font-semibold hover:bg-[#bcaaa4] transition-all duration-300 shadow-md"
      >
        CERRAR SESIÓN
      </button>
    );
  }

  // Si NO hay sesión ➜ mostrar botón de iniciar sesión
  return (
    <button
      onClick={handleLogin}
      className="ml-4 px-4 py-2 rounded-xl bg-[#c5e1a5] text-[#33691e] font-semibold hover:bg-[#aed581] transition-all duration-300 shadow-md"
    >
      INICIAR SESIÓN
    </button>
  );
}
