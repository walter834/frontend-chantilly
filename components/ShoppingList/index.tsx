'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CartItem {
    id: string;
    productId: string;
    product: {
        id: string;
        name: string;
        description?: string;
        price: number;
        image: string;
        portion: string;
        cakeFlavorName: string;
        cakeFlavor: string;
        fillingName: string;
        dedication: string;
        pickupDate: string;
    };
    quantity: number;
    price: number;
}

interface Cart {
    items: CartItem[];
    total: number;
    itemCount: number;
}

const ShoppingList = () => {
    const [cart, setCart] = useState<Cart>({
        items: [],
        total: 0,
        itemCount: 0
    });
    
    const { items, total, itemCount } = cart;
    console.log('cart',items);
    
    useEffect(() => {
        const loadCart = () => {
            const savedCart = localStorage.getItem('chantilly-cart');
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
        };
        
        loadCart();
        
        const handleStorageChange = () => loadCart();
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    
    const updateCart = (updatedItems: CartItem[]) => {
        const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        
        const updatedCart = {
            items: updatedItems,
            total,
            itemCount
        };
        
        localStorage.setItem('chantilly-cart', JSON.stringify(updatedCart));
        setCart(updatedCart);
        window.dispatchEvent(new Event('storage'));
    };

    const updateQuantity = (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        
        const updatedItems = items.map(item => 
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
        
        updateCart(updatedItems);
    };
    
    const removeFromCart = (itemId: string) => {
        const updatedItems = items.filter(item => item.id !== itemId);
        updateCart(updatedItems);
    };
    
    const clearCart = () => {
        const updatedCart: Cart = { items: [], total: 0, itemCount: 0 };
        localStorage.setItem('chantilly-cart', JSON.stringify(updatedCart));
        setCart(updatedCart);
        window.dispatchEvent(new Event('storage'));
    };
    
    const handleQuantityChange = (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        updateQuantity(itemId, newQuantity);
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 p-4">
                <p className="text-black text-lg mb-4">Tu carrito está vacío</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-start p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-gray-200">
                            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                {item.product.image ? (
                                    <Image
                                        src={item.product.image}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                        <span className="text-white/50 text-xs">Sin imagen</span>
                                    </div>
                                )}
                            </div>
                            <div className="ml-4 flex-1 min-w-0">
                                <h3 className="font-medium text-black line-clamp-1">{item.product.name}</h3>
                                    <p className="text-black/60 text-sm mt-1 line-clamp-3">
                                        Porción: {item.product.portion}
                                    </p>
                                    <p className="text-black/60 text-sm mt-1 line-clamp-3">
                                        Keke: {item.product.cakeFlavorName}
                                    </p>
                                    <p className="text-black/60 text-sm mt-1 line-clamp-3">
                                        Relleno: {item.product.fillingName}
                                    </p>
                                    <p className="text-black/60 text-sm mt-1 line-clamp-3">
                                        Dedicatoria: {item.product.dedication}
                                    </p>
                                    <p className="text-black/60 text-sm mt-1 line-clamp-3">
                                        Fecha de recojo: {item.product.pickupDate}
                                    </p>
                                <p className="text-black/80 font-medium mt-2">S/ {item.price.toFixed(2)}</p>
                                
                                <div className="flex justify-center items-center mt-3">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 ml-auto text-[#c41c1a] hover:bg-red-500/20"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-black hover:bg-black/20"
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="w-6 text-center text-black text-sm font-medium">
                                            {item.quantity}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-black hover:bg-black/20"
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="p-4 border-t border-black">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-black">
                        Total ({itemCount} {itemCount === 1 ? 'producto' : 'productos'})
                    </span>
                    <span className="text-black font-bold text-lg">S/ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-center flex-col space-y-2">
                    <Link href="/checkout" className="w-full">
                        <Button className="w-full bg-[#c41c1a] text-white hover:bg-[#a01818] transition-colors duration-300 h-12 text-base cursor-pointer">
                            Procesar compra
                        </Button>
                    </Link>
                    <Button 
                        variant="outline" 
                        className="w-full text-black border-[#c41c1a] hover:bg-[#FAFAFA] transition-colors duration-300 h-10 text-sm cursor-pointer"
                        onClick={clearCart}
                    >
                        Vaciar carrito
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ShoppingList;
