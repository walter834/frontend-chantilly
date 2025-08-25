export interface Product {
  id: number;
  short_description: string;
  large_description: string;
  product_type_id: number;
  category_id: number | null;
  min_price: string;
  max_price: string;
  theme_id: number | null;
  image: string;
  status: boolean;
  best_status: boolean;
  product_link: string;
}

export interface ProductVariant {
  id: number;
  cod_fab: string;
  product_id: number;
  description: string;
  portions: string;
  size_portion: string;
  price: string;
  hours: number;
  sort: number | null;
  image: string;
}

export interface OrderItem {
  id: number;
  product: Product | null;
  product_variant: ProductVariant | null
  quantity: number;
  unit_price: string;
  subtotal: string;
  dedication_text: string | null;
  delivery_date: string;
  image_url: string | null;
}

export interface BillingData {
  ruc: string;
  razon_social: string;
  tax_address: string;
}

export interface Order {
  id: number;
  customer_id: number;
  order_number: string;
  voucher_type: string | null;
  billing_data: BillingData | null; // Ahora puede ser un objeto o null
  local: Local;
  subtotal: string;
  total: string;
  order_date: string; // "YYYY-MM-DD HH:mm"
  status?: boolean;
  payment_method?: string | null;
  payment_status?: string | null;
  paid_at?: string | null;
  items: OrderItem[];
}
