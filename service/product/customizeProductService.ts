import api from "../api";

export interface ApiProduct {
    id:                number;
    short_description: string;
    large_description: string;
    min_price:         string;
    max_price:         string;
    image:             string;
    status:            boolean;
    best_status:       boolean;
    product_type_id:   ProductTypeID;
    category_id:       CategoryID | null;
    theme_id:          null;
    product_link:      string;
}

export interface CategoryID {
    id:   number;
    name: string;
}

export interface ProductTypeID {
    id:     number;
    name:   Name;
    status: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  product_type_id: string;
}


export enum Name {
    Accesorio = "ACCESORIO",
    Bocadito = "BOCADITO",
    Postre = "POSTRE",
    TortaEnLinea = "TORTA EN LINEA",
    TortaTematica = "TORTA TEMATICA",
}


/*  */


export async function getProducts(): Promise<Product[]> {
  try {
    const { data } = await api.get("/products/all");

    // Transformar los datos a una estructura personalizada
    const transformedProducts: Product[] = data.map(
      (apiProduct: ApiProduct) => ({
        id: apiProduct.id,
        name: apiProduct.short_description,
        description: apiProduct.large_description,
        product_type_id: apiProduct.product_type_id.name,
      })
    );

    return transformedProducts;
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
}
