import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Package } from "lucide-react";

export function OrderCard() {
  return (
    <div className="w-full px-4">
      <Card className="bg-white rounded-lg shadow-lg w-full mx-auto p-6  sm:p-6 max-w-xl md:max-w-4xl lg:max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center ">
          <span className="text-gray-600 text-sm sm:text-base font-medium">
            13 de agosto 2025
          </span>
          <span className="text-lg sm:text-xl font-bold">S/ 25.00</span>
        </div>
        <Separator className="my-0" />
        <div className="flex flex-col md:flex-row w-full justify-between">
          <div className="">
            {/* Order Number */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-red-500 font-bold text-sm sm:text-lg">Compra N° 0001</h2>
            </div>

            {/* Product Section */}
            <div className="flex gap-4 mb-6">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                  src="/alianza-lima-jersey-cake.png"
                  alt="Torta Alianza Lima"
                  className="w-24 h-24 rounded-lg object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-2">
                  1 x TORTA HOMBRE CAMISETA ALIANZA LIMA Y CHIMPUNES
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Porción:</span> 8 porciones
                  </p>
                  <p>
                    <span className="font-medium">Medida:</span> Diámetro 18cm
                  </p>
                  <p>
                    <span className="font-medium">Keke:</span> Keke de Novia
                  </p>
                  <p>
                    <span className="font-medium">Relleno:</span> Manjar de Casa
                  </p>
                  <p>
                    <span className="font-medium">Fecha Recojo:</span>{" "}
                    2025-08-21
                  </p>
                  <p>
                    <span className="font-medium">Nombre o Dedicatoria:</span>{" "}
                    mi viejo
                  </p>
                </div>
                <div className="mt-2">
                  <span className="font-bold text-lg">S/ 25.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="pt-4">
            <div className="mb-4">
              <div className="flex items-center gap-2 text-red-500 mb-2">
                <Package className="w-4 h-4" />
                <span className="font-bold">Tipo de Entrega</span>
              </div>
              <p className="text-gray-700 ml-6">RECOJO EN TIENDA</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-red-500 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="font-bold">Tienda</span>
              </div>
              <div className="ml-6 text-gray-700">
                <p className="font-medium">LA CASA DEL CHANTILLY - HABICH</p>
                <p className="text-sm">
                  Av. Eduardo de Habich 475 Urb. Ingeniería San Martín de Porras
                  Lima
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
