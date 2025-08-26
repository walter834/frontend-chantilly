import api from "../api";

export const getDepartamentos = async () => {
  const { data } = await api.get("/departamentos");

  return data;
};

export const getProvincias = async (coddep: string) => {
  const { data } = await api.get(`/provincias/${coddep}`);
  return data;
};

export const getDistritos = async (coddep: string, codpro: string) => {
  const { data } = await api.get(`/distritos/${coddep}/${codpro}`);
  return data;
};
