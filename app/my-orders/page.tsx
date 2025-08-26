"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import OrdersList from "./components/OrdersList";
import { Search, X } from "lucide-react";
import { useState } from "react";
export default function myOrders() {
  // Estados para manejar la busqueda por numero de compra
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearhQuery] = useState("");

  // Estado para manejas la busque por fecha
  const [dateFilter,setDateFilter] = useState("");

  const handleSearch = () => {
    setSearhQuery(searchTerm.trim());
  };

  const clearSearch = () =>{
    setSearchTerm("");
    setSearhQuery("");
    setDateFilter("");
  }
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div className="py-10 min-h-screen">
      <div className="mb-4">
        <h1 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold">MIS COMPRAS</h1>
      </div>
      <div className="flex flex-col md:flex-row justify-between mx-auto px-6 lg:px-40  gap-2  ">
        <div className="flex  items-center gap-2">
          <Input
            type="text"
            placeholder="Buscar por número de compras"
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
            className="md:w-[250px]"
          />
          <Button type="button" variant="outline" onClick={handleSearch}>
            <Search />
          </Button>
          {searchQuery && (
            <Button type="button" variant="outline" onClick={clearSearch}>
                <X/>
            </Button>
          )

          }
        </div>
        <Select value={dateFilter} onValueChange={setDateFilter} >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filtrar por fecha" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Periodos</SelectLabel>
              <SelectItem value="ultimos_30_dias">Últimos 30 días</SelectItem>
              <SelectItem value="ultimos_3_meses">Últimos 3 meses</SelectItem>
              <SelectItem value="ultimos_6_meses">Últimos 6 meses</SelectItem>
              <SelectItem value="2025">Año 2025</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-10">
        <OrdersList searchQuery={searchQuery} dateFilter={dateFilter}/>
      </div>
    </div>
  );
}
