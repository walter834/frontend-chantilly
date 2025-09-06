"use client";

// Utilizamos document.cookie en el cliente
const isClient = typeof window !== 'undefined';

// Obtener el valor de una cookie
export function getCookie(name: string): string | undefined {
  if (!isClient) return undefined;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue ? decodeURIComponent(cookieValue) : undefined;
  }
  
  return undefined;
}

// Establecer una cookie
export function setCookie(
  name: string,
  value: string,
  options: {
    maxAge?: number; // en segundos
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'Lax' | 'Strict' | 'None';
  } = {}
): void {
  if (!isClient) return;
  
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  // Configurar opciones de la cookie
  if (options.maxAge) {
    const expires = new Date();
    expires.setTime(expires.getTime() + options.maxAge * 1000);
    cookieString += `; expires=${expires.toUTCString()}`;
    cookieString += `; max-age=${options.maxAge}`;
  }
  
  if (options.path) {
    cookieString += `; path=${options.path}`;
  } else {
    cookieString += '; path=/';
  }
  
  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }
  
  if (options.secure) {
    cookieString += '; secure';
  }
  
  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }
  
  document.cookie = cookieString;
}

// Eliminar una cookie
export function deleteCookie(name: string, path: string = '/'): void {
  if (!isClient) return;
  
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path};`;
  
  // Intentar eliminar también sin el path por si se configuró de otra manera
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
}
