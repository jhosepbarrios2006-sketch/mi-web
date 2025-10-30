'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"; // 👈 asegúrate de tener este import correcto

export default function RecompensasPage() {
  const router = useRouter();

  const [points, setPoints] = useState<number>(0);
  const [visitedSections, setVisitedSections] = useState<Set<string>>(new Set());
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [certificateShown, setCertificateShown] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("Usuario Distinguido");

  const sections = [
    { id: 'cafeterias', name: 'Cafeterías', icon: '☕', description: 'Descubre las mejores cafeterías de la ciudad' },
    { id: 'comentarios', name: 'Comentarios', icon: '💬', description: 'Comparte tu experiencia y lee opiniones' }
  ];

  const pointsPerSection = 20;
  const totalPoints = sections.length * pointsPerSection;

  // ✅ Obtener usuario logueado
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        const name = data.user.user_metadata?.name || data.user.email || "Usuario Distinguido";
        setUserName(name);
      }
    };
    fetchUser();
  }, []);

  // ✅ Cargar progreso guardado
  useEffect(() => {
    const savedPoints = localStorage.getItem('points');
    const savedVisited = localStorage.getItem('visitedSections');
    if (savedPoints) setPoints(parseInt(savedPoints));
    if (savedVisited) setVisitedSections(new Set(JSON.parse(savedVisited)));
  }, []);

  // ✅ Guardar progreso
  useEffect(() => {
    localStorage.setItem('points', points.toString());
    localStorage.setItem('visitedSections', JSON.stringify(Array.from(visitedSections)));
  }, [points, visitedSections]);

  // ✅ Marcar sección + redirigir
  const markSectionVisited = (sectionId: string) => {
    if (!visitedSections.has(sectionId)) {
      const newVisited = new Set(visitedSections);
      newVisited.add(sectionId);
      setVisitedSections(newVisited);
      setPoints(points + pointsPerSection);
    }

    if (sectionId === "cafeterias") router.push("/cafeterias");
    else if (sectionId === "comentarios") router.push("/comentarios");
  };

  const progress = (points / totalPoints) * 100;
  const isComplete = points >= totalPoints;

  useEffect(() => {
    if (isComplete && !certificateShown && !showCertificate) {
      setTimeout(() => {
        setShowCertificate(true);
        setCertificateShown(true);
      }, 500);
    }
  }, [isComplete, certificateShown, showCertificate]);

  // ✅ Certificado con nombre personalizado
  const downloadCertificate = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Fondo beige
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(0, 0, 800, 600);

    // Borde
    ctx.fillStyle = '#92400e';
    ctx.fillRect(20, 20, 760, 560);
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(30, 30, 740, 540);

    // Título
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 48px serif';
    ctx.textAlign = 'center';
    ctx.fillText('Certificado de', 400, 120);

    ctx.font = 'bold 56px serif';
    ctx.fillStyle = '#92400e';
    ctx.fillText('Explorador Cafetero', 400, 190);

    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#78350f';
    ctx.fillText('Este certificado se otorga a:', 400, 260);

    // 👇 Aquí se muestra el nombre del usuario Supabase
    ctx.font = 'italic 32px serif';
    ctx.fillText(userName, 400, 320);

    ctx.font = '20px sans-serif';
    ctx.fillText('Por completar exitosamente la exploración', 400, 380);
    ctx.fillText('de todas las secciones cafeteras', 400, 410);

    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = '#92400e';
    ctx.fillText(`${totalPoints} Puntos Obtenidos`, 400, 470);

    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#78350f';
    const date = new Date().toLocaleDateString('es-ES');
    ctx.fillText(`Fecha: ${date}`, 400, 530);

    const link = document.createElement('a');
    link.download = 'certificado-explorador-cafetero.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const resetProgress = () => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar tu progreso?')) {
      setPoints(0);
      setVisitedSections(new Set());
      setShowCertificate(false);
      setCertificateShown(false);
      localStorage.removeItem('points');
      localStorage.removeItem('visitedSections');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative bg-gray-900 text-white py-24 px-6">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-5xl md:text-6xl font-bold uppercase">
              Mis Recompensas
            </h1>
            <button
              onClick={resetProgress}
              className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-2 rounded font-semibold transition text-sm"
            >
              Reiniciar
            </button>
          </div>

          {/* Barra de progreso */}
          <div className="bg-gray-700 rounded-full h-6 overflow-hidden mb-2">
            <div 
              className="bg-yellow-400 h-full transition-all duration-500 flex items-center justify-center text-xs font-bold text-gray-900"
              style={{ width: `${progress}%` }}
            >
              {progress > 10 && `${Math.round(progress)}%`}
            </div>
          </div>
          <p className="text-gray-200 text-center text-lg">
            {points} / {totalPoints} puntos
          </p>
        </div>
      </div>

      {/* Secciones */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="text-8xl mb-6">🏆</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 uppercase">
            ¡Conviértete en Explorador Cafetero!
          </h2>
          <p className="text-xl text-gray-700 mb-4">
            Visita las secciones para ganar puntos y obtener tu certificado
          </p>
          <div className="mt-8 inline-block bg-yellow-400 px-8 py-4 rounded font-bold text-gray-900 text-xl">
            {visitedSections.size} / {sections.length} secciones completadas
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {sections.map(section => {
            const isVisited = visitedSections.has(section.id);
            return (
              <div
                key={section.id}
                className={`bg-white border-2 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all ${
                  isVisited ? 'border-green-500' : 'border-gray-200'
                }`}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-7xl">{section.icon}</span>
                    {isVisited && (
                      <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                        ✓ COMPLETADA
                      </div>
                    )}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3 uppercase">{section.name}</h3>
                  <p className="text-gray-700 mb-6 text-lg">
                    {section.description}
                  </p>
                  
                  <button
                    onClick={() => markSectionVisited(section.id)}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-6 rounded uppercase transition text-lg"
                  >
                    {isVisited ? (
                      <>🔄 Visitar de nuevo</>
                    ) : (
                      <>→ Explorar (+{pointsPerSection} puntos)</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal certificado */}
      {showCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-10 border-4 border-yellow-400 text-center">
            <div className="text-8xl mb-6">🏆</div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4 uppercase">
              ¡Felicitaciones!
            </h2>
            <p className="text-xl text-gray-700 mb-4">
              Has completado todas las secciones y ganado {totalPoints} puntos
            </p>
            <p className="text-lg text-gray-800 mb-8">
              Este certificado pertenece a <strong>{userName}</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={downloadCertificate}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-8 rounded uppercase transition text-lg"
              >
                📥 Descargar Certificado
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-4 px-8 rounded uppercase transition text-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
