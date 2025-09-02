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
import { ImageIcon, Upload, X, File, Loader2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { updateBannerImage, updateBannerStatus } from "@/service/bannerService";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface Props {
  id: number;
  currentStatus?: boolean;
}

export function FileUploadDialog({ id, currentStatus }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  // Keep track of the original status to compare changes
  const [originalStatus, setOriginalStatus] = useState<boolean>(currentStatus ?? false);
  const [status, setStatus] = useState<boolean>(currentStatus ?? false);

  useEffect(() => {
    // Debug: vamos a ver qué valor exacto está llegando
    console.log('🔍 Debug currentStatus:', {
      value: currentStatus,
      type: typeof currentStatus,
      isUndefined: currentStatus === undefined,
      isNull: currentStatus === null,
      isFalsy: !currentStatus,
      normalized: currentStatus ?? false
    });
    
    const normalizedStatus = currentStatus ?? false;
    setOriginalStatus(normalizedStatus);
    setStatus(normalizedStatus);
  }, [currentStatus]);

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
      // Solo permitir una imagen
      setFiles(newFiles.slice(0, 1));
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      );
      // Solo permitir una imagen
      setFiles(newFiles.slice(0, 1));
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

  const handleUpdate = async () => {
    setIsUploading(true);
    
    try {
      const promises = [];
      if (files.length > 0) {
        promises.push(updateBannerImage(id, files[0]));
      }
      // Compare with the original status that was set when component mounted/updated
      if (status !== originalStatus) {
        promises.push(updateBannerStatus(id, status));
      }

      if (promises.length === 0) {
        toast.info("No hay cambios que guardar");
        return;
      }

      await Promise.all(promises);

      let message = "";

      if (files.length > 0 && status !== originalStatus) {
        message = "Imagen y estado actualizados correctamente";
      } else if (files.length > 0) {
        message = "Imagen actualizada correctamente";
      } else {
        message = "Estado actualizado correctamente";
      }
      toast.success(message);
      setIsOpen(false);
      setFiles([]);

      // Update the original status after successful save
      setOriginalStatus(status);

      if (typeof window !== "undefined" && (window as any).refreshBannersTable) {
        (window as any).refreshBannersTable();
      }
    } catch (error) {
      toast.error("Error al actualizar la imagen");
    } finally {
      setIsUploading(false);
    }
  };

  // Compare with original status instead of currentStatus
  const hasChanges = files.length > 0 || status !== originalStatus;

  // Debug render
  console.log('🔄 Render states:', {
    currentStatus,
    originalStatus,
    status,
    hasChanges
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 bg-transparent"
        >
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Carga las imágenes del producto
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between space-x-2 p-3 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="status-switch" className="text-sm font-medium">
                Estado del banner
              </Label>
              <p className="text-xs text-muted-foreground">
                {status ? 'El banner será visible para los usuarios' : 'El banner estará oculto'}
              </p>
            </div>
            <Switch
              id="status-switch"
              checked={status}
              onCheckedChange={setStatus}
              disabled={isUploading}
            />
          </div>

          <Separator />
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
                  Arrastra las imágenes aquí para subirlos
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
              <h4 className="text-sm font-medium">Archivos seleccionados:</h4>
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
                setStatus(originalStatus);
              }}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={!hasChanges || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subiendo...
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