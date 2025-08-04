import { Search } from "lucide-react";
import React from "react";

export default function CakesOnline() {
  return (
    <div className="mt-[20px] mx-auto container">
      <div className="text-center">
        <h1>TORTAS EN LINEA</h1>
        <p>Las mejores tortas en la Casa del Chantilly, calidad y amor.</p>
      </div>
      <div className="flex justify-between">
        <p>Mostrando 8 de 9 resultados</p>
        <div className="flex items-center p-2 gap-2 border border-black/20">
          
          <input type="text" placeholder="Buscar productos" className="border-none outline-none bg-transparent"/>
          <Search  className="text-black/30 size-5" />
          
        </div>
      </div>
    </div>
  );
}
