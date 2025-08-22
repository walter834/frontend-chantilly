// components/LoadingSkeleton.tsx
"use client";

import { Loader2, Lock } from "lucide-react";

interface LoadingSkeletonProps {
  message?: string;
  type?: 'verify' | 'reset';
}

export default function LoadingSkeleton({ 
  message = "Cargando...", 
  type = 'verify' 
}: LoadingSkeletonProps) {
  if (type === 'reset') {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
        <div className="w-full max-w-md backdrop-blur-sm rounded-2xl p-8 shadow-2xl border bg-white">
          {/* Header Skeleton */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-700 to-red-600 rounded-full flex items-center justify-center shadow-lg mb-4">
              <Lock className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="h-7 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-md animate-pulse mx-auto w-3/4"></div>
          </div>
          
          {/* Status Skeleton */}
          <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="h-4 bg-green-200 rounded animate-pulse flex-1"></div>
            </div>
          </div>

          {/* Form Skeleton */}
          <div className="space-y-6">
            <div>
              <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse w-1/3"></div>
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse w-1/3"></div>
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse w-1/4"></div>
              <div className="space-y-1">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5"></div>
              </div>
            </div>
            <div className="h-14 bg-red-200 rounded-xl animate-pulse"></div>
          </div>

          {/* Loading indicator */}
          <div className="text-center mt-6">
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">{message}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Verify code skeleton
  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white backdrop-blur-sm rounded-2xl p-8 shadow-2xl border">
        {/* Back Button Skeleton */}
        <div className="flex justify-start mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          </div>
        </div>

        {/* Logo Skeleton */}
        <div className="flex justify-start mb-8">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-yellow-300 font-bold text-xl animate-pulse">C</span>
          </div>
        </div>

        {/* Title Skeleton */}
        <div className="mb-8">
          <div className="h-7 bg-gray-200 rounded-lg mb-3 animate-pulse w-1/2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
        </div>

        {/* OTP Input Skeleton */}
        <div className="flex gap-3 mb-8 justify-center">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="w-12 h-12 border border-gray-200 rounded-xl animate-pulse bg-gray-100"
            />
          ))}
        </div>

        {/* Button Skeleton */}
        <div className="h-14 bg-red-200 rounded-xl mb-6 animate-pulse"></div>

        {/* Resend Text Skeleton */}
        <div className="text-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-2/3"></div>
        </div>

        {/* Loading indicator */}
        <div className="text-center mt-4">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">{message}</span>
          </div>
        </div>
      </div>
    </div>
  );
}