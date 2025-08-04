
import { usePathname } from "next/navigation";
import { useMemo } from "react";



export default function useNavigationData() {
  const pathname = usePathname();


  const routes = useMemo(() => [
    {
      id: 1,
      title: "NOVEDADES",
      active: pathname != '/about-me' && pathname != '/services' && pathname != '/portfolio' && pathname != '/testimonials',
      link: "/news",
    },
    {
      id: 2,
      title: "TORTAS EN LINEA",
      active: pathname === "/cakes-online",
      link: "/cakes-online",
    },
    {
      id: 3,
      title: "TORTAS TEMÁTICAS",
      active: pathname === "/cakes-themed",
      link: "/cakes-themed",
    },
    {
      id: 4,
      title: "PROMOCIONES",
      active: pathname === "/promotions",

      link: "/promotions",
    },
    {
      id: 5,
      title: "POSTRES",
      active: pathname === "/desserts",

      link: "/desserts",
    },
    {
      id: 6,
      title: "BOCADITOS",
      active: pathname === "/snacks",

      link: "/snacks",
    },
    {
      id: 7,
      title: "CONTÁCTANOS",
      active: pathname === "/contact",

      link: "/contact",
    },
  ], [pathname])




  return {
    routes, pathname
  }
}