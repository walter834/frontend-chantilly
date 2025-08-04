'use client';
import React from 'react';

const products = [
  {
    id: 1,
    title: 'CHEESCAKE DE MARACUYA',
    description: 'Cheesecake de maracuya',
    price: 'S/ 50.00',
    image: '/imgs/cheesecake.jpg',
  },
  {
    id: 2,
    title: 'BRAZO GITANO',
    description: 'Brazo gitano',
    price: 'S/ 40.00',
    image: '/imgs/brazo-gitano.jpg',
  },
  {
    id: 3,
    title: 'TORTA AMOR MEME - BUTTER CREAM',
    description: 'Torta amor meme - butter cream',
    price: 'S/ 90.00 – S/ 140.00',
    image: '/imgs/torta-amor.jpg',
  },
  {
    id: 4,
    title: 'TORTA PARA HOMBRE CON DEGRADADO – BUTTER CREAM',
    description: 'Torta para hombre con degradado - butter cream',
    price: 'S/ 90.00 – S/ 150.00',
    image: '/imgs/torta-hombre.jpg',
  },
];

export default function RecommendedProducts() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-black">Productos destacados</h2>
        <p className="text-gray-500 mt-2">Los mejores postres en la Casa del Chantilly, calidad y amor.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="text-center">
                {/* COMPONENTE DE PRODUCTOS AQUI */}
          </div>
        ))}
      </div>
    </section>
  );
}
