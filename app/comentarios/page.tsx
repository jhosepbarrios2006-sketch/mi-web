'use client';

import React, { useState, useEffect } from 'react';

interface Comment {
  id: string;
  cafeteria: string;
  nombre: string;
  rating: number;
  comentario: string;
  fecha: string;
}

export default function ComentariosPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedCafeteria, setSelectedCafeteria] = useState('');
  const [nombre, setNombre] = useState('');
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [filterCafeteria, setFilterCafeteria] = useState('todas');

  const cafeterias = [
    'Tayronacafé',
    'Juan Valdez',
    'Cafe Rojas',
    'Kaffa Origen del Café',
    'El Maná Coffee And Brunch',
    'Café Zona Té',
    'Cafe Ritual',
    'Herencia Brunch y Café',
    'El Molino Gourmet',
    'Praca Café Hecho Con Amor',
    'Cundinamarca Café Y Pastelería',
    'Star House Gourmet',
    'Cruton Artesanalmente Oblea By Cronch',
    'Mocca Coffee Gourmet'
  ];

  // Cargar comentarios guardados
  useEffect(() => {
    const savedComments = localStorage.getItem('cafeteriaComments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, []);

  // Guardar comentarios
  const saveComments = (newComments: Comment[]) => {
    localStorage.setItem('cafeteriaComments', JSON.stringify(newComments));
    setComments(newComments);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCafeteria || !nombre || rating === 0 || !comentario) {
      alert('Por favor completa todos los campos');
      return;
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      cafeteria: selectedCafeteria,
      nombre,
      rating,
      comentario,
      fecha: new Date().toLocaleDateString('es-ES')
    };

    const updatedComments = [newComment, ...comments];
    saveComments(updatedComments);

    // Limpiar formulario
    setSelectedCafeteria('');
    setNombre('');
    setRating(0);
    setComentario('');

    alert('¡Comentario publicado exitosamente! ☕');
  };

  const filteredComments = filterCafeteria === 'todas' 
    ? comments 
    : comments.filter(c => c.cafeteria === filterCafeteria);

  const renderStars = (rating: number, interactive: boolean = false, onRate?: (r: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRate && onRate(star)}
            className={`text-2xl ${interactive ? 'cursor-pointer hover:scale-110 transition' : 'cursor-default'} ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
            disabled={!interactive}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header con imagen de fondo similar a tu página */}
      <div className="relative bg-gray-900 text-white py-24 px-6">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 uppercase">
            Comentarios
          </h1>
          <p className="text-xl md:text-2xl text-gray-200">
            Comparte tu experiencia en nuestras cafeterías
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Deja tu comentario
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Selección de cafetería */}
                <div>
                  <label className="block text-gray-800 font-semibold mb-2 text-sm uppercase">
                    Selecciona la cafetería *
                  </label>
                  <select
                    value={selectedCafeteria}
                    onChange={(e) => setSelectedCafeteria(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                    required
                  >
                    <option value="">-- Elige una cafetería --</option>
                    {cafeterias.map((cafe) => (
                      <option key={cafe} value={cafe}>{cafe}</option>
                    ))}
                  </select>
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-gray-800 font-semibold mb-2 text-sm uppercase">
                    Tu nombre *
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: María García"
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                    required
                  />
                </div>

                {/* Calificación */}
                <div>
                  <label className="block text-gray-800 font-semibold mb-2 text-sm uppercase">
                    Calificación *
                  </label>
                  {renderStars(rating, true, setRating)}
                  {rating === 0 && (
                    <p className="text-sm text-gray-500 mt-1">Haz clic en las estrellas para calificar</p>
                  )}
                </div>

                {/* Comentario */}
                <div>
                  <label className="block text-gray-800 font-semibold mb-2 text-sm uppercase">
                    Tu comentario *
                  </label>
                  <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Cuéntanos tu experiencia en esta cafetería..."
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-500 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-6 rounded uppercase transition text-lg"
                >
                  Publicar Comentario
                </button>
              </form>
            </div>
          </div>

          {/* Lista de comentarios */}
          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Comentarios recientes
              </h2>
              
              {/* Filtro */}
              <div className="mb-6">
                <label className="block text-gray-800 font-semibold mb-2 text-sm uppercase">
                  Filtrar por cafetería:
                </label>
                <select
                  value={filterCafeteria}
                  onChange={(e) => setFilterCafeteria(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                >
                  <option value="todas">Todas las cafeterías</option>
                  {cafeterias.map((cafe) => (
                    <option key={cafe} value={cafe}>{cafe}</option>
                  ))}
                </select>
              </div>

              <p className="text-gray-700 mb-4">
                Total de comentarios: <span className="font-bold">{filteredComments.length}</span>
              </p>
            </div>

            {/* Comentarios */}
            <div className="space-y-4">
              {filteredComments.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
                  <div className="text-6xl mb-4">☕</div>
                  <p className="text-gray-600 text-lg">
                    {filterCafeteria === 'todas' 
                      ? 'Aún no hay comentarios. ¡Sé el primero en compartir tu experiencia!'
                      : `No hay comentarios para ${filterCafeteria} aún.`}
                  </p>
                </div>
              ) : (
                filteredComments.map((comment) => (
                  <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{comment.nombre}</h3>
                        <p className="text-sm text-gray-600 font-medium">{comment.cafeteria}</p>
                      </div>
                      <span className="text-xs text-gray-500">{comment.fecha}</span>
                    </div>
                    
                    <div className="mb-3">
                      {renderStars(comment.rating)}
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed">{comment.comentario}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}