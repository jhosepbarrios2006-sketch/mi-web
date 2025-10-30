"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    verificarYRedirigir();
  }, [router]);

  async function verificarYRedirigir() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.replace("/login");
      return;
    }

    const { data: usuario } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("email", session.user.email)
      .single();

    if (!usuario || usuario.rol !== "admin") {
      router.replace("/");
      return;
    }

    router.replace("/admin/editar-cafeterias");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-amber-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mb-4"></div>
        <p className="text-xl text-amber-900">Redirigiendo al panel...</p>
      </div>
    </div>
  );
}