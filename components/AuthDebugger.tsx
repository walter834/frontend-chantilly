// components/AuthDebugger.tsx - SOLO PARA DEVELOPMENT
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { dumpAuthState, checkLocalStorage, checkSessionStorage } from "@/lib/utils/debug";

export default function AuthDebugger() {
  // Solo mostrar en development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const { isAuthenticated, name, token } = useAuth();
  const authState = useSelector((state: RootState) => state.auth);

  const handleLogState = () => {
    console.log("🔍 [DEBUG] Estado completo de auth:", authState);
    console.log("🔍 [DEBUG] Store completo:", window.store?.getState());
  };

  const handleLogLocalStorage = () => {
    checkLocalStorage();
  };

  const handleLogSessionStorage = () => {
    checkSessionStorage();
  };

  const handleDumpAll = () => {
    dumpAuthState();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <div className="font-bold mb-2">🔍 Auth Debugger (DEV)</div>
      
      <div className="space-y-1">
        <div>
          <span className="text-gray-300">Estado:</span>
          <span className={`ml-2 ${isAuthenticated ? 'text-green-400' : 'text-red-400'}`}>
            {isAuthenticated ? '✅ Autenticado' : '❌ No autenticado'}
          </span>
        </div>
        
        <div>
          <span className="text-gray-300">Nombre:</span>
          <span className="ml-2 text-blue-400">
            {name || 'null'}
          </span>
        </div>
        
        <div>
          <span className="text-gray-300">Token:</span>
          <span className="ml-2 text-yellow-400">
            {token ? `${token.substring(0, 20)}...` : 'null'}
          </span>
        </div>
      </div>
      
      <div className="mt-3 space-y-1">
        <button
          onClick={handleLogState}
          className="w-full bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          Log Estado
        </button>
        
        <button
          onClick={handleLogLocalStorage}
          className="w-full bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
        >
          Log localStorage
        </button>
        
        <button
          onClick={handleLogSessionStorage}
          className="w-full bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-xs"
        >
          Log sessionStorage
        </button>
        
        <button
          onClick={handleDumpAll}
          className="w-full bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
        >
          Dump Completo
        </button>
      </div>
    </div>
  );
}
