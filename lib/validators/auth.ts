import z from "zod";

export const registerSchema = z.object({
  nombres: z.string().min(2, "Los nombres deben tener al menos 2 caracteres").max(50, "Máximo 50 caracteres"),
  apellidos: z.string().min(2, "Los apellidos deben tener al menos 2 caracteres").max(50, "Máximo 50 caracteres"),
  documentType: z.string().min(1, "Seleccione un tipo de documento"),
  documentNumber: z.string().min(8, "El documento debe tener al menos 8 caracteres").max(15, "Máximo 15 caracteres"),
  celular: z.string().min(9, "El celular debe tener al menos 9 dígitos").regex(/^\d+$/, "Solo números"),
  email: z.string().email("Ingrese un email válido"),
  direccion: z.string().optional(),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirme su contraseña")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
})

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio")
    .email("Ingrese un correo electrónico válido"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres")
})

