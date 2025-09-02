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
import { ImageIcon, Upload, X, File, Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { updateProductImages } from "@/service/product/customizeProductService";

interface Props {
  id: number;
}

export function FileUploadDialog({ id }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0); // Índice de imagen primaria

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
      // Permitir máximo 2 imágenes (primaria y secundaria)
      setFiles(newFiles.slice(0, 2));
      // Si solo hay una imagen, será la primaria por defecto
      setPrimaryImageIndex(0);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      );
      // Permitir máximo 2 imágenes (primaria y secundaria)
      setFiles(newFiles.slice(0, 2));
      // Si solo hay una imagen, será la primaria por defecto
      setPrimaryImageIndex(0);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      // Ajustar el índice de imagen primaria si es necesario
      if (primaryImageIndex === index) {
        setPrimaryImageIndex(0);
      } else if (primaryImageIndex > index) {
        setPrimaryImageIndex(primaryImageIndex - 1);
      }
      return newFiles;
    });
  };

  const setPrimaryImage = (index: number) => {
    setPrimaryImageIndex(index);
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

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Selecciona al menos una imagen");
      return;
    }

    setIsUploading(true);
    try {
      // OPCIÓN 1: Reordenar archivos para que la primaria vaya primera
      // Tu backend establece la primera imagen como primaria automáticamente
      const reorderedFiles = [...files];
      if (primaryImageIndex !== 0) {
        // Mover la imagen primaria al primer lugar
        const primaryFile = reorderedFiles[primaryImageIndex];
        reorderedFiles.splice(primaryImageIndex, 1);
        reorderedFiles.unshift(primaryFile);
      }

      // Usar tu función existente
      const result = await updateProductImages(id, reorderedFiles);

      toast.success("Imágenes actualizadas correctamente");
      setIsOpen(false);
      setFiles([]);
      setPrimaryImageIndex(0);

      
      if (typeof window !== "undefined" && (window as any).refreshBannersTable) {
        (window as any).refreshBannersTable();
      }
    } catch (error) {
      toast.error("Error al actualizar las imágenes");
      console.error("Error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="h-12 w-12 p-0 rounded-md border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer">
          <ImageIcon className="h-8 w-8 text-green-600" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Actualizar imágenes del producto
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
                  Arrastra hasta 2 imágenes aquí
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  o haz clic para seleccionar archivos (Imagen primaria y
                  secundaria)
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
                    <span>Seleccionar imágenes</span>
                  </Button>
                </label>
              </div>
            </div>
          </div>

          {/* File List with Primary Selection */}
          {files.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Imágenes seleccionadas:</h4>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-md border transition-colors",
                      index === primaryImageIndex
                        ? "bg-blue-50 border-blue-200"
                        : "bg-muted/50 border-muted"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Preview de la imagen */}
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="w-12 h-12 object-cover rounded border"
                        />
                        {index === primaryImageIndex && (
                          <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                            <Star className="w-3 h-3 fill-current" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm truncate font-medium">
                            {file.name}
                          </p>
                          {index === primaryImageIndex && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Principal
                            </span>
                          )}
                          {index !== primaryImageIndex && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              Secundaria
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Botón para establecer como primaria */}
                      {index !== primaryImageIndex && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPrimaryImage(index)}
                          className="h-8 w-8 p-0"
                          title="Establecer como imagen principal"
                        >
                          <Star className="h-3 w-3" />
                        </Button>
                      )}

                      {/* Botón para eliminar */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        title="Eliminar imagen"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {files.length < 2 && (
                <p className="text-xs text-muted-foreground">
                  Puedes agregar {2 - files.length} imagen
                  {files.length === 1 ? "" : "es"} más
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setFiles([]);
                setPrimaryImageIndex(0);
              }}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                `Actualizar imagen${files.length > 1 ? "es" : ""} (${
                  files.length
                })`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
