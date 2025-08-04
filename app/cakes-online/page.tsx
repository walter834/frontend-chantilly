import { Input } from "@/components/ui/input";
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
        
          <div className="flex w-full max-w-sm items-center border border-gray-300 rounded-lg px-2.5 py-1.5">
            <svg
            
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
               className="h-4 w-4 mr-2.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              placeholder="Search..."
              className="w-full border-0 outline-none"
            />
          </div>
        </div>
     
    </div>
  );
}
