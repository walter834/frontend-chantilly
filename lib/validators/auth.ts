import * as z from "zod";

export const registerSchema = z
  .object({
    nombres: z
      .string()
      .min(2, "Los nombres son requeridos")
      .max(50, "Máximo 50 caracteres"),
    apellidos: z
      .string()
      .min(2, "Los apellidos son requeridos")
      .max(50, "Máximo 50 caracteres"),
    documentType: z.string().min(1, "Seleccione"),
    documentNumber: z
      .string()
      .min(8, "Mínimo 8 dígitos")
      .max(15, "Máximo 15 dígitos"),
    celular: z.string().min(9, "Mínimo 9 dígitos").max(12, "Máximo 12 dígitos"),
    email: z.string().email("Email inválido"),
    direccion: z.string().optional(),

    // Campos de ubigeo
    departamento: z.string().min(1, "Seleccione un departamento"),
    provincia: z.string().min(1, "Seleccione una provincia"),
    distrito: z.string().min(1, "Seleccione un distrito de la lista"),
    deparment_code: z.string(),
    province_code: z.string(),
    district_code: z.string(),

    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string().min(8, "Confirme su contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
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
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

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
    email: z
      .string()
      .email({ message: "Ingresa un correo válido" })
      .nonempty({ message: "El correo es requerido" }),
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
      .nonempty({ message: "La contraseña es requerida" }),
    password_confirmation: z
      .string()
      .nonempty({ message: "Confirma tu contraseña" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });

export const profileUpdateSchema = z
  .object({
    nombres: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede tener más de 50 caracteres")
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras y espacios"),
    apellidos: z
      .string()
      .min(2, "Los apellidos deben tener al menos 2 caracteres")
      .max(50, "Los apellidos no pueden tener más de 50 caracteres")
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras y espacios"),
    documentType: z.string().min(1, "Seleccione un tipo de documento"),
    documentNumber: z
      .string()
      .min(8, "El número de documento debe tener al menos 8 caracteres")
      .max(15, "El número de documento no puede tener más de 15 caracteres"),
    celular: z
      .string()
      .min(9, "El celular debe tener al menos 9 dígitos")
      .max(12, "El celular no puede tener más de 12 dígitos")
      .regex(/^\d+$/, "Solo se permiten números"),
    email: z
      .string()
      .email("Ingrese un email válido")
      .min(1, "El email es requerido"),
    direccion: z.string().optional(),
    departamento: z.string(),
    provincia: z.string(),
    distrito: z.string(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // Solo validar contraseñas si se proporciona una
      if (data.password || data.confirmPassword) {
        if (!data.password || data.password.length < 8) {
          return false;
        }
        if (!data.confirmPassword || data.confirmPassword.length < 8) {
          return false;
        }
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Las contraseñas deben coincidir y tener al menos 8 caracteres",
      path: ["confirmPassword"],
    }
  );
