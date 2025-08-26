// reset/page.tsx
"use client";
import SmsResetFormContent from "./components/SmsResetFormContent";
import { useRouter } from "next/navigation";
import {
  usePasswordRecoveryData,
  useClearRecoveryData,
} from "@/hooks/useSessionData";
import { useEffect } from "react";
import FormSkeleton from "./components/FormSkeleton";

export default function SmsResetForm() {
  const router = useRouter();
  const { phone, code, isValid, isLoading } = usePasswordRecoveryData();
  const clearRecoveryData = useClearRecoveryData();

  useEffect(() => {
    if (!isLoading && !isValid) {
      clearRecoveryData();
      router.replace("/forgot-sms");
    }
  }, [isLoading, isValid, router, clearRecoveryData]);

  if (isLoading || !isValid) {
    return <FormSkeleton />;
  }

  return <SmsResetFormContent phone={phone} code={code} />;
}
