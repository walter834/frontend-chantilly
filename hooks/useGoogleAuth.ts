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

      console.log("🔍 Datos recibidos del backend:", { token: !!token, customerData: !!customerData });

      if (token && customerData) {
        const customer = JSON.parse(decodeURIComponent(customerData));
        console.log("✅ Customer decodificado:", customer);
        
        // Actualizar Redux
        dispatch(loginSuccess({ customer, token }));
        
        // Limpiar URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Manejar redirección guardada
        const redirectUrl = sessionStorage.getItem("redirectAfterLogin") || "/";
        sessionStorage.removeItem("redirectAfterLogin");
        
        console.log("🚀 Redirigiendo a:", redirectUrl);
        router.push(redirectUrl);
      } else {
        console.error("❌ Faltan datos:", { token: !!token, customerData: !!customerData });
        router.push('/login?error=missing_data');
      }
    } catch (error) {
      console.error('❌ Error en Google auth callback:', error);
      router.push('/login?error=callback_failed');
    }
  };

  return { handleGoogleCallback };
};