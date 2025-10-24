"use client";
import { createClient } from "@supabase/supabase-js";

// ⚙️ Validación: asegurarse de que las variables existan
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ Faltan variables de entorno de Supabase");
}

// 🚀 Cliente global de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
