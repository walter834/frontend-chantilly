import { number, string } from "zod";

export interface ApiPage {
  id: number;
  name: string;
  link_view: string;
  orden: number;
  status: boolean;
}

export interface ApiTheme {
  id: number;
  name: string;
  image_url: string;
}

export interface ApiProductType {
  id: number;
  name: string;
  status: number;
}

export interface ApiProduct {
  id: number;
  short_description: string;
  large_description: string;
  product_type_id: number;
  category_id: number;
  min_price: string;
  max_price: string;
  theme_id: number;
  image: string;
  status: boolean;
  best_status: boolean;
  theme: ApiTheme;
  category: {
    id: number;
    name: string;
  };
  product_type: {
    id: number;
    name: string;
    status: number;
  };
}

export interface ApiProductVariant {
  data: {
    0: {
      id: number;
      cod_fav: string;
      description: string;
      portion: number;
      size_portion: number;
      price: string;
      hours: string;
      sort: string;
      image: string;
      product: {
        id: number;
        short_description: string;
        large_description: string;
        product_type_id: number;
        category_id: number;
        min_price: string;
        max_price: string;
        theme_id: number;
        image: string;
        status: boolean;
        best_status: boolean;
        theme: ApiTheme;
        category: {
          id: number;
          name: string;
        };
        product_type: {
          id: number;
          name: string;
          status: number;
        };
      }
    }
  }
}

export interface TransformedProductVariant {
  id: number;
  cod_fav: string;
  description: string;
  portion: number;
  size_portion: number;
  price: string;
  hours: string;
  sort: string;
  image: string;
}

export interface ApiProductsResponse {
  data: ApiProduct[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export interface TransformedPage {
  id: number;
  name: string;
  slug: string;
  link: string;
  orden: number;
  status: boolean;
}

export interface TransformedTheme {
  id: number;
  name: string;
  slug: string;
  icon: string;
  link: string;
}

export interface TransformedProductType {
  id: number;
  name: string;
  slug: string;
  status: number;
}

export interface ApiCakeFilling {
  id: number;
  name: string;
  status: boolean;
}

export interface ApiCakeFlavor {
  id: number;
  name: string;
  status: boolean;
  filling_id: number;
  filling: ApiCakeFilling;
}

export interface TransformedCakeFlavor {
  id: number;
  name: string;
  fillingId: number;
  fillingName: string;
}

export interface TransformedProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  theme_id?: string;
  stock: number;
  isBestSeller: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function transformToSlug(linkView: string): string {
  return linkView
    .toLowerCase()
    .replace(/([A-Z])/g, '-$1')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

export function transformPage(apiPage: ApiPage): TransformedPage {
  const slug = transformToSlug(apiPage.link_view);
  const link = apiPage.link_view === '' ? '/' : `/c/${slug}`;

  return {
    id: apiPage.id,
    name: apiPage.name,
    slug,
    link,
    orden: apiPage.orden,
    status: apiPage.status,
  };
}

export function transformTheme(apiTheme: ApiTheme): TransformedTheme {
  const slug = apiTheme.name.toLowerCase().replace(/\s+/g, '-');

  return {
    id: apiTheme.id,
    name: apiTheme.name,
    slug,
    icon: `/imgs/icons/${apiTheme.image_url}`,
    link: `/c/tortas-tematicas/${slug}`,
  };
}

export function transformProductType(apiProductType: ApiProductType): TransformedProductType {
  const slug = apiProductType.name.toLowerCase().replace(/\s+/g, '-');

  return {
    id: apiProductType.id,
    name: apiProductType.name,
    slug,
    status: apiProductType.status,
  };
}

export function transformProduct(apiProduct: ApiProduct): TransformedProduct {
  const minPrice = parseFloat(apiProduct.min_price);
  const maxPrice = parseFloat(apiProduct.max_price);
  return {
    id: apiProduct.id,
    name: apiProduct.short_description,
    description: apiProduct.large_description,
    price: minPrice,
    originalPrice: maxPrice > minPrice ? maxPrice : undefined,
    image: apiProduct.image,
    category: apiProduct.product_type_id.toString(),
    theme_id: apiProduct.theme_id?.id?.toString(),
    stock: 10,
    isBestSeller: apiProduct.best_status,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

}

export function transformProductVariant(apiProductVariant: ApiProductVariant): TransformedProductVariant {
  const variant = apiProductVariant.data[0];
  return {
    id: variant.id,
    cod_fav: variant.cod_fav,
    description: variant.description,
    portion: variant.portion,
    size_portion: variant.size_portion,
    price: variant.price,
    hours: variant.hours,
    sort: variant.sort,
    image: variant.image,
  };
}

export function transformCakeFlavor(apiCakeFlavor: ApiCakeFlavor): TransformedCakeFlavor {
  return {
    id: apiCakeFlavor.id,
    name: apiCakeFlavor.name,
    fillingId: apiCakeFlavor.filling_id,
    fillingName: apiCakeFlavor.filling.name,
  };
}