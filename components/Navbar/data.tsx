
import { usePathname } from "next/navigation";
import { useMemo } from "react";
export default function useNavigationData() {
  const pathname = usePathname();

  const routes = useMemo(() => {
    // Por ahora usamos datos estáticos, pero esto se puede hacer dinámico
    // cuando implementemos React Query o SWR para el estado del servidor
    return [
      {
        id: 1,
        title: "NOVEDADES",
        active: pathname === "/",
        link: "/",
      },
      {
        id: 2,
        title: "TORTAS EN LINEA",
        active: pathname === "/c/tortas",
        link: "/c/tortas",
      },
      {
        id: 3,
        title: "TORTAS TEMÁTICAS",
        active: pathname === "/c/tortas-tematicas",
        link: "/c/tortas-tematicas",
      },
      {
        id: 4,
        title: "PROMOCIONES",
        active: pathname === "/c/promociones",
        link: "/c/promociones",
      },
      {
        id: 5,
        title: "POSTRES",
        active: pathname === "/c/postres",
        link: "/c/postres",
      },
      {
        id: 6,
        title: "BOCADITOS",
        active: pathname === "/c/bocaditos",
        link: "/c/bocaditos",
      },
      {
        id: 7,
        title: "CONTÁCTANOS",
        active: pathname === "/contacto",
        link: "/contacto",
      },
    ];
  }, [pathname]);

  return {
    routes, 
    pathname
  };
}