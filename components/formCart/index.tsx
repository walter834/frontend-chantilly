'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import { TransformedCakeFlavor, TransformedProductVariant } from '@/types/api';
import { portionsOptions } from '../features/ProductDetail/data';

interface FormCartProps {
  productId: string;
  initialPrice: number;
  productVariant: TransformedProductVariant | null;
  cakeFlavors: TransformedCakeFlavor[];
  onPortionChange: (portion: string) => void;
  theme?: string | null;
  imageProduct: string;
  cakeName: string;
}

const FormCart: React.FC<FormCartProps> = ({ 
  productId, 
  initialPrice, 
  productVariant, 
  cakeFlavors, 
  onPortionChange,
  theme,
  imageProduct,
  cakeName 
}) => {
  const [selectedPortion, setSelectedPortion] = useState('');
  const [selectedCake, setSelectedCake] = useState('');
  const [selectedCakeName, setSelectedCakeName] = useState('');
  const [selectedFilling, setSelectedFilling] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dedication, setDedication] = useState('');

  function arrayDataToCart(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    const currentCart = JSON.parse(localStorage.getItem('chantilly-cart') || '{"items":[],"total":0,"itemCount":0}');
    
    const cartItemId = `${productId}-${Date.now()}`;
    
    const newItem = {
      id: cartItemId,
      productId: productId,
      product: {
        id: productId,
        name: productVariant?.description || 'Producto personalizado',
        description: `Tema: ${theme || 'No especificado'}, Relleno: ${selectedFilling || 'No especificado'}`,
        price: parseFloat(productVariant?.price || '0'),
        image: imageProduct,
        portion: selectedPortion,
        cakeFlavor: selectedCake,
        cakeFlavorName: selectedCakeName,
        fillingName: selectedFilling,
        dedication: dedication,
        pickupDate: pickupDate,
      },
      quantity: 1,
      price: parseFloat(productVariant?.price || '0')
    };
    
    const updatedItems = [...currentCart.items, newItem];
    
    const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    
    const updatedCart = {
      items: updatedItems,
      total,
      itemCount
    };
    
    localStorage.setItem('chantilly-cart', JSON.stringify(updatedCart));
    
    window.dispatchEvent(new Event('storage'));
    
    console.log('Producto agregado al carrito:', newItem);
    alert('¡Producto agregado al carrito!');
  }

  useEffect(() => {
    if (selectedCake) {
      const cake = cakeFlavors.find(c => c.id.toString() === selectedCake);
      if (cake) {
        setSelectedFilling(cake.fillingName);
      } else {
        setSelectedFilling('');
      }
    } else {
      setSelectedFilling('');
    }
  }, [selectedCake, cakeFlavors]);

  return (
    <form onSubmit={arrayDataToCart} className="space-y-4">
      {/* string de image */}
      <input type="hidden" name="imageProduct" value={imageProduct || ''} />
      <input type="hidden" name="cakeName" value={selectedCakeName || ''} />
      {/* Porciones */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <label className="text-sm font-medium text-black sm:w-32 sm:flex-shrink-0">Porciones</label>
        <select
          value={selectedPortion}
          name="portion"
          onChange={(e) => {
            setSelectedPortion(e.target.value);
            onPortionChange(e.target.value);
          }}
          className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c41c1a] focus:border-[#c41c1a]"
        >
          {Object.entries(portionsOptions).map(([key, value]) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>

      {/* Opciones de cake */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <label className="text-sm font-medium text-black sm:w-32 sm:flex-shrink-0">Opciones de cake</label>
        <select
          value={selectedCake}
          name="cake"
          onChange={(e) => setSelectedCake(e.target.value) }
          className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c41c1a] focus:border-[#c41c1a]"
        >
          <option value="">Elige una opción</option>
          {cakeFlavors.map((cake) => (
            <option key={cake.id} value={cake.id.toString()}>{cake.name}</option>
          ))}
        </select>
      </div>

      {/* Opciones de relleno */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <label className="text-sm font-medium text-black sm:w-32 sm:flex-shrink-0">Relleno</label>
        <input
          type="text"
          name="filling"
          value={selectedFilling}
          readOnly
          className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
        />
      </div>

      {/* Día de recojo */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <label className="text-sm font-medium text-black sm:w-32 sm:flex-shrink-0">Día de recojo</label>
        <input
          type="date"
          value={pickupDate}
          name="pickupDate"
          onChange={(e) => setPickupDate(e.target.value)}
          className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c41c1a] focus:border-[#c41c1a]"
        />
      </div>

      {/* Nombre o Dedicatoria */}
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

      {/* Precio y Botón */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="text-3xl font-bold text-[#c41c1a] sm:w-32 sm:flex-shrink-0 text-center sm:text-left">
          S/ {selectedPortion && productVariant ? productVariant.price : '0.00'}
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