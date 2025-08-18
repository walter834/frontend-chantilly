import { handleAuthCallbackWithData } from "@/service/auth/authService";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/slices/authSlice";

export const useGoogleAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleGoogleCallback = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const customerData = urlParams.get("customer");

      if (token && customerData) {
        const customer = JSON.parse(decodeURIComponent(customerData));
        // Actualizar Redux antes de la redirección
        dispatch(loginSuccess({ customer, token }));
        router.push('/');
      } else {
        router.push('/login?error=missing_data');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      router.push('/login?error=callback_failed');
    }
  };

  return { handleGoogleCallback };
};