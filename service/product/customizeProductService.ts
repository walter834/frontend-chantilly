import api from "../api";

export interface ApiProduct {
  id: number;
  short_description: string;
  large_description: string;
  min_price: string;
  max_price: string;
  images: Image[];
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

export interface Image {
  id: number;
  url: string;
  is_primary: number;
  sort_order: number;
}

export interface ProductTypeID {
  id: number;
  name: Name;
  status: number;
}

export enum Name {
  Accesorio = "ACCESORIO",
  Bocadito = "BOCADITO",
  Postre = "POSTRE",
  TortaEnLinea = "TORTA EN LINEA",
  TortaTematica = "TORTA TEMATICA",
}

export interface Product {
  id: number;
  name: string;
  description: string;
  product_type_id: number;
  product_type_name: string;
  image: string;
  images: Image[];
}

export interface ImageWithMetadata {
  file: File;
  is_primary: number;
  sort_order: number;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const { data: responseData } = await api.get("/products/all");

    const transformedProducts: Product[] = responseData.map(
      (apiProduct: ApiProduct) => {
        const primaryImage = apiProduct.images.find(
          (img) => img.is_primary === 1
        );
        const fallbackImage = apiProduct.images.sort(
          (a, b) => a.sort_order - b.sort_order
        )[0];

        return {
          id: apiProduct.id,
          name: apiProduct.short_description,
          description: apiProduct.large_description,
          product_type_id: apiProduct.product_type_id.id,
          product_type_name: apiProduct.product_type_id.name,
          image: primaryImage?.url || fallbackImage?.url || "",
          images: apiProduct.images,
        };
      }
    );

    return transformedProducts;
  } catch (err) {
    throw err;
  }
}

export async function updateProductImages(
  id: number,
  images: File[]
): Promise<{ message: string; product: ApiProduct }> {
  try {
    const formData = new FormData();

    images.forEach((image,index) => {
      formData.append(`images[${index}]`, image);
    });

    const response = await api.post(`/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function setPrimaryImage(id:number,imageId:number):Promise<{message:string;product:ApiProduct}> {
  try {
    const response = await api.post(`/products/${id}/set-primary-image`,{
      image_id: imageId
    });
    return response.data;
  } catch (error) {
    throw error
  }
}