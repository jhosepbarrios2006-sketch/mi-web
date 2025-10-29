import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { id } = params;

  const { error } = await supabase
    .from("misiones")
    .update({
      completada: true,
      fecha_completada: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("❌ Error completando misión:", error.message);
    return new Response("Error completando misión", { status: 500 });
  }

  return new Response(
    `
    <html>
      <body style="font-family:sans-serif;text-align:center;margin-top:50px;">
        <h2>☕ ¡Misión completada!</h2>
        <p>Gracias por visitar tu primera cafetería registrada.</p>
      </body>
    </html>
    `,
    { headers: { "Content-Type": "text/html" } }
  );
}
