import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(str: string): string {
  if (typeof str !== 'string' || str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function parseNiubizDate(str: string) {
  const year = 2000 + parseInt(str.slice(0, 2));
  const month = parseInt(str.slice(2, 4)) - 1;
  const day = parseInt(str.slice(4, 6));
  const hour = parseInt(str.slice(6, 8));
  const minute = parseInt(str.slice(8, 10));
  const second = parseInt(str.slice(10, 12));

  return new Date(year, month, day, hour, minute, second);
}

export function formatDate(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

