interface ProductData {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
}

export const productStorage = {
  // Guardar producto en sessionStorage (se borra al cerrar pestaña)
  setProduct: (product: ProductData) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedProduct', JSON.stringify(product));
    }
  },

  // Obtener producto del sessionStorage
  getProduct: (): ProductData | null => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('selectedProduct');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  },

  // Limpiar producto del storage
  clearProduct: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('selectedProduct');
    }
  }
};
