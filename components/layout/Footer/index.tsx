import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Información de la empresa */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Chantilly</h3>
            <p className="text-gray-300 mb-4">
              Los mejores productos artesanales con la más alta calidad y sabor único.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/productos" className="text-gray-300 hover:text-white">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="text-gray-300 hover:text-white">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="text-gray-300 hover:text-white">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-gray-300 hover:text-white">
                  Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-gray-300">+51 999 999 999</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-gray-300">info@chantilly.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="text-gray-300">Lima, Perú</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 Chantilly. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
} 