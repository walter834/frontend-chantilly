"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateBannerStatus } from "@/service/bannerService";


interface Props {
  id: number;
  currentStatus: boolean;
  onStatusUpdate?: () => void;
}

export function StatusUpdateDialog({ id, currentStatus, onStatusUpdate }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await updateBannerStatus(id, status);
      toast.success(`Banner ${status ? 'activado' : 'desactivado'} correctamente`);
      setIsOpen(false);
      
      // Refresh data
      if (onStatusUpdate) {
        onStatusUpdate();
      } else if (typeof window !== "undefined" && (window as any).refreshBannersTable) {
        (window as any).refreshBannersTable();
      }
    } catch (error) {
      toast.error("Error al actualizar el estado del banner");
      console.error("Error updating banner status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setStatus(currentStatus); // Reset to original value
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Cambiar estado del banner
          </DialogTitle>
          <DialogDescription>
            Activa o desactiva la visualización de este banner.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-1">
              <Label htmlFor="status-switch" className="text-sm font-medium">
                Estado del banner
              </Label>
              <p className="text-xs text-muted-foreground">
                {status ? 'El banner se mostrará a los usuarios' : 'El banner estará oculto'}
              </p>
            </div>
            <Switch
              id="status-switch"
              checked={status}
              onCheckedChange={setStatus}
              disabled={isUpdating}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUpdating || status === currentStatus}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
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