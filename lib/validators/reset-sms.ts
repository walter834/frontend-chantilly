import * as z from "zod";

export const SmsResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });

  export const phoneVerificationSchema = z.object({
    phone: z
      .string()
      .min(9, "El número debe tener al menos 9 dígitos")
      .max(15, "El número no puede tener más de 15 dígitos")
      .regex(/^\d+$/, "Solo se permiten números"),
  });