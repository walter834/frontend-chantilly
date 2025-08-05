import ProductCard from "@/components/features/ProductCard";
import Paginations from "@/components/Paginations";
import { productsThemed } from "./data";

export default function CakesThemed() {
  return (
    <div className="mt-[20px] mx-auto container">
          <div className="text-center">
            <h1 className="font-bold text-2xl md:text-4xl">TORTAS TEMÁTICAS</h1>
            <p className="text-muted-foreground text-xl md:text-2xl">Las mejores tortas en la Casa del Chantilly, calidad y amor.</p>
          </div>
          <div className="flex md:justify-between justify-center mx-4 mt-4">
            <p className="md:flex hidden text-muted-foreground">Mostrando 8 de 9 resultados</p>
    
            <div className="flex w-full max-w-sm items-center border border-gray-300 rounded-lg px-2.5 py-1.5 mb-4">
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
          <Paginations />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-[24px]">
            {productsThemed.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.image}
              />
            ))}
          </div>
        </div>
  )
}
