import api from "../api";

export const getDepartamentos = async () => {
  const { data } = await api.get("/departamentos");
  console.log("Departamentos data:", data); // Depuración
  
  return data;
};

export const getProvincias = async (coddep: string) => {
  const { data } = await api.get(`/provincias/${coddep}`);
  console.log("Provincias data:", data); // Depuración
  return data;
};

export const getDistritos = async (coddep: string, codpro: string) => {
  const { data } = await api.get(`/distritos/${coddep}/${codpro}`);
   console.log("Provincias Distritos:", data); // Depuración
  return data;
};
