export interface ApiPage {
  id: number;
  name: string;
  link_view: string;
  orden: number;
  status: boolean;
}

export interface ApiCustomer {
  id: number;
  name: string;
  lastname: string;
  id_document_type: number;
  document_number: string;
  email: string;
  email_verified_at: string;
  address: string;
  phone: string;
  deparment: string;
  province: string;
  district: string;
  deparment_code: string;
  province_code: string;
  district_code: string;
  status: number;
  google_id: string;
}

export interface ApiInitSessionNiubiz {
  amount: number;
  order_id: number;
  purchaseNumber: string;
  description: string;
}

export interface ApiOrder {
  customer_id: number;
  voucher_type: string;
  local_id: number;
  subtotal: number;
  total_amount: number;
  billing_data: {
    ruc?: string,
    razon_social?: string,
    tax_address?: string
  },
  items: Array<{
    product_variant_id: number | null,
    cake_flavor_id: number | null,
    quantity: number,
    unit_price: number,
    subtotal: number,
    dedication_text: string | null,
    delivery_date: string | null
  }>
}

export interface ApiInitSessionNiubizTransformed {
  amount: number;
  order_id: number;
  description: string;
}

export interface TransformedOrder {
  orders: {
    0:{
      billing_data: null,
      customer_id: number,
      id: number,
      items: Array<{ product_variant_id: number, cake_flavor_id: number | null, quantity: number, unit_price: number, subtotal: number, dedication_text: string | null, delivery_date: string | null }>,
      local_id: number,
      order_date: string,
      order_number: string,
      subtotal: number,
      total: number,
      voucher_type: string
    }
  }
}

export interface TransformedInitSessionNiubiz {
  amount: number;
  order_id: number;
  description: string;
}

// Niubiz init session API response
export interface NiubizInitSessionResponse {
  success: boolean;
  data: {
    amount: number;
    merchant_id: string;
    purchase_number: string;
    sessionToken: string;
    merchant_logo: string;
  };
}

// New Niubiz flow types
export interface NiubizConfigResponse {
  merchant_id: string;
  checkout_js_url: string; // e.g. https://static-content-qas.vnforapps.com/v2/js/checkout.js?qa=true
  environment: 'sandbox' | 'prod';
}

export interface NiubizSessionResponse {
  data: {
    sessionToken: string;
    merchant_id: string;
    purchase_number: string;
    amount: number;
    merchant_logo: string;
  };
  success: boolean;
}

export interface NiubizProcessResponse {
  success: boolean;
  transaction_id?: string;
  action_code?: string;
  [key: string]: any;
}

export interface TransformedCustomer {
  id: number;
  name: string;
  lastname: string;
  id_document_type: number;
  document_number: string;
  email: string;
  email_verified_at: string;
  address: string;
  phone: string;
  deparment: string;
  province: string;
  district: string;
  deparment_code: string;
  province_code: string;
  district_code: string;
  status: number;
  google_id: string;
}

export type UpdateCustomerPayload = Pick<ApiCustomer,
  'name' |
  'lastname' |
  'address' |
  'phone' |
  'id_document_type' |
  'document_number'
>;

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
  product_type_id: {
    id: number;
    name: string;
    status: number;
  };
  category_id: number;
  min_price: string;
  max_price: string;
  theme_id: {
    id: number;
    name: string;
    image_url: string;
  };
  image: string;
  status: boolean;
  best_status: boolean;
  theme: ApiTheme;
  category: {
    id: number;
    name: string;
  };
  product_link: string;
}

export interface ApiProductAccessory {
  id: number;
  short_description: string;
  large_description: string;
  min_price: string;
  max_price: string;
  image: string;
  status: boolean;
  best_status: boolean
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
  fillings: {
    id: number;
    name: string;
    status: boolean;
  }[];
}

export interface TransformedCakeFlavor {
  id: number;
  name: string;
  status: boolean;
  fillings: {
    id: number;
    name: string;
    status: boolean;
  }[];
}

export interface TransformedProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category_id: string;
  product_type_id: string;
  theme_id?: string;
  isBestSeller: boolean;
  product_link: string;
}

export interface TransformedProductAccessory {
  id: number;
  short_description: string;
  large_description: string;
  min_price: string;
  max_price: string;
  image: string;
  status: boolean;
  best_status: boolean;
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
    category_id: apiProduct.category_id?.toString() || '',
    product_type_id: apiProduct.product_type_id?.id?.toString() || '',
    theme_id: apiProduct.theme_id?.id?.toString() || '',
    isBestSeller: apiProduct.best_status || false,
    product_link: apiProduct.product_link,
  };

}

export function transformProductAccessory(apiProductAccessory: ApiProductAccessory): TransformedProductAccessory {
  const minPrice = parseFloat(apiProductAccessory.min_price);
  const maxPrice = parseFloat(apiProductAccessory.max_price);
  return {
    id: apiProductAccessory.id,
    short_description: apiProductAccessory.short_description,
    large_description: apiProductAccessory.large_description,
    min_price: minPrice.toString(),
    max_price: maxPrice.toString(),
    image: apiProductAccessory.image,
    status: apiProductAccessory.status,
    best_status: apiProductAccessory.best_status,
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

export function transformCustomer(apiCustomer: ApiCustomer): TransformedCustomer {
  return {
    id: apiCustomer.id,
    name: apiCustomer.name,
    lastname: apiCustomer.lastname,
    id_document_type: apiCustomer.id_document_type,
    document_number: apiCustomer.document_number,
    email: apiCustomer.email,
    email_verified_at: apiCustomer.email_verified_at,
    address: apiCustomer.address,
    phone: apiCustomer.phone,
    deparment: apiCustomer.deparment,
    province: apiCustomer.province,
    district: apiCustomer.district,
    deparment_code: apiCustomer.deparment_code,
    province_code: apiCustomer.province_code,
    district_code: apiCustomer.district_code,
    status: apiCustomer.status,
    google_id: apiCustomer.google_id,
  };
}

export function transformCakeFlavor(apiCakeFlavor: ApiCakeFlavor): TransformedCakeFlavor {
  apiCakeFlavor.fillings.map((filling: ApiCakeFilling) => {
  });
  return {
    id: apiCakeFlavor.id,
    name: apiCakeFlavor.name,
    status: apiCakeFlavor.status,
    fillings: apiCakeFlavor.fillings,
  };
}