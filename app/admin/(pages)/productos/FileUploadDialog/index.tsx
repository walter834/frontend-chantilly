"use client";

import type React from "react";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageIcon, Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  updateProductImages,
  setPrimaryImage,
  deleteImage,
} from "@/service/product/customizeProductService";
import { getProductById } from "@/service/productService";

interface Props {
  id: number;
}

interface UnifiedImageItem {
  id?: number;
  tempId?: string;

  file?: File;
  url?: string;

  status: "existing" | "new" | "to_delete";

  sort_order: number;
}

export function FileUploadDialog({ id }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(false);

  const [unifiedImages, setUnifiedImages] = useState<UnifiedImageItem[]>([]);

  const loadExistingImages = async () => {
    setLoadingExisting(true);
    try {
      const product = await getProductById(id);
      const existingImages = product?.images || [];

      // Convertir imágenes existentes al formato unificado
      const unified = existingImages.map(
        (img): UnifiedImageItem => ({
          id: img.id,
          url: img.url,
          status: "existing",
          sort_order: img.sort_order,
        })
      );

      setUnifiedImages((prev) => {
        const newImages = prev.filter((img) => img.status === "new");
        return [...unified, ...newImages];
      });
    } catch (error) {
      toast.error("Error al cargar imágenes existentes");
    } finally {
      setLoadingExisting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadExistingImages();
    } else {
      setUnifiedImages([]);
    }
  }, [isOpen]);

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
      addNewImages(newFiles);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      );
      addNewImages(newFiles);
    }
  };

  const addNewImages = (files: File[]) => {
    setUnifiedImages((prev) => {
      const activeImages = prev.filter((img) => img.status !== "to_delete");
      const availableSlots = 3 - activeImages.length;

      if (availableSlots <= 0) {
        toast.error("Solo puedes tener máximo 3 imágenes");
        return prev;
      }

      const filesToAdd = files.slice(0, availableSlots);
      const newImages: UnifiedImageItem[] = filesToAdd.map((file, index) => ({
        tempId: `temp_${Date.now()}_${index}`,
        file,
        status: "new",
        is_primary: activeImages.length === 0 && index === 0,
        sort_order: activeImages.length + index,
      }));

      return [...prev, ...newImages];
    });
  };

  const removeImage = async (image: UnifiedImageItem, index: number) => {
    try {
      if (image.status === "existing" && image.id) {
        const existingImages = unifiedImages.filter(
          (img) => img.status === "existing"
        );
        const realIndex = existingImages.findIndex(
          (img) => img.id === image.id
        );
        if (realIndex !== -1) {
          await deleteImage(id, realIndex);
          toast.success("Imagen eliminada correctamente");
          await loadExistingImages();
          window.dispatchEvent(new CustomEvent("productUpdated"));
        }
      } else if (image.status === "new") {
        setUnifiedImages((prev) =>
          prev.filter((img) => !(img.tempId && img.tempId === image.tempId))
        );
      }
    } catch (error) {
      toast.error("Error al eliminar la imagen");
    }
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
    setIsUploading(true);
    try {
      const activeImages = unifiedImages.filter(
        (img) => img.status !== "to_delete"
      );
      const newImages = activeImages.filter((img) => img.status === "new");

      if (activeImages.length === 0) {
        toast.error("Debe haber al menos una imagen");
        return;
      }

      const files = newImages.map((img) => img.file!);

      await updateProductImages(id, files);

      toast.success("Imágenes actualizadas correctamente");
      setIsOpen(false);
      setUnifiedImages([]);
      window.dispatchEvent(new CustomEvent("productUpdated"));
     
    } catch (error) {
      toast.error("Error al actualizar las imágenes");
      console.error("Error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Calcular estados para la UI
  const activeImages = unifiedImages.filter(
    (img) => img.status !== "to_delete"
  );
  const canAddMore = activeImages.length < 3;
  const hasChanges = unifiedImages.some(
    (img) => img.status === "new" || img.status === "to_delete"
  );

  const renderImageItem = (image: UnifiedImageItem, index: number) => (
    <div
      key={image.id || image.tempId}
      className="flex items-center justify-between p-3 rounded-md border transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative">
          <img
            src={
              image.url || (image.file ? URL.createObjectURL(image.file) : "")
            }
            alt="Preview"
            className="w-12 h-12 object-cover rounded border"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm truncate font-medium">
              {image.file?.name || `Imagen ${index + 1}`}
            </p>

            {image.status === "new" && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Nueva
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {image.file ? formatFileSize(image.file.size) : "Imagen existente"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeImage(image, index)}
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
          title="Eliminar imagen"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="h-12 w-12 p-0 rounded-md border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer">
          <ImageIcon className="h-8 w-8 text-green-600" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Gestionar imágenes del producto
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loadingExisting ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">
                Cargando imágenes...
              </span>
            </div>
          ) : (
            <>
              {/* Lista unificada de imágenes */}
              {unifiedImages.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">
                    Imágenes ({activeImages.length}/3)
                  </h4>
                  <div className="space-y-2">
                    {unifiedImages.map((image, index) =>
                      renderImageItem(image, index)
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    Este producto no tiene imágenes
                  </p>
                </div>
              )}

              {/* Área de drag and drop - solo mostrar si se pueden agregar más */}
              {canAddMore && (
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-muted-foreground/50"
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="space-y-3">
                    <div className="mx-auto w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {activeImages.length === 0
                          ? "Arrastra hasta 3 imágenes aquí"
                          : `Agregar ${3 - activeImages.length} imagen${
                              3 - activeImages.length > 1 ? "es" : ""
                            } más`}
                      </p>
                      <input
                        type="file"
                        multiple={canAddMore && 3 - activeImages.length > 1}
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload">
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer bg-transparent"
                          asChild
                        >
                          <span>Seleccionar imágenes</span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {!canAddMore && (
                <p className="text-xs text-muted-foreground text-center">
                  Máximo 3 imágenes alcanzado. Elimina una imagen para agregar
                  otra.
                </p>
              )}
            </>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setUnifiedImages([]);
              }}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!hasChanges || isUploading || activeImages.length === 0}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
