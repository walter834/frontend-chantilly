interface User {
  nombres: string;
  apellidos: string;
  document_type_id: number;
  document_number: string;
  celular: string;
  email: string;
  direccion?: string;
  password: string;
  password_confirmation: string; // ✅ ESTE CAMPO ERA EL QUE FALTABA
}