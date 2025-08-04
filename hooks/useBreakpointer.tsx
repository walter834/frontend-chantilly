import { useEffect, useState } from "react"

export default function useBreakpointer() {
  
  const [width,setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);
  
  useEffect(()=>{
    const handleResizeWindow = () => setWidth(window.innerWidth);

    window.addEventListener("resize",handleResizeWindow);

    return () => window.removeEventListener("resize",handleResizeWindow);
  })

  return width;
}
