import * as z from "zod";

export const registerSchema = z.object({
  nombres: z.string().min(2, "Los nombres son requeridos").max(50, "Máximo 50 caracteres"),
  apellidos: z.string().min(2, "Los apellidos son requeridos").max(50, "Máximo 50 caracteres"),
  documentType: z.string().min(1, "Seleccione"),
  documentNumber: z.string().min(8, "Mínimo 8 dígitos").max(15, "Máximo 15 dígitos"),
  celular: z.string().min(9, "Mínimo 9 dígitos").max(12, "Máximo 12 dígitos"),
  email: z.string().email("Email inválido"),
  direccion: z.string().optional(),
  
  // Campos de ubigeo
  departamento: z.string().min(1, "Seleccione un departamento"),
  provincia: z.string().min(1, "Seleccione una provincia"), 
  distrito: z.string().min(1, "Seleccione un distrito de la lista"),
  
  password: z.string().min(8, "Mínimo 8 caracteres"),
  confirmPassword: z.string().min(8, "Confirme su contraseña"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio")
    .email("Ingrese un correo electrónico válido"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .min(5, "La contraseña debe tener al menos 6 caracteres")
})

// Schema de validación
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Ingresa un correo electrónico válido")
    .toLowerCase(),
});

export const ResetPasswordSchema = z
  .object({
    token: z.string().nonempty({ message: "El token es requerido" }),
    email: z.string().email({ message: "Ingresa un correo válido" }).nonempty({ message: "El correo es requerido" }),
    password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }).nonempty({ message: "La contraseña es requerida" }),
    password_confirmation: z.string().nonempty({ message: "Confirma tu contraseña" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });