// reset/page.tsx
"use client";
import SmsResetFormContent from "./components/SmsResetFormContent";
import { useRouter } from "next/navigation";
import { usePasswordRecoveryState } from "@/hooks/usePasswordRecoveryState";
import { useEffect } from "react";
import FormSkeleton from "./components/FormSkeleton";

export default function SmsResetForm() {
  const { state } = usePasswordRecoveryState();

  // Mostrar skeleton si no tenemos los datos necesarios
  if (!state.phone || !state.code || !state.isVerified) {
    return <FormSkeleton />;
  }

  return <SmsResetFormContent phone={state.phone} code={state.code} />;
}