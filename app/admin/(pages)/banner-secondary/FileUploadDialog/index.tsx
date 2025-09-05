"use client";

import type React from "react";
import Image from "next/image";
import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageIcon, Upload, X, File, Loader2, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { BannerSecondary } from "@/service/bannerFooter/bannerFooterService";
import { useUpdateBannerSecondary } from "@/hooks/useBannerSecondary";
import { Button } from "@/components/common/Button";

export function FileUploadDialog({ id, title, description, image, image_movil }: BannerSecondary) {
  const [isOpen, setIsOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [titleBanner, setTitleBanner] = useState(title);
  const [descriptionBanner, setDescriptionBanner] = useState(description);
  const [imageBanner, setImageBanner] = useState(image);
  const [imageBannerMovil, setImageBannerMovil] = useState(image_movil);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        if (type === 'desktop') {
          setDesktopFile(file);
          // Create a preview URL for the new image
          setImageBanner(URL.createObjectURL(file));
        } else {
          setMobileFile(file);
          setImageBannerMovil(URL.createObjectURL(file));
        }
      }
    }
  };

  const removeFile = (type: 'desktop' | 'mobile') => {
    if (type === 'desktop') {
      setDesktopFile(null);
      setImageBanner('');
    } else {
      setMobileFile(null);
      setImageBannerMovil('');
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

  const { mutate: updateBanner } = useUpdateBannerSecondary();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', titleBanner || '');
    formData.append('description', descriptionBanner || '');

    if (desktopFile) {
      formData.append('image', desktopFile);
    }
    if (mobileFile) {
      formData.append('image_movil', mobileFile);
    }

    setIsUploading(true);
    try {
      await updateBanner(
        { id, formData },
        {
          onSuccess: () => {
            toast.success("Banner actualizado correctamente");
            setIsOpen(false);
          },
          onError: () => {
            toast.error("Error al actualizar el banner");
          },
        }
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="h-12 w-12 p-0 rounded-md  border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer">
          <PenLine className="h-8 w-8 text-green-600" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenLine className="h-5 w-5" />
            Editar Banner secundario
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpload} method="post">
          <div className="space-y-4 pt-4 overflow-y-auto h-[calc(100vh-200px)]">
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="title"
                id="title"
                value={titleBanner}
                onChange={(e) => setTitleBanner(e.target.value)}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-black peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="title"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black peer-focus:dark:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Título
              </label>
            </div>
            <div>
              <textarea
                id="description"
                name="description"
                value={descriptionBanner}
                onChange={(e) => setDescriptionBanner(e.target.value)}
                className="w-full h-24 border border-gray-300 rounded-md p-2"
                placeholder="Descripción"
              />
            </div>
            <div className="space-y-4">
              {/* Drag and Drop Area */}
              <label htmlFor="file-upload-desktop" className="block text-sm font-medium text-gray-700">Imagen para escritorio</label>
              <input
                type="file"
                id="file-upload-desktop"
                name="file-upload-desktop"
                accept="image/*"
                onChange={(e) => handleFileInput(e, 'desktop')}
                className="block w-full text-sm text-gray-500 border border-gray-300 rounded-md p-2 cursor-pointer"
              />
              {imageBanner && (
                <div className="mt-2 relative">
                  <div className="relative w-full h-48 overflow-hidden rounded-md">
                    <Image
                      src={imageBanner}
                      alt="Vista previa escritorio"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile('desktop')}
                    className="absolute top-2 right-2 bg-[#c41c1a] text-white rounded-full p-1 hover:bg-red-600 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <label htmlFor="file-upload-mobile" className="block text-sm font-medium text-gray-700 mt-4">Imagen para móvil</label>
              <input
                type="file"
                id="file-upload-mobile"
                name="file-upload-mobile"
                accept="image/*"
                onChange={(e) => handleFileInput(e, 'mobile')}
                className="block w-full text-sm text-gray-500 border border-gray-300 rounded-md p-2 cursor-pointer"
              />
              {imageBannerMovil && (
                <div className="mt-2 relative">
                  <div className="relative w-full h-48 overflow-hidden rounded-md">
                    <Image
                      src={imageBannerMovil}
                      alt="Vista previa móvil"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile('mobile')}
                    className="absolute top-2 right-2 bg-[#c41c1a] text-white rounded-full p-1 hover:bg-red-600 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={isUploading}
                  className="cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin cursor-not-allowed" />
                      Subiendo...
                    </>
                  ) : (
                    `Actualizar`
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
