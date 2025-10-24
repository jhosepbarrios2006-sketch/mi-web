import { NextResponse } from "next/server";
import * as QRCode from "qrcode";  // ✅ Librería correcta
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ✅ clave segura
);

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();

    // Generar un código único
    const uniqueCode = `${email}-${Date.now()}`;

    // Crear el QR como Data URL (base64)
    const qrDataUrl = await QRCode.toDataURL(uniqueCode);

    // Guardar en Supabase
    const { data, error } = await supabase
      .from("user_qr_codes")
      .insert([{ user_id: userId, qr_code: qrDataUrl }]);

    if (error) throw error;

    return NextResponse.json({ success: true, qr: qrDataUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: String(err) });
  }
}
