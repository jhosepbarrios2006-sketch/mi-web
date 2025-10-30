"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Mantener sesión activa (importante para que no se cierre al recargar)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        console.log("✅ Sesión activa detectada");
        router.push("/"); // Redirigir automáticamente al inicio
      }
    });
    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    setLoading(true);

    // 🔐 Iniciar sesión
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      alert("❌ " + loginError.message);
      setLoading(false);
      return;
    }

    // 🔎 Obtener el usuario actual
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("❌ No se pudo obtener el usuario después del login");
      setLoading(false);
      return;
    }

    // 🔍 Buscar el rol en la tabla `usuarios`
    const { data: userData, error: roleError } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("email", user.email)
      .maybeSingle();

    if (roleError) {
      alert("⚠️ Error al obtener el rol del usuario");
      console.error(roleError);
      setLoading(false);
      return;
    }

    // ✅ Redirigir según el rol
    if (userData?.rol === "admin") {
      alert("Bienvenido administrador 👑");
      router.push("/admin");
    } else {
      alert("Login exitoso 🎉");
      router.push("/"); // Redirige al inicio
    }

    setLoading(false);
  };

  const handleGuest = () => {
    alert("Entraste como invitado 🚀");
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f4ede4] to-[#e1c6b2] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 space-y-6">
        <h1 className="text-3xl font-bold text-[#b08968] text-center">
          🔒 Ingresar
        </h1>

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b08968] transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b08968] transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-[#b08968] hover:bg-[#a06f4a]"
          } text-white font-semibold py-3 rounded-lg transition`}
        >
          {loading ? "Ingresando..." : "Iniciar Sesión"}
        </button>

        <button
          onClick={handleGuest}
          className="w-full bg-[#cbb39a] hover:bg-[#b89d7f] text-white font-semibold py-3 rounded-lg transition"
        >
          Continuar como Invitado
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          ¿No tienes cuenta?{" "}
          <span
            onClick={() => router.push("/register")}
            className="cursor-pointer text-[#b08968] hover:underline font-medium"
          >
            Regístrate aquí
          </span>
        </p>
      </div>
    </div>
  );
}
