'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import { TransformedCakeFlavor, TransformedProductVariant } from '@/types/api';
import { portionsOptions } from '../features/ProductDetail/data';
import { CustomAlert } from '@/components/ui/custom-alert';

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
  const [selectedFilling, setSelectedFilling] = useState('');
  const [fillings, setFillings] = useState<Array<{id: number, name: string, status: boolean}>>([]);
  const [pickupDate, setPickupDate] = useState('');
  const [dedication, setDedication] = useState('');
  

  // Cart item shape used in localStorage
  interface LocalCartItem {
    productId: string;
    product: {
      portion?: string;
      diameter?: string;
      cakeFlavor?: string;
      fillingId?: string;
      fillingName?: string;
      pickupDate?: string;
    };
    price: number | string;
    quantity: number;
  }

  function arrayDataToCart(event: FormEvent<HTMLFormElement>) {

    event.preventDefault();
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 2);

    if(productType === '2') {
      if(pickupDate <=  today.toISOString().split('T')[0]) {
        CustomAlert(`Ingrese una fecha mayor a ${today.toISOString().split('T')[0]}`, 'error', 'top-right');
        return;
      }else if(pickupDate < tomorrow.toISOString().split('T')[0]) {
        CustomAlert(`Ingrese una fecha mayor a ${tomorrow.toISOString().split('T')[0]}`, 'error', 'top-right');
        return;
      }
    }
    
    const currentCart = JSON.parse(localStorage.getItem('chantilly-cart') || '{"items":[],"total":0,"itemCount":0}');
    const existingItemIndex = currentCart.items.findIndex((item: LocalCartItem) =>
      item.productId === productId &&
      item.product.portion === selectedPortion &&
      (productType !== '2' || item.product.cakeFlavor === selectedCake) &&
      (productType !== '2' || item.product.fillingId === selectedFilling) &&
      item.product.pickupDate === pickupDate
    );

    let updatedItems;
    
    if (existingItemIndex !== -1) {
      updatedItems = [...currentCart.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + 1,
        price: parseFloat(productVariant?.price || initialPrice.toString())
      };
    } else {
      const selectedDiameter = (portionsOptions.find((p: any) => p.name === selectedPortion)?.size) || '';
      const selectedCakeName = cakeFlavors.find(c => c.id.toString() === selectedCake)?.name || '';
      const selectedFillingName = fillings.find(f => f.id.toString() === selectedFilling)?.name || '';
      const newItem = {
        id: `${productId}-${Date.now()}`,
        productId: productId,
        product: {
          id: productId,
          productVariant: productVariant?.id || 0,
          name: productVariant?.description || name,
          description: `Tema: ${theme || 'No especificado'}`
            + (selectedDiameter ? `, Diámetro: ${selectedDiameter}` : '')
            + (productType === '2' ? `, Relleno: ${selectedFillingName || 'No especificado'}` : ''),
          price: parseFloat(productVariant?.price || initialPrice.toFixed(2)),
          image: imageProduct || initialImage,
          portion: selectedPortion,
          diameter: selectedDiameter,
          ...(productType === '2' ? {
            cakeFlavor: selectedCake,
            cakeFlavorName: selectedCakeName,
            fillingId: selectedFilling,
            fillingName: selectedFillingName,
          } : {}),
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
    window.dispatchEvent(new Event('chantilly-cart-updated'));
    window.dispatchEvent(new Event('open-cart'));
  
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
            {Object.entries(portionsOptions).map(([key, value]) => (
              <option key={key} value={value.name}>{value.name} {value.size}</option>
            ))}
          </select>
        </div>
      )}
  
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
  
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <label className="text-sm font-medium text-black sm:w-32 sm:flex-shrink-0">Día de recojo</label>
        <input
          type="date"
          value={pickupDate}
          name="pickupDate"
          required 
          onChange={(e) => setPickupDate(e.target.value)}
          className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c41c1a] focus:border-[#c41c1a]"
        />
      </div>
  
      {productType !== '4' && (
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
      )}
  
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="text-3xl font-bold text-[#c41c1a] sm:w-32 sm:flex-shrink-0 text-center sm:text-left">
          S/
          {productType === '3' || productType === '4' ? (
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