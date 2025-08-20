interface ProductData {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
}

export const productStorage = {
  setProduct: (product: ProductData) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedProduct', JSON.stringify(product));
    }
  },

  getProduct: (): ProductData | null => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('selectedProduct');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  },

  clearProduct: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('selectedProduct');
    }
  }
};
