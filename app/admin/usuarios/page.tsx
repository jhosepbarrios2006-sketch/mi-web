"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    checkAuthAndRedirect();
  }, []);

  const checkAuthAndRedirect = async () => {
    // Verificar que está autenticado
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.replace("/login");
      return;
    }

    // Verificar que es admin
    const { data: usuario } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("email", session.user.email)
      .single();

    if (!usuario || usuario.rol !== "admin") {
      router.replace("/");
      return;
    }

    // Si es admin, redirigir al panel
    router.replace("/admin/editar-cafeterias");
  };

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
          ☕ Redirigiendo al panel admin...
        </p>
      </div>
    </div>
  );
}