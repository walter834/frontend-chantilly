'use client';

import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { findNearbyLocals, clearError } from '@/store/slices/localSlice';
import LocalCard from "../LocalCard";


export default function LocalCardGrid() {
  const dispatch = useDispatch<AppDispatch>();
  const { locals, loading, error } = useSelector(
    (state: RootState) => state.local
  );

  // Cargar locales cercanos al montar el componente
  useEffect(() => {
    dispatch(findNearbyLocals());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(clearError());
    dispatch(findNearbyLocals());
  };

  if (loading) {
    return (
      <div className="mt-10 flex justify-center items-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c41d1ada]"></div>
          <span className="text-gray-600 text-sm">Buscando locales cercanos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 flex justify-center items-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto text-center">
          <div className="flex justify-center mb-4">
            <svg className="h-8 w-8 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-800 mb-2">
            No se pudieron cargar los locales
          </h3>
          <p className="text-sm text-red-700 mb-4">
            {error}
          </p>
          <button
            onClick={handleRetry}
            className="bg-[#c41d1ada] hover:bg-red-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  if (locals.length === 0) {
    return (
      <div className="mt-10 flex justify-center items-center py-12">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No se encontraron locales cercanos</p>
          <button
            onClick={handleRetry}
            className="text-[#c41d1ada] hover:text-red-800 underline text-sm"
          >
            Buscar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {locals.map((local) => (
        <LocalCard key={local.id} local={local} />
      ))}
    </div>
  );
}