import api from "../api";

export interface ApiProduct {
  id: number;
  short_description: string;
  large_description: string;
  min_price: string;
  max_price: string;
  image: string;
  status: boolean;
  best_status: boolean;
  product_type_id: ProductTypeID;
  category_id: CategoryID | null;
  theme_id: null;
  product_link: string;
}

export interface CategoryID {
  id: number;
  name: string;
}

export interface ProductTypeID {
  id: number;
  name: Name;
  status: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  product_type_id: number;
  product_type_name: string;
  image: string;
}

export enum Name {
  Accesorio = "ACCESORIO",
  Bocadito = "BOCADITO",
  Postre = "POSTRE",
  TortaEnLinea = "TORTA EN LINEA",
  TortaTematica = "TORTA TEMATICA",
}

export async function getProducts(): Promise<Product[]> {
  try {
    let data;
    const { data: responseData } = await api.get("/products/all");
    data = responseData;

    const transformedProducts: Product[] = data.map(
      (apiProduct: ApiProduct) => ({
        id: apiProduct.id,
        name: apiProduct.short_description,
        description: apiProduct.large_description,
        product_type_id: apiProduct.product_type_id.id,
        product_type_name: apiProduct.product_type_id.name,
        image: apiProduct.image,
      })
    );

    return transformedProducts;
  } catch (err) {
    throw err;
  }
}

export async function updateProductImage(
  id: number,
  image: File
): Promise<any> {
  try {
    const formData = new FormData();
    formData.append("image", image);

    const response = await api.post(`/products/${id}`,formData,{
      headers:{
        'Content-Type': undefined
      }
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}
