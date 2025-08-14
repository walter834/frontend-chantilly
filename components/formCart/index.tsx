'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import { TransformedCakeFlavor, TransformedProductVariant } from '@/types/api';
import { portionsOptions } from '../features/ProductDetail/data';

interface FormCartProps {
  productId: string;
  name: string;
  initialPrice: number;
  productVariant: TransformedProductVariant | null;
  cakeFlavors: TransformedCakeFlavor[];
  onPortionChange: (portion: string) => void;
  theme?: string | null;
  imageProduct: string;
  cakeName: string;
  initialImage: string;
  productType: string;
}

const FormCart: React.FC<FormCartProps> = ({ 
  productId, 
  name,
  initialPrice, 
  productVariant, 
  cakeFlavors, 
  onPortionChange,
  theme,
  imageProduct,
  cakeName,
  initialImage,
  productType, 
}) => {
  const [selectedPortion, setSelectedPortion] = useState('');
  const [selectedCake, setSelectedCake] = useState('');
  const [selectedCakeName, setSelectedCakeName] = useState('');
  const [selectedFilling, setSelectedFilling] = useState('');
  const [fillings, setFillings] = useState<Array<{id: number, name: string, status: boolean}>>([]);
  const [pickupDate, setPickupDate] = useState('');
  const [dedication, setDedication] = useState('');

  function arrayDataToCart(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    const currentCart = JSON.parse(localStorage.getItem('chantilly-cart') || '{"items":[],"total":0,"itemCount":0}');
    
    const productIdentifier = `${productId}-${selectedPortion}-${selectedCake}-${selectedFilling}`;
    
    const existingItemIndex = currentCart.items.findIndex((item: any) => 
      item.productId === productId && 
      item.product.portion === selectedPortion &&
      item.product.cakeFlavor === selectedCake &&
      item.product.fillingName === selectedFilling
    );

    let updatedItems;
    
    if (existingItemIndex !== -1) {
      updatedItems = [...currentCart.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + 1,
        price: parseFloat(updatedItems[existingItemIndex].price) + parseFloat(productVariant?.price || '0')
      };
    } else {
      console.log('name', name);
      const newItem = {
        id: `${productId}-${Date.now()}`,
        productId: productId,
        product: {
          id: productId,
          name: productVariant?.description || name,
          description: `Tema: ${theme || 'No especificado'}, Relleno: ${selectedFilling || 'No especificado'}`,
          price: parseFloat(productVariant?.price || initialPrice.toFixed(2)),
          image: imageProduct || initialImage,
          portion: selectedPortion,
          cakeFlavor: selectedCake,
          cakeFlavorName: cakeName,
          fillingName: selectedFilling,
          dedication: dedication,
          pickupDate: pickupDate,
        },
        quantity: 1,
        price: parseFloat(productVariant?.price || initialPrice.toString())
      };
      updatedItems = [...currentCart.items, newItem];
    }
    
    const total = updatedItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    
    const updatedCart = {
      items: updatedItems,
      total,
      itemCount
    };
    
    localStorage.setItem('chantilly-cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
    
    console.log('Carrito actualizado:', updatedCart);
    alert(existingItemIndex !== -1 ? '¡Cantidad actualizada en el carrito!' : '¡Producto agregado al carrito!');
  }

  useEffect(() => {
    if (selectedCake) {
      const cake = cakeFlavors.find(c => c.id.toString() === selectedCake);
      if (cake) {
        setFillings(cake.fillings);
        setSelectedFilling('');
      } else {
        setFillings([]);
        setSelectedFilling('');
      }
    } else {
      setFillings([]);
      setSelectedFilling('');
    }
  }, [selectedCake, cakeFlavors]);

  return (
    <form onSubmit={arrayDataToCart} className="space-y-4">
      <input type="hidden" name="imageProduct" value={imageProduct || ''} />
      <input type="hidden" name="cakeName" value={cakeName || ''} />
  
      {/* Porciones — solo para Tortas temáticas */}
      {(productType === '1' || productType === '2') && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="text-sm font-medium text-black sm:w-32 sm:flex-shrink-0">Porciones</label>
          <select
            value={selectedPortion}
            name="portion"
            required={(productType === '1' || productType === '2')}
            onChange={(e) => {
              setSelectedPortion(e.target.value);
              onPortionChange(e.target.value);
            }}
            className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c41c1a] focus:border-[#c41c1a]"
          >
            {Object.entries(portionsOptions).map(([key]) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
      )}
  
      {/* Opciones de cake — solo para Tortas temáticas */}
      {productType === '2' && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="text-sm font-medium text-black sm:w-32 sm:flex-shrink-0">Opciones de cake</label>
          <select
            value={selectedCake}
            name="cake"
            required={productType === '2'}
            onChange={(e) => setSelectedCake(e.target.value)}
            className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c41c1a] focus:border-[#c41c1a]"
          >
            <option value="">Elige una opción</option>
            {cakeFlavors.map((cake) => (
              <option key={cake.id} value={cake.id.toString()}>{cake.name}</option>
            ))}
          </select>
        </div>
      )}
  
      {/* Relleno — solo para Tortas temáticas */}
      {productType === '2' && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="text-sm font-medium text-black sm:w-32 sm:flex-shrink-0">Relleno</label>
          <select
            name="filling"
            value={selectedFilling}
            required={productType === '2'}
            onChange={(e) => setSelectedFilling(e.target.value)}
            className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c41c1a] focus:border-[#c41c1a]"
            disabled={!selectedCake || fillings.length === 0}
          >
            <option value="">Selecciona un relleno</option>
            {fillings.map((filling) => (
              <option key={filling.id} value={filling.id.toString()}>
                {filling.name}
              </option>
            ))}
          </select>
        </div>
      )}
  
      {/* Día de recojo — requerido para todos los tipos */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <label className="text-sm font-medium text-black sm:w-32 sm:flex-shrink-0">Día de recojo</label>
        <input
          type="date"
          value={pickupDate}
          name="pickupDate"
          required // siempre requerido según tu especificación
          onChange={(e) => setPickupDate(e.target.value)}
          className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c41c1a] focus:border-[#c41c1a]"
        />
      </div>
  
      {/* Dedicatoria — opcional siempre */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
        <label className="text-sm font-medium text-black sm:w-32 sm:flex-shrink-0 sm:pt-2">Nombre o Dedicatoria</label>
        <textarea
          value={dedication}
          name="dedication"
          onChange={(e) => setDedication(e.target.value)}
          placeholder="Escribe tu dedicatoria"
          rows={3}
          className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c41c1a] focus:border-[#c41c1a] resize-none"
        />
      </div>
  
      {/* Precio + botón */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="text-3xl font-bold text-[#c41c1a] sm:w-32 sm:flex-shrink-0 text-center sm:text-left">
          S/
          {productType === '3' ? (
            initialPrice.toFixed(2)
          ) : selectedPortion && productVariant ? productVariant.price : '0.00'}
        </div>
        <button
          type="submit"
          className="cursor-pointer w-full sm:flex-1 bg-[#c41c1a] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#a01818] transition-colors duration-300 ease-in-out shadow-md flex items-center justify-center gap-2"
        >
          Añadir al carrito
        </button>
      </div>
    </form>
  );  
};

export default FormCart;