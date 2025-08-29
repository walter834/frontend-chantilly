import { store } from "@/store/store";
import api from "../api";
import { loginAdminSuccess } from "@/store/slices/authAdminSlice";

interface LoginAdminCredentials {
  username: string;
  password: string;
}

interface User {
  id: number;
  username: string;
  email: string;
}

interface LoginAdminResponse {
  success: boolean;
  message: string;
  user: User;
}

export const loginAdmin = async (
  credentials: LoginAdminCredentials
): Promise<LoginAdminResponse> => {
  try {
    const response = await api.post("/admin/login", credentials);
    const { token, user, message } = response.data;

    store.dispatch(loginAdminSuccess({ user, token }));

    return {
      success: true,
      message: message,
      user,
    };
  } catch (error) {
    throw error;
  }
};

export const logoutAdmin = async () => {
  try {
    const response = await api.post("/admin/logout");
    return response.data;
  } catch (error) {
    throw error;
  }finally{
    store.dispatch(logoutAdmin());
  }
};
