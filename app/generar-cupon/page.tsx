import CreateCoupon from "@/components/CreateCoupon";

export default function GenerarCuponPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Generar Cupón con QR</h1>
      <CreateCoupon />
    </main>
  );
}
