// hooks/useUbigeo.ts
import { getDepartamentos, getDistritos, getProvincias } from "@/service/ubigeo/ubigeoServices";
import { useEffect, useState } from "react";


export function useDepartamentos() {
  const [departamentos, setDepartamentos] = useState<any[]>([]);

  useEffect(() => {
    getDepartamentos().then(setDepartamentos);
  }, []);

  return { departamentos };
}

export function useProvincias(coddep?: string) {
  const [provincias, setProvincias] = useState<any[]>([]);

  useEffect(() => {
    if (!coddep) return;
    getProvincias(coddep).then(setProvincias);
  }, [coddep]);

  return { provincias };
}

export function useDistritos(coddep?: string, codpro?: string) {
  const [distritos, setDistritos] = useState<any[]>([]);

  useEffect(() => {
    if (!coddep || !codpro) return;
    getDistritos(coddep, codpro).then(setDistritos);
  }, [coddep, codpro]);

  return { distritos };
}
