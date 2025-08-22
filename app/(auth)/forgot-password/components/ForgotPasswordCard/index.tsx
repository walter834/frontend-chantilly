import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ForgotPasswordForm from "../ForgotPasswordForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Smartphone } from "lucide-react";
export default function ForgotPasswordCard() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-lg border-0  backdrop-blur-sm">
        <CardHeader className="space-y-3 pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-semibold text-gray-900">Recuperar contraseña</CardTitle>
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Volver al inicio"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>
          <CardDescription className="text-base text-gray-600 leading-relaxed">
            Ingresa tu correo electrónico y te enviaremos un enlace seguro para restablecer tu contraseña
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-6">
          <ForgotPasswordForm />
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">¿Prefieres recuperar tu contraseña por SMS?</p>
            <Link href="/forgot-sms" className="w-full block">
              <Button
                variant="outline"
                className="w-full border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 bg-transparent"
              >
                <Smartphone className="mr-2 h-4 w-4" />
                Recuperar por SMS
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Volver al inicio
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
