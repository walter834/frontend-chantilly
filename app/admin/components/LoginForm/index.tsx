import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bienvenido de nuevo</h1>
                <p className="text-muted-foreground text-balance">
                  Inicie sesión en su cuenta de Chantilly
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="user">Usuario</Label>
                <Input
                  id="user"
                  type="text"
                  placeholder="Ingrese su usario"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                 
                </div>
                <Input id="password" type="password" placeholder="Ingrese su contraseña" required />
              </div>
              <Button type="submit" className="w-full">
                Ingresar
              </Button>
              
              
              
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/avatar.jpeg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      

    </div>
  )
}
