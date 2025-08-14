import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ForgotPasswordForm from "../ForgotPasswordForm";
export default function ForgotPasswordCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Recuperar contraseña</CardTitle>
        <CardDescription>
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
        </CardDescription>
        
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm/>       
      </CardContent>
      
    </Card>
  );
}
