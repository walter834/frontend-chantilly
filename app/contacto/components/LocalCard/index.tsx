"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface LocalCardProps {
  local: Local;
}

export default function LocalCard({ local }: LocalCardProps) {
  const formatTime = (time: string) => {
    return time.slice(0, 5); // Convierte "08:00:00" a "08:00"
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative group">
        {/* Gradient border effect */}
        {/* <div
          className="absolute -inset-1 bg-gradient-to-r from-pink-200 via-purple-200 to-pink-200 rounded-xl blur-sm opacity-75 
                        group-hover:-inset-2 group-hover:from-pink-300 group-hover:via-purple-300 group-hover:to-pink-300 group-hover:opacity-90 
                        transition-all duration-300 ease-in-out"
        ></div> */}

        {/* Main card */}
        <Card className="relative bg-white w-full max-w-md p-0 transition-transform duration-300 group-hover:scale-[1.02]">
          <Image
            src={local.image || "/avatar.jpeg"} // Imagen por defecto si no hay imagen
            alt={local.name}
            width={460}
            height={280}
            className="w-full h-auto object-cover rounded-t-xl max-h-[280px] aspect-video "
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/avatar.jpeg"; // Imagen por defecto
            }}
          />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-start text-[#c41d1ada] pb-1 font-bold">
              {local.name} ( {(local.distance)} KM )
            </CardTitle>
            <CardDescription className="text-gray-600 text-start text-xs space-y-1">
              <p>{local.address}</p>
              <p>
                Lunes a Domingo de {formatTime(local.start_time)} -{" "}
                {formatTime(local.end_time)} horas
              </p>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pb-4">
            <div className="flex gap-3 pt-2">
              <a
                href={local.link_local}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full bg-[#c41d1ada] hover:bg-red-800 cursor-pointer">
                  Más información <ChevronRight className="" />
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
