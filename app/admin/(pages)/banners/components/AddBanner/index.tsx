"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, X, File, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { addBannersBulk } from "@/service/bannerService";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function AddBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState(true);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      // Limitar a 12 imágenes según tu backend
      setFiles(newFiles.slice(0, 12));
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      );
      // Limitar a 12 imágenes según tu backend
      setFiles(newFiles.slice(0, 12));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const handleAdd = async () => {
    if (files.length === 0) {
      toast.error("Selecciona al menos una imagen");
      return;
    }

    if (files.length > 12) {
      toast.error("No puedes subir más de 12 imágenes a la vez");
      return;
    }

    setIsUploading(true);
    
    try {
      const result = await addBannersBulk(files, status);
      
      if (result.success) {
        toast.success(
          `${files.length} banner${files.length > 1 ? 's' : ''} ${files.length > 1 ? 'añadidos' : 'añadido'} correctamente`
        );
        
        setIsOpen(false);
        setFiles([]);
        
        // Refresh the table
        if (typeof window !== "undefined" && (window as any).refreshBannersTable) {
          (window as any).refreshBannersTable();
        }
      } else {
        toast.error(result.error || "Error al crear los banners");
      }
    } catch (error: any) {
      console.error("Error uploading banners:", error);
      
      // Handle specific error messages from backend
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error?.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = Object.values(error.response.data.errors).flat();
        toast.error(errorMessages.join(', '));
      } else {
        toast.error("Error al subir las imágenes");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-700 hover:bg-red-800 text-white cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          Añadir banner
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Carga las imágenes del banner
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Switch */}
          <div className="flex items-center justify-between space-x-2 p-3 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="status-switch" className="text-sm font-medium">
                Estado inicial
              </Label>
              <p className="text-xs text-muted-foreground">
                {status
                  ? "Los banners se crearán activos"
                  : "Los banners se crearán inactivos"}
              </p>
            </div>
            <Switch
              id="status-switch"
              checked={status}
              onCheckedChange={setStatus}
              disabled={isUploading}
            />
          </div>

          {/* File limit info */}
          <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded border border-blue-200">
            📝 Puedes subir hasta 12 imágenes a la vez. Solo se aceptan archivos JPG, JPEG, PNG y WebP.
          </div>

          {/* Drag and Drop Area */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Arrastra las imágenes aquí para subirlas
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  o haz clic para seleccionar archivos
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="outline"
                    className="cursor-pointer bg-transparent"
                    asChild
                  >
                    <span>Seleccionar archivos</span>
                  </Button>
                </label>
              </div>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Archivos seleccionados:</h4>
                <span className="text-xs text-muted-foreground">
                  {files.length}/12
                </span>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0 flex-shrink-0"
                      disabled={isUploading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setFiles([]);
              }}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAdd}
              disabled={files.length === 0 || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                `Añadir ${files.length} banner${files.length > 1 ? 's' : ''}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}