import api from "../api";

export interface ApiVariant {
  id: number;
  cod_fav: string;
  description: string;
  portions: string;
  size_portion: string;
  price: string;
  hours: number;
  sort: null;
  image: string;
  product: Product;
}

export interface Product {
  id: number;
  short_description: string;
  large_description: string;
  min_price: string;
  max_price: string;
  image: string;
  status: boolean;
  best_status: boolean;
  product_type_id: ProductTypeID;
  category_id: null;
  product_link: string;
}

export interface Variant {
  id: number;
  cod_fav: string;
  description: string;
  product: string;
}
export interface ProductTypeID {
  id: number;
  name: Name;
  status: number;
}

export interface ProductTypeID {
  id: number;
  name: Name;
  status: number;
}
export enum Name {
  Postre = "POSTRE",
  TortaEnLinea = "TORTA EN LINEA",
  TortaTematica = "TORTA TEMATICA",
}

export async function getVariants(): Promise<Variant[]> {
  try {
    const { data } = await api.get("/products-variant/all");

    const transformedVariant: Variant[] = data.map(
      (apiVariant: ApiVariant) => ({
        id: apiVariant.id,
        cod_fav: apiVariant.cod_fav,
        description: apiVariant.description,
        product: apiVariant.product.short_description,
      })
    );
    return transformedVariant;
  } catch (err) {
    throw err;
  }
}
